import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

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

function scoreGratitudeResponse(responseText: string): number {
  const lowerText = responseText.toLowerCase();
  const gratitudeKeywords = [
    'cảm ơn', 'biết ơn', 'may mắn', 'tươi sáng', 'hạnh phúc', 'vui', 'tốt',
    'tuyệt', 'tuyệt vời', 'siêu', 'lỗi', 'bố', 'mẹ', 'bạn', 'người yêu',
    'gia đình', 'sức khỏe', 'cuộc sống', 'được sống'
  ];
  
  let score = 3;
  let matchCount = 0;
  
  for (const keyword of gratitudeKeywords) {
    if (lowerText.includes(keyword)) {
      matchCount++;
    }
  }
  
  score = Math.min(7, Math.max(1, 1 + Math.floor((matchCount * 6) / gratitudeKeywords.length)));
  return score;
}

function scoreLifeMeaningResponse(responseText: string): number {
  const lowerText = responseText.toLowerCase();
  const meaningKeywords = [
    'ý nghĩa', 'mục đích', 'lý tưởng', 'giác ngộ', 'giúp đỡ', 'đóng góp',
    'tự nhẫn thức', 'phát triển', 'học hỏi', 'tìm kiếm', 'khám phá',
    'giá trị', 'sứ mệnh', 'tiến bộ', 'tăng trưởng'
  ];
  
  let score = 3;
  let matchCount = 0;
  
  for (const keyword of meaningKeywords) {
    if (lowerText.includes(keyword)) {
      matchCount++;
    }
  }
  
  score = Math.min(7, Math.max(1, 1 + Math.floor((matchCount * 6) / meaningKeywords.length)));
  return score;
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

    if (taskType === 'gratitude') {
      gratitudeScore = responses.reduce((sum, resp) => sum + scoreGratitudeResponse(resp.responseText), 0) / responses.length;
      gratitudeScore = Math.round(Math.min(7, Math.max(1, gratitudeScore)));
    } else if (taskType === 'meaning') {
      lifeMeaningScore = responses.reduce((sum, resp) => sum + scoreLifeMeaningResponse(resp.responseText), 0) / responses.length;
      lifeMeaningScore = Math.round(Math.min(7, Math.max(1, lifeMeaningScore)));
    } else if (taskType === 'prosocial') {
      prosocialBehavior = analyzeProsocialBehavior(responses);
    }

    const updateData: any = {
      user_id: userId,
      task_date: taskDate,
      updated_at: new Date().toISOString(),
    };

    if (gratitudeScore) updateData.gratitude_score = gratitudeScore;
    if (lifeMeaningScore) updateData.life_meaning_score = lifeMeaningScore;
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