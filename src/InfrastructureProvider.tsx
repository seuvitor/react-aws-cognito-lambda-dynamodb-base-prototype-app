import type { PropsWithChildren } from "react";

import { AppConfigProvider } from "./AppConfigContext";
import { DDBProvider } from "./DDBContext";
import { LambdaProvider } from "./LambdaContext";
import { MessageProvider } from "./MessageContext";
import { SpinnerProvider } from "./SpinnerContext";
import { UserProvider } from "./UserContext";
import type { AppConfig } from "./core/makeAppConfig";

type InfrastructureProviderProps = PropsWithChildren<{
	appConfig: AppConfig;
}>;

const InfrastructureProvider = ({
	appConfig,
	children,
}: InfrastructureProviderProps) => (
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
