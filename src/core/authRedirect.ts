import type { AppMessages } from "./makeAppConfig";

const authRedirect = (
	appBasePath: string | undefined,
	showSpinner: () => void,
	dismissSpinner: () => void,
	loginWithAuthorizationCode: (authorizationCode: string) => Promise<void>,
	showMessage: (message: string) => void,
	appMessages: AppMessages | undefined,
) => {
	if (window.location.pathname === appBasePath) {
		const search = new URLSearchParams(window.location.search);
		if (search.get("auth-redirect") !== null && search.get("code") !== null) {
			window.history.replaceState({}, "", window.location.pathname);
			const authorizationCode = search.get("code");

			if (authorizationCode) {
				showSpinner();
				loginWithAuthorizationCode(authorizationCode)
					.then(() => {
						if (appMessages) {
							showMessage(appMessages.LOGIN_SUCCESSFUL);
						}
					})
					.catch(() => {
						if (appMessages) {
							showMessage(appMessages.LOGIN_FAILED);
						}
					})
					.finally(() => {
						dismissSpinner();
					});
			}
		}
	}
};

export default authRedirect;
