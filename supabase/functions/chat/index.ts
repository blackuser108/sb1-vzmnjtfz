import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    let relevantContext = "";

    // Search tutor_knowledge for relevant Q&A
    const { data: tutorKnowledge } = await supabase
      .from("tutor_knowledge")
      .select("topic, question, answer")
      .or(`question.ilike.%${message}%,answer.ilike.%${message}%`)
      .limit(5);

    if (tutorKnowledge && tutorKnowledge.length > 0) {
      relevantContext += "\n\nCÂU HỎI THƯỜNG GẶP (từ tài liệu):\n";
      for (const tk of tutorKnowledge) {
        relevantContext += `\nChủ đề: ${tk.topic}\nCâu hỏi: ${tk.question}\nTrả lời: ${tk.answer}\n`;
      }
    }

    // Also pull some theoretical background
    const { data: knowledgeBase } = await supabase
      .from("knowledge_base")
      .select("title, content, category")
      .limit(3);

    if (knowledgeBase && knowledgeBase.length > 0) {
      relevantContext += "\n\nCƠ SỞ LÝ THUYẾT:\n";
      for (const kb of knowledgeBase) {
        relevantContext += `\n### ${kb.title}\n${kb.content.substring(0, 2000)}...\n`;
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `Bạn là trợ lý AI chuyên về vấn đề mối quan hệ giữa lòng biết ơn và hành vi ủng hộ xã hội, trong đó bạn phân tích một khía cạnh quan trọng nhất của vấn đề chính là vai trò trung gian của ý nghĩa cuộc sống.

Nhiệm vụ của bạn:
1. Trả lời bằng tiếng Việt một cách thân thiện, dễ hiểu và hữu ích cho học sinh THPT (16-18 tuổi)
2. Sử dụng kiến thức từ cơ sở lý thuyết và câu hỏi thường gặp được cung cấp bên dưới
3. Đưa ra lời khuyên thực tế, có căn cứ khoa học
4. Khuyến khích học sinh phát triển lòng biết ơn, hành vi tích cực và tìm kiếm ý nghĩa trong cuộc sống

Khi trả lời:
- Với mỗi ý bạn có thể bôi đậm tiêu đề lên, không thêm gì ở 2 đầu
- Ngôn ngữ thân thiện, gần gũi với học sinh
- Trong file đã viết vừa đủ không có viết khác đi
- Viết vừa đủ, không dài dòng
- Dẫn dắt bằng ví dụ gần gũi
- Kết thúc bằng một câu hỏi mở
- Phải trả lời vào đúng trọng tâm câu hỏi mà người hỏi đặt ra
- Phải trả lời đúng thông tin dựa vào tài liệu sẵn có không lạc đề, tránh lệch hướng
- Nếu có câu hỏi gần giống hoặc giống với câu hỏi trong tài liệu thì giữ nguyên để trả lời không thay đổi gì cả
- Có những câu nhắn từ người dùng sẽ khen bạn trả lời hay hoặc tuyệt vời bạn nên chỉ cảm ơn họ và hỏi rằng họ có còn thắc mắc gì không
- Viết tắt lần lượt là: Life Engagement Test (LET), Purpose in Life Test (PIL), Existential Meaning Scale (EMS/MEMS) Sources of Meaning Questionnaire (SoMe), Meaning in Life Questionnaire (MLQ). Đây là kiến thức quan trọng bạn cần nhớ nếu người dùng không hỏi thì không nên đưa ra

${relevantContext}

Hãy trả lời câu hỏi sau dựa trên kiến thức trên và kinh nghiệm của bạn về tâm lý học:`;

    const fullPrompt = `${systemPrompt}\n\nCâu hỏi của học sinh: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ reply: text }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Có lỗi xảy ra. Vui lòng thử lại sau!" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
