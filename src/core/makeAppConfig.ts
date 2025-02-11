type AppMessages = {
	LOGIN_SUCCESSFUL: string;
	LOGIN_FAILED: string;
	LOGOUT_SUCCESSFUL: string;
	LOGOUT_FAILED: string;
	LOGGED_OUT_USER: string;
	LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS: string;
	LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE: string;
	LOG_COULD_NOT_GET_REFRESHED_TOKENS: string;
	LOG_COULD_NOT_REFRESH_TOKENS: string;
	LOG_NO_REFRESH_TOKEN_AVAILABLE: string;
	LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS: string;
};

type AppConfig = {
	appBasePath: string;
	appAuthUrl: string;
	appClientId: string;
	appAuthRedirect: string;
	appExternalLoginUrl: string;
	appIdentityPoolId: string;
	appRegion: string;
	appUserPoolId: string;
	appLogoUrl: string;
	appMessages: AppMessages;
	hideLogin: boolean;
	appRefreshTokenStorageKey: string;
};

type MakeAppConfigParam = {
	appHost: string;
	appBasePath: string;
	appRegion: string;
	appUserPoolId: string;
	appUserPoolDomain: string;
	appClientId: string;
	appIdentityPoolId: string;
	appRefreshTokenStorageKey: string;
	appLogoUrl: string;
	appMessages: AppMessages;
	hideLogin?: boolean;
};

const makeAppConfig = ({
	appHost,
	appBasePath,
	appRegion,
	appUserPoolId,
	appUserPoolDomain,
	appClientId,
	appIdentityPoolId,
	appRefreshTokenStorageKey,
	appLogoUrl,
	appMessages,
	hideLogin,
}: MakeAppConfigParam): AppConfig => {
	const appBaseAuthUrl = `https://${appUserPoolDomain}.auth.${appRegion}.amazoncognito.com`;
	const appAuthRedirect = `${appHost}${appBasePath}?auth-redirect`;
	const appAuthUrl = `${appBaseAuthUrl}/oauth2/token`;
	const appExternalLoginUrl = `${appBaseAuthUrl}/login?client_id=${appClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${appAuthRedirect}`;

	return {
		appBasePath,
		appRegion,
		appUserPoolId,
		appClientId,
		appIdentityPoolId,
		appAuthRedirect,
		appAuthUrl,
		appExternalLoginUrl,
		appRefreshTokenStorageKey,
		appLogoUrl,
		appMessages,
		hideLogin: hideLogin || false,
	};
};

export default makeAppConfig;

export type { AppMessages, AppConfig };
