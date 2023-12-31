import {
	json,
	type LinksFunction,
	type LoaderFunctionArgs,
} from "@remix-run/node";
import styles from "~/tailwind.css";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import {
	PreventFlashOnWrongTheme,
	ThemeProvider,
	useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./sessions.server";
import { csrf } from "./utils/csrf.server";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import GlobalLoading from "./components/global-loading";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
	const { getTheme } = await themeSessionResolver(request);
	const [token, cookieHeader] = await csrf.commitToken();

	console.log(token);

	return json(
		{
			theme: getTheme(),
			token,
		},
		{
			headers: {
				"set-cookie": cookieHeader as string,
			},
		},
	);
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>();

	return (
		<ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
			<AuthenticityTokenProvider token={data.token}>
				<App />
			</AuthenticityTokenProvider>
		</ThemeProvider>
	);
}

export function App() {
	const data = useLoaderData<typeof loader>();
	const [theme] = useTheme();

	return (
		<html lang="en" className={clsx(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
				<Links />
			</head>
			<body>
				<GlobalLoading />
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
