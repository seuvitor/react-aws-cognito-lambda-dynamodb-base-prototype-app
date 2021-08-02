import { createElement as e } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  Icon,
  ListItem,
  ListItemText,
  Toolbar
} from '@material-ui/core';

import useAppConfig from './AppConfigContext';
import useUser from './UserContext';

const AppDrawer = ({ routes, drawerOpen, setDrawerOpen }) => {
  const { appConfig: { appLogoUrl } } = useAppConfig();
  const { user: { groups: userGroups } } = useUser();

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
