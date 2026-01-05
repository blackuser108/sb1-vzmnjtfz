import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ContentSection as ContentSectionType } from '../utils/parseContent';

interface ContentSectionProps {
  section: ContentSectionType;
  onSelectSection: (id: string) => void;
  depth?: number;
}

export default function ContentSection({
  section,
  onSelectSection,
  depth = 0
}: ContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = section.children.length > 0;
  const hasContent = section.content.trim().length > 0;

  const levelColors = [
    'text-blue-900',
    'text-blue-800',
    'text-blue-700',
    'text-blue-600'
  ];

  const levelFontSize = [
    'text-2xl',
    'text-xl',
    'text-lg',
    'text-base'
  ];

  const levelFontWeight = [
    'font-bold',
    'font-bold',
    'font-semibold',
    'font-medium'
  ];

  const levelPadding = [
    'py-6 px-8 md:px-12',
    'py-4 px-8 md:px-12',
    'py-3 px-8 md:px-12',
    'py-2 px-8 md:px-12'
  ];

  return (
    <div id={section.id} className={`scroll-mt-32 border-b ${depth === 0 ? 'border-gray-200' : 'border-gray-100'}`}>
      <button
        onClick={() => {
          onSelectSection(section.id);
          if (hasChildren || hasContent) {
            setIsExpanded(!isExpanded);
          }
        }}
        className={`
          w-full text-left transition-colors duration-200
          ${levelPadding[depth]}
          ${levelFontSize[depth]} ${levelFontWeight[depth]} ${levelColors[depth]}
          hover:bg-blue-50
          flex items-start justify-between gap-4
        `}
      >
        <span className="flex-1">{section.title}</span>
        {(hasChildren || hasContent) && (
          <span className="flex-shrink-0 text-blue-600 mt-1">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </span>
        )}
      </button>

      {isExpanded && (
        <div>
          {hasContent && (
            <div className={`text-gray-700 leading-relaxed text-justify whitespace-pre-line ${levelPadding[depth]} bg-white`}>
              {section.content}
            </div>
          )}

          {hasChildren && (
            <div className={depth === 0 ? 'bg-gray-50' : ''}>
              {section.children.map(child => (
                <ContentSection
                  key={child.id}
                  section={child}
                  onSelectSection={onSelectSection}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
