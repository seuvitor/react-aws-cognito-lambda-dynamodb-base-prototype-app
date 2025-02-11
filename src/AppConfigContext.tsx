import React, { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";
import type { AppConfig } from "./core/makeAppConfig";

type AppConfigContextValue =
	| {
			appConfig: AppConfig;
	  }
	| undefined;

const AppConfigContext = createContext<AppConfigContextValue>(undefined);

type AppConfigProviderProps = PropsWithChildren<{
	appConfig: AppConfig;
}>;

const AppConfigProvider = ({ appConfig, children }: AppConfigProviderProps) => (
	<AppConfigContext.Provider value={{ appConfig }}>
		{children}
	</AppConfigContext.Provider>
);

const useAppConfig = () => {
	const ctx = useContext(AppConfigContext);

	if (ctx === undefined) {
		throw new Error(
			"useAppConfig can only be used in the scope of a AppConfigProvider",
		);
	}

	const { appConfig } = ctx;
	return { appConfig };
};

export default useAppConfig;
export { AppConfigProvider };
