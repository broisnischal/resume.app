import { AvatarFallback } from "@radix-ui/react-avatar";
import { Popover } from "@radix-ui/react-popover";
import {
	ActionFunction,
	LoaderFunction,
	LoaderFunctionArgs,
	json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createStore, useStateMachine } from "little-state-machine";
import {
	Edit2Icon,
	EditIcon,
	Facebook,
	Github,
	Linkedin,
	TwitterIcon,
	Youtube,
} from "lucide-react";
import React, { useState } from "react";
import MarkDown from "~/components/items/markdown";

import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Progress } from "~/components/ui/progress";
import { Textarea } from "~/components/ui/textarea";
import { updateName, updateTitle } from "~/utils/resumeAction";

createStore({
	build: {
		name: "",
		title: "",
	},
});

export const loader: LoaderFunction = async ({
	request,
}: LoaderFunctionArgs) => {
	const programmingLanguages: string[] = [
		"TypeScript",
		"JavaScript",
		"HTML",
		"CSS",
		"React",
		"Next.js",
		"Astro",
		"Node.js",
		"Flutter",
		"C#",
		"Python",
		"Java",
	];

	const softSkills: string[] = [
		"Communication",
		"Team Collaboration",
		"Problem Solving",
		"Time Management",
		"Adaptability",
		"Critical Thinking",
		"Creativity",
		"Leadership",
		"Emotional Intelligence",
		"Active Listening",
		"Conflict Resolution",
		"Decision Making",
	];

	const techTopics: string[] = [
		"TypeScript",
		"React",
		"Next.js",
		"Node.js",
		"Express.js",
		"GraphQL",
		"RESTful APIs",
		"Database Design",
		"MongoDB",
		"PostgreSQL",
		"Docker",
		"Microservices Architecture",
		"CI/CD",
		"Authentication and Authorization",
		"Web Security",
		"Serverless Computing",
		"Testing (Unit, Integration, E2E)",
		"Performance Optimization",
		"Design Patterns",
		"DevOps",
		"Agile Methodology",
		"Git and Version Control",
	];

	return json({
		programmingLanguages,
		softSkills,
		techTopics,
	});
};

export default function Build() {
	const [markdown, setMarkdown] = useState("# Hi, *Pluto*!");
	const [name, setName] = useState("");

	const { programmingLanguages, softSkills } = useLoaderData<typeof loader>();

	const { actions, state, getState } = useStateMachine({
		updateName,
		updateTitle,
	});

	const socials = [
		{
			title: "Facebook",
			icon: <Facebook />,
			href: "https://www.facebook.com",
		},
		{
			title: "Github",
			icon: <Github />,
			href: "https://www.github.com",
		},
		{
			title: "Linkedin",
			icon: <Linkedin />,
			href: "https://www.linkedin.com",
		},
		{
			title: "Youtube",
			icon: <Youtube />,
			href: "https://www.youtube.com",
		},
		{
			title: "Twitter",
			icon: <TwitterIcon />,
			href: "https://www.twitter.com",
		},
	];

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
							onChange={(e) => {
								actions.updateName({
									name: e.target.value,
								});
							}}
							value={state.build.name}
							placeholder="Enter your name"
						/>
						<Input
							onChange={(e) => {
								actions.updateTitle({
									title: e.target.value,
								});
							}}
							value={state.build.title}
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
					<div className="">
						<Popover>
							<PopoverTrigger>
								<Button variant={"outline"}>Edit Socials</Button>
							</PopoverTrigger>
							<PopoverContent
								align="center"
								className="flex gap-4 flex-col ml-12"
							>
								{socials.map((item) => (
									<Card key={item.title}>
										<CardHeader>
											<CardTitle className="flex justify-between">
												<h1>{item.title}</h1>

												<EditIcon size={15} />
											</CardTitle>
											<CardDescription>{item.href}</CardDescription>
										</CardHeader>
									</Card>
								))}
							</PopoverContent>
						</Popover>
					</div>
					<h1>Select Language</h1>

					<div className="flex gap-4 flex-wrap">
						{programmingLanguages.map((item, index) => (
							<div
								className="px-10 cursor-pointer bg-white/5 w-min"
								key={index}
							>
								<h1>{item}</h1>
							</div>
						))}
					</div>
				</div>
				<div className="preview-area h-fit py-10 flex-1 p-4 border rounded ">
					<div className="heading flex flex-col gap-5 items-center my-10">
						<Avatar className="w-24 h-24 -z-10">
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
								{state.build.name || "John Doe"}
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
								{state.build.title || "Full Stack Developer"}
							</h2>

							<div className="social-icons flex gap-4 items-center justify-center">
								<Facebook />
								<Youtube />
								<Github />
								<Linkedin />
							</div>
						</div>
					</div>

					<MarkDown>{markdown}</MarkDown>

					<div className="skills">
						<div className="mt-4 ">
							<p className="font-medium mb-2">React</p>
							<Progress value={70} />
						</div>
						<div className="mt-4 ">
							<p className="font-medium mb-2">Typescript</p>
							<Progress value={49} />
						</div>
						<div className="mt-4 ">
							<p className="font-medium mb-2">Python</p>
							<Progress value={89} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
