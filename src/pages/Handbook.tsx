import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Upload, X, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import * as pdfjsLib from 'pdfjs-dist';

interface HandbookProps {
  onNavigate: (page: string) => void;
}

interface PDFFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
  description?: string;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Handbook({ onNavigate }: HandbookProps) {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PDFFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [pdfPages, setPdfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState('');

  const pdfPreviewUrl = 'https://drive.google.com/file/d/112ruhDBStkxM9E-gzedYTY6ZzOsT2eyZ/preview';

  useEffect(() => {
    loadPdfs();
  }, [user]);

  const loadPdfs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('handbook_pdfs')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPdfs(data || []);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert('Vui lòng chọn file PDF');
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      alert('Vui lòng chọn file PDF');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pdf-upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setPdfs([result.pdf, ...pdfs]);
      setShowUploadModal(false);
      setFile(null);
      setDescription('');
      alert('Upload PDF thành công!');
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleViewPdf = async (pdf: PDFFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('handbook')
        .createSignedUrl(pdf.file_path.replace('handbook/', ''), 3600);

      if (error) throw error;
      setPdfUrl(data.signedUrl);
      setSelectedPdf(pdf);
      setCurrentPage(1);
      loadPdfPages(data.signedUrl);
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Không thể tải PDF');
    }
  };

  const loadPdfPages = async (url: string) => {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      setPdfPages(pdf.numPages);
    } catch (error) {
      console.error('Error loading PDF pages:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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

        <div className="max-w-6xl mx-auto">
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

              {selectedPdf ? (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedPdf.file_name}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedPdf(null);
                        setPdfUrl('');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 mb-4">
                    <div className="relative">
                      {pdfUrl && (
                        <iframe
                          src={`${pdfUrl}#toolbar=1`}
                          width="100%"
                          height="700"
                          title={selectedPdf.file_name}
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {selectedPdf.description && (
                        <span>{selectedPdf.description}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Kích thước: {formatFileSize(selectedPdf.file_size)}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Xem Trước Tài Liệu Mặc Định</h2>
                    <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                      <iframe
                        src={`${pdfPreviewUrl}#toolbar=1&navpanes=0`}
                        width="100%"
                        height="600"
                        title="Cẩm nang gratia et vita"
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Nếu không thể xem PDF tại đây, vui lòng tải xuống tài liệu bằng nút bên dưới
                    </p>
                  </div>

                  {pdfs.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tài Liệu Tải Lên</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pdfs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => handleViewPdf(pdf)}
                          >
                            <h3 className="font-semibold text-gray-800 truncate">{pdf.file_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatFileSize(pdf.file_size)}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Tải lên: {new Date(pdf.uploaded_at).toLocaleDateString('vi-VN')}
                            </p>
                            {pdf.description && (
                              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                                {pdf.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {user && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    Tải Lên PDF
                  </button>
                )}
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

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tải Lên PDF</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn File PDF
              </label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-input"
                />
                <label htmlFor="pdf-input" className="cursor-pointer">
                  {file ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-700">Nhấp để chọn file PDF</p>
                      <p className="text-xs text-gray-500 mt-1">Tối đa 100MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô Tả (Tùy Chọn)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả về tài liệu này..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setFile(null);
                  setDescription('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Tải Lên
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
