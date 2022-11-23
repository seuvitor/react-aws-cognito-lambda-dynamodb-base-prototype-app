import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';
import useSpinner from './SpinnerContext';

const AuthRedirect = () => {
  const { appConfig: { appMessages } } = useAppConfig();
  const { showMessage } = useMessage();
  const { loginWithAuthorizationCode } = useUser();
  const { authorization_code: authorizationCode } = useParams();
  const { showSpinner, dismissSpinner } = useSpinner();
  const navigate = useNavigate();

  useEffect(
    () => {
      showSpinner();
      loginWithAuthorizationCode(authorizationCode).then(() => {
        showMessage(appMessages.LOGIN_SUCCESSFUL);
        navigate('/', { replace: true });
      }).catch(() => {
        showMessage(appMessages.LOGIN_FAILED);
      }).finally(() => {
        dismissSpinner();
      });
    },
    [
      authorizationCode,
      loginWithAuthorizationCode,
      showMessage,
      navigate,
      appMessages,
      showSpinner,
      dismissSpinner
    ]
  );

  return null;
};

export default AuthRedirect;
