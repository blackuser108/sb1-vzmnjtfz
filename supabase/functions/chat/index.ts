import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function getApiKey(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  let apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (apiKey) return apiKey;

  const { data, error } = await supabase
    .from("app_secrets")
    .select("value")
    .eq("key", "DEEPSEEK_API_KEY")
    .single();

  if (error || !data) return null;
  return data.value;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const apiKey = await getApiKey(supabase);
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Deepseek API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let relevantContext = "";

    // Search tutor_knowledge for relevant Q&A
    try {
      const { data: tutorKnowledge, error: tkErr } = await supabase
        .from("tutor_knowledge")
        .select("topic, question, answer")
        .or(`question.ilike.%${message}%,answer.ilike.%${message}%`)
        .limit(5);

      if (tkErr) throw tkErr;

      if (tutorKnowledge && tutorKnowledge.length > 0) {
        relevantContext += "\n\nCÂU HỎI THƯỜNG GẶP (từ tài liệu):\n";
        for (const tk of tutorKnowledge) {
          relevantContext += `\nChủ đề: ${tk.topic}\nCâu hỏi: ${tk.question}\nTrả lời: ${tk.answer}\n`;
        }
      }
    } catch (dbErr) {
      console.warn("tutor_knowledge query failed:", dbErr);
    }

    // Also pull some theoretical background
    try {
      const { data: knowledgeBase, error: kbErr } = await supabase
        .from("knowledge_base")
        .select("title, content, category")
        .limit(3);

      if (kbErr) throw kbErr;

      if (knowledgeBase && knowledgeBase.length > 0) {
        relevantContext += "\n\nCƠ SỞ LÝ THUYẾT:\n";
        for (const kb of knowledgeBase) {
          relevantContext += `\n### ${kb.title}\n${kb.content.substring(0, 2000)}...\n`;
        }
      }
    } catch (dbErr) {
      console.warn("knowledge_base query failed:", dbErr);
    }

    const systemPrompt = `Bạn là trợ lý AI chuyên về vấn đề mối quan hệ giữa lòng biết ơn và hành vi ủng hộ xã hội, trong đó bạn phân tích một khía cạnh quan trọng nhất của vấn đề chính là vai trò trung gian của ý nghĩa cuộc sống.

Nhiệm vụ của bạn:
1. Trả lời bằng tiếng Việt một cách thân thiện, dễ hiểu và hữu ích cho học sinh THPT (16-18 tuổi)
2. Sử dụng kiến thức từ cơ sở lý thuyết và câu hỏi thường gặp được cung cấp bên dưới
3. Đưa ra lời khuyên thực tế, có căn cứ khoa học
4. Khuyến khích học sinh phát triển lòng biết ơn, hành vi tích cực và tìm kiếm ý nghĩa trong cuộc sống

Khi trả lời:
- Với mỗi ý bạn có thể bôi đậm tiêu đề lên, không thêm gì ở 2 đầu
- Ngôn ngữ thân thiện, gần gũi với học sinh
- Viết vừa đủ, không dài dòng
- Dẫn dắt bằng ví dụ gần gũi
- Kết thúc bằng một câu hỏi mở
- Phải trả lời vào đúng trọng tâm câu hỏi mà người hỏi đặt ra
- Phải trả lời đúng thông tin dựa vào tài liệu sẵn có không lạc đề, tránh lệch hướng
- Nếu có câu hỏi gần giống hoặc giống với câu hỏi trong tài liệu thì giữ nguyên để trả lời không thay đổi gì cả
- Có những câu nhắn từ người dùng sẽ khen bạn trả lời hay thì chỉ cảm ơn họ và hỏi rằng họ có còn thắc mắc gì không
- Viết tắt: Life Engagement Test (LET), Purpose in Life Test (PIL), Existential Meaning Scale (EMS/MEMS), Sources of Meaning Questionnaire (SoMe), Meaning in Life Questionnaire (MLQ). Nếu người dùng không hỏi thì không nên đưa ra

${relevantContext}

Hãy trả lời câu hỏi sau dựa trên kiến thức trên và kinh nghiệm của bạn về tâm lý học:`;

    // Call Deepseek API (OpenAI-compatible)
    const aiRes = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiRes.json();

    if (!aiRes.ok) {
      console.error("Deepseek API error:", JSON.stringify(aiData));
      const errMsg = aiData?.error?.message || `Deepseek API returned ${aiRes.status}`;
      return new Response(
        JSON.stringify({ error: errMsg }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const text =
      aiData?.choices?.[0]?.message?.content ||
      "Xin lỗi, mình chưa thể trả lời câu hỏi này.";

    return new Response(
      JSON.stringify({ reply: text }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errMsg }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
