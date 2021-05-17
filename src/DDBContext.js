import React from 'react';
import AWS from 'aws-sdk';

import UserContext from './UserContext';

const e = React.createElement;

const DDBContext = React.createContext();

const DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = React.useContext(UserContext);
  const [documentDB, setDocumentDB] = React.useState();

  React.useEffect(() => {
    if (awsConfig) {
      setDocumentDB(new AWS.DynamoDB.DocumentClient(awsConfig));
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
