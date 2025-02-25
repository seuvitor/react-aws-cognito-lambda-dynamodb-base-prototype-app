import { CognitoIdentityCredentialProvider } from '@aws-sdk/credential-provider-cognito-identity';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { JSX } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { PropsWithChildren } from 'react';
import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb';

export declare type AppConfig = {
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

declare type AppMessages = {
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

export declare type AppRoute = {
    name: string;
    label: string;
    path: string;
    hideFromMenu: boolean;
    component: () => JSX.Element;
    authorizedGroups?: string[];
};

export declare const BaseAppScope: ({ appConfig, routes, children }: BaseAppScopeProps) => JSX_2.Element;

declare type BaseAppScopeProps = PropsWithChildren<{
    appConfig: AppConfig;
    routes: AppRoute[];
}>;

export declare const makeAppConfig: ({ appHost, appBasePath, appRegion, appUserPoolId, appUserPoolDomain, appClientId, appIdentityPoolId, appRefreshTokenStorageKey, appLogoUrl, appMessages, hideLogin, }: MakeAppConfigParam) => AppConfig;

declare type MakeAppConfigParam = {
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

export declare const useAppBarState: (routes: AppRoute[]) => {
    currentRouteLabel: string;
    hideLoginButton: boolean;
    appExternalLoginUrl: string;
    hideAccountButton: boolean;
    userName: string | undefined;
    logoffAndShowMessage: () => void;
};

export declare const useAppConfig: () => {
    appConfig: AppConfig;
};

export declare const useAppDrawerState: (routes: AppRoute[]) => {
    appLogoUrl: string;
    menuRoutes: AppRoute[];
};

export declare const useDDB: () => {
    documentDB: DynamoDBDocumentClient | undefined;
    ddbGet: (params: GetCommandInput) => Promise<GetCommandOutput>;
    ddbPut: (params: PutCommandInput) => Promise<PutCommandOutput>;
    ddbUpdate: (params: UpdateCommandInput) => Promise<UpdateCommandOutput>;
};

export declare const useLambda: () => {
    invokeLambda: (functionName: string, payload: object) => Promise<object>;
};

export declare const useMessage: () => {
    showMessage: (message: string) => void;
};

export declare const useMessageAreaState: () => {
    message: string | undefined;
    dismissMessage: () => void;
};

export declare const useSpinner: () => {
    showSpinner: () => void;
    dismissSpinner: () => void;
};

export declare const useSpinnerAreaState: () => {
    showing: boolean;
};

export declare const useUser: () => {
    user: {
        identityId: undefined | string;
        id: undefined | string;
        name: undefined | string;
        email: undefined | string;
        groups: undefined | string[];
        idToken: undefined | string;
        accessToken: undefined | string;
    };
    awsConfig: {
        region: undefined | string;
        credentials: undefined | CognitoIdentityCredentialProvider;
    } | undefined;
    awsCredentials: CognitoIdentityCredentialProvider | undefined;
    loginAnonymously: () => void;
    loginWithAuthorizationCode: (authorizationCode: string) => Promise<void>;
    logoff: () => Promise<void>;
};

export { }
