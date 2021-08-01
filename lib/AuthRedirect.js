"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var MaterialUI = _interopRequireWildcard(require("@material-ui/core"));

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

var _MessageContext = _interopRequireDefault(require("./MessageContext"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;
var Backdrop = MaterialUI.Backdrop,
    CircularProgress = MaterialUI.CircularProgress;

var AuthRedirect = function AuthRedirect() {
  var _useAppConfig = (0, _AppConfigContext["default"])(),
      appMessages = _useAppConfig.appConfig.appMessages;

  var _useMessage = (0, _MessageContext["default"])(),
      showMessage = _useMessage.showMessage;

  var _useUser = (0, _UserContext["default"])(),
      loginWithAuthorizationCode = _useUser.loginWithAuthorizationCode;

  var _useParams = (0, _reactRouterDom.useParams)(),
      authorizationCode = _useParams.authorization_code;

  var _React$useState = _react["default"].useState(true),
      loading = _React$useState[0],
      setLoading = _React$useState[1];

  var theme = MaterialUI.useTheme();
  var history = (0, _reactRouterDom.useHistory)();

  _react["default"].useEffect(function () {
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

var _default = AuthRedirect;
exports["default"] = _default;
module.exports = exports.default;