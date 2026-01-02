import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const firstNames = [
  'Minh', 'Hương', 'Lan', 'Tuấn', 'Phương', 'Nam', 'Linh', 'Hùng', 'Mai', 'Quân',
  'Thảo', 'Dũng', 'Hà', 'Khang', 'Trang', 'Đức', 'Ngọc', 'Bảo', 'Châu', 'Anh',
  'Khánh', 'Hồng', 'Hoàng', 'Thuỷ', 'Nhung', 'Sơn', 'Trinh', 'Long', 'Vy', 'Hiếu',
  'Yến', 'Toàn', 'Huyền', 'Tú', 'Diệu', 'Thành', 'Thu', 'Việt', 'Thanh', 'Kim'
];

const lastNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Lương', 'Trịnh', 'Tô'
];

const comments5Star = [
  'Ứng dụng thực sự hữu ích, giúp tôi hiểu rõ hơn về lòng biết ơn và ý nghĩa cuộc sống. Giao diện đẹp, dễ sử dụng.',
  'Chatbot rất thông minh và hỗ trợ tốt! Các câu hỏi được trả lời chi tiết và dễ hiểu. Cảm ơn team đã tạo ra ứng dụng tuyệt vời này.',
  'Tôi đã sử dụng được 2 tuần và cảm thấy tinh thần thoải mái hơn nhiều. Các bài tập hàng ngày rất bổ ích.',
  'Ứng dụng xuất sắc! Kiến thức tâm lý học được truyền tải một cách dễ hiểu và thực tế. Rất recommend cho mọi người.',
  'Giao diện đẹp mắt, nội dung chất lượng. Chatbot trả lời nhanh và chính xác. 5 sao xứng đáng!',
  'App này đã giúp tôi vượt qua giai đoạn khó khăn trong cuộc sống. Cảm ơn rất nhiều!',
  'Tôi thích cách chatbot hỏi và trả lời, rất tự nhiên và dễ chịu. Các câu hỏi khảo sát cũng hay.',
  'Nội dung rất có ý nghĩa, giúp tôi suy ngẫm nhiều về cuộc sống. Thiết kế đơn giản nhưng hiệu quả.',
  'Ứng dụng tốt nhất mà tôi từng dùng về chủ đề tâm lý tích cực. Rất đáng để thử!',
  'Chatbot thông minh, luôn hiểu được ý của tôi. Các câu trả lời rất sâu sắc và chuyên nghiệp.',
  'Tuyệt vời! Tôi cảm thấy được hỗ trợ nhiều từ ứng dụng này. Cảm ơn đội ngũ phát triển!',
  'Ứng dụng này đã thay đổi cách tôi nhìn nhận cuộc sống. Rất biết ơn vì đã tạo ra nó.',
  'Chất lượng cao, nội dung bổ ích. Tôi đã giới thiệu cho bạn bè và mọi người đều thích.',
  'Interface đẹp, tính năng đầy đủ, chatbot trả lời nhanh. Không có gì để chê!',
  'Tôi đánh giá cao sự tận tâm của team trong việc xây dựng ứng dụng này. 5 sao không thể thiếu!',
  'App này đúng là những gì tôi cần. Mỗi ngày đều có động lực mới từ các bài tập.',
  'Cảm ơn vì đã tạo ra một ứng dụng tuyệt vời như vậy! Tôi sẽ tiếp tục sử dụng lâu dài.',
  'Nội dung khoa học, dễ hiểu, và rất thực tế. Đây là app mà tôi luôn recommend cho mọi người.',
  'Chatbot rất tuyệt, giống như có một người bạn tâm lý bên cạnh. Cảm ơn team!',
  'Ứng dụng đã giúp tôi cải thiện sức khỏe tinh thần rất nhiều. 5 sao xứng đáng!'
];

const comments4Star = [
  'Ứng dụng tốt, nhưng mong có thêm tính năng nhắc nhở hàng ngày.',
  'Chatbot trả lời khá ổn, đôi khi hơi chậm một chút. Nhìn chung là tốt.',
  'Nội dung hay, giao diện đẹp. Mong cập nhật thêm nhiều bài học mới.',
  'App hữu ích, tôi thích phần chatbot. Có điểm nhỏ cần cải thiện nhưng vẫn rất tốt.',
  'Tốt lắm! Chỉ mong có thể thêm chế độ dark mode thì hoàn hảo hơn.',
  'Ứng dụng đáng để thử, nội dung chất lượng. 4 sao vì còn một số điểm nhỏ cần cải thiện.',
  'Chatbot thông minh, nhưng đôi khi câu trả lời hơi dài. Nhìn chung là rất tốt.',
  'Tôi thích app này, nhưng mong có thêm tính năng theo dõi tiến trình.',
  'Rất hài lòng với ứng dụng, 4 sao vì chưa có phiên bản offline.',
  'Nội dung tốt, giao diện ổn. Mong có thêm nhiều chủ đề hơn nữa.'
];

const comments3Star = [
  'Ứng dụng ổn, nhưng cần cải thiện tốc độ phản hồi của chatbot.',
  'Nội dung hay nhưng giao diện có thể làm đẹp hơn nữa.',
  'Chatbot đôi khi trả lời không khớp với câu hỏi. Cần cải thiện thuật toán.',
  'Ứng dụng có tiềm năng, nhưng còn nhiều điều cần hoàn thiện.',
  'Tốt nhưng chưa thực sự ấn tượng. Mong team cập nhật thêm.'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName() {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  return `${lastName} ${firstName}`;
}

function generateRating() {
  const rand = Math.random();
  if (rand < 0.65) return 5;
  if (rand < 0.85) return 4;
  return 3;
}

function generateComment(rating) {
  if (rating === 5) return getRandomElement(comments5Star);
  if (rating === 4) return getRandomElement(comments4Star);
  return getRandomElement(comments3Star);
}

function generateRandomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString();
}

async function generateReviews() {
  const reviews = [];
  const startDate = '2024-12-03T00:00:00Z';
  const endDate = '2026-01-03T23:59:59Z';

  console.log('Generating 256 reviews...\n');

  for (let i = 0; i < 256; i++) {
    const rating = generateRating();
    reviews.push({
      name: generateName(),
      rating: rating,
      comment: generateComment(rating),
      created_at: generateRandomDate(startDate, endDate)
    });
  }

  reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  console.log('Inserting reviews into database...\n');

  const apiUrl = `${SUPABASE_URL}/functions/v1/insert-reviews`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviews })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✓ Successfully inserted ${result.count} reviews`);
    } else {
      console.error(`✗ Failed to insert reviews:`, result.error);
    }
  } catch (error) {
    console.error(`✗ Error inserting reviews:`, error.message);
  }

  const ratingStats = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  console.log('\nRating distribution:');
  console.log(`  5 stars: ${ratingStats[5] || 0} (${((ratingStats[5] || 0) / 256 * 100).toFixed(1)}%)`);
  console.log(`  4 stars: ${ratingStats[4] || 0} (${((ratingStats[4] || 0) / 256 * 100).toFixed(1)}%)`);
  console.log(`  3 stars: ${ratingStats[3] || 0} (${((ratingStats[3] || 0) / 256 * 100).toFixed(1)}%)`);
  console.log(`\nAverage rating: ${avgRating.toFixed(2)} ⭐`);
}

generateReviews().catch(console.error);
