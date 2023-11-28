import { AvatarFallback } from "@radix-ui/react-avatar";
import { Popover } from "@radix-ui/react-popover";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
	ActionFunction,
	LoaderFunction,
	json,
	redirect,
} from "@remix-run/node";
import {
	Form,
	useActionData,
	useFetcher,
	useLoaderData,
} from "@remix-run/react";
import {
	Cross,
	EditIcon,
	Facebook,
	Github,
	Linkedin,
	LoaderIcon,
	Plus,
	Trash,
	TwitterIcon,
	X,
	Youtube,
} from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { Alert } from "~/components/ui/alert";
import { Label } from "~/components/ui/label";
import moment from "moment";
import { useDebouncedCallback } from "use-debounce";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

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

	const works = await prisma.works.findMany({
		where: {
			Resume: {
				label: {
					equals: params.label,
				},
			},
		},
	});

	console.log(skills);

	const programmingLanguages = await prisma.programmingLanguages.findMany({
		where: {
			Resume: {
				label: {
					equals: params.label,
				},
			},
		},
	});

	const allprogramminglanguages = await prisma.programmingLanguages.findMany();

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
		allprogramminglanguages,
		softSkills,
		techTopics,
		resume,
		skills,
		works,
	});
}

export async function action({ request }: ActionFunctionArgs) {
	const resumeSchemaValidator = z.object({
		name: z.string(),
		designation: z.string(),
		description: z.string(),
		content: z.string(),
		label: z.string().min(1),
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

	const workValidator = z.object({
		title: z.string().min(1, {
			message: "Title is required",
		}),
		company: z.string().min(1, {
			message: "Title is required",
		}),
		desc: z.string().min(1, {
			message: "Title is required",
		}),
		startDate: z.string(),
		endDate: z.string(),
		resumeId: z.string().min(1),
	});

	const { _action, ...values } = Object.fromEntries(await request.formData());

	console.log(_action, values);

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
		case "add-work": {
			try {
				const value = workValidator.parse(values);

				const newWork = await prisma.works.create({
					data: {
						title: value.title,
						company: value.company,
						desc: value.desc,
						startDate: new Date(value.startDate),
						endDate: new Date(value.endDate),
						resumeId: value.resumeId,
					},
				});

				return newWork;
			} catch (error) {
				console.log(error);
				return json({
					error: {
						message: error.message,
					},
				});
			}
		}
		case "delete-work": {
			const id = values.id as string;

			const existswork = await prisma.works.findUnique({
				where: {
					id,
				},
			});

			await prisma.works.delete({
				where: {
					id: existswork?.id,
				},
			});

			return null;
		}
		case "fields": {
			const value = resumeSchemaValidator.parse(values);

			const updateResume = await prisma.resume.update({
				where: {
					label: value.label,
				},
				data: {
					name: value.name,
					designation: value.designation,
					description: value.description,
					content: value.content,
				},
			});

			return updateResume;
		}
		case "add-tag": {
			const tagid = values.tag as string;

			const tag = await prisma.programmingLanguages.findUnique({
				where: {
					id: tagid,
				},
			});

			const addtag = await prisma.resume.update({
				where: {
					label: values.label as string,
				},
				data: {
					programmingLanguages: {
						connect: {
							id: tag?.id,
						},
					},
				},
			});

			return addtag;
		}
		default: {
			return null;
		}
	}
}

export default function Build() {
	const {
		programmingLanguages,
		allprogramminglanguages,
		resume: resumevalue,
		skills: skillsData,
		works,
		softSkills,
		techTopics,
	} = useLoaderData<typeof loader>();

	console.log(allprogramminglanguages);
	console.log(programmingLanguages);

	const resumeData: {
		id: string;
		title: string;
		label: string;
		name: string | null;
		designation: string | null;
		description: string | null;
		content: string | null;
		public: boolean;
		template: boolean;
		ownerId: string;
		createdAt: Date;
		updatedAt: Date;
	} = resumevalue;

	const initialState = {
		name: resumeData.name === null ? "" : resumeData.name,
		designation: resumeData.designation === null ? "" : resumeData.designation,
		description: resumeData.description === null ? "" : resumeData.description,
		content: resumeData.content === null ? "" : resumeData.content,
	};

	const [resume, setResume] = useState(initialState);

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

	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const [skills, setSkills] = useState<{ name: string; level: number }[] | []>(
		[],
	);

	const [displayState, setDisplayState] = useState<
		"editor" | "both" | "preview"
	>("both");

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

	const fetcher = useFetcher({ key: "resume" });
	const tagfetcher = useFetcher({ key: "tags" });

	const handleTagClick = (tag: string) => {
		if (selectedTags.includes(tag)) {
			// setSelectedTags((prevTags) =>
			// prevTags.filter((selectedTag) => selectedTag !== tag),
			// );
			console.log(tag);

			tagfetcher.submit(
				{
					_action: "delete-tag",
					tag,
					label: resumeData.label,
				},
				{
					method: "post",
				},
			);
		} else {
			setSelectedTags((prevTags) => [...prevTags, tag]);
			tagfetcher.submit(
				{
					_action: "add-tag",
					tag,
					label: resumeData.label,
				},
				{
					method: "post",
				},
			);
		}
	};

	const debounced = useDebouncedCallback((e) => {
		fetcher.submit(
			{
				_action: "fields",
				...resume,
				label: resumeData.label,
			},
			{
				method: "post",
			},
		);
	}, 1000);

	return (
		<div>
			{/* <div className="buttons">
				<Button
					className={clsx({
						"bg-red-300": displayState === "both",
					})}
					variant={"outline"}
					onClick={() => setDisplayState("both")}
				>
					both
				</Button>
				<Button
					className={clsx({
						"bg-red-300": displayState === "preview",
					})}
					variant={"outline"}
					onClick={() => setDisplayState("preview")}
				>
					preview only
				</Button>

				<Button
					className={clsx({
						"bg-red-300": displayState === "editor",
					})}
					variant={"outline"}
					onClick={() => setDisplayState("editor")}
				>
					editor only
				</Button>
			</div> */}
			<div className="box flex gap-3 m-10">
				<div className="flex flex-col gap-4  flex-1">
					<Input type="file" className="w-fit" onChange={handleFileChange} />
					<fetcher.Form
						className="flex flex-col gap-3"
						method="post"
						name="resume"
						id="resume"
						onChange={(e) => debounced(e)}
					>
						<div className="flex gap-3 flex-wrap">
							<Input
								onChange={handleInputChange}
								name="name"
								defaultValue={resume.name || ""}
								placeholder="Enter your name"
							/>
							<Input
								onChange={handleInputChange}
								name="designation"
								defaultValue={resume.designation || ""}
								placeholder="Enter your title"
							/>
						</div>
						<Textarea
							name="description"
							className=" min-h-[20vh] p-4 border rounded"
							onChange={handleInputChange}
							defaultValue={resume.description || ""}
							placeholder="Add your bio description..."
						/>
						<Textarea
							name="content"
							className=" min-h-[50vh] p-4 border rounded"
							onChange={handleInputChange}
							defaultValue={resume.content || ""}
							placeholder="Write your resume in Markdown..."
						/>
						<Button
							type="submit"
							name="_action"
							value="fields"
							className="hidden"
						/>
					</fetcher.Form>
					<div className="flex flex-wrap gap-3">
						<AlertDialog>
							<AlertDialogTrigger>
								<Button className="w-fit">
									Add Skill <Plus size={15} />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Give the title of your skill?
									</AlertDialogTitle>
									<AlertDialogDescription>
										You can add your title and level in percentage to show up
										your skill.
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
									<AlertDialogAction
										form="add-skill"
										id="add-skill"
										className=" p-0"
									>
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

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className="w-fit" variant={"outline"}>
									Add Work <Plus size={15} />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className="w-[400px]">
								<AlertDialogHeader>
									<AlertDialogTitle>Are your work</AlertDialogTitle>

									<AlertDialogDescription>
										add your work{" "}
										<strong className="text-primary">experience </strong>.
									</AlertDialogDescription>

									<Form
										method="post"
										id="add-work"
										className="flex flex-col gap-4"
									>
										<Input
											// onChange={(e) => setDeleteInput(e.target.value)}
											type="text"
											name="title"
											placeholder="Work Title"
										/>
										<Input
											// onChange={(e) => setDeleteInput(e.target.value)}
											type="text"
											name="company"
											placeholder="Company Name"
										/>
										<Textarea
											name="desc"
											placeholder="Short work description"
										/>
										<Label htmlFor="startDate">Start Date</Label>
										<Input
											placeholder="Start Date"
											type="date"
											name="startDate"
											id="startDate"
											required
										/>
										<input
											type="hidden"
											name="resumeId"
											defaultValue={resumeData.id}
										/>
										<Label htmlFor="endDate">End Date</Label>
										<Input placeholder="End Date" type="date" name="endDate" />
									</Form>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									{/* <Form method="post">
							<input type="hidden" value={item.id} name="id" />
							<Button
								disabled={deleteInput !== `delete ${item.label}`}
								type="submit"
								name="_action"
								value={"delete"}
							>
								{state === "submitting" ? (
									<LoaderIcon size={14} className="animate-spin" />
								) : (
									"Delete"
								)}
							</Button>
						</Form> */}
									<AlertDialogAction
										className=" p-0"
										form="add-skill"
										id="add-skill"
									>
										<Button
											id="add-work"
											name="_action"
											value={"add-work"}
											form="add-work"
										>
											Save work
										</Button>
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>

					{works.map((item) => (
						<Card className="w-full" key={item.id}>
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
								<CardDescription>{item.desc}</CardDescription>
							</CardHeader>
							<CardContent>
								<strong>{item.company}</strong> |{" "}
								{moment(item.startDate).format("LL")} -{" "}
								{moment(item.endDate).format("LL")}
							</CardContent>

							<CardFooter className="flex justify-between">
								<Button variant="outline">Edit</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="outline">Delete</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete your work experience from resume.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>

											<AlertDialogAction>
												<Form method="post">
													<input type="hidden" value={item.id} name="id" />
													<Button
														type="submit"
														name="_action"
														value={"delete-work"}
													>
														{/* {state === "submitting" ? (
													<LoaderIcon size={14} className="animate-spin" />
												) : (
													"Continue"
												)} */}
														Continue
													</Button>
												</Form>
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardFooter>
						</Card>
					))}

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

					<div className="flex flex-wrap gap-2">
						<div className="inline-flex bg-secondary overflow-hidden items-center px-2.5 py-0.2 rounded-full text-sm font-medium">
							English
							<X size={16} />
						</div>

						<Button size="sm" variant="outline">
							Add Language
						</Button>
					</div>

					<h1>Select Language</h1>

					<div className="flex gap-4 flex-wrap">
						{allprogramminglanguages.map((item, index) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={item.id}
								onClick={() => handleTagClick(item.id)}
								className={` lowercase cursor-pointer px-[1rem] tracking-wide  font-bold select-none border-[1px]  rounded-full ${
									selectedTags.includes(item.name)
										? "bg-primary text-white dark:text-black "
										: "bg-secondary/10 "
								}`}
							>
								#{item.slug}
							</div>
						))}
					</div>
					<h1 className="text-2xl">Soft Skills </h1>

					<div className="flex gap-4 flex-wrap">
						{softSkills.map((item, index) => (
							// <div
							// 	className="px-10 cursor-pointer bg-white/5 w-min"
							// 	key={index}
							// >
							// 	<h1>{item.toLocaleLowerCase()}</h1>
							// </div>
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={item}
								onClick={() => handleTagClick(item)}
								className={` lowercase cursor-pointer px-[1rem] tracking-wide  font-bold select-none border-[1px]  rounded-full ${
									selectedTags.includes(item)
										? "bg-primary text-white dark:text-black "
										: "bg-secondary/10 "
								}`}
							>
								#{item}
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
								{resume.designation}
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
