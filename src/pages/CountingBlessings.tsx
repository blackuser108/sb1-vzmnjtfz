import { ExternalLink, BookOpen, Lightbulb, FileCheck, Sparkles } from 'lucide-react';

export default function CountingBlessings() {
  const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSepySlho2Gw_hY3I5porZuzC23a55pVTawbgG1xKK5knqdcPQ/viewform?usp=embed_facebook';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-2 rounded-full inline-block">
                <span className="text-white font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Hoạt động được chứng minh khoa học
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Đếm Điều May Mắn
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Khám phá sức mạnh của lòng biết ơn thông qua hành trình tự ghi nhật ký
          </p>

          <div className="inline-block mb-8">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-white text-lg font-bold overflow-hidden rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 group-hover:via-rose-500 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-rose-600 opacity-0 group-hover:opacity-20 blur-xl"></div>
              <div className="relative flex items-center justify-center gap-3">
                <Lightbulb className="w-7 h-7 animate-bounce" />
                <span>Bắt Đầu Ghi Nhật Ký Ngay</span>
                <ExternalLink className="w-7 h-7" />
              </div>
            </a>
          </div>
          <p className="text-sm text-gray-600 italic font-medium">
            ✓ Miễn phí • ✓ Bảo mật cao • ✓ Hỗ trợ AI • ✓ 10-15 phút mỗi ngày
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-amber-600">10</span>
              </div>
              <h3 className="font-bold text-gray-800">10 Ngày Liên Tiếp</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Tham gia hành trình ghi nhật ký biết ơn trong 10 ngày để thấy sự thay đổi
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-bold text-gray-800">3 Điều Mỗi Ngày</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Chia sẻ ba điều mà bạn cảm thấy biết ơn mỗi ngày
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-rose-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-rose-600">AI</span>
              </div>
              <h3 className="font-bold text-gray-800">Hỗ Trợ AI</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Nhận phản hồi tích cực và gợi ý từ chatbot hỗ trợ tâm lý
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-l-4 border-blue-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Cơ Sở Khoa Học
          </h2>
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">Nghiên Cứu Froh, Sefick & Emmons (2008)</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Nghiên cứu này khám phá tác động của việc ghi nhật ký biết ơn đối với sức khỏe tâm thần và hạnh phúc của học sinh.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white text-sm flex items-center justify-center rounded-full">1</span>
                  Đối Tượng Nghiên Cứu
                </h4>
                <p className="text-gray-700 ml-8">
                  Nghiên cứu được thực hiện trên 221 học sinh từ lớp 6-9 tại các trường công lập ở Hoa Kỳ. Các học sinh này đại diện cho các nền tảng xã hội-kinh tế và đặc điểm nhân khẩu học khác nhau.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white text-sm flex items-center justify-center rounded-full">2</span>
                  Phương Pháp Nghiên Cứu
                </h4>
                <p className="text-gray-700 ml-8">
                  Nghiên cứu sử dụng thiết kế thử nghiệm đối chứng ngẫu nhiên (RCT - Randomized Controlled Trial), được coi là tiêu chuẩn vàng trong nghiên cứu khoa học. Nhóm tham gia được chia ngẫu nhiên thành nhóm can thiệp (ghi nhật ký biết ơn) và nhóm kiểm soát.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white text-sm flex items-center justify-center rounded-full">3</span>
                  Quy Trình Can Thiệp
                </h4>
                <p className="text-gray-700 ml-8">
                  Nhóm can thiệp được hướng dẫn ghi lại ba điều mà họ cảm thấy biết ơn mỗi ngày trong suốt kỳ nghiên cứu. Phương pháp này đơn giản nhưng hiệu quả, giúp học sinh chuyển sự chú ý từ những khía cạnh tiêu cực sang những điểm tích cực trong cuộc sống.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white text-sm flex items-center justify-center rounded-full">4</span>
                  Kết Quả Đạt Được
                </h4>
                <p className="text-gray-700 ml-8">
                  Kết quả cho thấy học sinh ghi nhật ký biết ơn có:
                </p>
                <ul className="text-gray-700 ml-8 mt-2 space-y-1">
                  <li>• <strong>Mức độ hạnh phúc cao hơn</strong> - Sinh viên báo cáo cảm thấy vui vẻ và hài lòng hơn</li>
                  <li>• <strong>Triệu chứng trầm cảm giảm</strong> - Cảm giác buồn bã, tuyệt vọng giảm đi</li>
                  <li>• <strong>Mối quan hệ tốt hơn</strong> - Sự cảm thông và gần gũi với gia đình, bạn bè tăng lên</li>
                  <li>• <strong>Thái độ tích cực hơn</strong> - Cách nhìn nhận cuộc sống tích cực và lạc quan hơn</li>
                </ul>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                <p className="text-gray-800 italic">
                  Những phát hiện này cho thấy rằng một hành động đơn giản như ghi nhật ký biết ơn có thể có tác động sâu sắc đến sức khỏe tâm thần và phúc lợi tổng thể của thanh niên.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-l-4 border-green-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-green-500" />
            Hướng Dẫn Thực Hiện
          </h2>

          <div className="mt-6 space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-full font-bold text-sm">Bước 1</span>
                Đăng Ký Và Truy Cập Google Form
              </h3>
              <ul className="space-y-2 text-gray-700 ml-10">
                <li>• <strong>Đăng nhập</strong> bằng tài khoản Gmail cá nhân của bạn</li>
                <li>• Nhấp vào link "Bắt Đầu Ghi Nhật Ký" ở trên để truy cập Google Form</li>
                <li>• Link sẽ mở trong tab mới để không mất dữ liệu</li>
                <li>• Bạn có thể truy cập Google Form này từ bất kỳ thiết bị nào có internet</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-sm">Bước 2</span>
                Ghi Lại Ba Điều Biết Ơn
              </h3>
              <div className="ml-10 space-y-3">
                <p className="text-gray-700">
                  <strong>Quy trình hàng ngày:</strong> Mỗi ngày, bạn sẽ ghi lại <strong>ba điều</strong> mà bản thân cảm thấy biết ơn. Những điều này có thể là:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Những thứ nhỏ bé (một buổi sáng đẹp, một bữa ăn ngon)</li>
                  <li>• Những mối quan hệ quý báu (gia đình, bạn bè, thầy cô)</li>
                  <li>• Những bài học và kinh nghiệm quý báu</li>
                  <li>• Các hoạt động yêu thích hoặc sở thích của bạn</li>
                  <li>• Các cơ hội mới hoặc thành tựu bạn đạt được</li>
                </ul>
                <p className="text-gray-600 italic mt-3">
                  <strong>💡 Mẹo:</strong> Hãy cụ thể và chi tiết - thay vì chỉ viết "gia đình", hãy viết "mẹ đã nấu bữa tối yêu thích của tôi" để tạo sự kết nối sâu sắc hơn.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-12 h-12 bg-purple-500 text-white flex items-center justify-center rounded-full font-bold text-sm">Bước 3</span>
                Gửi Phản Hồi Tự Động
              </h3>
              <div className="ml-10 space-y-3">
                <p className="text-gray-700">
                  Khi bạn gửi phản hồi của mình trên Google Form:
                </p>
                <ol className="space-y-2 text-gray-700 list-decimal">
                  <li>Dữ liệu của bạn được <strong>tự động lưu trữ</strong> vào Google Sheets (cơ sở dữ liệu đám mây)</li>
                  <li>Hệ thống tự động kích hoạt <strong>Apps Script Trigger</strong> để xử lý dữ liệu</li>
                  <li>Thông tin của bạn được gửi đến <strong>OpenAI API</strong> để xử lý thông minh</li>
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full font-bold text-sm">Bước 4</span>
                Nhận Email Phản Hồi Cảm Xúc Và Gợi Ý
              </h3>
              <div className="ml-10 space-y-3">
                <p className="text-gray-700">
                  Trong vòng <strong>một vài phút</strong>, bạn sẽ nhận được một email tự động từ hệ thống:
                </p>
                <div className="bg-white border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 font-semibold mb-2">Email này sẽ chứa:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>✨ <strong>Phản hồi cảm xúc tích cực</strong> - Chatbot sẽ nhận xét và động viên bạn về những điều bạn chia sẻ, sử dụng ngôn ngữ tự nhiên, ấm áp như một người bạn đồng hành tâm lý</li>
                    <li>💡 <strong>Gợi ý hành động tích cực</strong> - Một gợi ý cụ thể về hành động mà bạn có thể thực hiện vào ngày tiếp theo để duy trì và chuẩn hóa thực hành lòng biết ơn</li>
                    <li>🎯 <strong>Động lực tiếp tục</strong> - Những lời khuyến khích để giúp bạn tiếp tục hành trình 10 ngày</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-12 h-12 bg-yellow-500 text-white flex items-center justify-center rounded-full font-bold text-sm">Bước 5</span>
                Tiếp Tục Trong 10 Ngày
              </h3>
              <ul className="ml-10 space-y-2 text-gray-700">
                <li>• <strong>Lặp lại quy trình</strong> mỗi ngày trong 10 ngày liên tiếp</li>
                <li>• Ghi nhật ký vào <strong>cùng một thời gian</strong> mỗi ngày để tạo thói quen</li>
                <li>• <strong>Nhận email phản hồi</strong> mỗi ngày để có sự hỗ trợ liên tục</li>
                <li>• Theo dõi sự <strong>thay đổi tâm trạng</strong> của bạn qua 10 ngày</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Tại Sao Phương Pháp Này Hiệu Quả?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Thay đổi góc nhìn</strong> - Giúp bạn chuyển từ suy nghĩ tiêu cực sang tích cực</li>
                <li>• <strong>Hỗ trợ tâm lý thực</strong> - AI phản hồi cảm xúc giúp bạn cảm thấy được nghe và hiểu</li>
                <li>• <strong>Xây dựng thói quen</strong> - 10 ngày liên tiếp giúp tạo thói quen mới bền vững</li>
                <li>• <strong>Tác động khoa học</strong> - Dựa trên nghiên cứu khoa học đã chứng minh</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl shadow-2xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
          </div>
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4">Sẵn Sàng Bắt Đầu Hành Trình Của Bạn?</h2>
            <p className="text-lg mb-8 text-white text-opacity-95">
              Hãy nhấp vào nút dưới đây để bắt đầu ghi nhật ký biết ơn ngay hôm nay
            </p>
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-orange-600 font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-110 transition-all duration-300 mb-6"
            >
              <Lightbulb className="w-7 h-7 animate-bounce" />
              Bắt Đầu Ghi Nhật Ký
              <ExternalLink className="w-7 h-7" />
            </a>
            <p className="text-sm text-white text-opacity-90 font-medium">
              ✓ Không mất phí • ✓ Bảo mật dữ liệu • ✓ Hỗ trợ từ AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
