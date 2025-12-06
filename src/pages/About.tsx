import { Brain, Heart, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Giới Thiệu
          </h1>
          <p className="text-xl text-gray-600">
            Hiểu rõ hơn về hành vi bầy đàn và tầm quan trọng của nó
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Về Dự Án</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Website này được phát triển với mục đích giúp các bạn học sinh hiểu rõ hơn về hành
            vi bầy đàn - một hiện tượng tâm lý xã hội phổ biến ở lứa tuổi thanh thiếu niên.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Thông qua bài khảo sát được thiết kế khoa học, chúng mình mong muốn giúp các bạn
            tự nhận biết mức độ ảnh hưởng của áp lực nhóm đối với bản thân, từ đó có những điều
            chỉnh tích cực trong cách suy nghĩ và hành động.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Tầm Quan Trọng</h3>
            <p className="text-gray-700 leading-relaxed">
              Nhận biết hành vi bầy đàn giúp bạn phát triển tư duy phản biện, tự chủ trong
              quyết định và không bị cuốn theo những xu hướng tiêu cực.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Mục Tiêu</h3>
            <p className="text-gray-700 leading-relaxed">
              Giúp học sinh tự đánh giá, nhận thức và phát triển kỹ năng tư duy độc lập, tự tin
              thể hiện bản thân mà không sợ bị xa lánh.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Đối Tượng</h3>
            <p className="text-gray-700 leading-relaxed">
              Học sinh từ lớp 6 đến lớp 12 - lứa tuổi dễ bị ảnh hưởng bởi áp lực từ bạn bè và
              môi trường xã hội.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Giá Trị</h3>
            <p className="text-gray-700 leading-relaxed">
              Tạo môi trường an toàn để học sinh tự do chia sẻ, tìm hiểu về bản thân và nhận
              được những lời khuyên hữu ích.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Hành Vi Bầy Đàn Là Gì?</h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Định Nghĩa</h3>
              <p className="leading-relaxed">
                Hành vi bầy đàn (Herd Behavior) là hiện tượng con người có xu hướng làm theo
                những gì mà đa số đang làm, bất chấp suy nghĩ hay giá trị cá nhân của họ. Đây
                là một bản năng tự nhiên của con người, xuất phát từ nhu cầu thuộc về một nhóm
                và được chấp nhận.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Biểu Hiện Ở Học Sinh</h3>
              <ul className="space-y-2 ml-6">
                <li className="list-disc">
                  Mặc đồ, làm tóc theo xu hướng của bạn bè ngay cả khi không thích
                </li>
                <li className="list-disc">
                  Tham gia các hoạt động mà nhóm bạn làm để tránh bị cô lập
                </li>
                <li className="list-disc">
                  Thay đổi ý kiến để phù hợp với đa số, không dám bày tỏ quan điểm khác biệt
                </li>
                <li className="list-disc">
                  Làm theo những thử thách trên mạng xã hội mà không suy nghĩ kỹ
                </li>
                <li className="list-disc">
                  Chọn sở thích, nghề nghiệp theo xu hướng chung thay vì đam mê thực sự
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tác Động</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Tiêu Cực</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Mất đi bản sắc cá nhân</li>
                    <li>• Tham gia hành vi nguy hiểm</li>
                    <li>• Thiếu tự tin và tư duy độc lập</li>
                    <li>• Stress và lo âu</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Tích Cực</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Học hỏi từ người khác</li>
                    <li>• Hòa nhập với cộng đồng</li>
                    <li>• Cảm giác an toàn trong nhóm</li>
                    <li>• Phát triển kỹ năng xã hội</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cách Đối Phó</h3>
              <ol className="space-y-2 ml-6">
                <li className="list-decimal">
                  <strong>Tự nhận thức:</strong> Hiểu rõ giá trị và mục tiêu của bản thân
                </li>
                <li className="list-decimal">
                  <strong>Tư duy phản biện:</strong> Đặt câu hỏi "Tại sao?" trước khi làm theo
                </li>
                <li className="list-decimal">
                  <strong>Tự tin:</strong> Dám nói "không" khi cần thiết
                </li>
                <li className="list-decimal">
                  <strong>Tìm bạn tốt:</strong> Kết bạn với người tôn trọng sự khác biệt
                </li>
                <li className="list-decimal">
                  <strong>Xin trợ giúp:</strong> Trao đổi với người lớn khi cần
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
