import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { Button } from "~/components/ui/button";
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
import { prisma } from "~/utils/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		successRedirect: "/main",
	});

	return user;
}

export async function action({ request }: LoaderFunctionArgs) {
	await validateCSRF(request);

	const form = await request.formData();
	const username = form.get("username") as string;
	const email = form.get("email") as string;
	const password = form.get("password") as string;
	const cpassword = form.get("cpassword") as string;

	const hashedPassword = await bcrypt.hash(password, 10);

	if (password !== cpassword) {
		return new Response("Passwords do not match", {
			status: 400,
		});
	}

	await prisma.user.create({
		data: {
			username,
			email,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	});

	return await authenticator.authenticate("login", request, {
		successRedirect: "/main",
		context: {
			formData: form,
		},
	});
}

export default function SignUp() {
	// const data = useActionData<typeof action>();

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="mx-auto max-w-sm ">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						Sign Up
					</CardTitle>
					<CardDescription className="">
						Create your account to start creating your resume
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" className="grid gap-4">
						<AuthenticityTokenInput />
						<Label className="sr-only" htmlFor="username">
							Username
						</Label>
						<Input
							id="username"
							placeholder="Username"
							autoCapitalize="none"
							name="username"
							type="text"
							autoComplete="off"
							required
						/>
						<Label className="sr-only" htmlFor="username">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							placeholder="Email"
							autoCapitalize="none"
							autoComplete="email"
							required
						/>
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							name="password"
							id="password"
							type="password"
							placeholder="Password"
							autoComplete="current-password"
							required
						/>
						<Label className="sr-only" htmlFor="password">
							Confirm Password
						</Label>
						<Input
							id="cpassword"
							type="password"
							name="cpassword"
							placeholder="Confirm Password"
							autoComplete="confirm-password"
							required
						/>

						<Button type="submit">Login</Button>

						<Link
							className="block text-center text-sm underline text-gray-700 dark:text-gray-300"
							to={"/login"}
						>
							Already have an account?
						</Link>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
