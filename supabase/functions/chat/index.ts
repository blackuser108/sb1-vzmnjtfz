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
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const messageLower = message.toLowerCase();
    const keywords = {
      gratitude: ["biết ơn", "cảm ơn", "tri ân"],
      prosocial: ["ủng hộ xã hội", "giúp đỡ", "chia sẻ", "quan tâm"],
      meaning: ["ý nghĩa cuộc sống", "ý nghĩa", "mục đích sống"],
    };

    let relevantContext = "";

    const { data: knowledgeBase } = await supabase
      .from("knowledge_base")
      .select("title, content, category")
      .limit(5);

    if (knowledgeBase && knowledgeBase.length > 0) {
      relevantContext += "\n\nCƠ SỞ LÝ THUYẾT:\n";
      for (const kb of knowledgeBase) {
        relevantContext += `\n### ${kb.title}\n${kb.content.substring(0, 2000)}...\n`;
      }
    }

    const { data: tutorKnowledge } = await supabase
      .from("tutor_knowledge")
      .select("topic, question, answer")
      .limit(10);

    if (tutorKnowledge && tutorKnowledge.length > 0) {
      relevantContext += "\n\nCÂU HỎI THƯỜNG GẶP:\n";
      for (const tk of tutorKnowledge) {
        relevantContext += `\nChủ đề: ${tk.topic}\nCâu hỏi: ${tk.question}\nTrả lời: ${tk.answer}\n`;
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `Bạn là trợ lý AI chuyên về tâm lý học thanh thiếu niên, đặc biệt về lòng biết ơn, hành vi ủng hộ xã hội và ý nghĩa cuộc sống.

Nhiệm vụ của bạn:
1. Trả lời bằng tiếng Việt một cách thân thiện, dễ hiểu và hữu ích cho học sinh THPT (16-18 tuổi)
2. Sử dụng kiến thức từ cơ sở lý thuyết và câu hỏi thường gặp được cung cấp bên dưới
3. Đưa ra lời khuyên thực tế, có căn cứ khoa học
4. Khuyến khích học sinh phát triển lòng biết ơn, hành vi tích cực và tìm kiếm ý nghĩa trong cuộc sống
5. Nếu câu hỏi không liên quan đến chủ đề nghiên cứu, hãy lịch sự chuyển hướng về các chủ đề liên quan đến lòng biết ơn, hành vi ủng hộ xã hội hoặc ý nghĩa cuộc sống

${relevantContext}

Hãy trả lời câu hỏi sau dựa trên kiến thức trên và kinh nghiệm của bạn về tâm lý học:`;

    const fullPrompt = `${systemPrompt}\n\nCâu hỏi của học sinh: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ reply: text }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Có lỗi xảy ra. Vui lòng thử lại sau!" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
