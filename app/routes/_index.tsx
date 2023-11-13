import type { MetaFunction } from "@remix-run/node";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Remix</h1>
			<Button>Click Me!</Button>
			<ModeToggle />
		</div>
	);
}
