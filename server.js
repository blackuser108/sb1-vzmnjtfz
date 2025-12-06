// server.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // dev: cho phép mọi origin; production: set domain cụ thể
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, userScore = 0, totalQuestions = 1 } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error('Missing GEMINI_API_KEY');
      return res.status(500).json({ error: 'Server not configured with GEMINI_API_KEY' });
    }

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `Điểm khảo sát: ${userScore}/${totalQuestions * 5}\n\n${prompt}` }]
        }
      ]
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    console.log('Calling upstream:', url);
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const raw = await upstream.text();
    console.log('Upstream status:', upstream.status);
    console.log('Upstream raw response length:', raw?.length);
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch(e) { console.error('Parse error upstream:', e); }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.output?.[0]?.content?.[0]?.text ||
      null;

    if (!reply) {
      console.warn('Empty reply from provider', { status: upstream.status, rawSnippet: raw?.slice(0, 100) });
      return res.json({ reply: 'Rất tiếc, AI chưa phản hồi được. (Upstream may be empty)' });
    }

    return res.json({ reply });
  } catch (err) {
    console.error('Server /api/chat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// listen on PORT from env (Bolt/hosting cung cấp)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
