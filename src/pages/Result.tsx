import { useEffect, useState } from 'react';
import { Heart, Users, Target, Home, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ResultProps {
  surveyId: string;
  onBackHome: () => void;
}

interface SurveyResponse {
  id: string;
  x_score: number;
  y_score: number;
  m_score: number;
  x_level: string;
  y_level: string;
  m_level: string;
  completed_at: string;
}

export default function Result({ surveyId, onBackHome }: ResultProps) {
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [surveyId]);

  const loadResult = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', surveyId)
        .maybeSingle();

      if (error) throw error;
      setResponse(data);
    } catch (error) {
      console.error('Error loading result:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Rất cao': 'bg-green-100 text-green-800 border-green-500',
      'Cao': 'bg-blue-100 text-blue-800 border-blue-500',
      'Trung bình': 'bg-yellow-100 text-yellow-800 border-yellow-500',
      'Thấp': 'bg-orange-100 text-orange-800 border-orange-500',
      'Rất thấp': 'bg-red-100 text-red-800 border-red-500',
    };
    return colors[level] || colors['Trung bình'];
  };

  const getRecommendations = (xLevel: string, yLevel: string, mLevel: string) => {
    const recommendations: Record<string, string[]> = {
      'X': {
        'Rất cao': [
          'Bạn có khả năng trân trọng cuộc sống xuất sắc!',
          'Hãy tiếp tục ghi nhận những điều tích cực mỗi ngày.',
          'Chia sẻ lòng biết ơn của bạn với người thân để lan tỏa năng lượng tích cực.'
        ],
        'Cao': [
          'Bạn biết trân trọng những điều tốt đẹp trong cuộc sống.',
          'Hãy thử viết nhật ký biết ơn để duy trì và phát triển thêm.',
          'Thể hiện lòng biết ơn với những người xung quanh bạn.'
        ],
        'Trung bình': [
          'Bạn có thể cải thiện khả năng nhận biết những điều tích cực.',
          'Mỗi ngày hãy dành 5 phút để nghĩ về 3 điều bạn biết ơn.',
          'Tập trung vào những điều nhỏ nhặt nhưng có ý nghĩa trong cuộc sống.'
        ],
        'Thấp': [
          'Bạn cần chú ý nhiều hơn đến những điều tích cực xung quanh.',
          'Bắt đầu với việc ghi chép 1 điều biết ơn mỗi ngày.',
          'Tìm kiếm sự hỗ trợ từ gia đình hoặc bạn bè để chia sẻ cảm xúc.'
        ],
        'Rất thấp': [
          'Bạn đang gặp khó khăn trong việc nhận ra những điều tích cực.',
          'Hãy nói chuyện với người lớn đáng tin cậy về cảm xúc của bạn.',
          'Xem xét tham khảo ý kiến chuyên gia tâm lý để được hỗ trợ.'
        ]
      },
      'Y': {
        'Rất cao': [
          'Bạn có tinh thần giúp đỡ người khác rất tốt!',
          'Hãy tiếp tục tham gia các hoạt động tình nguyện và cộng đồng.',
          'Truyền cảm hứng cho bạn bè cùng tham gia các hoạt động ý nghĩa.'
        ],
        'Cao': [
          'Bạn thường xuyên giúp đỡ người khác.',
          'Hãy tìm kiếm thêm cơ hội để đóng góp cho cộng đồng.',
          'Chia sẻ kinh nghiệm của bạn để khuyến khích người khác.'
        ],
        'Trung bình': [
          'Bạn có thể phát triển thêm hành vi giúp đỡ người khác.',
          'Bắt đầu với những việc nhỏ như giúp bạn bè trong học tập.',
          'Tham gia các hoạt động nhóm để học cách làm việc với người khác.'
        ],
        'Thấp': [
          'Bạn cần chú ý nhiều hơn đến nhu cầu của người xung quanh.',
          'Thử thách bản thân bằng việc giúp đỡ một người mỗi tuần.',
          'Tìm hiểu về lợi ích của việc giúp đỡ người khác đối với bản thân.'
        ],
        'Rất thấp': [
          'Bạn đang thiếu kết nối với cộng đồng xung quanh.',
          'Hãy bắt đầu với những hành động nhỏ để giúp đỡ người khác.',
          'Tham gia các nhóm hoạt động để học cách tương tác tích cực.'
        ]
      },
      'M': {
        'Rất cao': [
          'Bạn có cảm nhận rõ ràng về ý nghĩa và mục đích cuộc sống!',
          'Hãy tiếp tục theo đuổi những điều có ý nghĩa với bạn.',
          'Chia sẻ triết lý sống của bạn để truyền cảm hứng cho người khác.'
        ],
        'Cao': [
          'Bạn đang trên con đường tìm thấy ý nghĩa cuộc sống.',
          'Hãy khám phá thêm những giá trị và mục tiêu quan trọng với bạn.',
          'Dành thời gian suy ngẫm về hướng đi của cuộc đời.'
        ],
        'Trung bình': [
          'Bạn đang trong quá trình khám phá ý nghĩa cuộc sống.',
          'Hãy thử những hoạt động mới để tìm ra đam mê của mình.',
          'Đặt câu hỏi về những gì thực sự quan trọng với bạn.'
        ],
        'Thấp': [
          'Bạn cần dành thời gian để suy nghĩ về mục đích cuộc sống.',
          'Thử viết nhật ký để khám phá giá trị và mục tiêu của bản thân.',
          'Trao đổi với người lớn đáng tin cậy về định hướng tương lai.'
        ],
        'Rất thấp': [
          'Bạn đang cảm thấy lạc lối và thiếu định hướng.',
          'Hãy tìm kiếm sự hỗ trợ từ gia đình, thầy cô hoặc chuyên gia.',
          'Tham gia các hoạt động tư vấn để được hướng dẫn và động viên.'
        ]
      }
    };

    return {
      x: recommendations['X'][xLevel] || recommendations['X']['Trung bình'],
      y: recommendations['Y'][yLevel] || recommendations['Y']['Trung bình'],
      m: recommendations['M'][mLevel] || recommendations['M']['Trung bình']
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang phân tích kết quả...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy kết quả</p>
          <button
            onClick={onBackHome}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendations(response.x_level, response.y_level, response.m_level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Kết Quả Khảo Sát</h2>
            <p className="text-gray-600">Phân tích sức khỏe tinh thần của bạn</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Lòng Biết Ơn</h3>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Điểm số</span>
                  <span className="text-2xl font-bold text-pink-600">{response.x_score.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-pink-600 h-3 rounded-full transition-all"
                    style={{ width: `${(response.x_score / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getLevelColor(response.x_level)}`}>
                {response.x_level}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Hành Vi Xã Hội</h3>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Điểm số</span>
                  <span className="text-2xl font-bold text-blue-600">{response.y_score.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(response.y_score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getLevelColor(response.y_level)}`}>
                {response.y_level}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ý Nghĩa Sống</h3>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Điểm số</span>
                  <span className="text-2xl font-bold text-purple-600">{response.m_score.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${(response.m_score / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getLevelColor(response.m_level)}`}>
                {response.m_level}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Khuyến Nghị Cho Bạn
          </h3>

          <div className="space-y-6">
            <div className="border-l-4 border-pink-500 bg-pink-50 p-6 rounded-r-lg">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Lòng Biết Ơn
              </h4>
              <ul className="space-y-2">
                {recommendations.x.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Hành Vi Ủng Hộ Xã Hội
              </h4>
              <ul className="space-y-2">
                {recommendations.y.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-6 rounded-r-lg">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Ý Nghĩa Cuộc Sống
              </h4>
              <ul className="space-y-2">
                {recommendations.m.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Giải Thích Kết Quả</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Lòng biết ơn (X):</strong> Đo lường khả năng trân trọng và nhận biết những điều tích cực trong cuộc sống. Lòng biết ơn giúp cải thiện sức khỏe tinh thần và tăng cường hạnh phúc.
            </p>
            <p>
              <strong>Hành vi ủng hộ xã hội (Y):</strong> Đánh giá mức độ sẵn sàng giúp đỡ và đóng góp cho cộng đồng. Hành vi này giúp xây dựng mối quan hệ tốt và tạo ý nghĩa cho cuộc sống.
            </p>
            <p>
              <strong>Ý nghĩa cuộc sống (M):</strong> Đo lường cảm nhận về mục đích và ý nghĩa trong cuộc sống. Có ý nghĩa sống rõ ràng giúp định hướng và tạo động lực cho bản thân.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
}
