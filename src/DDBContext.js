import React, { useCallback } from 'react';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';

import useUser from './UserContext';

const e = React.createElement;

const DDBContext = React.createContext();

const DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = useUser();
  const [documentDB, setDocumentDB] = React.useState();

  React.useEffect(() => {
    if (awsConfig) {
      const ddbClient = new DynamoDBClient(awsConfig);
      setDocumentDB(new DynamoDBDocumentClient(ddbClient));
    } else {
      setDocumentDB(undefined);
    }
  }, [awsConfig]);

  React.useEffect(() => {
    if (awsCredentials) {
      setDocumentDB((oldDocumentDB) => {
        if (oldDocumentDB) {
          oldDocumentDB.service.config.update({ credentials: awsCredentials });
        }
        return oldDocumentDB;
      });
    }
  }, [awsCredentials]);

  return e(DDBContext.Provider, { value: { documentDB } }, children);
};

const useDDB = () => {
  const { documentDB } = React.useContext(DDBContext);

  const ddbGet = useCallback(
    (params) => documentDB.send(new GetCommand(params)),
    [documentDB]
  );

  const ddbPut = useCallback(
    (params) => documentDB.send(new PutCommand(params)),
    [documentDB]
  );

  const ddbUpdate = useCallback(
    (params) => documentDB.send(new UpdateCommand(params)),
    [documentDB]
  );

  return {
    documentDB,
    ddbGet: documentDB && ddbGet,
    ddbPut: documentDB && ddbPut,
    ddbUpdate: documentDB && ddbUpdate
  };
};

export default useDDB;
export { DDBProvider };
