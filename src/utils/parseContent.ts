export interface ContentSection {
  id: string;
  level: number;
  title: string;
  content: string;
  children: ContentSection[];
}

export function parseContent(text: string, sectionId: string): ContentSection[] {
  const lines = text.split('\n');
  const sections: ContentSection[] = [];
  let currentSection: ContentSection | null = null;
  let currentContent: string[] = [];
  let parentStack: ContentSection[] = [];

  const headingRegex = /^([\d.]+)\.\s+(.+)$/;

  const flushCurrentSection = () => {
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
    }
    currentContent = [];
  };

  lines.forEach((line) => {
    const headingMatch = line.match(headingRegex);

    if (headingMatch) {
      const number = headingMatch[1];
      const numberParts = number.split('.');

      if (numberParts.length === 1) {
        return;
      }

      flushCurrentSection();

      const title = headingMatch[2];
      const level = numberParts.length;
      const newId = `${sectionId}-${number}`;

      const newSection: ContentSection = {
        id: newId,
        level,
        title: `${number}. ${title}`,
        content: '',
        children: []
      };

      while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
        parentStack.pop();
      }

      if (parentStack.length > 0) {
        parentStack[parentStack.length - 1].children.push(newSection);
      } else {
        sections.push(newSection);
      }

      parentStack.push(newSection);
      currentSection = newSection;
    } else if (line.trim()) {
      currentContent.push(line);
    } else if (currentContent.length > 0) {
      currentContent.push('');
    }
  });

  flushCurrentSection();
  return sections;
}
