import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Chúng mình sẽ phản hồi sớm nhất có thể.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Liên Hệ
          </h1>
          <p className="text-xl text-gray-600">
            Chúng mình luôn sẵn sàng lắng nghe và hỗ trợ bạn!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi Tin Nhắn</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại (không bắt buộc)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Tin nhắn</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bạn muốn chia sẻ điều gì với chúng mình?"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Send className="w-5 h-5" />
                Gửi Tin Nhắn
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[50] h-[50]">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Liên Hệ</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">nguyenquangvinh112009@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                    <p className="text-gray-600">024 1234 5678</p>
                    <p className="text-gray-600">0901 234 567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">
                      Phòng Tâm lý học Giáo dục<br />
                      Trường Đại học Khoa học Xã hội và Nhân văn<br />
                      Hà Nội, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Giờ Làm Việc</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Thứ 2 - Thứ 6:</strong> 8:00 - 17:00</p>
                <p><strong>Thứ 7:</strong> 8:00 - 12:00</p>
                <p><strong>Chủ nhật:</strong> Nghỉ</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Cần Hỗ Trợ Khẩn Cấp?</h3>
              <p className="mb-4">
                Nếu bạn đang gặp khó khăn nghiêm trọng về tâm lý, hãy liên hệ ngay:
              </p>
              <p className="font-bold text-lg">Hotline Tâm Lý: 1800 1234</p>
              <p className="text-sm opacity-90">(Miễn phí, 24/7)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
