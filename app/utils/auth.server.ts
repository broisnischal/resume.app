import type { User } from "@prisma/client";
import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { prisma } from "./db.server";

const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email") as string;
		const password = form.get("password") as string;

		console.log(form);

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		console.log(user);

		if (!user) {
			throw new AuthorizationError("User doesnot exists");
		}
		console.log(await bcrypt.compare(password, user.password as string));

		if (!(await bcrypt.compare(password, user.password as string))) {
			throw new AuthorizationError("Invalid credentials");
		}

		return user;
	}),
	"login",
);

export { authenticator };
