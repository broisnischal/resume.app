import type {
	ActionFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Toaster } from "sonner";
import { MainNav } from "~/components/items/Navbar";
import { authenticator } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: "/login",
	});

	return user;
}

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const action = form.get("action");

	switch (action) {
		case "logout": {
			return await authenticator.logout(request, { redirectTo: "/login" });
		}
		default: {
			return new Response("Invalid action", { status: 400 });
		}
	}
};

export const meta: MetaFunction = () => {
	return [
		{ title: "My Resume" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<Toaster />
			<MainNav />
			<Outlet />
			<div className="footer text-center py-2 mt-10">
				Created with ❤️ by nees
			</div>
		</div>
	);
}
