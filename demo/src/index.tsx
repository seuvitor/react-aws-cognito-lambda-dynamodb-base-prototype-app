import React from "react";
import { createRoot } from "react-dom/client";

import { makeAppConfig } from "../../src";
import DemoBaseApp from "./DemoBaseApp";

const myAppMessages = {
	LOGIN_SUCCESSFUL: "User logged-in successfully",
	LOGIN_FAILED: "Login failed",
	LOGOUT_SUCCESSFUL: "User logged-out successfully",
	LOGOUT_FAILED: "Log-out failed",
	LOGGED_OUT_USER: "Logged-out User",
	LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS:
		"Could not login with refreshed tokens",
	LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE:
		"Could not decode authentication response",
	LOG_COULD_NOT_GET_REFRESHED_TOKENS: "Could not get refreshed tokens",
	LOG_NO_REFRESH_TOKEN_AVAILABLE: "No refresh token available",
	LOG_COULD_NOT_REFRESH_TOKENS: "Could not refresh tokens",
	LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS:
		"Could not get identification tokens with this authorization code",
};

const myEnv = {
	appHost: "http://localhost:5000",
	appBasePath: "/",
	appLogoUrl: "demoapp.png",
	appRegion: "us-east-1",
	appUserPoolId: "cognito-idp.us-east-1.amazonaws.com/us-east-1_SjfN8ExVX",
	appUserPoolDomain: "carteira-investimentos",
	appClientId: "2kl7a7vgnbck6caudr0imifn5o",
	appIdentityPoolId: "us-east-1:874c45d2-0eb6-4d04-92f0-b8769dcbcc54",
};

const appConfig = makeAppConfig({
	...myEnv,
	appRefreshTokenStorageKey: "demoapp-refresh-token",
	appMessages: myAppMessages,
});

const MainContent = () => (
	<main>
		<p>Main content text.</p>
	</main>
);

const routes = [
	{
		name: "main",
		label: "Main",
		path: "/",
		hideFromMenu: false,
		component: MainContent,
		options: { exact: true },
	},
];

const Demo = () => <DemoBaseApp routes={routes} appConfig={appConfig} />;

export default Demo;

const rootNode = document.querySelector("#demo");
if (rootNode) {
	const root = createRoot(rootNode);
	root.render(<Demo />);
}
