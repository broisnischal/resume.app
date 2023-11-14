import type { Location } from "@remix-run/react";
import { Link, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { ModeToggle } from "../mode-toggle";
import clsx from "clsx";

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
			title: "Build Resume",
			href: "/main/build",
			alt: "build",
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
				"flex items-center p-3 justify-center space-x-4 lg:space-x-6",
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

			<div className="m-auto">
				<ModeToggle />
			</div>
		</nav>
	);
}
