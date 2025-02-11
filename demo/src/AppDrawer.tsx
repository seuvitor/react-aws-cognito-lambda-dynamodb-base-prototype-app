import React from "react";
import { NavLink } from "react-router-dom";

import { useAppDrawerState } from "../../src";

const AppDrawer = ({ routes, drawerOpen, setDrawerOpen }) => {
	const { appLogoUrl, menuRoutes } = useAppDrawerState(routes);

	const handleClose = () => setDrawerOpen(false);

	return !drawerOpen ? null : (
		<nav>
			<img
				src={appLogoUrl}
				width="50px"
				height="50px"
				aria-label="Application Logo"
			/>
			<ul>
				{menuRoutes.map((route) => (
					<li
						key={`${route.name}-route-drawer-item`}
						onClick={handleClose}
						onKeyUp={handleClose}
					>
						<NavLink to={route.path}>{route.label}</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default AppDrawer;
