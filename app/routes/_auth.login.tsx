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

	return await authenticator.authenticate("login", request, {
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
						<div className="providers flex flex-col gap-3">
							<div className="flex flex-col items-center space-y-4 mt-4">
								<span className="text-gray-500 dark:text-gray-400">
									or login with
								</span>
								<div className="flex space-x-4">
									<Form action="/auth/google" method="post">
										<Button
											className="flex items-center space-x-2"
											variant="outline"
										>
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="24"
												viewBox="0 0 24 24"
												width="24"
											>
												<path
													d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													fill="#4285F4"
												/>
												<path
													d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													fill="#34A853"
												/>
												<path
													d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													fill="#FBBC05"
												/>
												<path
													d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													fill="#EA4335"
												/>
												<path d="M1 1h22v22H1z" fill="none" />
											</svg>
											<span>Google</span>
										</Button>
									</Form>

									<Button
										className="flex items-center space-x-2"
										variant="outline"
									>
										{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
										<svg
											className=" w-6 h-6 text-gray-800 dark:text-gray-100"
											fill="none"
											height="24"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
											<path d="M9 18c-4.51 2-5-2-7-2" />
										</svg>
										<span>GitHub</span>
									</Button>
								</div>
							</div>
						</div>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
