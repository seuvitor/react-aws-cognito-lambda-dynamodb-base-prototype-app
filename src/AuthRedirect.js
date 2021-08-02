import { createElement as e, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Backdrop, CircularProgress, useTheme } from '@material-ui/core';

import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';

const AuthRedirect = () => {
  const { appConfig: { appMessages } } = useAppConfig();
  const { showMessage } = useMessage();
  const { loginWithAuthorizationCode } = useUser();
  const { authorization_code: authorizationCode } = useParams();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const history = useHistory();

  useEffect(() => {
    loginWithAuthorizationCode(authorizationCode).then(() => {
      showMessage(appMessages.LOGIN_SUCCESSFUL);
      history.replace('/');
    }).catch(() => {
      showMessage(appMessages.LOGIN_FAILED);
      setLoading(false);
    });
  }, [authorizationCode, loginWithAuthorizationCode, showMessage, history, appMessages]);

  return e(Backdrop, { open: loading, style: { zIndex: 1 + theme.zIndex.drawer } },
    e(CircularProgress, null, null));
};

export default AuthRedirect;
