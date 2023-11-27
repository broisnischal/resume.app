import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import type { LoaderFunctionArgs, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useNavigation,
} from "@remix-run/react";
import {
	EditIcon,
	FolderOpen,
	LayoutTemplate,
	LayoutTemplateIcon,
	LoaderIcon,
	PlusIcon,
	Trash,
} from "lucide-react";
import moment from "moment";
import { Alert } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const { _action, ...formData } = Object.fromEntries(form);

	switch (_action) {
		case "delete": {
			console.log(formData);
			const resumeId = form.get("id");

			const resume = await prisma.resume.findUnique({
				where: {
					id: resumeId as string,
				},
			});

			if (!resume) {
				return new Response("Resume not found", {
					status: 400,
				});
			}

			return await prisma.resume.delete({
				where: {
					id: resumeId as string,
				},
			});
		}

		case "create": {
			const user = await prisma.user.findUnique({
				where: {
					id: formData.userId as string,
				},
			});

			if (!user) {
				return new Response("User not found", {
					status: 400,
				});
			}

			const resume = await prisma.resume.create({
				data: {
					title: formData.title as string,
					label: formData.label as string,
					public: formData.public === "on" ? true : false,
					template:
						formData.template && formData.template === "on" ? true : false,
					ownerId: user.id,
				},
			});

			return resume;
		}

		default: {
			return null;
		}
	}
};

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/login",
	});

	const resumes = await prisma.resume.findMany({
		where: {
			ownerId: user.id,
		},
	});

	return json({ user, resumes });
}

export default function Dashboard() {
	const { user, resumes } = useLoaderData<typeof loader>();

	const popref = useRef<HTMLDivElement>(null);
	const [popoverClose, setPopoverClose] = useState(false);
	const [deleteInput, setDeleteInput] = useState("");
	const navigation = useNavigation();
	const state: "idle" | "submitting" | "loading" = navigation.state;

	return (
		<div className="flex items-center flex-col mt-10 min-h-[calc(100vh-200px)]  gap-1">
			{/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 filter blur-md animate-fadeIn opacity-5 pointer-events-none" /> */}
			<Toaster position="top-center" />
			<div className="resume flex flex-wrap max-w-[1200px] mx-auto justify-between gap-8">
				{resumes.length > 0 ? (
					resumes.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Card key={index} className="w-[360px]">
							<CardHeader>
								<CardTitle className="flex justify-between gap-4">
									{item.title}{" "}
									<div className="div flex gap-3">
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Trash size={15} className="cursor-pointer" />
											</AlertDialogTrigger>
											<AlertDialogContent className="w-[400px]">
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you sure to delete your Resume?
													</AlertDialogTitle>
													<Alert variant={"destructive"}>
														Warning : This action is not reversible. Please be
														certain.
													</Alert>
													<AlertDialogDescription>
														To delete your resume type{" "}
														<strong className="text-primary">
															delete {item.label}
														</strong>{" "}
														and continue.
													</AlertDialogDescription>
													<Input
														value={deleteInput}
														onChange={(e) => setDeleteInput(e.target.value)}
														type="text"
													/>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<Form method="post">
														<input type="hidden" value={item.id} name="id" />
														<Button
															disabled={deleteInput !== `delete ${item.label}`}
															type="submit"
															name="_action"
															value={"delete"}
														>
															{state === "submitting" ? (
																<LoaderIcon
																	size={14}
																	className="animate-spin"
																/>
															) : (
																"Delete"
															)}
														</Button>
													</Form>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>

										<Link prefetch="intent" to={`build/${item.label}`}>
											<EditIcon size={15} />
										</Link>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{/* <p>{item.label}</p> */}
								<div>Resume is {item.public ? "Public" : "Private"}</div>
								<div>
									{item.template
										? "Availabel for template"
										: "Not available for template"}
								</div>
							</CardContent>

							<CardFooter>
								<h1>{item.name}</h1>
								<div className="text-zinc-300 flex justify-between w-full">
									<div>{moment(item.createdAt).fromNow()}</div>

									<Link prefetch="intent" to={`/${item.label}`}>
										<Button>Visit</Button>
									</Link>
								</div>
							</CardFooter>
						</Card>
					))
				) : (
					<div className="flex items-center justify-center flex-col gap-4">
						<h1 className="text-primary">You do not have any resume...</h1>
						<Link prefetch="intent" to="/main/templates">
							<Button variant={"outline"}>
								<LayoutTemplateIcon size={15} className="mr-3" /> browse
								templates
							</Button>
						</Link>
					</div>
				)}
			</div>
			<Popover>
				<PopoverTrigger
					ref={popref as any}
					className="fixed top-3 right-3  z-[999]"
				>
					<Button className="p-0 aspect-square " variant={"outline"}>
						<PlusIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="z-[999]">
					<Card className="w-[450px]">
						<CardHeader>
							<CardTitle>Create Resume</CardTitle>
							<CardDescription>
								Deploy your new resume in one-click.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form id="create-resume" method="post">
								<div className="grid w-full items-center gap-4">
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="name">
											URL Label{" "}
											<small className="text-zinc-400">
												Unique, it will be used for URL
											</small>
										</Label>

										<Input id="name" name="label" placeholder="URL Label" />
									</div>
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="name">Resume Title</Label>
										<Input
											id="name"
											name="title"
											placeholder="Enter Resume Title"
										/>
										<Input
											name="userId"
											hidden
											className="hidden"
											value={user.id}
										/>
									</div>
									<div className=" flex items-center space-x-4 rounded-md border p-4">
										<FolderOpen strokeWidth={1.25} />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												Public Resume
											</p>
											<p className="text-sm text-muted-foreground">
												Others able to view your resume.
											</p>
										</div>
										<Switch name="public" defaultChecked />
									</div>
									<div className=" flex items-center space-x-4 rounded-md border p-4">
										<LayoutTemplate strokeWidth={1.5} />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												Template
											</p>
											<p className="text-sm text-muted-foreground">
												Your resume will be added to template.
											</p>
										</div>
										<Switch name="template" />
									</div>
								</div>
							</Form>
						</CardContent>
						<CardFooter className="flex flex-col gap-3">
							<div className="flex w-full justify-between">
								<PopoverClose>
									<Button variant="outline">Cancel</Button>
								</PopoverClose>
								<Button
									type="submit"
									form="create-resume"
									name="_action"
									value={"create"}
									disabled={
										(user.usertype === "FREE" && resumes.length >= 1) ||
										state === "submitting"
									}
									onClick={() => {
										toast.success("Resume Created Successfully!");
									}}
								>
									{state === "submitting" ? "Creating..." : "Create"}
								</Button>
							</div>
							{user.usertype === "FREE" && resumes.length >= 1 && (
								<Alert variant="destructive">
									{" "}
									You have reached your limit.{" "}
								</Alert>
							)}
						</CardFooter>
					</Card>
				</PopoverContent>
			</Popover>
		</div>
	);
}
