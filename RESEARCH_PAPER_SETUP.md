# Hướng Dẫn Cấu Hình Trang Bài Báo Khoa Học

## Cập nhật Links cho Tạp chí và PDF

Để cập nhật các link tới tạp chí quốc tế và file PDF trên Google Drive, vui lòng làm theo các bước sau:

### 1. Mở file ResearchPaper.tsx

File nằm tại: `src/pages/ResearchPaper.tsx`

### 2. Tìm và cập nhật constants

Tìm dòng code sau (khoảng dòng 28-29):

```typescript
const JOURNAL_URL = 'https://example.com/journal-article';
const PDF_DRIVE_URL = 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing';
```

### 3. Thay thế bằng links thật

#### Link Tạp chí Quốc tế:
Thay thế `https://example.com/journal-article` bằng link tới bài báo trên tạp chí quốc tế.

**Ví dụ:**
```typescript
const JOURNAL_URL = 'https://www.nature.com/articles/s41598-024-xxxxx';
```

#### Link Google Drive PDF:
Thay thế `YOUR_FILE_ID` bằng File ID từ Google Drive.

**Cách lấy File ID từ Google Drive:**

1. Upload file PDF lên Google Drive
2. Click chuột phải vào file → Chọn "Chia sẻ" (Share)
3. Chọn "Bất kỳ ai có link" (Anyone with the link)
4. Sao chép link chia sẻ, sẽ có dạng:
   ```
   https://drive.google.com/file/d/1ABc2DEf3GHi4JKl5MNo6PQr7STu8VWx9YZ/view?usp=sharing
   ```
5. Phần `1ABc2DEf3GHi4JKl5MNo6PQr7STu8VWx9YZ` chính là File ID

**Ví dụ:**
```typescript
const PDF_DRIVE_URL = 'https://drive.google.com/file/d/1ABc2DEf3GHi4JKl5MNo6PQr7STu8VWx9YZ/view?usp=sharing';
```

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
