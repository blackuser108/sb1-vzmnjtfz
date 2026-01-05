import { useEffect, useState, useRef } from 'react';
import { FileText, Download, ExternalLink, BookOpen, Menu, X } from 'lucide-react';
import CollapsibleMenu from '../components/CollapsibleMenu';
import { researchStructure } from '../data/researchStructure';

interface ResearchContent {
  title: string;
  authors: string;
  international: string;
  abstract: string;
  keywords: string;
  introduction: string;
  theoretical: string;
  methodology: string;
  results: string;
  conclusion: string;
  references: string;
}

interface TableData {
  name: string;
  content: string;
}

export default function ResearchPaper() {
  const [content, setContent] = useState<ResearchContent | null>(null);
  const [tables, setTables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState('abstract');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const JOURNAL_URL = 'https://rajournals.in/index.php/rajar/article/view/1785';
  const PDF_DRIVE_URL = 'https://drive.google.com/file/d/1KBfMzUBWzE3Y8y5_siMoBW41wReANhOB/view?usp=sharing';

  const TABLE_MARKERS: Record<string, string> = {
    'Table 4.1.1. Thực trạng Lòng biết ơn': 'table-4.1.1-gratitude',
    'Bảng 4.1.2. Thực trạng hành vi ủng hộ xã hội': 'table-4.1.2-full-prosocial',
    'Bảng 4.1.3. Thực trạng Ý nghĩa cuộc sống': 'table-4.1.3-mil-classification',
    'Bảng 4.2.1. Ma trận tương quan giữa các biến số (N = 406)': 'table-4.2.1-correlation-matrix',
    'Bảng 4.2.2. Kết quả hồi quy tuyến tính: Ảnh hưởng của Ý nghĩa cuộc sống đến Hành vi hướng xã hội': 'table-4.2.2-linear-regression',
    'Bảng 4.2.3: Tóm tắt kết quả kiểm định mô hình trung gian (Baron & Kenny, 1986)': 'table-4.2.3-mediation-baron-kenny',
    'Bảng 4.3.1: Tóm tắt kết quả so sánh theo nhóm giới tính (ANOVA)': 'table-4.3.1-anova-gender',
    'Bảng 4.3.2. Tóm tắt kết quả so sánh theo nhóm Học lực (ANOVA)': 'table-4.3.2-anova-academic-performance',
    'Bảng 4.3.3: Tóm tắt kết quả phân tích ANOVA theo Khối lớp': 'table-4.3.3-anova-grade-level',
    'Bảng 4.4a:': 'table-4.4a-gratitude-education-measures',
    'Bảng 4.4b:': 'table-4.4b-emotional-intervention-measures'
  };

  const IMAGE_MARKERS: Record<string, { src: string; caption: string }> = {
    'Sơ đồ 2.4.3:': {
      src: '/research report/image/2.4.3.png',
      caption: 'Sơ đồ 2.4.3: Mô hình nghiên cứu'
    },
    'Sơ đồ 4.2.3. Mô hình trung gian của Ý nghĩa cuộc sống trong mối quan hệ giữa Lòng biết ơn và Hành vi hướng xã hội': {
      src: '/research report/image/4.2.3.png',
      caption: 'Sơ đồ 4.2.3: Mô hình trung gian của Ý nghĩa cuộc sống trong mối quan hệ giữa Lòng biết ơn và Hành vi hướng xã hội'
    }
  };

  useEffect(() => {
    loadResearchContent();
  }, []);

  const handleToggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const loadResearchContent = async () => {
    try {
      const textFiles = [
        '01-title.txt',
        '02-authors.txt',
        '03-international.txt',
        '04-abstract.txt',
        '05-keywords.txt',
        '06-introduction.txt',
        '07-theoretical-background.txt',
        '08-methodology.txt',
        '09-results.txt',
        '10-conclusion.txt',
        '11-references.txt'
      ];

      const tableFiles = [
        'table-4.1.1-gratitude.txt',
        'table-4.1.2-full-prosocial.txt',
        'table-4.1.3-mil-classification.txt',
        'table-4.2.1-correlation-matrix.txt',
        'table-4.2.2-linear-regression.txt',
        'table-4.2.3-mediation-baron-kenny.txt',
        'table-4.3.1-anova-gender.txt',
        'table-4.3.2-anova-academic-performance.txt',
        'table-4.3.3-anova-grade-level.txt',
        'table-4.4a-gratitude-education-measures.txt',
        'table-4.4b-emotional-intervention-measures.txt'
      ];

      const textPromises = textFiles.map(file =>
        fetch(`/research report/text/${file}`).then(res => res.text())
      );

      const tablePromises = tableFiles.map(async file => {
        const content = await fetch(`/research report/table/${file}`).then(res => res.text());
        return { name: file.replace('.txt', ''), content };
      });

      const [texts, tablesData] = await Promise.all([
        Promise.all(textPromises),
        Promise.all(tablePromises)
      ]);

      setContent({
        title: texts[0],
        authors: texts[1],
        international: texts[2],
        abstract: texts[3],
        keywords: texts[4],
        introduction: texts[5],
        theoretical: texts[6],
        methodology: texts[7],
        results: texts[8],
        conclusion: texts[9],
        references: texts[10]
      });

      const tablesMap: Record<string, string> = {};
      tablesData.forEach(table => {
        tablesMap[table.name] = table.content;
      });
      setTables(tablesMap);
    } catch (error) {
      console.error('Error loading research content:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseTable = (tableContent: string) => {
    const lines = tableContent.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    const tableName = lines[0];
    const headers = lines[1].split('|').map(h => h.trim()).filter(h => h);
    const rows = lines.slice(2).map(line =>
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );

    return { tableName, headers, rows };
  };

  const renderContentWithMedia = (text: string, section: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join('\n');
        elements.push(
          <p key={`p-${key++}`} className="text-gray-700 leading-relaxed mb-4 text-justify whitespace-pre-line">
            {paragraphText}
          </p>
        );
        currentParagraph = [];
      }
    };

    lines.forEach((line, index) => {
      let matched = false;

      Object.entries(TABLE_MARKERS).forEach(([marker, tableKey]) => {
        if (line.includes(marker)) {
          matched = true;
          flushParagraph();

          const tableContent = tables[tableKey];
          if (tableContent) {
            const parsed = parseTable(tableContent);
            if (parsed) {
              elements.push(
                <div key={`table-${key++}`} className="my-8 overflow-x-auto">
                  <p className="text-center font-semibold text-gray-800 mb-4">
                    {parsed.tableName}
                  </p>
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full border-collapse border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          {parsed.headers.map((header, idx) => (
                            <th
                              key={idx}
                              className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {row.map((cell, cellIdx) => (
                              <td
                                key={cellIdx}
                                className="border border-gray-300 px-4 py-3 text-gray-700"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }
          }
        }
      });

      Object.entries(IMAGE_MARKERS).forEach(([marker, imageData]) => {
        if (line.includes(marker)) {
          matched = true;
          flushParagraph();

          elements.push(
            <div key={`img-${key++}`} className="my-8">
              <img
                src={imageData.src}
                alt={imageData.caption}
                className="mx-auto max-w-full h-auto rounded-lg shadow-md"
              />
              <p className="text-center text-sm text-gray-600 mt-3 italic">
                {imageData.caption}
              </p>
            </div>
          );
        }
      });

      if (!matched && line.trim()) {
        currentParagraph.push(line);
      } else if (!matched && !line.trim() && currentParagraph.length > 0) {
        flushParagraph();
      }
    });

    flushParagraph();
    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài báo khoa học...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Không thể tải nội dung bài báo</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">Bài Báo Khoa Học</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={JOURNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Xem trên tạp chí</span>
                <span className="sm:hidden">Tạp chí</span>
              </a>
              <a
                href={PDF_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Tải PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <Menu className="w-5 h-5 text-blue-600" />
                Mục lục
              </h3>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                <CollapsibleMenu
                  sections={researchStructure}
                  expandedSections={expandedSections}
                  onToggleSection={handleToggleSection}
                  onSelectSection={handleSelectSection}
                  activeSection={activeSection}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span>Mục lục</span>
          </button>

          {mobileMenuOpen && (
            <div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm border p-6">
              <CollapsibleMenu
                sections={researchStructure}
                expandedSections={expandedSections}
                onToggleSection={handleToggleSection}
                onSelectSection={handleSelectSection}
                activeSection={activeSection}
              />
            </div>
          )}

          <div className="flex-1 min-w-0" ref={contentRef}>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-600 rounded-r-lg p-6 mb-8 shadow-sm">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Về bản dịch này</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Đây là bản dịch tiếng Việt của bài báo khoa học đã được công bố trên tạp chí quốc tế.
                    Nội dung được dịch và trình bày nhằm phục vụ mục đích giáo dục và nghiên cứu.
                  </p>
                </div>
              </div>
            </div>

            <article className="bg-white rounded-lg shadow-sm border">
              <div className="p-8 md:p-12 border-b">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight text-center">
                  {content.title}
                </h1>

                <div className="text-center mb-6">
                  <p className="text-lg text-gray-700 whitespace-pre-line">{content.authors}</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{content.international}</p>
                </div>
              </div>

              <div id="abstract" className="p-8 md:p-12 border-b bg-gray-50 scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Tóm tắt</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                  {content.abstract}
                </div>
              </div>

              <div id="keywords" className="p-8 md:p-12 border-b scroll-mt-32">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Từ khóa</h3>
                <p className="text-gray-700 italic">{content.keywords}</p>
              </div>

              <div id="intro" className="p-8 md:p-12 border-b scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">1. Giới thiệu</h2>
                <div>
                  {renderContentWithMedia(content.introduction, 'introduction')}
                </div>
              </div>

              <div id="theoretical" className="p-8 md:p-12 border-b scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">2. Cơ sở lý thuyết</h2>
                <div>
                  {renderContentWithMedia(content.theoretical, 'theoretical')}
                </div>
              </div>

              <div id="methodology" className="p-8 md:p-12 border-b scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">3. Phương pháp nghiên cứu</h2>
                <div>
                  {renderContentWithMedia(content.methodology, 'methodology')}
                </div>
              </div>

              <div id="results" className="p-8 md:p-12 border-b scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">4. Kết quả nghiên cứu</h2>
                <div>
                  {renderContentWithMedia(content.results, 'results')}
                </div>
              </div>

              <div id="conclusion" className="p-8 md:p-12 border-b scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">5. Kết luận</h2>
                <div>
                  {renderContentWithMedia(content.conclusion, 'conclusion')}
                </div>
              </div>

              <div id="references" className="p-8 md:p-12 bg-gray-50 scroll-mt-32">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">Tài liệu tham khảo</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {content.references}
                </div>
              </div>
            </article>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trích dẫn bài báo</h3>
                  <p className="text-sm text-gray-700">
                    Để trích dẫn bài báo này, vui lòng sử dụng định dạng APA hoặc tham khảo hướng dẫn
                    trích dẫn của tạp chí.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
