import type { AppRoute } from "../../src";
import { useAppBarState } from "../../src";

type AppBarProps = {
	drawerOpen: boolean;
	setDrawerOpen: (open: boolean) => void;
	routes: AppRoute[];
};

const AppBar = ({ drawerOpen, setDrawerOpen, routes }: AppBarProps) => {
	const {
		currentRouteLabel,
		hideLoginButton,
		appExternalLoginUrl,
		hideAccountButton,
		userName,
		logoffAndShowMessage,
	} = useAppBarState(routes);

	return (
		<header>
			<nav>
				<ul>
					{hideAccountButton ? null : (
						<li>
							User name: {userName}{" "}
							<button type="button" onClick={() => logoffAndShowMessage()}>
								Logoff
							</button>
						</li>
					)}
					<li>Current page: {currentRouteLabel}</li>
					{hideLoginButton ? null : (
						<li>
							<a href={appExternalLoginUrl}>Login</a>
						</li>
					)}
					<li>
						{drawerOpen ? (
							<button type="button" onClick={() => setDrawerOpen(false)}>
								Hide menu
							</button>
						) : (
							<button type="button" onClick={() => setDrawerOpen(true)}>
								Show menu
							</button>
						)}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default AppBar;
