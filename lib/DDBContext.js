"use strict";

exports.__esModule = true;
exports.DDBProvider = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;

var DDBContext = _react["default"].createContext();

var DDBProvider = function DDBProvider(_ref) {
  var children = _ref.children;

  var _React$useContext = _react["default"].useContext(_UserContext["default"]),
      awsConfig = _React$useContext.awsConfig,
      awsCredentials = _React$useContext.awsCredentials;

  var _React$useState = _react["default"].useState(),
      documentDB = _React$useState[0],
      setDocumentDB = _React$useState[1];

  _react["default"].useEffect(function () {
    if (awsConfig) {
      setDocumentDB(new _awsSdk["default"].DynamoDB.DocumentClient(awsConfig));
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
var _default = DDBContext;
exports["default"] = _default;