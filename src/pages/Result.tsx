import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Shield, TrendingUp, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SurveyResult } from '../types';

interface ResultProps {
  surveyId: string;
  onBackHome: () => void;
}

export default function Result({ surveyId, onBackHome }: ResultProps) {
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [surveyId]);

  const loadResult = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_results')
        .select('*')
        .eq('survey_id', surveyId)
        .maybeSingle();

      if (error) throw error;
      setResult(data);
    } catch (error) {
      console.error('Error loading result:', error);
    } finally {
      setLoading(false);
    }
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

  if (!result) {
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

  const getRiskConfig = (level: string) => {
    const configs = {
      low: {
        icon: CheckCircle,
        color: 'green',
        title: 'Mức Độ Thấp',
        description: 'Bạn có khả năng tư duy độc lập tốt!',
        bgGradient: 'from-green-50 to-emerald-50',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-500',
        borderColor: 'border-green-500',
      },
      medium: {
        icon: Shield,
        color: 'yellow',
        title: 'Mức Độ Trung Bình',
        description: 'Bạn cần chú ý hơn đến quyết định của bản thân.',
        bgGradient: 'from-yellow-50 to-orange-50',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        borderColor: 'border-yellow-500',
      },
      high: {
        icon: AlertTriangle,
        color: 'orange',
        title: 'Mức Độ Cao',
        description: 'Bạn đang bị ảnh hưởng nhiều bởi áp lực nhóm.',
        bgGradient: 'from-orange-50 to-red-50',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-500',
        borderColor: 'border-orange-500',
      },
      critical: {
        icon: AlertTriangle,
        color: 'red',
        title: 'Mức Độ Rất Cao',
        description: 'Bạn cần sự hỗ trợ ngay lập tức!',
        bgGradient: 'from-red-50 to-rose-50',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        borderColor: 'border-red-500',
      },
    };
    return configs[level as keyof typeof configs] || configs.medium;
  };

  const config = getRiskConfig(result.risk_level);
  const Icon = config.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div
              className={`w-24 h-24 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <Icon className={`w-12 h-12 ${config.iconColor}`} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết Quả Đánh Giá</h2>
            <p className={`text-xl font-semibold ${config.iconColor}`}>{config.title}</p>
          </div>

          <div className={`border-l-4 ${config.borderColor} bg-gray-50 p-6 rounded-lg mb-8`}>
            <p className="text-lg text-gray-700 mb-2">{config.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Điểm số của bạn</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r from-${config.color}-400 to-${config.color}-600 h-3 rounded-full transition-all`}
                      style={{ width: `${Math.min((result.total_score / 60) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-lg">{result.total_score}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Phân Tích Chi Tiết
            </h3>
            <div className="space-y-4">
              {result.risk_level === 'low' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Bạn thể hiện khả năng tư duy độc lập tốt và ít bị ảnh hưởng bởi áp lực từ
                    bạn bè. Bạn có xu hướng đưa ra quyết định dựa trên suy nghĩ của riêng mình
                    và không sợ bày tỏ ý kiến khác biệt.
                  </p>
                </div>
              )}
              {result.risk_level === 'medium' && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Bạn đôi khi bị ảnh hưởng bởi ý kiến của nhóm, đặc biệt trong các tình huống
                    xã hội. Bạn cần rèn luyện thêm kỹ năng tự tin và khẳng định bản thân để
                    không bị cuốn theo dòng chảy một cách thụ động.
                  </p>
                </div>
              )}
              {result.risk_level === 'high' && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Bạn đang chịu ảnh hưởng đáng kể từ hành vi bầy đàn. Áp lực từ bạn bè và
                    mong muốn được chấp nhận đang khiến bạn dễ dàng thay đổi quan điểm và hành
                    vi. Điều này có thể dẫn đến việc bạn tham gia vào các hoạt động không phù
                    hợp với giá trị của mình.
                  </p>
                </div>
              )}
              {result.risk_level === 'critical' && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-semibold">
                    Bạn đang ở mức độ rủi ro rất cao! Bạn rất dễ bị ảnh hưởng bởi nhóm và có
                    thể tham gia vào các hành vi tiêu cực. Hãy nói chuyện với người lớn đáng
                    tin cậy ngay lập tức để được hỗ trợ và hướng dẫn.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Khuyến Nghị</h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {result.risk_level === 'critical' && (
            <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Cảnh Báo Quan Trọng
              </h3>
              <p className="text-red-700 mb-4">
                Kết quả của bạn cho thấy bạn đang gặp khó khăn trong việc đưa ra quyết định độc
                lập. Đây là tín hiệu cần được quan tâm ngay lập tức.
              </p>
              <p className="text-red-700 font-semibold">
                Hãy liên hệ với gia đình, thầy cô hoặc chuyên gia tâm lý để được tư vấn và hỗ
                trợ!
              </p>
            </div>
          )}

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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Tìm Hiểu Thêm</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Hành vi bầy đàn</strong> không phải lúc nào cũng xấu. Việc học hỏi từ
              người khác và hòa nhập với cộng đồng là điều tự nhiên. Tuy nhiên, khi bạn làm
              theo nhóm mà không suy nghĩ, đặc biệt là trong những tình huống tiêu cực, điều
              đó có thể gây hại cho bạn.
            </p>
            <p>
              Hãy nhớ rằng: <strong>Bạn có quyền có ý kiến riêng của mình!</strong> Không ai có
              thể buộc bạn phải làm điều gì mà bạn không muốn. Sự tự tin và khả năng tư duy độc
              lập là những kỹ năng quan trọng giúp bạn trở thành phiên bản tốt nhất của chính
              mình.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
