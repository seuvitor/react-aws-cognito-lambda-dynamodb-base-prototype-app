import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

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

import useUser from "./UserContext";

type DDBContextValue = {
	documentDB?: DynamoDBDocumentClient;
};

const DDBContext = createContext<DDBContextValue>({
	documentDB: undefined,
});

const DDBProvider = ({ children }) => {
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

const useDDB = () => {
	const { documentDB } = useContext(DDBContext);

	const ddbGet = useCallback(
		(params: GetCommandInput) =>
			documentDB
				? documentDB.send(new GetCommand(params))
				: Promise.reject<GetCommandOutput>(),
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

	return {
		documentDB,
		ddbGet,
		ddbPut,
		ddbUpdate,
	};
};

export default useDDB;
export { DDBProvider };
