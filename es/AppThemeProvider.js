import React from 'react';
import * as MaterialUI from '@material-ui/core';
var e = React.createElement;
var ThemeProvider = MaterialUI.ThemeProvider;

var AppThemeProvider = function AppThemeProvider(_ref) {
  var children = _ref.children;

  var _React$useState = React.useState(MaterialUI.createMuiTheme({
    palette: {
      primary: {
        main: '#556cd6'
      }
    }
  })),
      theme = _React$useState[0];

  return e(ThemeProvider, {
    theme: theme
  }, children);
};

export default AppThemeProvider;