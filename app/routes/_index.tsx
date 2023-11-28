import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Features from "~/components/items/feature";
import { Button } from "~/components/ui/button";
import { Toaster } from "sonner";

export const meta: MetaFunction = () => {
	return [
		{ title: "My Resume" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black ">
				<div className="container px-4 md:px-6">
					<div className="grid gap-6 items-center">
						<div className="flex flex-col justify-center space-y-4 text-center">
							<div className="space-y-2">
								<h1
									style={{
										WebkitBackgroundClip: "text",
									}}
									className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
								>
									Revolutionize Your Resume Creation
								</h1>

								<p className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
									Join us and create your beautiful looking resume, search for
									your matching degination resume and create your own via
									templating it!
								</p>

								<div className="m-auto flex items-center justify-center">
									<Link to={"/main"} prefetch="viewport">
										<div className="group relative overflow-hidden rounded-full bg-white/10 px-3 py-1 duration-300 w-fit border-[1px] hover:border-[#31bdc6] cursor-pointer border-secondary/30">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												className="mr-1 inline-block h-4 w-4 fill-[#31bdc6]"
												viewBox="4 4 48 48"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="m19.2 36.4-4.75-10.45L4 21.2l10.45-4.75L19.2 6l4.75 10.45L34.4 21.2l-10.45 4.75ZM36.4 42l-2.35-5.25-5.25-2.35 5.25-2.4 2.35-5.2 2.4 5.2 5.2 2.4-5.2 2.35Z" />
											</svg>
											<span
												style={{
													WebkitBackgroundClip: "text",
												}}
												className="select-none bg-gradient-to-r from-[#31bdc6] to-[#3178c6]   bg-clip-text text-transparent duration-300"
											>
												Start Building Resume{" "}
											</span>
										</div>
									</Link>
								</div>
							</div>
							{/* <Link to={"/main"}>
								<Button variant="default">Start Building Resume</Button>
							</Link> */}
							{/* <div className="w-full max-w-sm space-y-2 mx-auto">
								<form className="flex space-x-2">
									<Input
										className="max-w-lg flex-1 bg-gray-800 text-white border-gray-900"
										placeholder="Enter your email"
										type="email"
									/>
									<Button className="bg-white text-black" type="submit">
										Join Now
									</Button>
								</form>
								<p className="text-xs text-zinc-200 dark:text-zinc-100">
									Get ready to redefine your email experience.
									<Link
										className="underline underline-offset-2 text-white"
										href="#"
									>
										Terms & Conditions
									</Link>
								</p>
							</div> */}
						</div>
					</div>
				</div>
			</section>

			<Features />
		</div>
	);
}
