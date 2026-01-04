import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    // FIX: Refactored the markdown parser to correctly handle lists and other elements.
    // The original implementation contained syntax errors (e.g., `elements.push(</ul>)`) and
    // would have produced runtime errors by attempting to mutate props of React elements.
    // This new version uses a buffer for list items and flushes them when the list ends,
    // which is a more robust and correct approach.
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactElement[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">{listItems}</ul>);
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Headings
      if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>);
        continue;
      }
      if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="text-xl font-bold mt-5 mb-2">{line.substring(3)}</h2>);
        continue;
      }
      if (line.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.substring(2)}</h1>);
        continue;
      }

      // Lists
      if (line.startsWith('* ') || line.startsWith('- ')) {
        let listItemContent = line.substring(2);
        // Bold and Italics for list items
        listItemContent = listItemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        listItemContent = listItemContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
        listItems.push(<li key={i} dangerouslySetInnerHTML={{ __html: listItemContent }} />);
        continue;
      }

      // If we encounter a non-list item, flush any existing list items
      flushList();
      
      // Bold and Italics for paragraphs
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Paragraphs
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: line || '<br/>' }} />);
    }

    // Flush any remaining list items at the end of the content
    flushList();
    
    return elements;
  };

  return <div className="prose dark:prose-invert max-w-none">{renderContent()}</div>;
};
