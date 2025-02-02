import React from "react";

import { AppConfigProvider } from "./AppConfigContext";
import { DDBProvider } from "./DDBContext";
import { LambdaProvider } from "./LambdaContext";
import { MessageProvider } from "./MessageContext";
import { SpinnerProvider } from "./SpinnerContext";
import { UserProvider } from "./UserContext";

const InfrastructureProvider = ({ appConfig, children }) => (
	<MessageProvider>
		<SpinnerProvider>
			<AppConfigProvider appConfig={appConfig}>
				<UserProvider>
					<DDBProvider>
						<LambdaProvider>{children}</LambdaProvider>
					</DDBProvider>
				</UserProvider>
			</AppConfigProvider>
		</SpinnerProvider>
	</MessageProvider>
);

export default InfrastructureProvider;
