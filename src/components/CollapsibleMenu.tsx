import { ChevronDown, ChevronRight } from 'lucide-react';
import { ResearchSection } from '../data/researchStructure';

interface CollapsibleMenuProps {
  sections: ResearchSection[];
  expandedSections: Set<string>;
  onToggleSection: (id: string) => void;
  onSelectSection: (id: string) => void;
  activeSection: string;
}

export default function CollapsibleMenu({
  sections,
  expandedSections,
  onToggleSection,
  onSelectSection,
  activeSection
}: CollapsibleMenuProps) {
  const renderSection = (section: ResearchSection, depth: number = 0) => {
    const hasChildren = section.children && section.children.length > 0;
    const isExpanded = expandedSections.has(section.id);
    const isActive = activeSection === section.id;

    const levelColors = [
      'text-gray-900',
      'text-blue-900',
      'text-blue-800',
      'text-blue-700'
    ];

    const levelBgHover = [
      'hover:bg-blue-50',
      'hover:bg-blue-100',
      'hover:bg-blue-50',
      'hover:bg-blue-50'
    ];

    const levelPadding = [
      'pl-0',
      'pl-4',
      'pl-8',
      'pl-12'
    ];

    const levelFontWeight = [
      'font-bold',
      'font-semibold',
      'font-medium',
      'font-normal'
    ];

    const levelSize = [
      'text-base',
      'text-sm',
      'text-sm',
      'text-sm'
    ];

    return (
      <div key={section.id}>
        <button
          onClick={() => {
            onSelectSection(section.id);
            if (hasChildren) {
              onToggleSection(section.id);
            }
          }}
          className={`
            w-full text-left px-4 py-3 rounded-lg transition-all duration-200
            ${levelPadding[depth]} ${levelFontWeight[depth]} ${levelSize[depth]}
            ${levelColors[depth]} ${levelBgHover[depth]}
            ${isActive ? 'bg-blue-100 border-l-4 border-blue-600' : ''}
            flex items-center justify-between gap-2
          `}
        >
          <span className="flex-1">{section.title}</span>
          {hasChildren && (
            <span className="flex-shrink-0 text-blue-600">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="space-y-1 mt-1">
            {section.children.map(child => renderSection(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {sections.map(section => renderSection(section))}
    </nav>
  );
}
