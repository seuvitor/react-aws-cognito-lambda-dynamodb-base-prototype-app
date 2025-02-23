import { useLocation } from "react-router-dom";

import useAppConfig from "./AppConfigContext";
import type { AppRoute } from "./BaseAppScope";
import useMessage from "./MessageContext";
import useUser from "./UserContext";

const useAppBarState = (routes: AppRoute[]) => {
	const {
		appConfig: { appMessages, hideLogin, appExternalLoginUrl },
	} = useAppConfig();
	const { showMessage } = useMessage();
	const {
		user: { name: userName },
		logoff,
	} = useUser();

	const location = useLocation();

	const logoffAndShowMessage = () => {
		logoff()
			.then(() => showMessage(appMessages.LOGOUT_SUCCESSFUL))
			.catch(() => showMessage(appMessages.LOGOUT_FAILED));
	};

	const currentRoute = routes.find((route) => route.path === location.pathname);
	const currentRouteLabel = currentRoute ? currentRoute.label : "";

	const hideLoginButton = !!userName || hideLogin;
	const hideAccountButton = !userName || hideLogin;

	return {
		currentRouteLabel,
		hideLoginButton,
		appExternalLoginUrl,
		hideAccountButton,
		userName,
		logoffAndShowMessage,
	};
};

export default useAppBarState;
