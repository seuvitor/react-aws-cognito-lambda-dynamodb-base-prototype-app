import { useEffect } from 'react';
import authRedirect from './core/authRedirect';
import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useSpinner from './SpinnerContext';
import useUser from './UserContext';

const useAuthRedirect = () => {
  const { appConfig: { appBasePath, appMessages } } = useAppConfig();
  const { showMessage } = useMessage();
  const { showSpinner, dismissSpinner } = useSpinner();
  const { loginWithAuthorizationCode } = useUser();

  useEffect(() => {
    authRedirect(
      appBasePath,
      showSpinner,
      dismissSpinner,
      loginWithAuthorizationCode,
      showMessage,
      appMessages
    );
  }, [
    appBasePath,
    showSpinner,
    dismissSpinner,
    loginWithAuthorizationCode,
    showMessage,
    appMessages
  ]);
};

export default useAuthRedirect;
