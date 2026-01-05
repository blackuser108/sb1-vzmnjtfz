import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
}

export default function Accordion({
  items,
  allowMultiple = true,
  defaultOpenId,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(
    defaultOpenId ? new Set([defaultOpenId]) : new Set()
  );
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [contentHeights, setContentHeights] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const heights: { [key: string]: number } = {};
    items.forEach(item => {
      const ref = contentRefs.current[item.id];
      if (ref) {
        heights[item.id] = ref.scrollHeight;
      }
    });
    setContentHeights(heights);
  }, [items]);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);

    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      if (!allowMultiple) {
        newOpen.clear();
      }
      newOpen.add(id);
    }

    setOpenItems(newOpen);
  };

  return (
    <div className="w-full space-y-0 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={index !== items.length - 1 ? 'border-b border-gray-200' : ''}
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors group"
            aria-expanded={openItems.has(item.id)}
            aria-controls={`content-${item.id}`}
          >
            <span className="text-left text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.title}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-300 group-hover:text-blue-600 ${
                openItems.has(item.id) ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          <div
            id={`content-${item.id}`}
            ref={(el) => { contentRefs.current[item.id] = el; }}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: openItems.has(item.id)
                ? `${contentHeights[item.id] || 0}px`
                : '0px',
            }}
          >
            <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed">
              {item.children}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
