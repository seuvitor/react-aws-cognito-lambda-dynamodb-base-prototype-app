"use strict";

exports.__esModule = true;
exports.DDBProvider = exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

var _libDynamodb = require("@aws-sdk/lib-dynamodb");

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var e = _react["default"].createElement;

var DDBContext = _react["default"].createContext();

var DDBProvider = function DDBProvider(_ref) {
  var children = _ref.children;

  var _useUser = (0, _UserContext["default"])(),
      awsConfig = _useUser.awsConfig,
      awsCredentials = _useUser.awsCredentials;

  var _React$useState = _react["default"].useState(),
      documentDB = _React$useState[0],
      setDocumentDB = _React$useState[1];

  _react["default"].useEffect(function () {
    if (awsConfig) {
      var ddbClient = new _clientDynamodb.DynamoDBClient(awsConfig);
      setDocumentDB(new _libDynamodb.DynamoDBDocumentClient(ddbClient));
    } else {
      setDocumentDB(undefined);
    }
  }, [awsConfig]);

  _react["default"].useEffect(function () {
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

exports.DDBProvider = DDBProvider;

var useDDB = function useDDB() {
  var _React$useContext = _react["default"].useContext(DDBContext),
      documentDB = _React$useContext.documentDB;

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