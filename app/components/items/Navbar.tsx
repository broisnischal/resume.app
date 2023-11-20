import type { Location } from "@remix-run/react";
import { Form, Link, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { ModeToggle } from "../mode-toggle";
import clsx from "clsx";
import { Button } from "../ui/button";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const location: Location = useLocation();

	const links = [
		{
			title: "Home",
			href: "/main",
			alt: "main",
		},
		{
			title: "Templates",
			href: "/main/templates",
			alt: "templates",
		},
		{
			title: "Profile",
			href: "/main/profile",
			alt: "Profile",
		},
	];

	return (
		<nav
			className={cn(
				"flex items-center sticky top-0 backdrop-blur-xl border-b-secondary-foreground/20 border-[1px]  p-3 justify-center space-x-4 lg:space-x-6",
				className,
			)}
			{...props}
		>
			{links.map((link) => (
				<Link
					key={link.title}
					to={link.href}
					className={clsx(
						"text-sm font-medium transition-colors hover:text-primary text-muted-foreground",
						{
							"text-primary": link.href === location.pathname,
						},
					)}
				>
					{link.title}
				</Link>
			))}

			<div className="m-auto flex gap-4">
				<ModeToggle />
				<Form method="post">
					<Button
						type="submit"
						variant={"outline"}
						name="action"
						value="logout"
					>
						Logout
					</Button>
				</Form>
			</div>
		</nav>
	);
}
