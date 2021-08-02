"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _core = require("@material-ui/core");

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

var _MessageContext = _interopRequireDefault(require("./MessageContext"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var AuthRedirect = function AuthRedirect() {
  var _useAppConfig = (0, _AppConfigContext["default"])(),
      appMessages = _useAppConfig.appConfig.appMessages;

  var _useMessage = (0, _MessageContext["default"])(),
      showMessage = _useMessage.showMessage;

  var _useUser = (0, _UserContext["default"])(),
      loginWithAuthorizationCode = _useUser.loginWithAuthorizationCode;

  var _useParams = (0, _reactRouterDom.useParams)(),
      authorizationCode = _useParams.authorization_code;

  var _useState = (0, _react.useState)(true),
      loading = _useState[0],
      setLoading = _useState[1];

  var theme = (0, _core.useTheme)();
  var history = (0, _reactRouterDom.useHistory)();
  (0, _react.useEffect)(function () {
    loginWithAuthorizationCode(authorizationCode).then(function () {
      showMessage(appMessages.LOGIN_SUCCESSFUL);
      history.replace('/');
    })["catch"](function () {
      showMessage(appMessages.LOGIN_FAILED);
      setLoading(false);
    });
  }, [authorizationCode, loginWithAuthorizationCode, showMessage, history, appMessages]);
  return (0, _react.createElement)(_core.Backdrop, {
    open: loading,
    style: {
      zIndex: 1 + theme.zIndex.drawer
    }
  }, (0, _react.createElement)(_core.CircularProgress, null, null));
};

var _default = AuthRedirect;
exports["default"] = _default;
module.exports = exports.default;