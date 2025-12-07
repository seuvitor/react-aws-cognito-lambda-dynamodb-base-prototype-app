import type { InvokeCommandInput } from "@aws-sdk/client-lambda";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import type { PropsWithChildren } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import useUser from "./UserContext";

type LambdaContextValue = {
	invokeLambda?: (functionName: string, payload: object) => Promise<object>;
};

const LambdaContext = createContext<LambdaContextValue>({
	invokeLambda: undefined,
});

const LambdaProvider = ({ children }: PropsWithChildren) => {
	const {
		user: { accessToken },
		awsConfig,
		awsCredentials,
	} = useUser();
	const [lambda, setLambda] = useState<LambdaClient>();

	useEffect(() => {
		if (awsConfig) {
			setLambda(new LambdaClient(awsConfig));
		} else {
			setLambda(undefined);
		}
	}, [awsConfig]);

	useEffect(() => {
		if (awsCredentials) {
			setLambda((oldLambda) => {
				if (oldLambda) {
					oldLambda.config.credentials = awsCredentials;
				}
				return oldLambda;
			});
		}
	}, [awsCredentials]);

	const invokeLambda = useCallback(
		(functionName: string, payload: object) => {
			if (lambda) {
				const encoder = new TextEncoder();
				const decoder = new TextDecoder();
				const params: InvokeCommandInput = {
					FunctionName: functionName,
					ClientContext: btoa(JSON.stringify({ custom: { accessToken } })),
					Payload: payload
						? encoder.encode(JSON.stringify(payload))
						: undefined,
				};
				const command = new InvokeCommand(params);
				return new Promise<object>((resolve, reject) => {
					lambda
						.send(command)
						.then((data) => {
							if (
								!data.StatusCode ||
								data.StatusCode !== 200 ||
								!data.Payload
							) {
								reject(data);
							}
							const responsePayload = JSON.parse(decoder.decode(data.Payload));
							if (
								!responsePayload ||
								!responsePayload.statusCode ||
								responsePayload.statusCode !== 200
							) {
								reject(data);
							}
							resolve(responsePayload.body);
						})
						.catch((err) => {
							reject(err);
						});
				});
			}
			return Promise.reject("Lambda client is undefined");
		},
		[lambda, accessToken],
	);

	return (
		<LambdaContext.Provider
			value={{ invokeLambda: lambda ? invokeLambda : undefined }}
		>
			{children}
		</LambdaContext.Provider>
	);
};

const useLambda = () => {
	const { invokeLambda } = useContext(LambdaContext);

	return { invokeLambda };
};

export default useLambda;
export { LambdaProvider };
