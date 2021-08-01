import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';
import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';
var e = React.createElement;
var Backdrop = MaterialUI.Backdrop,
    CircularProgress = MaterialUI.CircularProgress;

var AuthRedirect = function AuthRedirect() {
  var _useAppConfig = useAppConfig(),
      appMessages = _useAppConfig.appConfig.appMessages;

  var _useMessage = useMessage(),
      showMessage = _useMessage.showMessage;

  var _useUser = useUser(),
      loginWithAuthorizationCode = _useUser.loginWithAuthorizationCode;

  var _useParams = useParams(),
      authorizationCode = _useParams.authorization_code;

  var _React$useState = React.useState(true),
      loading = _React$useState[0],
      setLoading = _React$useState[1];

  var theme = MaterialUI.useTheme();
  var history = useHistory();
  React.useEffect(function () {
    loginWithAuthorizationCode(authorizationCode).then(function () {
      showMessage(appMessages.LOGIN_SUCCESSFUL);
      history.replace('/');
    })["catch"](function () {
      showMessage(appMessages.LOGIN_FAILED);
      setLoading(false);
    });
  }, [authorizationCode, loginWithAuthorizationCode, showMessage, history, appMessages]);
  return e(Backdrop, {
    open: loading,
    style: {
      zIndex: 1 + theme.zIndex.drawer
    }
  }, e(CircularProgress, null, null));
};

export default AuthRedirect;