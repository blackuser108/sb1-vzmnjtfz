import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { surveyQuestions } from '../data/questions';
import { supabase } from '../lib/supabase';
import { Survey as SurveyType } from '../types';

interface SurveyProps {
  onComplete: (surveyId: string) => void;
  onBack: () => void;
}

export default function Survey({ onComplete, onBack }: SurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    grade: '',
    school: '',
  });
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(1);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const currentQuestion = surveyQuestions[currentStep - 1];
  const isLastQuestion = currentStep === surveyQuestions.length + 1;

  const handleNext = async () => {
    if (isLastQuestion) {
      await submitSurvey();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitSurvey = async (mode: 'situation' | 'result' = 'situation') => {
    try {
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          user_name: userInfo.name,
          user_age: parseInt(userInfo.age),
          user_grade: userInfo.grade,
          user_school: userInfo.school,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (surveyError || !survey) throw surveyError;

      const responses = Object.entries(answers).map(([questionId, answer]) => {
        const question = surveyQuestions.find((q) => q.id === questionId);
        return {
          survey_id: survey.id,
          question_id: questionId,
          question_type: question?.type || 'likert',
          answer: { value: answer },
        };
      });

      const { error: responsesError } = await supabase
        .from('survey_responses')
        .insert(responses);

      if (responsesError) throw responsesError;

      const score = calculateScore();
      const riskLevel = getRiskLevel(score);
      const recommendations = getRecommendations(riskLevel);

      const { error: resultError } = await supabase.from('survey_results').insert({
        survey_id: survey.id,
        total_score: score,
        risk_level: riskLevel,
        analysis: { score, answers },
        recommendations,
      });

      if (resultError) throw resultError;

      onComplete(survey.id);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại!');
    }
  };

  const calculateScore = () => {
    let score = 0;
    surveyQuestions.forEach((q) => {
      const answer = answers[q.id];
      if (q.type === 'likert' && typeof answer === 'number') {
        score += answer;
      } else if (q.type === 'multiple_choice' && typeof answer === 'number') {
        score += 5 - answer;
      }
    });
    return score;
  };

  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score <= 15) return 'low';
    if (score <= 30) return 'medium';
    if (score <= 45) return 'high';
    return 'critical';
  };

  const getRecommendations = (riskLevel: string): string[] => {
    const recommendations: Record<string, string[]> = {
      low: [
        'Bạn có khả năng tư duy độc lập tốt! Hãy tiếp tục phát huy.',
        'Chia sẻ kinh nghiệm của bạn với bạn bè để giúp họ tự tin hơn.',
      ],
      medium: [
        'Bạn cần chú ý đến việc đưa ra quyết định độc lập nhiều hơn.',
        'Thử thách bản thân bằng cách nói "không" khi không đồng ý với nhóm.',
        'Tìm hiểu thêm về giá trị cá nhân của bạn.',
      ],
      high: [
        'Bạn đang bị ảnh hưởng nhiều bởi áp lực nhóm.',
        'Hãy dành thời gian suy nghĩ về những gì thực sự quan trọng với bạn.',
        'Tìm kiếm sự hỗ trợ từ gia đình hoặc thầy cô.',
        'Luyện tập kỹ năng tự khẳng định bản thân.',
      ],
      critical: [
        'Bạn đang ở mức độ rủi ro cao về hành vi bầy đàn.',
        'Cần trao đổi với người lớn đáng tin cậy ngay lập tức.',
        'Tham gia các hoạt động phát triển kỹ năng sống.',
        'Xem xét tham khảo ý kiến chuyên gia tâm lý.',
      ],
    };
    return recommendations[riskLevel] || [];
  };

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Thông Tin Cá Nhân
            </h2>

            <form onSubmit={handleUserInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Tuổi</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="25"
                  value={userInfo.age}
                  onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tuổi của bạn"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Lớp</label>
                <input
                  type="text"
                  required
                  value={userInfo.grade}
                  onChange={(e) => setUserInfo({ ...userInfo, grade: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 10A1, 11B2, ..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Trường</label>
                <input
                  type="text"
                  value={userInfo.school}
                  onChange={(e) => setUserInfo({ ...userInfo, school: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên trường (không bắt buộc)"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Bắt Đầu Khảo Sát
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isLastQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Hoàn Thành!</h2>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã hoàn thành khảo sát. Hãy xem kết quả phân tích của bạn!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Xem lại
              </button>
              <button
                onClick={() => submitSurvey('result')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Tình huống
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Câu hỏi {currentStep} / {surveyQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / surveyQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / surveyQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-8 text-gray-800">{currentQuestion.text}</h3>

          {currentQuestion.type === 'likert' && (
            <div className="space-y-4">
              {[
                { value: 1, label: 'Hoàn toàn không đồng ý' },
                { value: 2, label: 'Không đồng ý' },
                { value: 3, label: 'Trung lập' },
                { value: 4, label: 'Đồng ý' },
                { value: 5, label: 'Hoàn toàn đồng ý' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    answers[currentQuestion.id] === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion.id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, index)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {answers[currentQuestion.id] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'open_ended' && (
            <textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              placeholder="Nhập câu trả lời của bạn..."
            />
          )}

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
              {currentStep === surveyQuestions.length ? 'Hoàn thành' : 'Câu tiếp theo'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
