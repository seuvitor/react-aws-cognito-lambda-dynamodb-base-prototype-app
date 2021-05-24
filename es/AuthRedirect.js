import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';
import AppConfigContext from './AppConfigContext';
import MessageContext from './MessageContext';
import UserContext from './UserContext';
var e = React.createElement;
var Backdrop = MaterialUI.Backdrop,
    CircularProgress = MaterialUI.CircularProgress;

var AuthRedirect = function AuthRedirect() {
  var _React$useContext = React.useContext(AppConfigContext),
      appMessages = _React$useContext.appConfig.appMessages;

  var _React$useContext2 = React.useContext(MessageContext),
      showMessage = _React$useContext2.showMessage;

  var _React$useContext3 = React.useContext(UserContext),
      loginWithAuthorizationCode = _React$useContext3.loginWithAuthorizationCode;

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