"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _core = require("@material-ui/core");

var AppThemeProvider = function AppThemeProvider(_ref) {
  var children = _ref.children;

  var _useState = (0, _react.useState)((0, _core.createTheme)({
    palette: {
      primary: {
        main: '#556cd6'
      }
    }
  })),
      theme = _useState[0];

  return (0, _react.createElement)(_core.ThemeProvider, {
    theme: theme
  }, children);
};

var _default = AppThemeProvider;
exports["default"] = _default;
module.exports = exports.default;