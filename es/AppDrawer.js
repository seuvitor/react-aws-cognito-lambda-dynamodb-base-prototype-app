function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { NavLink } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';
import useAppConfig from './AppConfigContext';
import useUser from './UserContext';
var e = React.createElement;
var Box = MaterialUI.Box,
    Divider = MaterialUI.Divider,
    Drawer = MaterialUI.Drawer,
    Icon = MaterialUI.Icon,
    ListItem = MaterialUI.ListItem,
    ListItemText = MaterialUI.ListItemText,
    Toolbar = MaterialUI.Toolbar;

var AppDrawer = function AppDrawer(_ref) {
  var routes = _ref.routes,
      drawerOpen = _ref.drawerOpen,
      setDrawerOpen = _ref.setDrawerOpen;

  var _useAppConfig = useAppConfig(),
      appLogoUrl = _useAppConfig.appConfig.appLogoUrl;

  var _useUser = useUser(),
      userGroups = _useUser.user.groups;

  var handleClose = function handleClose() {
    return setDrawerOpen(false);
  };

  var userFromAuthorizedGroup = function userFromAuthorizedGroup(authorizedGroups) {
    if (!authorizedGroups) {
      return true;
    }

    if (!userGroups) {
      return false;
    }

    return authorizedGroups.some(function (authorizedGroup) {
      return userGroups.includes(authorizedGroup);
    });
  };

  return e(Drawer, {
    open: drawerOpen,
    onClose: handleClose
  }, e(Toolbar, {
    onClick: handleClose,
    style: {
      padding: 'inherit'
    }
  }, e(ListItem, {
    button: true,
    style: {
      justifyContent: 'space-between',
      height: '100%'
    }
  }, e(Box, {
    style: {
      flex: 'auto',
      textAlign: 'center'
    }
  }, e('img', {
    src: appLogoUrl,
    width: '70px',
    height: '70px'
  }, null)), e(Icon, null, 'chevron_left'))), e(Divider, null, null), routes.filter(function (route) {
    return !route.hideFromMenu;
  }).filter(function (route) {
    return userFromAuthorizedGroup(route.authorizedGroups);
  }).map(function (route) {
    return e(ListItem, _extends({
      key: route.name + "-route-drawer-item",
      button: true,
      component: NavLink,
      activeClassName: 'Mui-selected',
      to: route.path,
      onClick: handleClose
    }, route.options), e(ListItemText, {
      primary: route.label
    }, null));
  }));
};

export default AppDrawer;