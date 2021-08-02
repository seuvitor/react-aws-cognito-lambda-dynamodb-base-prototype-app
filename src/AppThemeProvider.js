import { createElement as e, useState } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';

const AppThemeProvider = ({ children }) => {
  const [theme] = useState(createTheme({
    palette: {
      primary: {
        main: '#556cd6'
      }
    }
  }));
  return e(ThemeProvider, { theme }, children);
};

export default AppThemeProvider;
