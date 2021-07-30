import { useAuth0, WithAuthenticationRequiredOptions } from '@auth0/auth0-react';
import { ComponentType, FC, useEffect } from 'react';
import getUserRole, { PossibleUserRoles } from './getUserRole';

const defaultOnRedirecting = (): JSX.Element => <></>;
const defaultReturnTo = (): string => `/`;

const withRole = <P extends object>(
  Component: ComponentType<P>,
  requiredRole?: PossibleUserRoles,
  options: WithAuthenticationRequiredOptions = {}
): FC<P> => {
  return function WithRole(props: P): JSX.Element {
    const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();
    const { returnTo = defaultReturnTo, onRedirecting = defaultOnRedirecting, loginOptions = {} } = options;

    let userRole = getUserRole(user);

    useEffect(() => {
      if (isLoading || (isAuthenticated && user && userRole === requiredRole) || !requiredRole) {
        return;
      }
      const opts = {
        ...loginOptions,
        appState: {
          ...loginOptions.appState,
          returnTo: typeof returnTo === 'function' ? returnTo() : returnTo,
        },
      };
      (async (): Promise<void> => {
        await loginWithRedirect(opts);
      })();
    }, [isLoading, isAuthenticated, loginWithRedirect, loginOptions, returnTo, user]);

    return isAuthenticated && (userRole === requiredRole || !requiredRole) ? <Component {...props} /> : onRedirecting();
  };
};

export default withRole;
