import React, { useState } from "react";

import { BaseAppScope } from "../../src";
import type { AppRoute } from "../../src/BaseAppScope";
import type { AppConfig } from "../../src/core/makeAppConfig";
import AppBar from "./AppBar";
import AppDrawer from "./AppDrawer";
import MessageArea from "./MessageArea";
import SpinnerArea from "./SpinnerArea";

type DemoBaseAppProps = {
	appConfig: AppConfig;
	routes: AppRoute[];
};

const DemoBaseApp = ({ appConfig, routes }: DemoBaseAppProps) => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<BaseAppScope appConfig={appConfig} routes={routes}>
			<AppBar
				drawerOpen={drawerOpen}
				setDrawerOpen={setDrawerOpen}
				routes={routes}
			/>
			<AppDrawer
				routes={routes}
				drawerOpen={drawerOpen}
				setDrawerOpen={setDrawerOpen}
			/>
			<MessageArea />
			<SpinnerArea />
		</BaseAppScope>
	);
};

export default DemoBaseApp;
