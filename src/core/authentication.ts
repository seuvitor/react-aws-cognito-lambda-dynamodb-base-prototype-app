import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
	type CognitoIdentityCredentialProvider,
	fromCognitoIdentityPool,
} from "@aws-sdk/credential-provider-cognito-identity";

const initialUserState = {
	appConfig: undefined,
	user: {
		identityId: undefined,
		id: undefined,
		name: undefined,
		email: undefined,
		groups: undefined,
		idToken: undefined,
		accessToken: undefined,
	},
	refreshToken: undefined,
	awsConfig: undefined,
	awsCredentials: undefined,
};

const getRefreshTokenFromSessionStorage = (appRefreshTokenStorageKey: string) =>
	sessionStorage.getItem(appRefreshTokenStorageKey);

const updateRefreshTokenInSessionStorage = (
	refreshToken: string | undefined,
	appRefreshTokenStorageKey: string,
) => {
	if (refreshToken) {
		sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
	} else {
		sessionStorage.removeItem(appRefreshTokenStorageKey);
	}
};

type AppMessages = {
	LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS: string;
	LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE: string;
	LOG_COULD_NOT_GET_REFRESHED_TOKENS: string;
	LOG_NO_REFRESH_TOKEN_AVAILABLE: string;
	LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS: string;
};

type AppConfig = {
	appAuthUrl: string;
	appClientId: string;
	appAuthRedirect: string;
	appIdentityPoolId: string;
	appRegion: string;
	appUserPoolId: string;
	appMessages: AppMessages;
	appRefreshTokenStorageKey: string;
};

type AwsCredentialsState = {
	awsCredentials: undefined | CognitoIdentityCredentialProvider;
	user: {
		identityId: undefined | string;
		id: undefined | string;
		name: undefined | string;
		email: undefined | string;
		groups: undefined | string[];
		idToken: undefined | string;
		accessToken: undefined | string;
	};
	awsConfig:
		| undefined
		| {
				region: undefined | string;
				credentials: undefined | CognitoIdentityCredentialProvider;
		  };
};

type LoginState = AwsCredentialsState & {
	refreshToken: undefined | string;
};

const stateUpdateFromClearAwsCredentials: AwsCredentialsState = {
	awsCredentials: undefined,
	user: {
		identityId: undefined,
		id: undefined,
		name: undefined,
		email: undefined,
		groups: undefined,
		idToken: undefined,
		accessToken: undefined,
	},
	awsConfig: undefined,
};

const stateUpdateFromFailedLogin: LoginState = {
	...stateUpdateFromClearAwsCredentials,
	refreshToken: undefined,
};

const stateUpdateFromNewAwsCredentials = (
	awsCredentials: CognitoIdentityCredentialProvider,
	identityId: string,
	idToken: string,
	accessToken: string,
	appMessages,
	appRegion,
): AwsCredentialsState => {
	const idTokenPayload = idToken && JSON.parse(atob(idToken.split(".")[1]));
	const user = {
		identityId,
		id: idTokenPayload?.sub,
		name: idTokenPayload ? idTokenPayload.name : appMessages.LOGGED_OUT_USER,
		email: idTokenPayload?.email,
		groups: idTokenPayload?.["cognito:groups"],
		idToken,
		accessToken,
	};
	const awsConfig = awsCredentials
		? { region: appRegion, credentials: awsCredentials }
		: undefined;

	return {
		awsCredentials,
		user,
		awsConfig,
	};
};

