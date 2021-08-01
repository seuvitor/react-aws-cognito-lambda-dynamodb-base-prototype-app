import React from 'react';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import UserContext from './UserContext';
var e = React.createElement;
var DDBContext = React.createContext();

var DDBProvider = function DDBProvider(_ref) {
  var children = _ref.children;

  var _React$useContext = React.useContext(UserContext),
      awsConfig = _React$useContext.awsConfig,
      awsCredentials = _React$useContext.awsCredentials;

  var _React$useState = React.useState(),
      documentDB = _React$useState[0],
      setDocumentDB = _React$useState[1];

  React.useEffect(function () {
    if (awsConfig) {
      var ddbClient = new DynamoDBClient(awsConfig);
      setDocumentDB(new DynamoDBDocumentClient(ddbClient));
    } else {
      setDocumentDB(undefined);
    }
  }, [awsConfig]);
  React.useEffect(function () {
    if (awsCredentials) {
      setDocumentDB(function (oldDocumentDB) {
        if (oldDocumentDB) {
          oldDocumentDB.service.config.update({
            credentials: awsCredentials
          });
        }

        return oldDocumentDB;
      });
    }
  }, [awsCredentials]);
  return e(DDBContext.Provider, {
    value: {
      documentDB: documentDB
    }
  }, children);
};

export default DDBContext;
export { DDBProvider };