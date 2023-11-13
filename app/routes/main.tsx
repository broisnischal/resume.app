import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { MainNav } from "~/components/items/Navbar";

export const meta: MetaFunction = () => {
	return [
		{ title: "My Resume" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<MainNav />
			<Outlet />
		</div>
	);
}
