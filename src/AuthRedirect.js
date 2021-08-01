import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';

import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';

const e = React.createElement;
const { Backdrop, CircularProgress } = MaterialUI;

const AuthRedirect = () => {
  const { appConfig: { appMessages } } = useAppConfig();
  const { showMessage } = useMessage();
  const { loginWithAuthorizationCode } = useUser();
  const { authorization_code: authorizationCode } = useParams();
  const [loading, setLoading] = React.useState(true);
  const theme = MaterialUI.useTheme();
  const history = useHistory();

  React.useEffect(() => {
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
