import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
	useSearchParams,
	useSubmit,
} from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import moment from "moment";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { loader, action } from "./main.templates";

export default function Templates() {
	const { templateResumes } = useLoaderData<typeof loader>();

	const data = useActionData<typeof action>();

	const [parmas] = useSearchParams();
	const submit = useSubmit();
	const navigation = useNavigation();

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).get("q");

	return (
		<section className="min-h-[calc(100vh-150px)] flex flex-col gap-5  mt-5">
			<div className="search w-[50vw] mx-auto flex gap-3 items-center border-primary/30 border-[1px] rounded-lg px-5 py-2">
				<SearchIcon />

				<Form method="post">
					<input
						onChange={(event) => {
							const isFirstSearch = q === null;
							submit(event.currentTarget, {
								replace: !isFirstSearch,
							});
						}}
						role="search"
						type="text"
						className="outline-none border-none w-full bg-transparent text-primary"
						name="q"
						placeholder="browse for template"
						defaultValue={parmas.get("q") || ""}
					/>
				</Form>
			</div>
			<div className="flex flex-wrap max-w-[1200px] justify-center mx-auto gap-5">
				{data?.searchedResume.length > 0
					? data?.searchedResume.map((item, index) => (
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
					: templateResumes.map((item, index) => (
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
					  ))}
			</div>
		</section>
	);
}
