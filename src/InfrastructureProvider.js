import React from 'react';

import { MessageProvider } from './MessageContext';
import { SpinnerProvider } from './SpinnerContext';
import { UserProvider } from './UserContext';
import { DDBProvider } from './DDBContext';
import { LambdaProvider } from './LambdaContext';
import { AppConfigProvider } from './AppConfigContext';

const InfrastructureProvider = ({ appConfig, children }) => (
  <MessageProvider>
    <SpinnerProvider>
      <AppConfigProvider appConfig={appConfig}>
        <UserProvider>
          <DDBProvider>
            <LambdaProvider>
              { children }
            </LambdaProvider>
          </DDBProvider>
        </UserProvider>
      </AppConfigProvider>
    </SpinnerProvider>
  </MessageProvider>
);

export default InfrastructureProvider;
