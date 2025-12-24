const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = input.trim();
  setInput('');
  setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
  setIsLoading(true);

  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error('Groq API key not foun');

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `
Bạn là trợ lý AI chuyên về tâm lí lòng tốt và hành vi ủng hộ xã hội,
đặc biệt hiểu rõ vai trò trung gian của ý nghĩa cuộc sống.

Yêu cầu khi trả lời:
- Trả lời bằng tiếng Việt
- Giọng thân thiện, dễ hiểu cho học sinh
- Mỗi ý có thể in đậm tiêu đề (không thêm ký tự lạ)
- Ví dụ gần gũi
- Có thể dùng emoji dễ thương
- Không dài dòng
- Kết thúc bằng một câu hỏi mở
              `,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      throw new Error(data.error?.message || 'Groq request failed');
    }

    const aiResponse =
      data.choices?.[0]?.message?.content ||
      'Xin lỗi, mình chưa trả lời được câu hỏi này.';

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: aiResponse },
    ]);
  } catch (error: any) {
    console.error('Chat error:', error);
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: 'Xin lỗi, hiện AI đang bận. Bạn thử lại sau nhé!',
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
