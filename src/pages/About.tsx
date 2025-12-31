import { Brain, Heart, Users, Target, Sparkles, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Giới Thiệu Website
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Website được xây dựng nhằm hỗ trợ thu thập dữ liệu cho nghiên cứu về mối quan hệ giữa lòng biết ơn và hành vi ủng hộ xã hội của học sinh THPT, với vai trò trung gian của ý nghĩa cuộc sống.
          </p>
          <p className="text-lg text-gray-600 mt-4 max-w-4xl mx-auto leading-relaxed">
            Tại đây, người tham gia có thể thực hiện khảo sát một cách nhanh chóng, bảo mật và hoàn toàn tự nguyện. Mọi thông tin thu thập chỉ phục vụ cho mục đích nghiên cứu khoa học, góp phần cung cấp cơ sở dữ liệu đáng tin cậy cho các hoạt động giáo dục và phát triển tâm lý tích cực trong nhà trường.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Về Dự Án</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Website này được phát triển nhằm phục vụ nghiên cứu về mối quan hệ giữa lòng biết ơn và hành vi ủng hộ xã hội của học sinh THPT, với vai trò trung gian của ý nghĩa cuộc sống. Dự án hướng đến việc giúp học sinh hiểu rõ hơn những yếu tố tâm lý tích cực ảnh hưởng đến cách các bạn suy nghĩ, cảm nhận và hành động trong đời sống hằng ngày.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Tầm Quan Trọng</h3>
            <p className="text-gray-700 leading-relaxed">
              Việc nuôi dưỡng lòng biết ơn và ý nghĩa cuộc sống góp phần thúc đẩy các hành vi quan tâm, chia sẻ và ủng hộ xã hội. Nghiên cứu này giúp làm rõ những giá trị tích cực đó, từ đó hỗ trợ học sinh phát triển nhân cách lành mạnh và gắn kết hơn với cộng đồng.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Mục Tiêu</h3>
            <p className="text-gray-700 leading-relaxed">
              Giúp học sinh tự đánh giá mức độ lòng biết ơn, cảm nhận ý nghĩa cuộc sống và các hành vi ủng hộ xã hội của bản thân. Qua đó, khuyến khích các bạn hình thành lối sống tích cực, nhân ái và có trách nhiệm với người xung quanh.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Đối Tượng</h3>
            <p className="text-gray-700 leading-relaxed">
              Học sinh THPT – lứa tuổi đang trong giai đoạn hình thành giá trị sống, dễ chịu tác động từ môi trường học tập và các mối quan hệ xã hội.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Giá Trị</h3>
            <p className="text-gray-700 leading-relaxed">
              Tạo một không gian khảo sát an toàn, bảo mật và thân thiện, giúp học sinh tự do chia sẻ suy nghĩ, đồng thời cung cấp dữ liệu khoa học có ý nghĩa cho giáo dục và các chương trình phát triển tâm lý tích cực trong nhà trường.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tìm Hiểu Các Giá Trị</h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Định Nghĩa</h3>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  <span className="font-semibold text-gray-800">Lòng biết ơn</span> là cảm xúc trân trọng và ghi nhận những điều tốt đẹp mà mình nhận được từ người khác và cuộc sống.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-gray-800">Hành vi ủng hộ xã hội</span> là những hành động tự nguyện nhằm giúp đỡ, chia sẻ, quan tâm và hỗ trợ người khác.
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold text-gray-800">Ý nghĩa cuộc sống</span> phản ánh mức độ cá nhân cảm nhận cuộc sống của mình có giá trị, mục đích và đáng sống.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Biểu Hiện Ở Học Sinh THPT</h3>
              <ul className="space-y-2 ml-6">
                <li className="list-disc leading-relaxed">
                  Biết cảm ơn sự giúp đỡ từ bạn bè, thầy cô và gia đình
                </li>
                <li className="list-disc leading-relaxed">
                  Sẵn sàng hỗ trợ bạn học khi gặp khó khăn
                </li>
                <li className="list-disc leading-relaxed">
                  Tham gia các hoạt động thiện nguyện, tập thể vì lợi ích chung
                </li>
                <li className="list-disc leading-relaxed">
                  Quan tâm đến cảm xúc và nhu cầu của người xung quanh
                </li>
                <li className="list-disc leading-relaxed">
                  Cảm nhận cuộc sống có mục tiêu và định hướng rõ ràng
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Tác Động</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-5 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3 text-lg">Tích Cực</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Tăng cảm xúc tích cực và sự hài lòng trong cuộc sống</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Thúc đẩy hành vi chia sẻ, giúp đỡ người khác</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Củng cố các mối quan hệ xã hội</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Giúp học sinh sống có trách nhiệm và nhân ái hơn</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-5 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3 text-lg">Hạn Chế Khi Thiếu Hụt</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Thờ ơ với người xung quanh</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Giảm động lực giúp đỡ và hợp tác</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Dễ cảm thấy trống rỗng, mất phương hướng</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Giảm sự gắn kết với tập thể và cộng đồng</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Vai Trò Của Ý Nghĩa Cuộc Sống</h3>
              <p className="leading-relaxed">
                Ý nghĩa cuộc sống giúp chuyển hóa lòng biết ơn thành những hành động cụ thể. Khi học sinh cảm nhận rõ giá trị và mục đích sống, các em sẽ có xu hướng thể hiện nhiều hành vi ủng hộ xã hội hơn, không chỉ vì nghĩa vụ mà xuất phát từ sự tự nguyện và mong muốn đóng góp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
