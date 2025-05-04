import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
	GetCommandInput,
	GetCommandOutput,
	PutCommandInput,
	UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { PropsWithChildren } from "react";
import useUser from "./UserContext";

type DDBContextValue = {
	documentDB?: DynamoDBDocumentClient;
};

const DDBContext = createContext<DDBContextValue>({
	documentDB: undefined,
});

const DDBProvider = ({ children }: PropsWithChildren) => {
	const { awsConfig, awsCredentials } = useUser();
	const [documentDB, setDocumentDB] = useState<DynamoDBDocumentClient>();

	useEffect(() => {
		if (awsConfig) {
			const ddbClient = new DynamoDBClient(awsConfig);
			setDocumentDB(DynamoDBDocumentClient.from(ddbClient));
		} else {
			setDocumentDB(undefined);
		}
	}, [awsConfig]);

	useEffect(() => {
		if (awsCredentials) {
			setDocumentDB((oldDocumentDB) => {
				if (oldDocumentDB) {
					oldDocumentDB.config.credentials = awsCredentials;
				}
				return oldDocumentDB;
			});
		}
	}, [awsCredentials]);

	return (
		<DDBContext.Provider value={{ documentDB }}>{children}</DDBContext.Provider>
	);
};

const useDDB = <T,>() => {
	const { documentDB } = useContext(DDBContext);

	if (!documentDB) {
		return {
			documentDB: undefined,
			ddbGet: undefined,
			ddbPut: undefined,
			ddbUpdate: undefined,
		};
	}

	const ddbGet = useCallback(
		(
			params: GetCommandInput,
		): Promise<Omit<GetCommandOutput, "Item"> & { Item?: T }> =>
			documentDB
				.send(new GetCommand(params))
				.then(
					(output) => output as Omit<GetCommandOutput, "Item"> & { Item?: T },
				),
		[documentDB],
	);

	const ddbPut = useCallback(
		(params: PutCommandInput) => documentDB.send(new PutCommand(params)),
		[documentDB],
	);

	const ddbUpdate = useCallback(
		(params: UpdateCommandInput) => documentDB.send(new UpdateCommand(params)),
		[documentDB],
	);

	return {
		documentDB,
		ddbGet,
		ddbPut,
		ddbUpdate,
	};
};

export default useDDB;
export { DDBProvider };
