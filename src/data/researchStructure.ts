export interface ResearchSection {
  id: string;
  level: number;
  title: string;
  children?: ResearchSection[];
}

export const researchStructure: ResearchSection[] = [
  { id: 'abstract', level: 1, title: 'Tóm tắt' },
  { id: 'keywords', level: 1, title: 'Từ khóa' },
  {
    id: 'intro',
    level: 1,
    title: '1. Giới thiệu'
  },
  {
    id: 'theoretical',
    level: 1,
    title: '2. Cơ sở lý thuyết',
    children: [
      { id: 'theoretical-2.1', level: 2, title: '2.1. Lòng biết ơn' },
      { id: 'theoretical-2.2', level: 2, title: '2.2. Hành vi ủng hộ xã hội' },
      { id: 'theoretical-2.3', level: 2, title: '2.3. Ý nghĩa cuộc sống' },
      {
        id: 'theoretical-2.4',
        level: 2,
        title: '2.4. Cơ sở lý thuyết về mối quan hệ giữa Lòng biết ơn và Hành vi hướng xã hội',
        children: [
          { id: 'theoretical-2.4.1', level: 3, title: '2.4.1. Thuyết Mở rộng và Xây dựng các cảm xúc tích cực' },
          { id: 'theoretical-2.4.2', level: 3, title: '2.4.2. Thuyết Tự quyết' },
          { id: 'theoretical-2.4.3', level: 3, title: '2.4.3. Mô hình nghiên cứu đề xuất' }
        ]
      },
      { id: 'theoretical-2.5', level: 2, title: '2.5. Cơ sở lý luận về mối quan hệ giữa Lòng biết ơn và Ý nghĩa cuộc sống' },
      { id: 'theoretical-2.6', level: 2, title: '2.6. Cơ sở lý luận về mối quan hệ giữa Hành vi hướng xã hội và Ý nghĩa cuộc sống' }
    ]
  },
  {
    id: 'methodology',
    level: 1,
    title: '3. Phương pháp nghiên cứu',
    children: [
      { id: 'methodology-3.1', level: 2, title: '3.1. Khách thể nghiên cứu' },
      { id: 'methodology-3.2', level: 2, title: '3.2. Phương pháp luận' },
      { id: 'methodology-3.3', level: 2, title: '3.3. Công cụ đo lường' },
      { id: 'methodology-3.4', level: 2, title: '3.4. Quy trình thu thập dữ liệu' },
      { id: 'methodology-3.5', level: 2, title: '3.5. Xử lý và phân tích dữ liệu' }
    ]
  },
  {
    id: 'results',
    level: 1,
    title: '4. Kết quả nghiên cứu',
    children: [
      { id: 'results-4.1', level: 2, title: '4.1. Thực trạng các biến số' },
      { id: 'results-4.2', level: 2, title: '4.2. Kiểm định mô hình' },
      { id: 'results-4.3', level: 2, title: '4.3. Phân tích theo nhóm' },
      { id: 'results-4.4', level: 2, title: '4.4. Kết quả can thiệp' }
    ]
  },
  {
    id: 'conclusion',
    level: 1,
    title: '5. Kết luận'
  },
  {
    id: 'references',
    level: 1,
    title: 'Tài liệu tham khảo'
  }
];
