import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import {
	Await,
	Form,
	useActionData,
	useFetcher,
	useLoaderData,
	useNavigation,
	useSearchParams,
	useSubmit,
} from "@remix-run/react";
import { LoaderIcon, SearchIcon } from "lucide-react";
import moment from "moment";
import { Suspense, useState } from "react";
import ResumeList from "~/components/items/resumelist";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { prisma } from "~/utils/db.server";

export async function getResume() {
	return prisma.resume.findMany({
		where: {
			template: true,
		},
		take: 10,
		include: {
			owner: {
				select: {
					name: true,
					username: true,
				},
			},
		},
	});
}

export async function loader({ request }: LoaderFunctionArgs) {
	const templateResumes = getResume();

	const totalNumbersOfresume = await prisma.resume.count({
		where: {
			template: true,
		},
	});
	const q = new URL(request.url).searchParams.get("q") || "";

	return defer({
		templateResumes,
		q,
		totalNumbersOfresume,
	});
}

export async function action({ request }: ActionFunctionArgs) {
	const form = await request.formData();
	const q = form.get("q") as string;

	const searchedResume = await prisma.resume.findMany({
		where: {
			OR: [
				{
					title: {
						contains: q,
					},
				},
				{
					designation: {
						contains: q,
					},
				},
			],
			template: true,
		},
		take: 10,
		include: {
			owner: {
				select: {
					name: true,
					username: true,
				},
			},
		},
	});

	return {
		searchedResume,
	};
}

export default function Templates() {
	const { templateResumes, q, totalNumbersOfresume } =
		useLoaderData<typeof loader>();
	const [inputvalue, setInputValue] = useState("");

	const data = useActionData<typeof action>();

	const submit = useSubmit();
	const fetcher = useFetcher();
	const [searchParams, setSearchParams] = useSearchParams();

	console.log(searchParams.get("q"));

	const navigation = useNavigation();

	const searching =
		fetcher.state === "loading" || navigation.state === "submitting";

	return (
		<section className="min-h-[calc(100vh-150px)] flex flex-col gap-5  mt-5">
			<div className="search w-[50vw] mx-auto flex gap-3 items-center border-primary/30 border-[1px] rounded-lg px-5 py-2">
				{!searching ? (
					<SearchIcon size={15} />
				) : (
					<LoaderIcon className="animate-spin" size={15} />
				)}

				<fetcher.Form
					method="post"
					onChange={(e) => {
						setSearchParams({ q: e.currentTarget.q.value });
					}}
					onKeyUpCapture={(e) => {
						// if (e.key === "Enter") {

						submit(e.currentTarget, { replace: true });

						// }
					}}
				>
					<input
						role="searchbox"
						type="text"
						className="outline-none border-none w-full bg-transparent text-primary"
						name="q"
						placeholder="browse for template"
						onChange={(e) => {}}
					/>
				</fetcher.Form>
			</div>
			<div className="flex flex-wrap max-w-[1200px] justify-center mx-auto gap-5">
				{inputvalue.length >= 0 && !(data?.searchedResume.length === 0) ? (
					data?.searchedResume.length > 0 ? (
						data?.searchedResume.map((item, index) => (
							<div key={item.id}>
								<Card className="w-[300px]">
									<CardHeader>
										<CardTitle>
											<h1>{item.title}</h1>
										</CardTitle>
										<CardDescription>
											<p>{item.label}</p>
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p>{item.description}</p>
									</CardContent>
									<CardFooter className="flex justify-between">
										<p>{moment(item.createdAt).fromNow()}</p>
										<p> {item.owner.username}</p>
									</CardFooter>
								</Card>
							</div>
						))
					) : (
						<Suspense
							fallback={
								<ResumeList totalNumberOfResume={totalNumbersOfresume} />
							}
						>
							<Await resolve={templateResumes}>
								{(resume) => (
									<Await resolve={resume}>
										{(data) =>
											data.map((item) => (
												<div key={item.id}>
													<Card className="w-[300px]">
														<CardHeader>
															<CardTitle>
																<h1>{item.title}</h1>
															</CardTitle>
															<CardDescription>
																<p>{item.label}</p>
															</CardDescription>
														</CardHeader>
														<CardContent>
															<p>{item.description}</p>
														</CardContent>
														<CardFooter className="flex justify-between">
															<p>{moment(item.createdAt).fromNow()}</p>
															<p> {item.owner.username}</p>
														</CardFooter>
													</Card>
												</div>
											))
										}
									</Await>
								)}
							</Await>
						</Suspense>
					)
				) : (
					<div>No such result found</div>
				)}
			</div>
		</section>
	);
}

{
	/* <Suspense fallback={<div>Loading...</div>}>
						<Await resolve={templateResumes}>
							{(templateResume) =>
								templateResume.map((item, index) => (
									<div key={item.id}>
										<Card className="w-[300px]">
											<CardHeader>
												<CardTitle>
													<h1>{item.title}</h1>
												</CardTitle>
												<CardDescription>
													<p>{item.label}</p>
												</CardDescription>
											</CardHeader>
											<CardContent>
												<p>{item.description}</p>
											</CardContent>
											<CardFooter className="flex justify-between">
												<p>{moment(item.createdAt).fromNow()}</p>
												<p> {item.owner.username}</p>
											</CardFooter>
										</Card>
									</div>
								))
							}
						</Await>
					</Suspense> */
}
