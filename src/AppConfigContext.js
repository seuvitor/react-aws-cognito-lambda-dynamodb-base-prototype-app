import React, { createContext, useContext } from "react";

const AppConfigContext = createContext();

const AppConfigProvider = ({ appConfig, children }) => (
	<AppConfigContext.Provider value={{ appConfig }}>
		{children}
	</AppConfigContext.Provider>
);

const useAppConfig = () => {
	const { appConfig } = useContext(AppConfigContext);

	return { appConfig };
};

export default useAppConfig;
export { AppConfigProvider };
