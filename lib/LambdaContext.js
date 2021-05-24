"use strict";

exports.__esModule = true;
exports.LambdaProvider = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;

var LambdaContext = _react["default"].createContext();

var LambdaProvider = function LambdaProvider(_ref) {
  var children = _ref.children;

  var _React$useContext = _react["default"].useContext(_UserContext["default"]),
      accessToken = _React$useContext.user.accessToken,
      awsConfig = _React$useContext.awsConfig,
      awsCredentials = _React$useContext.awsCredentials;

  var _React$useState = _react["default"].useState(),
      lambda = _React$useState[0],
      setLambda = _React$useState[1];

  _react["default"].useEffect(function () {
    if (awsConfig) {
      setLambda(new _awsSdk["default"].Lambda(awsConfig));
    } else {
      setLambda(undefined);
    }
  }, [awsConfig]);

  _react["default"].useEffect(function () {
    if (awsCredentials) {
      setLambda(function (oldLambda) {
        if (oldLambda) {
          oldLambda.config.update({
            credentials: awsCredentials
          });
        }

        return oldLambda;
      });
    }
  }, [awsCredentials]);

  var invokeLambda = _react["default"].useCallback(function (functionName, payload) {
    var params = {
      FunctionName: functionName,
      ClientContext: btoa(JSON.stringify({
        custom: {
          accessToken: accessToken
        }
      }))
    };

    if (payload) {
      params.Payload = JSON.stringify(payload);
    }

    return new Promise(function (resolve, reject) {
      lambda.invoke(params).promise().then(function (data) {
        if (!data.StatusCode || data.StatusCode !== 200 || !data.Payload) {
          reject(data);
        }

        var responsePayload = JSON.parse(data.Payload);

        if (!responsePayload || !responsePayload.statusCode || responsePayload.statusCode !== 200) {
          reject(data);
        }

        resolve(responsePayload.body);
      })["catch"](function (err) {
        reject(err);
      });
    });
  }, [lambda, accessToken]);

  return e(LambdaContext.Provider, {
    value: {
      invokeLambda: lambda && invokeLambda
    }
  }, children);
};

exports.LambdaProvider = LambdaProvider;
var _default = LambdaContext;
exports["default"] = _default;