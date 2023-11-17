import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, type ActionFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import {
	EditIcon,
	FolderOpen,
	LayoutTemplate,
	PlusIcon,
	Trash,
} from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import moment from "moment";
import { Link1Icon } from "@radix-ui/react-icons";

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const formData = Object.fromEntries(form);

	console.log(formData);

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
			template: formData.template && formData.template === "on" ? true : false,
			ownerId: user.id,
		},
	});

	return resume;
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

	const navigation = useNavigation();
	const state: "idle" | "submitting" | "loading" = navigation.state;

	return (
		<div className="flex items-center flex-col mt-10 min-h-[calc(100vh-150px)]  gap-1">
			<div className="resume flex flex-wrap max-w-[1200px] mx-auto justify-between gap-8">
				{resumes.length > 0 ? (
					resumes.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Card key={index} className="w-[360px]">
							<CardHeader>
								<CardTitle className="flex justify-between gap-4">
									{item.title}{" "}
									<div className="div flex gap-3">
										<Trash size={15} className="cursor-pointer" />
										<EditIcon size={15} />
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
					<h1>You do not have any resume..</h1>
				)}
			</div>
			<Popover>
				<PopoverTrigger className="fixed top-2 right-2  z-[999]">
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
									disabled={user.usertype === "FREE" && resumes.length >= 1}
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
