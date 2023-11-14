import { Textarea } from "~/components/ui/textarea";
import Markdown from "react-markdown";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/cjs/styles/prism/dark.js";

export default function Build() {
	const [markdown, setMarkdown] = useState("# Hi, *Pluto*!");

	return (
		<div>
			<div className="box flex gap-3 m-10">
				<Textarea
					className="flex-1 min-h-[50vh]"
					onChange={(e) => setMarkdown(e.target.value)}
				/>
				<div className="preview-area flex-1">
					<Markdown
						remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
						components={{
							code({ node, inline, className, children, ...props }) {
								const match = /language-(\w+)/.exec(className || "");
								return !inline && match ? (
									<SyntaxHighlighter
										children={String(children).replace(/\n$/, "")}
										style={dark}
										language={match[1]}
										wrapLines
										PreTag="div"
										{...props}
									/>
								) : (
									<code className={className} {...props}>
										{children}
									</code>
								);
							},
						}}
					>
						{markdown}
					</Markdown>
				</div>
			</div>
		</div>
	);
}
