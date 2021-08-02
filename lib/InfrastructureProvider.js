"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _AppThemeProvider = _interopRequireDefault(require("./AppThemeProvider"));

var _MessageContext = require("./MessageContext");

var _UserContext = require("./UserContext");

var _DDBContext = require("./DDBContext");

var _LambdaContext = require("./LambdaContext");

var _AppConfigContext = require("./AppConfigContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var InfrastructureProvider = function InfrastructureProvider(_ref) {
  var appConfig = _ref.appConfig,
      children = _ref.children;
  return (0, _react.createElement)(_AppThemeProvider["default"], null, (0, _react.createElement)(_MessageContext.MessageProvider, null, (0, _react.createElement)(_AppConfigContext.AppConfigProvider, {
    appConfig: appConfig
  }, (0, _react.createElement)(_UserContext.UserProvider, null, (0, _react.createElement)(_DDBContext.DDBProvider, null, (0, _react.createElement)(_LambdaContext.LambdaProvider, null, children))))));
};

var _default = InfrastructureProvider;
exports["default"] = _default;
module.exports = exports.default;