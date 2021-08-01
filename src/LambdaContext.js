import React from 'react';

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

import UserContext from './UserContext';

const e = React.createElement;

const LambdaContext = React.createContext();

const LambdaProvider = ({ children }) => {
  const { user: { accessToken }, awsConfig, awsCredentials } = React.useContext(UserContext);
  const [lambda, setLambda] = React.useState();

  React.useEffect(() => {
    if (awsConfig) {
      setLambda(new LambdaClient(awsConfig));
    } else {
      setLambda(undefined);
    }
  }, [awsConfig]);

  React.useEffect(() => {
    if (awsCredentials) {
      setLambda((oldLambda) => {
        if (oldLambda) {
          oldLambda.config.update({ credentials: awsCredentials });
        }
        return oldLambda;
      });
    }
  }, [awsCredentials]);

  const invokeLambda = React.useCallback((functionName, payload) => {
    const params = {
      FunctionName: functionName,
      ClientContext: btoa(JSON.stringify({ custom: { accessToken } }))
    };
    if (payload) {
      params.Payload = JSON.stringify(payload);
    }
    const command = new InvokeCommand(params);
    return new Promise((resolve, reject) => {
      lambda.send(command).then((data) => {
        if (!data.StatusCode || data.StatusCode !== 200 || !data.Payload) {
          reject(data);
        }
        const responsePayload = JSON.parse(Buffer.from(data.Payload));
        if (!responsePayload || !responsePayload.statusCode || responsePayload.statusCode !== 200) {
          reject(data);
        }
        resolve(responsePayload.body);
      }).catch((err) => {
        reject(err);
      });
    });
  }, [lambda, accessToken]);

  return e(LambdaContext.Provider, { value: { invokeLambda: lambda && invokeLambda } }, children);
};

export default LambdaContext;
export { LambdaProvider };
