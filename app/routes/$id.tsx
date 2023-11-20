import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { Alert } from "~/components/ui/alert";
import { authenticator } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { Link as LinkIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const id = params.id!;
	const isUserLoggedIn = await authenticator.isAuthenticated(request);

	const resume = await prisma.resume.findUnique({
		where: {
			label: id,
		},
	});

	if (!resume?.public) {
		if (!isUserLoggedIn) {
			return json({
				error: {
					message: "Please login to view this resume!",
				},
			});
		}

		if (!(resume?.ownerId === isUserLoggedIn?.id)) {
			return json({
				error: {
					message: "This resume is private, you donot have acces to view!",
				},
			});
		}
	}
	return {
		id: params.id,
		resume,
	};
}

export default function Page() {
	const data = useLoaderData<typeof loader>();

	const error = data?.error?.message;

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
				<div>
					<h1>{data.resume.title}</h1>
					<p>{data.resume.description}</p>
				</div>
			)}{" "}
		</div>
	);
}
