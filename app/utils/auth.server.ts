import type { User } from "@prisma/client";
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";
import { GoogleStrategy } from "remix-auth-google";
import { GitHubStrategy } from "remix-auth-github";

const authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		callbackURL: process.env.GOOGLE_CALLBACK_URL!,
	},
	async ({ accessToken, refreshToken, extraParams, profile }) => {
		console.log(profile);

		const existsUser = await prisma.user.findFirst({
			where: {
				connection: {
					some: {
						providerId: profile.id,
					},
				},
				email: profile.emails[0].value,
			},
		});

		if (existsUser) {
			console.log(existsUser);
			return existsUser;
		}

		const user = await prisma.user.create({
			data: {
				username: profile.displayName.replace(/\s/g, "").toLocaleLowerCase(),
				email: profile.emails[0].value,
				name: profile.displayName,
				connection: {
					create: {
						providerId: profile.id,
						providerName: profile.provider,
					},
				},
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

authenticator.use(googleStrategy, "google");

authenticator.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			callbackURL: process.env.GITHUB_CALLBACK_URL!,
		},
		async ({ accessToken, refreshToken, extraParams, profile }) => {
			const existsUser = await prisma.user.findFirst({
				where: {
					connection: {
						some: {
							providerId: profile.id,
						},
					},
					email: profile.emails[0].value,
				},
			});

			if (existsUser) {
				console.log(existsUser);
				return existsUser;
			}

			const user = await prisma.user.create({
				data: {
					username: profile.displayName,
					email: profile.emails[0].value,
					connection: {
						create: {
							providerId: profile.id,
							providerName: "github",
						},
					},
				},
			});

			return user;
		},
	),
	"github",
);

export { authenticator };
