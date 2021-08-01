import React, { useCallback } from 'react';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import useUser from './UserContext';
var e = React.createElement;
var DDBContext = React.createContext();

var DDBProvider = function DDBProvider(_ref) {
  var children = _ref.children;

  var _useUser = useUser(),
      awsConfig = _useUser.awsConfig,
      awsCredentials = _useUser.awsCredentials;

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

var useDDB = function useDDB() {
  var _React$useContext = React.useContext(DDBContext),
      documentDB = _React$useContext.documentDB;

  var ddbGet = useCallback(function (params) {
    return documentDB.send(new GetCommand(params));
  }, [documentDB]);
  var ddbPut = useCallback(function (params) {
    return documentDB.send(new PutCommand(params));
  }, [documentDB]);
  var ddbUpdate = useCallback(function (params) {
    return documentDB.send(new UpdateCommand(params));
  }, [documentDB]);
  return {
    documentDB: documentDB,
    ddbGet: documentDB && ddbGet,
    ddbPut: documentDB && ddbPut,
    ddbUpdate: documentDB && ddbUpdate
  };
};

export default useDDB;
export { DDBProvider };