import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function importTutorKnowledge() {
  const filePath = path.join(__dirname, '../public/data/chatbot_tutor.txt');
  const content = fs.readFileSync(filePath, 'utf-8');

  const qaItems = parseContent(content);

  console.log(`Found ${qaItems.length} Q&A pairs to import`);

  const apiUrl = `${SUPABASE_URL}/functions/v1/import-tutor-knowledge`;

  for (const item of qaItems) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✓ Imported: ${item.topic} - ${item.question.substring(0, 50)}...`);
      } else {
        console.error(`✗ Failed to import ${item.topic}:`, result.error);
      }
    } catch (error) {
      console.error(`✗ Error importing ${item.topic}:`, error.message);
    }
  }

  console.log('\nImport completed!');
}

function parseContent(content) {
  const lines = content.split('\n');
  const qaItems = [];

  let currentTopic = '';
  let currentQuestion = '';
  let currentAnswer = '';
  let hasAnswer = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (hasAnswer && currentAnswer) {
        hasAnswer = false;
      }
      continue;
    }

    if (line.startsWith('CÂU HỎI:')) {
      if (currentQuestion && currentAnswer && currentTopic) {
        qaItems.push({
          topic: currentTopic,
          question: currentQuestion,
          answer: currentAnswer.trim()
        });
        hasAnswer = false;
      }

      currentQuestion = line.replace('CÂU HỎI:', '').trim();
      currentAnswer = '';
      hasAnswer = false;
    } else if (line.startsWith('TRẢ LỜI:')) {
      currentAnswer = line.replace('TRẢ LỜI:', '').trim();
      hasAnswer = true;
    } else {
      if (hasAnswer && currentAnswer) {
        currentAnswer += ' ' + line;
      } else if (!hasAnswer) {
        currentTopic = line;
      }
    }
  }

  if (currentQuestion && currentAnswer && currentTopic) {
    qaItems.push({
      topic: currentTopic,
      question: currentQuestion,
      answer: currentAnswer.trim()
    });
  }

  return qaItems;
}

importTutorKnowledge().catch(console.error);
