import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/login",
	});

	return json({ user });
}

export default function Profile() {
	const { user } = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Profile</h1>
			<h2>{user.username}</h2>
		</div>
	);
}
