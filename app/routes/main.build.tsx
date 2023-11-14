import { Textarea } from "~/components/ui/textarea";
import Markdown from "react-markdown";
import React, { useState } from "react";
import remarkGfm from "remark-gfm";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
	Delete,
	DeleteIcon,
	Facebook,
	Github,
	Linkedin,
	Trash,
	Youtube,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default function Build() {
	const [markdown, setMarkdown] = useState("# Hi, *Pluto*!");
	const [name, setName] = useState("");
	const [title, setTitle] = useState("");

	const [file, setFile] = useState("");
	const [description, setDescription] = useState("");

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		setFile(event.target.files[0]);
	};

	// const handleSubmit = (event) => {
	//     event.preventDefault();
	//     console.log(file);
	// }

	return (
		<div>
			<div className="box flex gap-3 m-10">
				<div className="flex flex-col gap-4  flex-1">
					<Input type="file" className="w-fit" onChange={handleFileChange} />
					<div className="flex gap-3">
						<Input
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
						/>
						<Input
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter your title"
						/>
					</div>
					<Textarea
						className=" min-h-[20vh] p-4 border rounded"
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Add your bio description..."
					/>
					<Textarea
						className=" min-h-[50vh] p-4 border rounded"
						onChange={(e) => setMarkdown(e.target.value)}
						placeholder="Write your resume in Markdown..."
					/>
					{/* <Card>
						<CardTitle>Software Engineer</CardTitle>
						<CardContent>Google</CardContent>
						<CardDescription>
							Managed up to 5 projects or tasks at a given time while under
							pressure to meet weekly deadlines.
						</CardDescription>
						<Trash />
					</Card> */}

					<Card>
						<CardHeader>
							<CardTitle>Software Engineer</CardTitle>
							<CardDescription>
								Managed up to 5 projects or tasks at a given time while under
								pressure to meet weekly deadlines.
							</CardDescription>
						</CardHeader>
						<CardContent>Microsoft, 2015 - 2018</CardContent>

						<CardFooter className="flex justify-between">
							<Button variant="outline">Edit</Button>
							<Button>Remove</Button>
						</CardFooter>
					</Card>
					<Card className="w-full">
						<CardHeader>
							<CardTitle>Software Engineer</CardTitle>
							<CardDescription>
								Managed up to 5 projects or tasks at a given time while under
								pressure to meet weekly deadlines.
							</CardDescription>
						</CardHeader>
						<CardContent>Microsoft, 2015 - 2018</CardContent>

						<CardFooter className="flex justify-between">
							<Button variant="outline">Edit</Button>
							<Button>Remove</Button>
						</CardFooter>
					</Card>
				</div>
				<div className="preview-area h-fit py-10 flex-1 p-4 border rounded ">
					<div className="heading flex flex-col gap-5 items-center my-10">
						<Avatar className="w-24 h-24">
							{file ? (
								<AvatarImage
									alt="User Avatar"
									src={URL.createObjectURL(file)}
								/>
							) : (
								<AvatarFallback>AB</AvatarFallback>
							)}
						</Avatar>

						<div className="div text-center flex flex-col gap-3">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-3xl lg:text-4xl/none">
								{name || "John Doe"}
							</h1>

							<p className="balance mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
								{description}
							</p>
							<h2
								style={{
									WebkitBackgroundClip: "text",
								}}
								className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 dark:from-purple-400 dark:to-red-500"
							>
								{title}
							</h2>

							<div className="social-icons flex gap-4 items-center justify-center">
								<Facebook />
								<Youtube />
								<Github />
								<Linkedin />
							</div>
						</div>
					</div>
					<Markdown
						remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
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
						{markdown}
					</Markdown>

					<div className="skills">
						<div className="mt-4">
							<p className="font-medium">React</p>

							<div className="h-2 mt-1 bg-primary-foreground rounded">
								<div
									className="h-2 bg-primary rounded"
									style={{
										width: "80%",
									}}
								/>
							</div>
						</div>
						<div className="mt-4">
							<p className="font-medium">Typescript</p>

							<div className="h-2 mt-1 bg-primary-foreground rounded">
								<div
									className="h-2 bg-primary rounded"
									style={{
										width: "70%",
									}}
								/>
							</div>
						</div>
						<div className="mt-4">
							<p className="font-medium">Angular</p>

							<div className="h-2 mt-1 bg-primary-foreground rounded">
								<div
									className="h-2 bg-primary rounded"
									style={{
										width: "30%",
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
