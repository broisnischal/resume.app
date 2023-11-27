import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { Alert } from "~/components/ui/alert";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { Link as LinkIcon, UserIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	EditIcon,
	Facebook,
	Github,
	Linkedin,
	LoaderIcon,
	Plus,
	Trash,
	TwitterIcon,
	Youtube,
} from "lucide-react";
import MarkDown from "~/components/items/markdown";
import { Progress } from "~/components/ui/progress";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import moment from "moment";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const id = params.id!;

	// const isUserLoggedIn = await authenticator.isAuthenticated(request);

	const resume = await prisma.resume.findUnique({
		where: {
			label: id,
		},
		include: {
			owner: true,
		},
	});

	const skills = await prisma.skills.findMany({
		where: {
			Resume: {
				label: {
					equals: id,
				},
			},
		},
	});

	const works = await prisma.works.findMany({
		where: {
			Resume: {
				label: {
					equals: id,
				},
			},
		},
	});

	// if (!resume) {
	// 	return json({
	// 		error: {
	// 			message: "Resume not found",
	// 		},
	// 	});
	// }

	// if (!resume.public) {
	// 	if (!isUserLoggedIn) {
	// 		return json({
	// 			error: {
	// 				message: "Please login to view this resume!",
	// 			},
	// 		});
	// 	}

	// 	if (!(resume?.ownerId === isUserLoggedIn?.id)) {
	// 		return json({
	// 			error: {
	// 				message: "This resume is private, you donot have acces to view!",
	// 			},
	// 		});
	// 	}
	// }

	return {
		resume,
		id,
		skills,
		works,
	};
}

export default function Page() {
	const data = useLoaderData<typeof loader>();

	const error = data?.error?.message;

	const { skills, works, resume } = data;

	return (
		<div>
			{error ? (
				<div className="flex justify-center flex-col gap-5 min-h-screen  items-center">
					<Alert className="w-[300px]" variant={"destructive"}>
						{error}
					</Alert>

					<Link to={"/"}>
						<Button className="flex gap-2">
							<LinkIcon size={15} /> Go Home
						</Button>
					</Link>
				</div>
			) : (
				<div className="max-w-[1000px] m-auto my-[5rem]">
					<div className="flex flex-col gap-5">
						<div className="user-info flex items-center justify-center flex-col gap-3 mb-[3rem]">
							{/* <div className="avatar">
							<div className=" rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
								<UserIcon size={32} />
							</div>
						</div> */}

							<h1
								style={{
									WebkitBackgroundClip: "text",
								}}
								className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-white dark:to-gray-500"
							>
								{data.resume?.name}
							</h1>

							{/* <p className="max-w-[600px] text-zinc-200 dark:text-zinc-100 mx-auto balance text-center text-[40px]">
							{data.resume?.description}
						</p> */}

							<p className="balance mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
								{resume?.description}
							</p>
							<h2
								style={{
									WebkitBackgroundClip: "text",
								}}
								className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 dark:from-purple-400 dark:to-red-500"
							>
								{resume?.designation}
							</h2>

							<div className="social-icons flex gap-4 items-center justify-center">
								<Facebook />
								<Youtube />
								<Github />
								<Linkedin />
							</div>
						</div>

						<div className="flex flex-wrap gap-10">
							<div className="skills w-full  flex-1">
								{skills.map((item) => (
									<div key={item.id} className="mt-4 ">
										<p className="font-medium mb-2 capitalize">{item.name}</p>
										<Progress value={item.value} className="-z-10" />
									</div>
								))}
							</div>

							<div className="works flex-1 flex flex-wrap gap-4">
								{works.map((item) => (
									<Card key={item.id}>
										<CardHeader>
											<CardTitle>{item.title}</CardTitle>
											<CardDescription>{item.desc}</CardDescription>
										</CardHeader>
										<CardContent>
											<strong>{item.company}</strong> |{" "}
											{moment(item.startDate).format("LL")} -{" "}
											{moment(item.endDate).format("LL")}
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						<div className="flex flex-col flex-wrap gap-3">
							<MarkDown>{resume?.content || ""}</MarkDown>
						</div>
					</div>
				</div>
			)}{" "}
			<div className="text-center m-5">❤️ from {resume?.owner.username}</div>
		</div>
	);
}

//
