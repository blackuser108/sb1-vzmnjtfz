import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BookHeart, Lightbulb, Users, Check, X, ArrowLeft } from 'lucide-react';

interface TaskQuestion {
  id: string;
  task_type: string;
  question_text: string;
  question_order: number;
}

interface DailyTask {
  id: string;
  task_type: string;
  task_date: string;
  completed: boolean;
}

interface TaskResponse {
  question_id: string;
  response_text?: string;
  response_value?: number;
  checked?: boolean;
}

interface DailyTasksProps {
  onNavigate: (page: string) => void;
}

export default function DailyTasks({ onNavigate }: DailyTasksProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gratitudeQuestions, setGratitudeQuestions] = useState<TaskQuestion[]>([]);
  const [meaningQuestions, setMeaningQuestions] = useState<TaskQuestion[]>([]);
  const [prosocialQuestions, setProsocialQuestions] = useState<TaskQuestion[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, TaskResponse>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const getDayNumber = () => {
    const baseDate = new Date('2025-01-01');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    baseDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays % 7) + 1;
  };

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentDay = getDayNumber();

      const [gratitudeResult, meaningResult, prosocialResult, tasksResult] = await Promise.all([
        supabase
          .from('task_questions')
          .select('*')
          .eq('task_type', 'gratitude')
          .eq('day_number', currentDay)
          .eq('is_active', true)
          .order('question_order'),
        supabase
          .from('task_questions')
          .select('*')
          .eq('task_type', 'meaning')
          .eq('day_number', currentDay)
          .eq('is_active', true)
          .order('question_order'),
        supabase
          .from('task_questions')
          .select('*')
          .eq('task_type', 'prosocial')
          .eq('is_active', true)
          .order('question_order'),
        supabase
          .from('daily_tasks')
          .select('*')
          .eq('user_id', user!.id)
          .eq('task_date', today)
      ]);

      if (gratitudeResult.data) {
        setGratitudeQuestions(gratitudeResult.data);
      }
      if (meaningResult.data) {
        setMeaningQuestions(meaningResult.data);
      }
      if (prosocialResult.data) {
        setProsocialQuestions(prosocialResult.data);
      }
      if (tasksResult.data) {
        setDailyTasks(tasksResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTaskCompleted = (taskType: string) => {
    return dailyTasks.some(task => task.task_type === taskType && task.completed);
  };

  const handleStartTask = (taskType: string) => {
    setActiveTask(taskType);
    setResponses({});
  };

  const handleResponseChange = (questionId: string, value: string | number | boolean, type: 'text' | 'value' | 'checkbox') => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        ...(type === 'text' ? { response_text: value as string } :
            type === 'checkbox' ? { checked: value as boolean, response_value: value ? 1 : 0 } :
            { response_value: value as number })
      }
    }));
  };

  const handleCheckboxToggle = (questionId: string) => {
    const currentChecked = responses[questionId]?.checked || false;
    handleResponseChange(questionId, !currentChecked, 'checkbox');
  };

  const handleSubmitTask = async () => {
    if (!activeTask || !user) return;

    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: taskData, error: taskError } = await supabase
        .from('daily_tasks')
        .upsert({
          user_id: user.id,
          task_type: activeTask,
          task_date: today,
          completed: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,task_type,task_date'
        })
        .select()
        .single();

      if (taskError) throw taskError;

      const responsesToSave = Object.values(responses).map(response => ({
        daily_task_id: taskData.id,
        user_id: user.id,
        task_type: activeTask,
        question_id: response.question_id,
        response_text: response.response_text,
        response_value: response.response_value,
        created_at: new Date().toISOString()
      }));

      const { error: responseError } = await supabase
        .from('daily_task_responses')
        .insert(responsesToSave);

      if (responseError) throw responseError;

      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (token) {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/score-daily-tasks`;
        const prosocialQuestionMap = new Map(prosocialQuestions.map(q => [q.id, q.question_text]));

        const formattedResponses = Object.values(responses).map(resp => ({
          questionId: resp.question_id,
          questionText: activeTask === 'prosocial' ? prosocialQuestionMap.get(resp.question_id) || '' : '',
          responseText: resp.response_text || '',
          responseValue: resp.response_value
        }));

        try {
          await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user.id,
              taskDate: today,
              taskType: activeTask,
              responses: formattedResponses
            })
          });
        } catch (scoringError) {
          console.error('Error calling AI scoring function:', scoringError);
        }
      }

      await loadData();
      setActiveTask(null);
      setResponses({});
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Không thể lưu câu trả lời. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const renderTaskCard = (
    title: string,
    description: string,
    icon: React.ReactNode,
    taskType: string,
    color: string
  ) => {
    const completed = isTaskCompleted(taskType);

    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border-2 ${completed ? 'border-green-500' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${color}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          {completed && (
            <div className="bg-green-500 text-white p-2 rounded-full">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>

        {!completed ? (
          <button
            onClick={() => handleStartTask(taskType)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${color.replace('bg-', 'bg-opacity-20 hover:bg-opacity-30 text-')}`}
          >
            Bắt đầu
          </button>
        ) : (
          <div className="text-center text-green-600 font-semibold py-3">
            ✓ Đã hoàn thành
          </div>
        )}
      </div>
    );
  };

  const renderTaskModal = () => {
    if (!activeTask) return null;

    let questions: TaskQuestion[] = [];
    let title = '';
    let isEssay = true;

    if (activeTask === 'gratitude') {
      questions = gratitudeQuestions;
      title = 'Nhật Ký Lòng Biết Ơn';
      isEssay = true;
    } else if (activeTask === 'meaning') {
      questions = meaningQuestions;
      title = 'Ý Nghĩa Cuộc Sống';
      isEssay = true;
    } else if (activeTask === 'prosocial') {
      questions = prosocialQuestions;
      title = 'Hành Vi Ủng Hộ Xã Hội';
      isEssay = false;
    }

    const allAnswered = activeTask === 'prosocial'
      ? Object.keys(responses).length > 0
      : questions.every(q => responses[q.id] && (responses[q.id].response_text || responses[q.id].response_value));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={() => setActiveTask(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {activeTask === 'prosocial' ? (
              <div className="space-y-3">
                <p className="text-gray-600 mb-4">
                  Hãy đánh dấu những hành động bạn đã thực hiện hôm nay:
                </p>
                {questions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => handleCheckboxToggle(question.id)}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      responses[question.id]?.checked
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      responses[question.id]?.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {responses[question.id]?.checked && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`text-base ${
                      responses[question.id]?.checked
                        ? 'text-gray-800 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {question.question_text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      {index + 1}. {question.question_text}
                    </label>
                    <textarea
                      value={responses[question.id]?.response_text || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value, 'text')}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập câu trả lời của bạn..."
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setActiveTask(null)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitTask}
                disabled={!allAnswered || saving}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? 'Đang lưu...' : 'Hoàn thành'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  const completedCount = dailyTasks.filter(t => t.completed).length;
  const totalTasks = 3;
  const currentDay = getDayNumber();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Về Dashboard</span>
        </button>

        <div className="text-center mb-12">
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Ngày {currentDay}/7
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nhiệm Vụ Hàng Ngày
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Hoàn thành 3 nhiệm vụ mỗi ngày để phát triển sức khỏe tinh thần
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-semibold">Tiến độ hôm nay</span>
              <span className="text-2xl font-bold text-blue-600">{completedCount}/{totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {renderTaskCard(
            'Lòng Biết Ơn',
            'Nhật ký',
            <BookHeart className="w-6 h-6 text-pink-600" />,
            'gratitude',
            'bg-pink-100'
          )}

          {renderTaskCard(
            'Ý Nghĩa Cuộc Sống',
            'Tự luận',
            <Lightbulb className="w-6 h-6 text-yellow-600" />,
            'meaning',
            'bg-yellow-100'
          )}

          {renderTaskCard(
            'Hành Vi Ủng Hộ Xã Hội',
            'Đánh giá',
            <Users className="w-6 h-6 text-green-600" />,
            'prosocial',
            'bg-green-100'
          )}
        </div>
      </div>

      {renderTaskModal()}
    </div>
  );
}
