import type { User } from "@prisma/client";
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";
import { GoogleStrategy } from "remix-auth-google";

const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
	{
		clientID: "YOUR_CLIENT_ID",
		clientSecret: "YOUR_CLIENT_SECRET",
		callbackURL: "https://example.com/auth/google/callback",
	},
	async ({ accessToken, refreshToken, extraParams, profile }) => {
		// Get the user data from your DB or API using the tokens and profile
		const user = await prisma.user.findFirst({
			where: {
				email: profile.emails[0].value,
			},
		});
		return user;
	},
);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email") as string;
		const password = form.get("password") as string;

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				password: true,
			},
		});

		console.log(user);

		if (!user) {
			throw new AuthorizationError("User doesnot exists");
		}
		console.log(await bcrypt.compare(password, user.password?.hash as string));

		if (!(await bcrypt.compare(password, user.password?.hash as string))) {
			throw new AuthorizationError("Invalid credentials");
		}

		return user;
	}),
	"login",
);

// authenticator.use(googleStrategy, "google");

export { authenticator };
