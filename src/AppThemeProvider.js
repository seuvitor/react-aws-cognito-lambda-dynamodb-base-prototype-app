import React from 'react';
import * as MaterialUI from '@material-ui/core';

const e = React.createElement;
const { ThemeProvider } = MaterialUI;

const AppThemeProvider = ({ children }) => {
  const [theme] = React.useState(MaterialUI.createMuiTheme({
    palette: {
      primary: {
        main: '#556cd6'
      }
    }
  }));
  return e(ThemeProvider, { theme }, children);
};

export default AppThemeProvider;
