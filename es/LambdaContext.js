import React from 'react';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import useUser from './UserContext';
var e = React.createElement;
var LambdaContext = React.createContext();

var LambdaProvider = function LambdaProvider(_ref) {
  var children = _ref.children;

  var _useUser = useUser(),
      accessToken = _useUser.user.accessToken,
      awsConfig = _useUser.awsConfig,
      awsCredentials = _useUser.awsCredentials;

  var _React$useState = React.useState(),
      lambda = _React$useState[0],
      setLambda = _React$useState[1];

  React.useEffect(function () {
    if (awsConfig) {
      setLambda(new LambdaClient(awsConfig));
    } else {
      setLambda(undefined);
    }
  }, [awsConfig]);
  React.useEffect(function () {
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
  var invokeLambda = React.useCallback(function (functionName, payload) {
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

    var command = new InvokeCommand(params);
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
  return e(LambdaContext.Provider, {
    value: {
      invokeLambda: lambda && invokeLambda
    }
  }, children);
};

var useLambda = function useLambda() {
  var _React$useContext = React.useContext(LambdaContext),
      invokeLambda = _React$useContext.invokeLambda;

  return {
    invokeLambda: invokeLambda
  };
};

export default useLambda;
export { LambdaProvider };