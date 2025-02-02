import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import InfrastructureProvider from "./InfrastructureProvider";
import useAuthRedirect from "./useAuthRedirect";

const RedirectAuthCode = () => {
	useAuthRedirect();
	return null;
};

const BaseAppScope = ({ appConfig, routes, children }) => (
	<InfrastructureProvider appConfig={appConfig}>
		<RedirectAuthCode />
		<HashRouter>
			{children}
			<Routes>
				{routes.map((route) => (
					<Route
						key={`${route.name}-route`}
						exact={true}
						path={route.path}
						element={<route.component />}
						{...route.options}
					/>
				))}
			</Routes>
		</HashRouter>
	</InfrastructureProvider>
);

export default BaseAppScope;
