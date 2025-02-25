import type { JSX, PropsWithChildren } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import InfrastructureProvider from "./InfrastructureProvider";
import type { AppConfig } from "./core/makeAppConfig";
import useAuthRedirect from "./useAuthRedirect";

const RedirectAuthCode = () => {
	useAuthRedirect();
	return null;
};

type AppRoute = {
	name: string;
	label: string;
	path: string;
	hideFromMenu: boolean;
	component: () => JSX.Element;
	authorizedGroups?: string[];
};

type BaseAppScopeProps = PropsWithChildren<{
	appConfig: AppConfig;
	routes: AppRoute[];
}>;

const BaseAppScope = ({ appConfig, routes, children }: BaseAppScopeProps) => (
	<InfrastructureProvider appConfig={appConfig}>
		<RedirectAuthCode />
		<HashRouter>
			{children}
			<Routes>
				{routes.map((route) => (
					<Route
						key={`${route.name}-route`}
						path={route.path}
						element={<route.component />}
					/>
				))}
			</Routes>
		</HashRouter>
	</InfrastructureProvider>
);

export default BaseAppScope;

export type { AppRoute };
