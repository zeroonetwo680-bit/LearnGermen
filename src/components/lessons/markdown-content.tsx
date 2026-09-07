import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="md-content prose prose-slate max-w-none dark:prose-invert prose-headings:font-black prose-p:leading-8 prose-li:leading-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
