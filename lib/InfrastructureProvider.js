"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _AppThemeProvider = _interopRequireDefault(require("./AppThemeProvider"));

var _MessageContext = require("./MessageContext");

var _UserContext = require("./UserContext");

var _DDBContext = require("./DDBContext");

var _LambdaContext = require("./LambdaContext");

var _AppConfigContext = require("./AppConfigContext");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;

var InfrastructureProvider = function InfrastructureProvider(_ref) {
  var appConfig = _ref.appConfig,
      children = _ref.children;
  return e(_AppThemeProvider["default"], null, e(_MessageContext.MessageProvider, null, e(_AppConfigContext.AppConfigProvider, {
    appConfig: appConfig
  }, e(_UserContext.UserProvider, null, e(_DDBContext.DDBProvider, null, e(_LambdaContext.LambdaProvider, null, children))))));
};

var _default = InfrastructureProvider;
exports["default"] = _default;
module.exports = exports.default;