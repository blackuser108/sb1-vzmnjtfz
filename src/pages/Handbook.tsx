import { ArrowLeft, Download } from 'lucide-react';

interface HandbookProps {
  onNavigate: (page: string) => void;
}

export default function Handbook({ onNavigate }: HandbookProps) {
  const pdfUrl = 'https://drive.google.com/file/d/112ruhDBStkxM9E-gzedYTY6ZzOsT2eyZ/preview';
  const pdfFileName = 'Cam-nang-hanh-vi-bay-dan.pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại trang chủ
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">Cẩm Nang Hành Vi Bầy Đàn</h1>
              <p className="text-lg opacity-90">
                Hướng dẫn chi tiết giúp bạn hiểu rõ và quản lý hành vi bầy đàn trong cuộc sống hàng ngày
              </p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">📚 Nội Dung</h3>
                  <p className="text-sm text-gray-700">
                    10 chương chi tiết với các ví dụ thực tế
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl">
                  <h3 className="font-bold text-teal-900 mb-2">👥 Đối Tượng</h3>
                  <p className="text-sm text-gray-700">
                    Dành cho học sinh, phụ huynh và giáo viên
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                  <h3 className="font-bold text-emerald-900 mb-2">⏱️ Thời Gian</h3>
                  <p className="text-sm text-gray-700">
                    Đọc trong khoảng 30-45 phút
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Xem Trước Tài Liệu</h2>
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0`}
                    width="100%"
                    height="600"
                    title="Cẩm nang hành vi bầy đàn"
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Nếu không thể xem PDF tại đây, vui lòng tải xuống tài liệu bằng nút bên dưới
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Tải Xuống Tài Liệu
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Quay Lại
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Nội Dung Chính</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Khái niệm hành vi bầy đàn',
                    'Lý do tại sao chúng ta dễ bị ảnh hưởng',
                    'Nhận biết áp lực bạn bè',
                    'Kỹ năng đưa ra quyết định độc lập',
                    'Xây dựng sự tự tin',
                    'Làm thế nào để bảo vệ bản thân',
                    'Hỗ trợ bạn bè gặp khó khăn',
                    'Tư vấn chuyên gia'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-0.5">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
