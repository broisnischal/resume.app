import { AvatarFallback } from "@radix-ui/react-avatar";
import { Popover } from "@radix-ui/react-popover";
import {
	ActionFunction,
	ActionFunctionArgs,
	LoaderFunction,
	LoaderFunctionArgs,
	json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
	EditIcon,
	Facebook,
	Github,
	Linkedin,
	Plus,
	TwitterIcon,
	Youtube,
} from "lucide-react";
import React, { useState } from "react";
import MarkDown from "~/components/items/markdown";
import { z } from "zod";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Slider } from "~/components/ui/slider";
import { prisma } from "~/utils/db.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const resume = await prisma.resume.findUnique({
		where: {
			label: params.label,
		},
	});

	const skills = await prisma.skills.findMany({
		where: {
			Resume: {
				label: {
					equals: params.label,
				},
			},
		},
	});

	console.log(skills);

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
		resume,
		skills,
	});
}

export async function action({ request }: ActionFunctionArgs) {
	const resumeSchemaValidator = z.object({
		name: z.string(),
		title: z.string(),
		designation: z.string(),
		description: z.string(),
		content: z.string(),
	});

	const skillValidator = z.object({
		title: z.string().min(1),
		level: z
			.string()
			.transform((value) => {
				return parseInt(value);
			})
			.refine((value) => {
				return value >= 0 && value <= 100;
			}),
		resumeId: z.string().min(1),
	});

	const { _action, ...values } = Object.fromEntries(await request.formData());

	console.log(values);
	console.log(_action);

	switch (_action) {
		case "add-skill": {
			try {
				const value = skillValidator.parse(values);

				const newSkill = await prisma.skills.create({
					data: {
						name: value.title,
						value: value.level,
						resumeId: value.resumeId,
					},
				});
				return newSkill;
			} catch (error) {
				console.log(error);
				return json({
					error: {
						message: error.message,
					},
				});
			}
		}
		default: {
			return null;
		}
	}
}

const initialState = {
	name: "",
	title: "",
	designation: "",
	description: "",
	content: "",
};

export default function Build() {
	const [resume, setResume] = useState(initialState);

	const {
		programmingLanguages,
		resume: resumeData,
		skills: skillsData,
	} = useLoaderData<typeof loader>();

	const data = useActionData<typeof action>();

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

	const [skills, setSkills] = useState<{ name: string; level: number }[] | []>(
		[],
	);

	const [file, setFile] = useState("");

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = event.target;
		setResume({ ...resume, [name]: value });
	};

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
							onChange={handleInputChange}
							name="name"
							placeholder="Enter your name"
						/>
						<Input
							onChange={handleInputChange}
							name="title"
							placeholder="Enter your title"
						/>
					</div>
					<Textarea
						name="description"
						className=" min-h-[20vh] p-4 border rounded"
						onChange={handleInputChange}
						placeholder="Add your bio description..."
					/>
					<Textarea
						name="content"
						className=" min-h-[50vh] p-4 border rounded"
						onChange={handleInputChange}
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

					<AlertDialog>
						<AlertDialogTrigger>
							<Button className="w-full">
								Add Skill <Plus size={15} />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Give the title of your skill?
								</AlertDialogTitle>
								<AlertDialogDescription>
									You can add your title and level in percentage to show up your
									skill.
								</AlertDialogDescription>

								<Form
									// onSubmit={(e) => {
									// 	e.preventDefault();
									// 	setSkills([
									// 		...skills,
									// 		{
									// 			name: e.currentTarget.title.value,
									// 			level: e.currentTarget.level.value,
									// 		},
									// 	]);
									// }}
									method="post"
									id="add-skill"
									className="flex flex-col gap-4"
								>
									<Input
										placeholder="Enter your skill title, programming, singing, typescript"
										name="title"
									/>
									<input
										type="hidden"
										name="resumeId"
										defaultValue={resumeData.id}
									/>
									<Slider
										className="w-full"
										defaultValue={[60]}
										max={100}
										step={1}
										name="level"
									/>
								</Form>
							</AlertDialogHeader>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction form="add-skill" id="add-skill">
									<Button
										id="add-skill"
										name="_action"
										value={"add-skill"}
										form="add-skill"
										variant={"outline"}
									>
										Add Skill <Plus size={15} />
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

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
								{resume.name}
							</h1>

							<p className="balance mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
								{resume.description}
							</p>
							<h2
								style={{
									WebkitBackgroundClip: "text",
								}}
								className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 dark:from-purple-400 dark:to-red-500"
							>
								{resume.title}
							</h2>

							<div className="social-icons flex gap-4 items-center justify-center">
								<Facebook />
								<Youtube />
								<Github />
								<Linkedin />
							</div>
						</div>
					</div>

					<MarkDown>{resume.content}</MarkDown>

					<div className="skills ">
						{skillsData.map((item) => (
							<div key={item.id} className="mt-4 ">
								<p className="font-medium mb-2 capitalize">{item.name}</p>
								<Progress value={item.value} className="-z-10" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
