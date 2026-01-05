# Hướng Dẫn Cấu Hình Trang Bài Báo Khoa Học

## ⚠️ Links hiện tại đã được cấu hình

Links hiện tại trong file `src/pages/ResearchPaper.tsx`:
- **Tạp chí quốc tế**: https://rajournals.in/index.php/rajar/article/view/1785
- **Google Drive PDF**: https://drive.google.com/file/d/1KBfMzUBWzE3Y8y5_siMoBW41wReANhOB/view?usp=sharing

## Cập nhật Links (nếu cần)

### 1. Mở file ResearchPaper.tsx

File nằm tại: `src/pages/ResearchPaper.tsx`

### 2. Tìm và cập nhật constants

Tìm dòng code sau (khoảng dòng 28-29):

```typescript
const JOURNAL_URL = 'https://rajournals.in/index.php/rajar/article/view/1785';
const PDF_DRIVE_URL = 'https://drive.google.com/file/d/1KBfMzUBWzE3Y8y5_siMoBW41wReANhOB/view?usp=sharing';
```

### 3. Thay thế bằng links mới (nếu cần)

Chỉ thay đổi nếu bài báo được xuất bản ở nơi khác hoặc file PDF được cập nhật.

### 4. Save file và rebuild

Sau khi cập nhật, chạy:
```bash
npm run build
```

## Cấu trúc Dữ liệu Bài Báo

### Thư mục văn bản (Text Files)
- Đường dẫn: `public/research report/text/`
- Các file phải được đặt tên chính xác:
  - `01-title.txt`
  - `02-authors.txt`
  - `03-international.txt`
  - `04-abstract.txt`
  - `05-keywords.txt`
  - `06-introduction.txt`
  - `07-theoretical-background.txt`
  - `08-methodology.txt`
  - `09-results.txt`
  - `10-conclusion.txt`
  - `11-references.txt`

### Thư mục bảng (Tables)
- Đường dẫn: `public/research report/table/`
- Format: Các cột phân cách bởi dấu `|`
- Dòng đầu tiên: Tên bảng
- Dòng thứ hai: Tiêu đề cột
- Các dòng tiếp theo: Dữ liệu

**Ví dụ format bảng:**
```
Bảng 4.1.1. Thực trạng Lòng biết ơn (GQ-6)

STT | Nội dung khảo sát | Min | Max | Mean (M) | SD | Diễn giải
1   | Tôi thấy biết ơn rất nhiều điều trong cuộc sống. | 1 | 7 | 4.98 | 1.538 | Mức độ biết ơn tương đối cao
2   | Nếu phải liệt kê tất cả những điều tôi thấy biết ơn... | 1 | 7 | 4.87 | 1.440 | Nhận thức sâu sắc về lòng biết ơn
```

### Thư mục hình ảnh (Images)
- Đường dẫn: `public/research report/image/`
- Format: `.png`, `.jpg`, `.jpeg`
- Đặt tên có ý nghĩa, ví dụ: `2.4.3.png`, `4.2.3.png`

## Lưu ý quan trọng

1. **KHÔNG** thay đổi nội dung các file text - chỉ thay thế file hoàn toàn nếu cần
2. **KHÔNG** sửa đổi cấu trúc bảng - giữ nguyên format pipe-separated
3. **KHÔNG** thay đổi tên thư mục hoặc đường dẫn file
4. Tất cả file phải được đặt trong thư mục `public/` để truy cập được từ web

## Kiểm tra

Sau khi cập nhật:
1. Build project: `npm run build`
2. Chạy dev server: `npm run dev`
3. Truy cập trang "Bài báo KH" từ menu
4. Kiểm tra:
   - Nội dung hiển thị đầy đủ
   - Bảng render đúng
   - Hình ảnh hiển thị
   - Nút "Xem trên tạp chí" và "Tải PDF" hoạt động

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
- Console của trình duyệt (F12) để xem lỗi
- Đảm bảo tất cả file tồn tại đúng đường dẫn
- Kiểm tra format của các file text và bảng
