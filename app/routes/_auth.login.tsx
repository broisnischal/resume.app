import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator } from "~/utils/auth.server";
import { validateCSRF } from "~/utils/csrf.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		successRedirect: "/main",
	});

	return user;
}

export const action: ActionFunction = async ({ request }) => {
	await validateCSRF(request);

	return authenticator.authenticate("login", request, {
		successRedirect: "/main",
	});
};

export default function Login() {
	const data = useActionData<typeof action>();

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="mx-auto max-w-sm ">
				<span>{data?.message || ""}</span>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						Login
					</CardTitle>
					<CardDescription className="">
						Please enter your username and password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" className="grid gap-4">
						<AuthenticityTokenInput />

						<Label className="sr-only" htmlFor="username">
							Email
						</Label>
						<Input
							name="email"
							id="email"
							placeholder="Email"
							autoCapitalize="none"
							autoComplete="email"
							required
						/>
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Password"
							autoComplete="current-password"
							required
						/>

						<Button type="submit">Login</Button>
						<Link
							className="block text-center text-sm underline text-gray-700 dark:text-gray-300"
							to={"/"}
						>
							Forgot your password?
						</Link>
						<Link
							className="block text-center text-sm underline text-gray-700 dark:text-gray-300"
							to={"/signup"}
						>
							Don't have an account? Create
						</Link>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
