import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
	return [
		{ title: "My Resume" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Resume App.</h1>

			<Link to={"/main"}>
				<Button variant="default">Build Resume</Button>
			</Link>
		</div>
	);
}
