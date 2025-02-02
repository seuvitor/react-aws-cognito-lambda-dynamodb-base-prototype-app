import React from "react";

import { useAppBarState } from "../../src";

const AppBar = ({ drawerOpen, setDrawerOpen, routes }) => {
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
