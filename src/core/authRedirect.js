const authRedirect = (
  appBasePath,
  showSpinner,
  dismissSpinner,
  loginWithAuthorizationCode,
  showMessage,
  appMessages
) => {
  if (window.location.pathname === appBasePath) {
    const search = new URLSearchParams(window.location.search);
    if (search.get('auth-redirect') !== null && search.get('code') !== null) {
      window.history.replaceState({}, '', window.location.pathname);
      const authorizationCode = search.get('code');

      showSpinner();
      loginWithAuthorizationCode(authorizationCode).then(() => {
        showMessage(appMessages.LOGIN_SUCCESSFUL);
      }).catch(() => {
        showMessage(appMessages.LOGIN_FAILED);
      }).finally(() => {
        dismissSpinner();
      });
    }
  }
};

export default authRedirect;
