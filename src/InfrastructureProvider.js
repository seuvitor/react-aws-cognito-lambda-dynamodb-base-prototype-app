import { createElement as e } from 'react';

import AppThemeProvider from './AppThemeProvider';
import { MessageProvider } from './MessageContext';
import { UserProvider } from './UserContext';
import { DDBProvider } from './DDBContext';
import { LambdaProvider } from './LambdaContext';
import { AppConfigProvider } from './AppConfigContext';

const InfrastructureProvider = ({ appConfig, children }) => (
  e(AppThemeProvider, null,
    e(MessageProvider, null,
      e(AppConfigProvider, { appConfig },
        e(UserProvider, null,
          e(DDBProvider, null,
            e(LambdaProvider, null,
              children))))))
);

export default InfrastructureProvider;
