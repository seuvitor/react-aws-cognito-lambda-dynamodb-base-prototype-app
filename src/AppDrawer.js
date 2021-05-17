import React from 'react';
import * as MaterialUI from '@material-ui/core';

import AppConfigContext from './AppConfigContext';
import UserContext from './UserContext';

const e = React.createElement;
const { NavLink } = window.ReactRouterDOM;
const {
  Box,
  Divider,
  Drawer,
  Icon,
  ListItem,
  ListItemText,
  Toolbar
} = MaterialUI;

const AppDrawer = ({ routes, drawerOpen, setDrawerOpen }) => {
  const { appConfig: { appLogoUrl } } = React.useContext(AppConfigContext);
  const { user: { groups: userGroups } } = React.useContext(UserContext);

  const handleClose = () => setDrawerOpen(false);

  const userFromAuthorizedGroup = (authorizedGroups) => {
    if (!authorizedGroups) {
      return true;
    }
    if (!userGroups) {
      return false;
    }
    return authorizedGroups.some((authorizedGroup) => userGroups.includes(authorizedGroup));
  };

  return e(Drawer, { open: drawerOpen, onClose: handleClose },
    e(Toolbar, { onClick: handleClose, style: { padding: 'inherit' } },
      e(ListItem, { button: true, style: { justifyContent: 'space-between', height: '100%' } },
        e(Box, { style: { flex: 'auto', textAlign: 'center' } },
          e('img',
            {
              src: appLogoUrl,
              width: '70px',
              height: '70px'
            },
            null)),
        e(Icon, null, 'chevron_left'))),
    e(Divider, null, null),
    routes.filter((route) => !route.hideFromMenu)
      .filter((route) => userFromAuthorizedGroup(route.authorizedGroups))
      .map((route) => e(ListItem,
        {
          key: `${route.name}-route-drawer-item`,
          button: true,
          component: NavLink,
          activeClassName: 'Mui-selected',
          to: route.path,
          onClick: handleClose,
          ...route.options
        },
        e(ListItemText, { primary: route.label }, null))));
};

export default AppDrawer;
