import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const knowledge = [
  {
    topic: "Lòng biết ơn",
    question: "Lòng biết ơn là gì?",
    answer: "Lòng biết ơn là một trạng thái tâm lý tích cực, bao gồm cả nhận thức và cảm xúc, khi con người nhận ra rằng mình đã nhận được những điều có giá trị từ cuộc sống, từ hoàn cảnh hoặc từ người khác. Nó không chỉ dừng lại ở việc nói 'cảm ơn', mà còn là sự trân trọng sâu sắc những điều tốt đẹp, dù là nhỏ bé hay lớn lao."
  },
  {
    topic: "Lòng biết ơn",
    question: "Lòng biết ơn có phải chỉ xuất hiện khi được giúp đỡ không?",
    answer: "Không. Lòng biết ơn có thể xuất hiện khi con người nhận ra những điều tích cực đã và đang tồn tại trong cuộc sống, như sức khỏe, các mối quan hệ, cơ hội học tập hay những trải nghiệm ý nghĩa, ngay cả khi không có một người cụ thể nào trực tiếp giúp đỡ."
  },
  {
    topic: "Lòng biết ơn",
    question: "Lòng biết ơn khác gì với suy nghĩ tích cực?",
    answer: "Suy nghĩ tích cực là cách nhìn nhận tình huống theo hướng lạc quan, trong khi lòng biết ơn nhấn mạnh vào việc trân trọng những gì đã nhận được. Một người có thể suy nghĩ tích cực về tương lai, nhưng lòng biết ơn giúp họ gắn kết sâu sắc hơn với hiện tại và những giá trị đang có."
  },
  {
    topic: "Lòng biết ơn",
    question: "Lòng biết ơn ảnh hưởng thế nào đến sức khỏe tinh thần?",
    answer: "Nhiều nghiên cứu cho thấy lòng biết ơn có liên quan đến mức độ hạnh phúc cao hơn, giảm căng thẳng, giảm cảm xúc tiêu cực và tăng cảm giác hài lòng với cuộc sống. Khi thường xuyên thực hành lòng biết ơn, con người có xu hướng điều hòa cảm xúc tốt hơn và cảm thấy an yên hơn."
  },
  {
    topic: "Ý nghĩa cuộc sống",
    question: "Ý nghĩa cuộc sống là gì?",
    answer: "Ý nghĩa cuộc sống là cảm nhận chủ quan rằng cuộc đời của một người có giá trị, có mục đích và đáng để gắn bó. Nó phản ánh niềm tin rằng những trải nghiệm, hành động và mối quan hệ của bản thân có ý nghĩa vượt ra ngoài sự tồn tại đơn thuần."
  },
  {
    topic: "Ý nghĩa cuộc sống",
    question: "Ý nghĩa cuộc sống có phải ai cũng giống nhau không?",
    answer: "Không. Ý nghĩa cuộc sống mang tính cá nhân rất cao. Mỗi người có thể tìm thấy ý nghĩa từ những nguồn khác nhau như gia đình, học tập, công việc, cống hiến xã hội hay sự phát triển bản thân."
  },
  {
    topic: "Hành vi ủng hộ xã hội",
    question: "Hành vi ủng hộ xã hội là gì?",
    answer: "Hành vi ủng hộ xã hội là những hành động tự nguyện nhằm giúp đỡ, chia sẻ, quan tâm hoặc bảo vệ lợi ích của người khác và cộng đồng, bao gồm cả những hành động nhỏ trong đời sống hằng ngày."
  },
  {
    topic: "Hành vi ủng hộ xã hội",
    question: "Hành vi ủng hộ xã hội có phải lúc nào cũng mang tính hy sinh không?",
    answer: "Không nhất thiết. Mặc dù một số hành vi giúp đỡ có thể đòi hỏi nỗ lực, nhưng nhiều nghiên cứu cho thấy người giúp đỡ cũng nhận được lợi ích tâm lý như cảm giác vui vẻ, gắn kết và thỏa mãn."
  }
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Insert knowledge
    const { error } = await supabase
      .from("tutor_knowledge")
      .insert(knowledge);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, count: knowledge.length }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});