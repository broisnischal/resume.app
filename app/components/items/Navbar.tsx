import { Link } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { ModeToggle } from "../mode-toggle";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<nav
			className={cn(
				"flex items-center p-3 justify-center space-x-4 lg:space-x-6",
				className,
			)}
			{...props}
		>
			<Link
				to="/examples/dashboard"
				className="text-sm font-medium transition-colors hover:text-primary"
			>
				Home
			</Link>
			<Link
				to="/examples/dashboard"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Build Your Resume
			</Link>
			<Link
				to="/examples/dashboard"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Templates
			</Link>
			<Link
				to="/examples/dashboard"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Settings
			</Link>

			<div className="m-auto">
				<ModeToggle />
			</div>
		</nav>
	);
}
