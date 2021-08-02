import { createElement as e, useState } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';

var AppThemeProvider = function AppThemeProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(createTheme({
    palette: {
      primary: {
        main: '#556cd6'
      }
    }
  })),
      theme = _useState[0];

  return e(ThemeProvider, {
    theme: theme
  }, children);
};

export default AppThemeProvider;