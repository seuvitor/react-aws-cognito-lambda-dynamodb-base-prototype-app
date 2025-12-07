import type { CognitoIdentityCredentialProvider } from "@aws-sdk/credential-provider-cognito-identity";
import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import useAppConfig from "./AppConfigContext";
import type { LoginState } from "./core/authentication";
import {
	loginWithAuthorizationCode as _loginWithAuthorizationCode,
	loginWithAwsCognitoIdentityPool as _loginWithAwsCognitoIdentityPool,
	logoff as _logoff,
	refreshIdAndAccessTokens as _refreshIdAndAccessTokens,
	setAppConfig as _setAppConfig,
	initialUserState,
} from "./core/authentication";

type UserContextValue = {
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

	loginAnonymously: () => void;
	loginWithAuthorizationCode: (authorizationCode: string) => Promise<void>;
	logoff: () => Promise<void>;
};

const initialUserContextValue = {
	user: initialUserState.user,
	awsConfig: initialUserState.awsConfig,
	awsCredentials: initialUserState.awsCredentials,
	loginAnonymously: () => {},
	loginWithAuthorizationCode: () => Promise.reject(),
	logoff: () => Promise.reject(),
};

const UserContext = createContext<UserContextValue>(initialUserContextValue);

const useSetInterval = (callback: () => void, seconds: number) => {
	useEffect(() => {
		const intervalHandle = setInterval(callback, seconds);
		return () => clearInterval(intervalHandle);
	}, [callback, seconds]);
};

const REFRESH_TOKEN_INTERVAL = 25 * 60000;

const UserProvider = ({ children }: PropsWithChildren) => {
	const { appConfig } = useAppConfig();
	const { appMessages } = appConfig;

	const [userState, setUserState] = useState<LoginState>(initialUserState);

	useEffect(() => {
		_setAppConfig(setUserState, appConfig);
	}, [appConfig]);

	const logoff = useCallback(
		() => _logoff(setUserState, appConfig),
		[appConfig],
	);

	const loginWithAwsCognitoIdentityPool = useCallback(
		(idToken: string | undefined, accessToken: string | undefined) =>
			_loginWithAwsCognitoIdentityPool(
				setUserState,
				appConfig,
				idToken,
				accessToken,
			),
		[appConfig],
	);

	const refreshIdAndAccessTokens = useCallback(
		() =>
			_refreshIdAndAccessTokens(
				setUserState,
				appConfig,
				userState.refreshToken,
			),
		[appConfig, userState.refreshToken],
	);

	const scheduledRefreshIdAndAccessTokens = useCallback(() => {
		refreshIdAndAccessTokens().catch(() => {
			console.warn(appMessages.LOG_COULD_NOT_REFRESH_TOKENS);
		});
	}, [refreshIdAndAccessTokens, appMessages]);

	useSetInterval(scheduledRefreshIdAndAccessTokens, REFRESH_TOKEN_INTERVAL);

	const loginAnonymously = useCallback(
		() => loginWithAwsCognitoIdentityPool(undefined, undefined),
		[loginWithAwsCognitoIdentityPool],
	);

	const loginWithAuthorizationCode = useCallback(
		(authorizationCode: string) =>
			_loginWithAuthorizationCode(setUserState, appConfig, authorizationCode),
		[appConfig],
	);

	useEffect(() => {
		if (!userState.awsCredentials) {
			refreshIdAndAccessTokens().catch(() => {
				console.warn(appMessages.LOG_COULD_NOT_REFRESH_TOKENS);
			});
		}
	}, [userState.awsCredentials, refreshIdAndAccessTokens, appMessages]);

	return (
		<UserContext.Provider
			value={{
				user: userState.user,
				awsConfig: userState.awsConfig,
				awsCredentials: userState.awsCredentials,
				loginAnonymously,
				loginWithAuthorizationCode,
				logoff,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

const useUser = () => {
	const {
		user,
		awsConfig,
		awsCredentials,
		loginAnonymously,
		loginWithAuthorizationCode,
		logoff,
	} = useContext(UserContext);

	return {
		user,
		awsConfig,
		awsCredentials,
		loginAnonymously,
		loginWithAuthorizationCode,
		logoff,
	};
};

export default useUser;
export { UserProvider };
