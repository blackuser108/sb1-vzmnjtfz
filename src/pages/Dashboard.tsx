import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';

interface SurveyData {
  id: string;
  created_at: string;
  completed_at: string;
  user_name: string;
  user_age: number;
  user_grade: string;
  result?: {
    total_score: number;
    risk_level: string;
    recommendations: string[];
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    averageScore: 0,
    latestRiskLevel: '',
    improvementRate: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const { data: surveysData, error: surveysError } = await supabase
        .from('surveys')
        .select(`
          *,
          survey_results (
            total_score,
            risk_level,
            recommendations
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (surveysError) throw surveysError;

      const formattedSurveys = surveysData?.map((s: any) => ({
        id: s.id,
        created_at: s.created_at,
        completed_at: s.completed_at,
        user_name: s.user_name,
        user_age: s.user_age,
        user_grade: s.user_grade,
        result: s.survey_results?.[0] || null
      })) || [];

      setSurveys(formattedSurveys);

      const totalSurveys = formattedSurveys.length;
      const scoresArray = formattedSurveys
        .filter((s: any) => s.result)
        .map((s: any) => s.result.total_score);

      const averageScore = scoresArray.length > 0
        ? scoresArray.reduce((a: number, b: number) => a + b, 0) / scoresArray.length
        : 0;

      const latestResult = formattedSurveys[0]?.result;
      const latestRiskLevel = latestResult?.risk_level || '';

      let improvementRate = 0;
      if (scoresArray.length >= 2) {
        const firstScore = scoresArray[scoresArray.length - 1];
        const lastScore = scoresArray[0];
        improvementRate = ((firstScore - lastScore) / firstScore) * 100;
      }

      setStats({
        totalSurveys,
        averageScore: Math.round(averageScore),
        latestRiskLevel,
        improvementRate: Math.round(improvementRate)
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelConfig = (level: string) => {
    const configs: any = {
      low: { color: 'green', label: 'Thấp', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      medium: { color: 'yellow', label: 'Trung bình', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
      high: { color: 'orange', label: 'Cao', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
      critical: { color: 'red', label: 'Rất cao', bgColor: 'bg-red-100', textColor: 'text-red-700' }
    };
    return configs[level] || configs.medium;
  };

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
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-teal-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Điểm trung bình</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.averageScore}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Mức độ hiện tại</h3>
            {stats.latestRiskLevel ? (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelConfig(stats.latestRiskLevel).bgColor} ${getRiskLevelConfig(stats.latestRiskLevel).textColor}`}>
                {getRiskLevelConfig(stats.latestRiskLevel).label}
              </span>
            ) : (
              <p className="text-gray-400">Chưa có dữ liệu</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Tiến bộ</h3>
            <p className={`text-3xl font-bold ${stats.improvementRate > 0 ? 'text-green-600' : stats.improvementRate < 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            Lịch Sử Khảo Sát
          </h2>

          {surveys.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Bạn chưa hoàn thành khảo sát nào</p>
              <p className="text-gray-400">Hãy bắt đầu khảo sát để nhận được đánh giá và gợi ý cải thiện</p>
            </div>
          ) : (
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div key={survey.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Khảo sát ngày {new Date(survey.created_at).toLocaleDateString('vi-VN')}
                        </h3>
                        {survey.result && (
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelConfig(survey.result.risk_level).bgColor} ${getRiskLevelConfig(survey.result.risk_level).textColor}`}>
                            {getRiskLevelConfig(survey.result.risk_level).label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(survey.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {survey.user_name}
                        </span>
                      </div>
                    </div>
                    {survey.result && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Điểm số</p>
                        <p className="text-3xl font-bold text-blue-600">{survey.result.total_score}</p>
                      </div>
                    )}
                  </div>

                  {survey.result && survey.result.recommendations.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        Khuyến nghị
                      </h4>
                      <ul className="space-y-2">
                        {survey.result.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                      {survey.result.recommendations.length > 2 && (
                        <p className="text-sm text-blue-600 mt-2">
                          +{survey.result.recommendations.length - 2} khuyến nghị khác
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {surveys.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Biểu Đồ Tiến Trình</h2>
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-around gap-2">
                {surveys.slice(0, 10).reverse().map((survey, index) => {
                  const score = survey.result?.total_score || 0;
                  const maxScore = 60;
                  const height = (score / maxScore) * 100;

                  return (
                    <div key={survey.id} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex flex-col items-center">
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Điểm: {score}
                        </div>
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-teal-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-teal-600"
                          style={{ height: `${height}%`, minHeight: '20px' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {new Date(survey.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Điểm thấp nhất: 0</p>
              <p className="text-sm text-gray-600">Điểm cao nhất: 60</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
