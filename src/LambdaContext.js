import {
  createContext,
  createElement as e,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

import useUser from './UserContext';

const LambdaContext = createContext();

const LambdaProvider = ({ children }) => {
  const { user: { accessToken }, awsConfig, awsCredentials } = useUser();
  const [lambda, setLambda] = useState();

  useEffect(() => {
    if (awsConfig) {
      setLambda(new LambdaClient(awsConfig));
    } else {
      setLambda(undefined);
    }
  }, [awsConfig]);

  useEffect(() => {
    if (awsCredentials) {
      setLambda((oldLambda) => {
        if (oldLambda) {
          oldLambda.config.update({ credentials: awsCredentials });
        }
        return oldLambda;
      });
    }
  }, [awsCredentials]);

  const invokeLambda = useCallback((functionName, payload) => {
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

const useLambda = () => {
  const { invokeLambda } = useContext(LambdaContext);

  return { invokeLambda };
};

export default useLambda;
export { LambdaProvider };
