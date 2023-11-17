import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkDown({ children }: { children: string }) {
	return (
		<Markdown
			remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
			rehypePlugins={[rehypeRaw]}
			components={{
				h1: ({ node, ...props }) => (
					<h1 className="text-2xl font-bold my-2" {...props} />
				),
				h2: ({ node, ...props }) => (
					<h2 className="text-xl font-bold my-2" {...props} />
				),
				h3: ({ node, ...props }) => (
					<h3 className="text-lg font-bold my-2" {...props} />
				),
				ul: ({ node, ...props }) => (
					<ul className="list-disc list-inside" {...props} />
				),
				ol: ({ node, ...props }) => (
					<ol className="list-decimal list-inside" {...props} />
				),
				// Add styles for other heading levels as needed
			}}
		>
			{children}
		</Markdown>
	);
}
