import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SurveyProps {
  onComplete: (responseId: string) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  section_code: string;
  question_text: string;
  question_order: number;
}

interface Section {
  code: string;
  name: string;
  description: string;
  scale_min: number;
  scale_max: number;
}

export default function Survey({ onComplete, onBack }: SurveyProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveyData();
  }, []);

  const loadSurveyData = async () => {
    try {
      const [sectionsResult, questionsResult] = await Promise.all([
        supabase
          .from('survey_sections')
          .select('*')
          .order('code'),
        supabase
          .from('survey_questions')
          .select('*')
          .eq('is_active', true)
          .order('section_code, question_order')
      ]);

      if (sectionsResult.data) {
        setSections(sectionsResult.data);
      }
      if (questionsResult.data) {
        setQuestions(questionsResult.data);
      }
    } catch (error) {
      console.error('Error loading survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = () => {
    const xQuestions = questions.filter(q => q.section_code === 'X');
    const yQuestions = questions.filter(q => q.section_code === 'Y');
    const mQuestions = questions.filter(q => q.section_code === 'M');

    const xScore = xQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0) / xQuestions.length;
    const yScore = yQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0) / yQuestions.length;
    const mScore = mQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0) / mQuestions.length;

    return {
      x_score: Number(xScore.toFixed(2)),
      y_score: Number(yScore.toFixed(2)),
      m_score: Number(mScore.toFixed(2))
    };
  };

  const getLevel = (score: number, sectionCode: string): string => {
    if (sectionCode === 'Y') {
      if (score >= 4.21) return 'Rất cao';
      if (score >= 3.41) return 'Cao';
      if (score >= 2.61) return 'Trung bình';
      if (score >= 1.81) return 'Thấp';
      return 'Rất thấp';
    } else {
      if (score >= 5.81) return 'Rất cao';
      if (score >= 4.61) return 'Cao';
      if (score >= 3.41) return 'Trung bình';
      if (score >= 2.21) return 'Thấp';
      return 'Rất thấp';
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      submitSurvey();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitSurvey = async () => {
    try {
      const scores = calculateScores();
      const xLevel = getLevel(scores.x_score, 'X');
      const yLevel = getLevel(scores.y_score, 'Y');
      const mLevel = getLevel(scores.m_score, 'M');

      const { data: response, error } = await supabase
        .from('survey_responses')
        .insert({
          user_id: user?.id,
          x_score: scores.x_score,
          y_score: scores.y_score,
          m_score: scores.m_score,
          x_level: xLevel,
          y_level: yLevel,
          m_level: mLevel,
          answers: answers
        })
        .select()
        .single();

      if (error) throw error;

      if (response) {
        onComplete(response.id);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải khảo sát...</div>
      </div>
    );
  }

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Khảo Sát Sức Khỏe Tinh Thần
            </h2>

            <div className="space-y-6 mb-8">
              {sections.map((section) => (
                <div key={section.code} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-bold text-gray-800">{section.name}</h3>
                  <p className="text-gray-600">{section.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Thang đo: {section.scale_min} - {section.scale_max}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                <strong>Lưu ý:</strong> Khảo sát gồm {questions.length} câu hỏi.
                Vui lòng trả lời trung thực để có kết quả chính xác nhất.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Bắt Đầu Khảo Sát
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep > questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Hoàn Thành!</h2>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã hoàn thành khảo sát. Đang xử lý kết quả...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];
  const currentSection = sections.find(s => s.code === currentQuestion.section_code);
  const scaleOptions = currentSection
    ? Array.from({ length: currentSection.scale_max - currentSection.scale_min + 1 }, (_, i) => i + currentSection.scale_min)
    : [];

  const sectionQuestions = questions.filter(q => q.section_code === currentQuestion.section_code);
  const questionIndexInSection = sectionQuestions.findIndex(q => q.id === currentQuestion.id) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Câu hỏi {currentStep} / {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {currentSection?.name} - Câu {questionIndexInSection}/{sectionQuestions.length}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{currentQuestion.question_text}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">1 = Hoàn toàn không đồng ý</span>
              <span className="text-sm text-gray-500">{currentSection?.scale_max} = Hoàn toàn đồng ý</span>
            </div>

            <div className="flex justify-between gap-2">
              {scaleOptions.map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(currentQuestion.id, value)}
                  className={`flex-1 py-8 rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === value
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-2xl font-bold">{value}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Câu trước
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {currentStep === questions.length ? 'Hoàn thành' : 'Câu tiếp theo'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
