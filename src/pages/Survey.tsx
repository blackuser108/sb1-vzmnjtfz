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

const sectionInfo: Record<string, { title: string; instruction: string; scaleLabels: string[] }> = {
  'X': {
    title: 'BẢNG 1: Thang đo lòng biết ơn (GQ - 6)',
    instruction: 'Anh/chị hãy đọc kỹ từng mệnh đề được đưa ra dưới đây và lựa chọn phương án trả lời phù hợp nhất với anh/chị. Anh/chị lưu ý mỗi mệnh đề chỉ lựa chọn 01 phương án trả lời trong số 07 phương án được đưa ra.',
    scaleLabels: [
      '1 = Hoàn toàn không đồng ý',
      '2 = Không đồng ý',
      '3 = Hơi không đồng ý',
      '4 = Trung lập',
      '5 = Hơi đồng ý',
      '6 = Đồng ý',
      '7 = Hoàn toàn đồng ý'
    ]
  },
  'Y': {
    title: 'BẢNG 2: Thang đo hành vi ủng hộ xã hội (PSA)',
    instruction: 'Các mệnh đề dưới đây mô tả một số lượng lớn các tình huống phổ biến. Không có câu trả lời "đúng" hay "sai"; câu trả lời tốt nhất là câu trả lời tự phát, đến ngay sau khi anh/chị đọc xong mệnh đề. Anh/chị hãy đọc từng mệnh đề và lựa chọn phương án trả lời đến đầu tiên trong suy nghĩ của anh/chị.',
    scaleLabels: [
      '1 = Không bao giờ/hầu như không bao giờ đúng',
      '2 = Thỉnh thoảng đúng',
      '3 = Đôi khi đúng (đúng nhiều hơn mức "thỉnh thoảng")',
      '4 = Thường đúng',
      '5 = Luôn đúng/Hầu như luôn đúng'
    ]
  },
  'M': {
    title: 'BẢNG 3: Thang đo ý nghĩa cuộc sống (MLQ)',
    instruction: 'Anh/chị hãy đọc kỹ từng mệnh đề được đưa ra dưới đây và lựa chọn phương án trả lời phù hợp nhất với anh/chị.',
    scaleLabels: [
      '1 = Hoàn toàn sai',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7 = Hoàn toàn đúng'
    ]
  }
};

export default function Survey({ onComplete, onBack }: SurveyProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [currentSectionCode, setCurrentSectionCode] = useState<string>('');

  useEffect(() => {
    loadSurveyData();
  }, []);

  const loadSurveyData = async () => {
    try {
      const [sectionsResult, questionsResult] = await Promise.all([
        supabase
          .from('survey_sections')
          .select('*')
          .order('display_order'),
        supabase
          .from('survey_questions')
          .select('*')
          .eq('is_active', true)
      ]);

      if (sectionsResult.data) {
        setSections(sectionsResult.data);
      }
      if (questionsResult.data) {
        const sectionOrder: Record<string, number> = { 'X': 1, 'Y': 2, 'M': 3 };
        const sortedQuestions = questionsResult.data.sort((a, b) => {
          const sectionCompare = (sectionOrder[a.section_code] || 0) - (sectionOrder[b.section_code] || 0);
          if (sectionCompare !== 0) return sectionCompare;
          return a.question_order - b.question_order;
        });
        setQuestions(sortedQuestions);
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
    if (showSectionIntro) {
      setShowSectionIntro(false);
      return;
    }

    if (currentStep < questions.length) {
      const nextQuestion = questions[currentStep];
      const currentQuestion = questions[currentStep - 1];

      if (currentQuestion && nextQuestion && currentQuestion.section_code !== nextQuestion.section_code) {
        setCurrentSectionCode(nextQuestion.section_code);
        setShowSectionIntro(true);
      }

      setCurrentStep(currentStep + 1);
    } else {
      submitSurvey();
    }
  };

  const handlePrevious = () => {
    if (showSectionIntro) {
      setShowSectionIntro(false);
      setCurrentStep(currentStep - 1);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartSurvey = () => {
    if (questions.length > 0) {
      setCurrentSectionCode(questions[0].section_code);
      setShowSectionIntro(true);
      setCurrentStep(1);
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
                <strong>Lưu ý:</strong> Khảo sát gồm {questions.length} câu hỏi chia thành 3 phần.
                Vui lòng trả lời trung thực để có kết quả chính xác nhất.
              </p>
            </div>

            <button
              onClick={handleStartSurvey}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Bắt Đầu Khảo Sát
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSectionIntro && currentSectionCode) {
    const info = sectionInfo[currentSectionCode];
    const sectionQuestions = questions.filter(q => q.section_code === currentSectionCode);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{info.title}</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
              <p className="text-gray-700 leading-relaxed">{info.instruction}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thang đo:</h3>
              <div className="grid grid-cols-1 gap-2">
                {info.scaleLabels.map((label, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                <strong>Phần này gồm {sectionQuestions.length} câu hỏi.</strong> Hãy đọc kỹ và chọn phương án phù hợp nhất với bạn.
              </p>
            </div>

            <button
              onClick={() => setShowSectionIntro(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Bắt Đầu Trả Lời
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
