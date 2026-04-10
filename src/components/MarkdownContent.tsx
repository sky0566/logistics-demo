'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) return null;

  return (
    <div className={`prose max-w-none 
      prose-headings:text-gray-900 prose-headings:font-light prose-headings:tracking-tight
      prose-h2:text-[20px] prose-h3:text-[17px] prose-h4:text-[15px]
      prose-p:text-gray-500 prose-p:text-[15px] prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900
      prose-ul:text-gray-600 prose-ol:text-gray-600
      prose-li:text-gray-600
      prose-table:border prose-table:border-gray-200
      prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:font-medium
      prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border-t
      prose-img:max-w-full prose-img:h-auto prose-img:rounded-xl
      prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:rounded-xl
      prose-blockquote:border-l-primary prose-blockquote:text-gray-500
      ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
