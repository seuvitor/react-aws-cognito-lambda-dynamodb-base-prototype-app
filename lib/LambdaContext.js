"use strict";

exports.__esModule = true;
exports.LambdaProvider = exports["default"] = void 0;

var _react = require("react");

var _clientLambda = require("@aws-sdk/client-lambda");

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LambdaContext = (0, _react.createContext)();

var LambdaProvider = function LambdaProvider(_ref) {
  var children = _ref.children;

  var _useUser = (0, _UserContext["default"])(),
      accessToken = _useUser.user.accessToken,
      awsConfig = _useUser.awsConfig,
      awsCredentials = _useUser.awsCredentials;

  var _useState = (0, _react.useState)(),
      lambda = _useState[0],
      setLambda = _useState[1];

  (0, _react.useEffect)(function () {
    if (awsConfig) {
      setLambda(new _clientLambda.LambdaClient(awsConfig));
    } else {
      setLambda(undefined);
    }
  }, [awsConfig]);
  (0, _react.useEffect)(function () {
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
  var invokeLambda = (0, _react.useCallback)(function (functionName, payload) {
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

    var command = new _clientLambda.InvokeCommand(params);
    return new Promise(function (resolve, reject) {
      lambda.send(command).then(function (data) {
        if (!data.StatusCode || data.StatusCode !== 200 || !data.Payload) {
          reject(data);
        }

        var responsePayload = JSON.parse(Buffer.from(data.Payload));

        if (!responsePayload || !responsePayload.statusCode || responsePayload.statusCode !== 200) {
          reject(data);
        }

        resolve(responsePayload.body);
      })["catch"](function (err) {
        reject(err);
      });
    });
  }, [lambda, accessToken]);
  return (0, _react.createElement)(LambdaContext.Provider, {
    value: {
      invokeLambda: lambda && invokeLambda
    }
  }, children);
};

exports.LambdaProvider = LambdaProvider;

var useLambda = function useLambda() {
  var _useContext = (0, _react.useContext)(LambdaContext),
      invokeLambda = _useContext.invokeLambda;

  return {
    invokeLambda: invokeLambda
  };
};

var _default = useLambda;
exports["default"] = _default;