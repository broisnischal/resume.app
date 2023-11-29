import { CSRF, CSRFError } from "remix-utils/csrf/server";
import { createCookie } from "@remix-run/node";

const cookie = createCookie("csrf", {
	path: "/",
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	secrets: process.env.SESSION_SECRET?.split(","),
});

export const csrf = new CSRF({
	cookie,
	// formDataKey: "csrf",
	// secret: process.env.SESSION_SECRET,
});

export async function validateCSRF(request: Request) {
	try {
		await csrf.validate(request);
	} catch (error) {
		if (error instanceof Response) return error;

		if (error instanceof CSRFError) {
			throw new Response("Invalid CSRF token", { status: 403 });
		}
		throw error;
	}
}
