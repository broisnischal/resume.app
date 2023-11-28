import { useNavigation } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export default function GlobalLoading() {
	const navigation = useNavigation();
	const active = navigation.state !== "idle";

	return active ? (
		<div
			className={cn(
				"fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white/50",
				active && "pointer-events-none",
			)}
		>
			<LoaderIcon size={14} className="animate-spin" />
		</div>
	) : null;
}
