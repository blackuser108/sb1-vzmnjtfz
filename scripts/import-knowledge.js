import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function importKnowledge() {
  const filePath = path.join(__dirname, '../public/data/co_so_ly_luan.txt');
  const content = fs.readFileSync(filePath, 'utf-8');

  const sections = parseContent(content);

  console.log(`Found ${sections.length} sections to import`);

  const apiUrl = `${SUPABASE_URL}/functions/v1/import-knowledge-base`;

  for (const section of sections) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(section)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✓ Imported: ${section.title}`);
      } else {
        console.error(`✗ Failed to import ${section.title}:`, result.error);
      }
    } catch (error) {
      console.error(`✗ Error importing ${section.title}:`, error.message);
    }
  }

  console.log('\nImport completed!');
}

function parseContent(content) {
  const lines = content.split('\n');
  const sections = [];

  let currentSection = null;
  let currentContent = [];
  let currentCategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.match(/^1\.\d+\.\d*\.?\s+/)) {
      if (currentSection && currentContent.length > 0) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n').trim(),
          category: currentCategory
        });
      }

      currentSection = line;
      currentContent = [];

      if (line.includes('lòng biết ơn') || line.includes('Lòng biết ơn')) {
        currentCategory = 'lòng biết ơn';
      } else if (line.includes('hành vi ủng hộ xã hội') || line.includes('Hành vi ủng hộ xã hội')) {
        currentCategory = 'hành vi ủng hộ xã hội';
      } else if (line.includes('ý nghĩa cuộc sống') || line.includes('Ý nghĩa cuộc sống')) {
        currentCategory = 'ý nghĩa cuộc sống';
      } else if (line.includes('mối liên hệ')) {
        currentCategory = 'mối liên hệ';
      } else {
        currentCategory = 'tổng quan';
      }
    } else if (line.length > 0) {
      currentContent.push(line);
    }
  }

  if (currentSection && currentContent.length > 0) {
    sections.push({
      title: currentSection,
      content: currentContent.join('\n').trim(),
      category: currentCategory
    });
  }

  return sections;
}

importKnowledge().catch(console.error);
