import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  FileText,
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  Clock,
  Target,
  MessageSquare,
  Trash2,
  CheckCircle2,
  LineChart,
  PieChart
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface SurveyData {
  id: string;
  created_at: string;
  completed_at: string;
  x_score: number;
  y_score: number;
  m_score: number;
  x_level: string;
  y_level: string;
  m_level: string;
}

interface ChatSession {
  session_id: string;
  message_count: number;
  last_message_at: string;
  first_message_at: string;
}

interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface DailyScore {
  id: string;
  task_date: string;
  gratitude_score: number | null;
  life_meaning_score: number | null;
  prosocial_behavior: string | null;
}

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState(0);
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    latestXLevel: '',
    latestYLevel: '',
    latestMLevel: '',
    totalChats: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const { data: surveysData, error: surveysError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (surveysError) throw surveysError;

      const formattedSurveys = surveysData || [];
      setSurveys(formattedSurveys);

      const totalSurveys = formattedSurveys.length;
      const latestSurvey = formattedSurveys[0];

      const { data: chatData, error: chatError } = await supabase
        .from('chat_history')
        .select('session_id, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (chatError) throw chatError;

      const sessionMap = new Map<string, { messages: number; first: string; last: string }>();
      chatData?.forEach((chat: any) => {
        if (!sessionMap.has(chat.session_id)) {
          sessionMap.set(chat.session_id, { messages: 0, first: chat.created_at, last: chat.created_at });
        }
        const session = sessionMap.get(chat.session_id)!;
        session.messages++;
        session.last = chat.created_at;
      });

      const sessions: ChatSession[] = Array.from(sessionMap.entries()).map(([id, data]) => ({
        session_id: id,
        message_count: data.messages,
        last_message_at: data.last,
        first_message_at: data.first
      }));

      setChatSessions(sessions);

      const { data: scoresData, error: scoresError } = await supabase
        .from('daily_scores')
        .select('*')
        .eq('user_id', user?.id)
        .order('task_date', { ascending: true });

      if (!scoresError && scoresData) {
        setDailyScores(scoresData);
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: tasksData, error: tasksError } = await supabase
        .from('daily_tasks')
        .select('completed')
        .eq('user_id', user?.id)
        .eq('task_date', today);

      if (tasksError) throw tasksError;

      const completedTasksCount = tasksData?.filter(t => t.completed).length || 0;
      setDailyTasksCompleted(completedTasksCount);

      setStats({
        totalSurveys,
        latestXLevel: latestSurvey?.x_level || '',
        latestYLevel: latestSurvey?.y_level || '',
        latestMLevel: latestSurvey?.m_level || '',
        totalChats: sessions.length
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('id, message, role, created_at')
        .eq('session_id', sessionId)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSelectedSession(data || []);
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  const deleteChat = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user?.id);

      if (error) throw error;
      setChatSessions(chatSessions.filter(s => s.session_id !== sessionId));
      setSelectedSession([]);
      setStats(prev => ({ ...prev, totalChats: prev.totalChats - 1 }));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const getRiskLevelConfig = (level: string) => {
    const configs: any = {
      'Rất thấp': { color: 'green', label: 'Rất thấp', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      'Thấp': { color: 'green', label: 'Thấp', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      'Trung bình': { color: 'yellow', label: 'Trung bình', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
      'Cao': { color: 'orange', label: 'Cao', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
      'Rất cao': { color: 'red', label: 'Rất cao', bgColor: 'bg-red-100', textColor: 'text-red-700' }
    };
    return configs[level] || configs['Trung bình'];
  };

  const getSurveyProgressData = () => {
    return surveys.slice().reverse().map((survey, index) => ({
      name: `Lần ${index + 1}`,
      date: new Date(survey.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      'Lòng biết ơn': Number(survey.x_score),
      'Hành vi xã hội': Number(survey.y_score),
      'Ý nghĩa cuộc sống': Number(survey.m_score)
    }));
  };

  const getDailyGratitudeData = () => {
    return dailyScores
      .filter(s => s.gratitude_score !== null)
      .slice(-14)
      .map(score => ({
        date: new Date(score.task_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        'Điểm': score.gratitude_score
      }));
  };

  const getDailyMeaningData = () => {
    return dailyScores
      .filter(s => s.life_meaning_score !== null)
      .slice(-14)
      .map(score => ({
        date: new Date(score.task_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        'Điểm': score.life_meaning_score
      }));
  };

  const getProsocialBehaviorStats = () => {
    const behaviorCounts: Record<string, number> = {};
    dailyScores.forEach(score => {
      if (score.prosocial_behavior) {
        behaviorCounts[score.prosocial_behavior] = (behaviorCounts[score.prosocial_behavior] || 0) + 1;
      }
    });
    return Object.entries(behaviorCounts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value);
  };

  const COLORS = ['#3B82F6', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Xin chào, {user?.user_metadata?.name || user?.email?.split('@')[0]}</p>
        </div>

        <div
          onClick={() => onNavigate('dailytasks')}
          className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg p-6 mb-8 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-xl font-bold mb-2">Nhiệm Vụ Hàng Ngày</h3>
              <p className="text-white text-opacity-90 mb-4">
                Hoàn thành 3 nhiệm vụ mỗi ngày
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-2xl font-bold">{dailyTasksCompleted}/3</span>
              </div>
            </div>
            <div className="text-white text-opacity-50">
              <CheckCircle2 className="w-16 h-16" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng số khảo sát</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalSurveys}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Lòng biết ơn</h3>
            {stats.latestXLevel ? (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelConfig(stats.latestXLevel).bgColor} ${getRiskLevelConfig(stats.latestXLevel).textColor}`}>
                {getRiskLevelConfig(stats.latestXLevel).label}
              </span>
            ) : (
              <p className="text-gray-400">Chưa có dữ liệu</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Hành vi xã hội</h3>
            {stats.latestYLevel ? (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelConfig(stats.latestYLevel).bgColor} ${getRiskLevelConfig(stats.latestYLevel).textColor}`}>
                {getRiskLevelConfig(stats.latestYLevel).label}
              </span>
            ) : (
              <p className="text-gray-400">Chưa có dữ liệu</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Ý nghĩa cuộc sống</h3>
            {stats.latestMLevel ? (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelConfig(stats.latestMLevel).bgColor} ${getRiskLevelConfig(stats.latestMLevel).textColor}`}>
                {getRiskLevelConfig(stats.latestMLevel).label}
              </span>
            ) : (
              <p className="text-gray-400">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        {surveys.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <LineChart className="w-6 h-6 text-blue-500" />
              Biểu Đồ Tiến Bộ Tổng Thể (Khảo Sát Chính)
            </h2>
            <p className="text-gray-600 mb-6">Theo dõi sự phát triển của ba chỉ số qua các lần khảo sát</p>

            <div className="mb-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-600">Lòng biết ơn (Thang 1-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-gray-600">Hành vi xã hội (Thang 1-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Ý nghĩa cuộc sống (Thang 1-7)</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <RechartsLineChart data={getSurveyProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 7]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Lòng biết ơn" stroke="#EC4899" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Hành vi xã hội" stroke="#14B8A6" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Ý nghĩa cuộc sống" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        )}

        {dailyScores.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <LineChart className="w-6 h-6 text-pink-500" />
                Lòng Biết Ơn Hàng Ngày
              </h2>
              <p className="text-gray-600 mb-6">Điểm số AI đánh giá (Thang 1-7) - 14 ngày gần nhất</p>

              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={getDailyGratitudeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 7]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Điểm" stroke="#EC4899" strokeWidth={3} dot={{ r: 4 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <LineChart className="w-6 h-6 text-orange-500" />
                Ý Nghĩa Cuộc Sống Hàng Ngày
              </h2>
              <p className="text-gray-600 mb-6">Điểm số AI đánh giá (Thang 1-7) - 14 ngày gần nhất</p>

              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={getDailyMeaningData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 7]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Điểm" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {getProsocialBehaviorStats().length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-teal-500" />
              Hành Vi Ủng Hộ Xã Hội Hàng Ngày
            </h2>
            <p className="text-gray-600 mb-6">Phân bố các hành vi được chọn nhiều nhất</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={getProsocialBehaviorStats()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getProsocialBehaviorStats().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>

              <div className="flex flex-col justify-center space-y-3">
                {getProsocialBehaviorStats().map((behavior, index) => {
                  const total = getProsocialBehaviorStats().reduce((sum, b) => sum + b.value, 0);
                  const percentage = Math.round((behavior.value / total) * 100);
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{behavior.name}</p>
                        <p className="text-xs text-gray-600">{behavior.value} lần ({percentage}%)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            Lịch Sử Khảo Sát Chi Tiết
          </h2>

          {surveys.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Bạn chưa hoàn thành khảo sát nào</p>
              <p className="text-gray-400">Hãy bắt đầu khảo sát để nhận được đánh giá và gợi ý cải thiện</p>
            </div>
          ) : (
            <div className="space-y-4">
              {surveys.map((survey) => {
                const avgScore = ((Number(survey.x_score) + Number(survey.y_score) + Number(survey.m_score)) / 3).toFixed(2);

                return (
                  <div key={survey.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            Khảo sát ngày {new Date(survey.created_at).toLocaleDateString('vi-VN')}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(survey.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Điểm trung bình</p>
                        <p className="text-3xl font-bold text-blue-600">{avgScore}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Lòng biết ơn</p>
                        <p className="text-lg font-bold text-gray-800">{survey.x_score}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelConfig(survey.x_level).bgColor} ${getRiskLevelConfig(survey.x_level).textColor}`}>
                          {survey.x_level}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Hành vi xã hội</p>
                        <p className="text-lg font-bold text-gray-800">{survey.y_score}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelConfig(survey.y_level).bgColor} ${getRiskLevelConfig(survey.y_level).textColor}`}>
                          {survey.y_level}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Ý nghĩa cuộc sống</p>
                        <p className="text-lg font-bold text-gray-800">{survey.m_score}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelConfig(survey.m_level).bgColor} ${getRiskLevelConfig(survey.m_level).textColor}`}>
                          {survey.m_level}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {chatSessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-pink-500" />
              Lịch Sử Trò Chuyện
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {chatSessions.map((session) => (
                    <button
                      key={session.session_id}
                      onClick={() => loadChatSession(session.session_id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedSession.length > 0 && selectedSession.some(m => m.id)
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-gray-800">Cuộc trò chuyện</p>
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                          {session.message_count} tin
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(session.last_message_at).toLocaleDateString('vi-VN')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                {selectedSession.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                      {selectedSession.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedSession.length > 0 && (
                      <button
                        onClick={() => {
                          const activeSession = chatSessions.find(session =>
                            selectedSession.some(msg => msg.id)
                          );
                          if (activeSession) {
                            deleteChat(activeSession.session_id);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa cuộc trò chuyện này
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Chọn một cuộc trò chuyện để xem</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
