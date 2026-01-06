import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.24.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

const genAI = new GoogleGenerativeAI(Deno.env.get("GOOGLE_API_KEY") || "");

interface ScoringRequest {
  userId: string;
  taskDate: string;
  taskType: 'gratitude' | 'meaning' | 'prosocial';
  responses: Array<{
    questionId: string;
    questionText?: string;
    responseText: string;
    responseValue?: number;
  }>;
}

async function scoreResponse(question: string, responseText: string): Promise<number> {
  if (!responseText || responseText.trim().length === 0) return 1;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const scoringPrompt = `Bạn là AI chấm điểm khảo sát tâm lý/nhận thức cá nhân. Nhiệm vụ của bạn là đánh giá câu trả lời dựa trên thang 7 điểm, chia nhỏ 0,25, theo 4 tiêu chí chính:

**Tính liên quan (0–2 điểm)**:
- Câu trả lời có liên quan trực tiếp đến câu hỏi không?
- Lạc đề: 0–0,25
- Chỉ "có/không": 1–2
- Chi tiết, đúng trọng tâm: 2

**Ví dụ cá nhân / minh họa (0–2 điểm)**:
- Câu trả lời có ví dụ hoặc trải nghiệm thực tế cụ thể không?
- Không có ví dụ: 0–0,25
- Có ví dụ ngắn: 1–1,5
- Có ví dụ chi tiết, minh họa rõ ràng: 2

**Sâu sắc nội tâm / phân tích (0–2 điểm)**:
- Câu trả lời có thể hiện nhận thức, thay đổi cảm xúc, lý do, ý nghĩa không?
- Không thể hiện: 0–0,25
- Có phân tích ngắn: 1–1,5
- Có phân tích sâu sắc, rõ ràng: 2

**Rõ ràng & thuyết phục (0–1 điểm)**:
- Câu trả lời dễ hiểu, mạch lạc, thuyết phục người đọc không?
- Lộn xộn, khó hiểu: 0–0,25
- Ngắn gọn, rõ ràng: 0,5–0,75
- Rất rõ ràng, mạch lạc, thuyết phục: 1

**Yêu cầu:**
- Không làm tròn, giữ độ chính xác 0,25
- Chỉ trả về dòng cuối cùng có định dạng: "Tổng điểm: X/7" (ví dụ: "Tổng điểm: 5.25/7")

Câu hỏi: ${question}
Câu trả lời: ${responseText}`;

  try {
    const result = await model.generateContent(scoringPrompt);
    const output = result.response.text();

    const match = output.match(/Tổng điểm:\s*([\d.]+)\/7/);
    if (match && match[1]) {
      const score = parseFloat(match[1]);
      return Math.max(1, Math.min(7, score));
    }
    return 3.5;
  } catch (error) {
    console.error('Error scoring with AI:', error);
    return 3.5;
  }
}

function analyzeProsocialBehavior(responses: Array<{ questionText?: string; responseValue?: number }>): string {
  if (responses.length === 0) return '';

  const selectedBehaviors = responses
    .filter(resp => resp.responseValue === 1 && resp.questionText)
    .map(resp => resp.questionText!.trim())
    .filter(text => text && text !== 'Hôm nay tôi chưa thực hiện được hành động ủng hộ xã hội nào');

  if (selectedBehaviors.length === 0) return '';

  const unique = [...new Set(selectedBehaviors)];
  return unique.join(' | ');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: ScoringRequest = await req.json();
    const { userId, taskDate, taskType, responses } = payload;

    if (!userId || !taskDate || !taskType || !responses) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let gratitudeScore: number | null = null;
    let lifeMeaningScore: number | null = null;
    let prosocialBehavior: string | null = null;

    if (taskType === 'gratitude' || taskType === 'meaning') {
      const scores: number[] = [];

      for (const resp of responses) {
        if (resp.responseText && resp.responseText.trim()) {
          const score = await scoreResponse(resp.questionText || '', resp.responseText);
          scores.push(score);
        }
      }

      if (scores.length > 0) {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const roundedScore = Math.round(avgScore * 100) / 100;

        if (taskType === 'gratitude') {
          gratitudeScore = roundedScore;
        } else {
          lifeMeaningScore = roundedScore;
        }
      }
    } else if (taskType === 'prosocial') {
      prosocialBehavior = analyzeProsocialBehavior(responses);
    }

    const updateData: any = {
      user_id: userId,
      task_date: taskDate,
      updated_at: new Date().toISOString(),
    };

    if (gratitudeScore !== null) updateData.gratitude_score = gratitudeScore;
    if (lifeMeaningScore !== null) updateData.life_meaning_score = lifeMeaningScore;
    if (taskType === 'prosocial') updateData.prosocial_behavior = prosocialBehavior || '';

    const { data, error } = await supabase
      .from('daily_scores')
      .upsert(updateData, { onConflict: 'user_id,task_date' })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        data,
        scores: {
          gratitude: gratitudeScore,
          lifeMeaning: lifeMeaningScore,
          prosocial: prosocialBehavior,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});