const loginWithAwsCognitoIdentityPoolSemDispatch = (
	appConfig: AppConfig,
	idToken: string,
	accessToken: string,
): Promise<AwsCredentialsState> => {
	const { appIdentityPoolId, appRegion, appUserPoolId, appMessages } =
		appConfig;

	const newCredentials = fromCognitoIdentityPool({
		client: new CognitoIdentityClient({
			region: appRegion,
		}),
		identityPoolId: appIdentityPoolId,
		...(idToken && { logins: { [appUserPoolId]: idToken } }),
	});

	return new Promise((resolve, reject) => {
		newCredentials()
			.then((creds) => {
				resolve(
					stateUpdateFromNewAwsCredentials(
						newCredentials,
						creds.identityId,
						idToken,
						accessToken,
						appMessages,
						appRegion,
					),
				);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const refreshIdAndAccessTokensSemDispatch = (
	appConfig: AppConfig,
	refreshToken: string,
): Promise<AwsCredentialsState> => {
	const { appAuthUrl, appClientId, appMessages } = appConfig;
	return new Promise((resolve, reject) => {
		if (refreshToken) {
			fetch(appAuthUrl, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: `grant_type=refresh_token&client_id=${appClientId}&refresh_token=${refreshToken}`,
			})
				.then((response) => {
					response
						.json()
						.then((res) => {
							loginWithAwsCognitoIdentityPoolSemDispatch(
								appConfig,
								res.id_token,
								res.access_token,
							)
								.then((stateUpdate) => {
									resolve(stateUpdate);
								})
								.catch((err) => {
									console.error(
										appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
										err,
									);
									reject(err);
								});
						})
						.catch((err) => {
							console.error(
								appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
								err,
							);
							reject(err);
						});
				})
				.catch((err) => {
					console.error(appMessages.LOG_COULD_NOT_GET_REFRESHED_TOKENS, err);
					reject(err);
				});
		} else {
			console.warn(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE);
			reject(Error(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE));
		}
	});
};

const loginWithAuthorizationCodeSemDispatch = (
	appConfig: AppConfig,
	authorizationCode: string,
): Promise<LoginState> => {
	const { appAuthUrl, appClientId, appAuthRedirect, appMessages } = appConfig;
	return new Promise((resolve, reject) => {
		fetch(appAuthUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `grant_type=authorization_code&client_id=${appClientId}&code=${authorizationCode}&redirect_uri=${appAuthRedirect}`,
		})
			.then((response) => {
				response
					.json()
					.then((res) => {
						refreshIdAndAccessTokensSemDispatch(appConfig, res.refresh_token)
							.then((stateUpdate) => {
								resolve({
									...stateUpdate,
									refreshToken: res.refresh_token,
								});
							})
							.catch((err) => {
								console.error(
									appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
									err,
								);
								reject(err);
							});
					})
					.catch((err) => {
						console.error(
							appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
							err,
						);
						reject(err);
					});
			})
			.catch((err) => {
				console.error(appMessages.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, err);
				reject(err);
			});
	});
};

const logoff = (setUserState, appConfig): Promise<void> =>
	new Promise((resolve, _reject) => {
		updateRefreshTokenInSessionStorage(
			undefined,
			appConfig.appRefreshTokenStorageKey,
		);
		setUserState(stateUpdateFromFailedLogin);
		resolve();
	});

const setAppConfig = (setUserState, appConfig) => {
	const refreshToken = getRefreshTokenFromSessionStorage(
		appConfig.appRefreshTokenStorageKey,
	);
	if (refreshToken) {
		refreshIdAndAccessTokens(setUserState, appConfig, refreshToken);
	}
};

const loginWithAwsCognitoIdentityPool = (
	setUserState,
	appConfig,
	idToken: string,
	accessToken: string,
): void => {
	loginWithAwsCognitoIdentityPoolSemDispatch(appConfig, idToken, accessToken)
		.then((stateUpdate) => {
			setUserState((oldState: LoginState) => ({ ...oldState, stateUpdate }));
		})
		.catch(() => {
			setUserState(stateUpdateFromFailedLogin);
		});
};

const refreshIdAndAccessTokens = (
	setUserState,
	appConfig: AppConfig,
	refreshToken: string,
): Promise<void> =>
	new Promise((resolve, reject) => {
		refreshIdAndAccessTokensSemDispatch(appConfig, refreshToken)
			.then((stateUpdate) => {
				setUserState((oldState: LoginState) => ({ ...oldState, stateUpdate }));
				resolve();
			})
			.catch((err) => {
				setUserState(stateUpdateFromFailedLogin);
				reject(err);
			});
	});

const loginWithAuthorizationCode = (
	setUserState,
	appConfig: AppConfig,
	authorizationCode: string,
): Promise<void> =>
	new Promise((resolve, reject) => {
		loginWithAuthorizationCodeSemDispatch(appConfig, authorizationCode)
			.then((stateUpdate) => {
				const { refreshToken } = stateUpdate;
				updateRefreshTokenInSessionStorage(
					refreshToken,
					appConfig.appRefreshTokenStorageKey,
				);
				setUserState(stateUpdate);
				resolve();
			})
			.catch((err) => {
				const refreshToken = undefined;
				updateRefreshTokenInSessionStorage(
					refreshToken,
					appConfig.appRefreshTokenStorageKey,
				);
				setUserState(stateUpdateFromFailedLogin);
				reject(err);
			});
	});

export {
	logoff,
	setAppConfig,
	loginWithAwsCognitoIdentityPool,
	refreshIdAndAccessTokens,
	loginWithAuthorizationCode,
	initialUserState,
};
