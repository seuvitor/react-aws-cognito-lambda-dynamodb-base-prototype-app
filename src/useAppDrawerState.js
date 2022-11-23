import useAppConfig from './AppConfigContext';
import useUser from './UserContext';

const useAppDrawerState = (routes) => {
  const { appConfig: { appLogoUrl } } = useAppConfig();
  const { user: { groups: userGroups } } = useUser();

  const userFromAuthorizedGroup = (authorizedGroups) => {
    if (!authorizedGroups) {
      return true;
    }
    if (!userGroups) {
      return false;
    }
    return authorizedGroups.some((authorizedGroup) => userGroups.includes(authorizedGroup));
  };

  const menuRoutes = routes.filter((route) => !route.hideFromMenu)
    .filter((route) => userFromAuthorizedGroup(route.authorizedGroups));

  return { appLogoUrl, menuRoutes };
};

export default useAppDrawerState;
