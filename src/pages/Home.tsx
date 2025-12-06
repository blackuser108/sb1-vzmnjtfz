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
              'url(https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-900/80"></div>
        </div>

        <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Hiểu Rõ Hành Vi Bầy Đàn
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl animate-fade-in-delay">
            Khám phá và đánh giá mức độ ảnh hưởng của hành vi bầy đàn đối với bạn
          </p>
          <button
            onClick={onStartSurvey}
            className="font-extrabold bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce-slow"
          >
            BẮT ĐẦU KHẢO SÁT
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
                Hiểu rõ hơn về bản thân và cách bạn bị ảnh hưởng bởi môi trường xung quanh
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-900">Kỹ Năng Xã Hội</h3>
              <p className="text-gray-700">
                Phát triển khả năng đưa ra quyết định độc lập và tự tin hơn
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                <FileChartPie className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-900">Phân Tích Chi Tiết</h3>
              <p className="text-gray-700">
                Nhận được báo cáo phân tích chi tiết về xu hướng hành vi của bạn
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-900">Bảo Vệ Bản Thân</h3>
              <p className="text-gray-700">
                Học cách nhận biết và tránh những ảnh hưởng tiêu cực từ áp lực nhóm
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Hành Vi Bầy Đàn Là Gì?
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Hành vi bầy đàn là xu hướng làm theo những gì mà đa số mọi người đang làm,
              ngay cả khi điều đó không phù hợp với suy nghĩ hay giá trị của bạn. Ở lứa tuổi
              học sinh, áp lực từ bạn bè và mong muốn được chấp nhận có thể khiến chúng ta dễ
              dàng bị cuốn theo dòng chảy.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Việc nhận biết và hiểu rõ mức độ ảnh hưởng này sẽ giúp bạn trở nên tự tin hơn
              trong việc đưa ra quyết định của riêng mình!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
