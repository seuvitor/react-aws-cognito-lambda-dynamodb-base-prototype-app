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
	PutCommandOutput,
	UpdateCommandInput,
	UpdateCommandOutput,
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

type DDBGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
	Item?: T;
};

type UseDDBReturnType<T> = {
	documentDB: DynamoDBDocumentClient | undefined;
	ddbGet?: (params: GetCommandInput) => Promise<DDBGetCommandOutput<T>>;
	ddbPut?: (params: PutCommandInput) => Promise<PutCommandOutput>;
	ddbUpdate?: (params: UpdateCommandInput) => Promise<UpdateCommandOutput>;
};

const useDDB = <T,>(): UseDDBReturnType<T> => {
	const { documentDB } = useContext(DDBContext);

	const ddbGet = useCallback(
		(params: GetCommandInput) =>
			documentDB
				? documentDB
						.send(new GetCommand(params))
						.then((output) => output as DDBGetCommandOutput<T>)
				: Promise.reject<DDBGetCommandOutput<T>>(),
		[documentDB],
	);

	const ddbPut = useCallback(
		(params: PutCommandInput) =>
			documentDB
				? documentDB.send(new PutCommand(params))
				: Promise.reject<PutCommandOutput>(),
		[documentDB],
	);

	const ddbUpdate = useCallback(
		(params: UpdateCommandInput) =>
			documentDB
				? documentDB.send(new UpdateCommand(params))
				: Promise.reject<UpdateCommandOutput>(),
		[documentDB],
	);

	if (!documentDB) {
		return {
			documentDB: undefined,
			ddbGet: undefined,
			ddbPut: undefined,
			ddbUpdate: undefined,
		};
	}

	return {
		documentDB,
		ddbGet,
		ddbPut,
		ddbUpdate,
	};
};

export default useDDB;
export { DDBProvider };
