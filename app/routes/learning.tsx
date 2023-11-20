import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { prisma } from "~/utils/db.server";

export async function getResume() {
	return prisma.resume.findMany();
}

export async function loader({ request }: LoaderFunctionArgs) {
	const resumes = getResume();

	return defer({
		resumes,
	});
}
export default function Page() {
	const { resumes } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Streaming Example Remix</h1>

			<div className="resume">
				<Suspense fallback={<div>Loading...</div>}>
					<Await resolve={resumes}>
						{(data) => {
							return data.map((item) => <div key={item.id}>{item.title}</div>);
						}}
					</Await>
				</Suspense>
			</div>
		</div>
	);
}
