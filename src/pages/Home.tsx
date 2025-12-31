import { BookOpen, Users, TrendingUp, Shield, FileChartPie } from 'lucide-react';

interface HomeProps {
  onStartSurvey: () => void;
}

export default function Home({ onStartSurvey }: HomeProps) {
  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/background.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-900/80"></div>
        </div>

        <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-5xl font-bold mb-6 animate-fade-in">
            LÒNG BIẾT ƠN VÀ HÀNH VI ỦNG HỘ XÃ HỘI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl animate-fade-in-delay">
            Khám phá và đánh giá vai trò trung gian của ý nghĩa cuộc sống
          </p>
          <button
            onClick={onStartSurvey}
            className="font-extrabold bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce-slow"
          >
            BẮT ĐẦU NGHIÊN CỨU
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Tại Sao Nên Tham Gia?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-900">Tự Nhận Thức</h3>
              <p className="text-gray-700">
                Giúp bạn hiểu rõ hơn mức độ lòng biết ơn và ý nghĩa cuộc sống của bản thân trong cuộc sống hằng ngày.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-900">Giá trị sống</h3>
              <p className="text-gray-700">
                Nhận ra vai trò của ý nghĩa cuộc sống trong việc định hướng suy nghĩ, cảm xúc và hành động tích cực với người khác.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                <FileChartPie className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-900">Hành Vi Xã Hội</h3>
              <p className="text-gray-700">
                Khám phá cách bạn thể hiện sự quan tâm, chia sẻ và ủng hộ xã hội trong các tình huống khác nhau.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-900">Phát Triển Bản Thân</h3>
              <p className="text-gray-700">
                Góp phần nuôi dưỡng lòng biết ơn, ý nghĩa sống và khuyến khích những hành vi tốt đẹp cho cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Tính Cấp Thiết Của Nghiên Cứu
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Ở lứa tuổi THPT, học sinh đang trong giai đoạn hình thành giá trị sống và nhân cách, nhưng dễ chịu tác động từ áp lực học tập và các mối quan hệ xã hội. Việc thiếu lòng biết ơn và ý nghĩa cuộc sống có thể làm giảm các hành vi quan tâm, sẻ chia và ủng hộ người khác.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nghiên cứu này giúp làm rõ mối quan hệ giữa lòng biết ơn và hành vi ủng hộ xã hội, đồng thời nhấn mạnh vai trò trung gian của ý nghĩa cuộc sống. Từ đó, góp phần định hướng các hoạt động giáo dục và nuôi dưỡng những giá trị tích cực cho học sinh.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
