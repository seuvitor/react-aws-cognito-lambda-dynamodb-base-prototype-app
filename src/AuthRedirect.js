import React from 'react';
import * as MaterialUI from '@material-ui/core';

import AppConfigContext from './AppConfigContext';
import MessageContext from './MessageContext';
import UserContext from './UserContext';

const e = React.createElement;
const { useParams, useHistory } = window.ReactRouterDOM;
const { Backdrop, CircularProgress } = MaterialUI;

const AuthRedirect = () => {
  const { appConfig: { appMessages } } = React.useContext(AppConfigContext);
  const { showMessage } = React.useContext(MessageContext);
  const { loginWithAuthorizationCode } = React.useContext(UserContext);
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