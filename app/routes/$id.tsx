import { useParams } from "@remix-run/react";

export default function Page() {
	const param = useParams();

	return (
		<div>
			<h1>{param.id}</h1>
			wow
		</div>
	);
}
