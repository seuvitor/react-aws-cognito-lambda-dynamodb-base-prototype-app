"use strict";

exports.__esModule = true;
exports.DDBProvider = exports["default"] = void 0;

var _react = require("react");

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

var _libDynamodb = require("@aws-sdk/lib-dynamodb");

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DDBContext = (0, _react.createContext)();

var DDBProvider = function DDBProvider(_ref) {
  var children = _ref.children;

  var _useUser = (0, _UserContext["default"])(),
      awsConfig = _useUser.awsConfig,
      awsCredentials = _useUser.awsCredentials;

  var _useState = (0, _react.useState)(),
      documentDB = _useState[0],
      setDocumentDB = _useState[1];

  (0, _react.useEffect)(function () {
    if (awsConfig) {
      var ddbClient = new _clientDynamodb.DynamoDBClient(awsConfig);
      setDocumentDB(new _libDynamodb.DynamoDBDocumentClient(ddbClient));
    } else {
      setDocumentDB(undefined);
    }
  }, [awsConfig]);
  (0, _react.useEffect)(function () {
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
  return (0, _react.createElement)(DDBContext.Provider, {
    value: {
      documentDB: documentDB
    }
  }, children);
};

exports.DDBProvider = DDBProvider;

var useDDB = function useDDB() {
  var _useContext = (0, _react.useContext)(DDBContext),
      documentDB = _useContext.documentDB;

  var ddbGet = (0, _react.useCallback)(function (params) {
    return documentDB.send(new _libDynamodb.GetCommand(params));
  }, [documentDB]);
  var ddbPut = (0, _react.useCallback)(function (params) {
    return documentDB.send(new _libDynamodb.PutCommand(params));
  }, [documentDB]);
  var ddbUpdate = (0, _react.useCallback)(function (params) {
    return documentDB.send(new _libDynamodb.UpdateCommand(params));
  }, [documentDB]);
  return {
    documentDB: documentDB,
    ddbGet: documentDB && ddbGet,
    ddbPut: documentDB && ddbPut,
    ddbUpdate: documentDB && ddbUpdate
  };
};

var _default = useDDB;
exports["default"] = _default;