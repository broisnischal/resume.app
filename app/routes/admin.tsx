import { Outlet } from "@remix-run/react";

export default function Admin() {
	return (
		<div>
			<h1>Admin</h1>
			<Outlet />
		</div>
	);
}
