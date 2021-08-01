import React from 'react';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import UserContext from './UserContext';

const e = React.createElement;

const DDBContext = React.createContext();

const DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = React.useContext(UserContext);
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

export default DDBContext;
export { DDBProvider };
