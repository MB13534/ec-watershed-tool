import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useAuth0 } from '../../hooks/useAuth0';
import NotFound from '../NotFound';

const PrivateRouteWithRoles = ({ component: Component, path, roles, ...rest }) => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: path },
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  useEffect(() => {
    if (isAuthenticated && user) {
      let authSwitch = false;
      roles.forEach(role => {
        if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
          authSwitch = true;
        }
      });
      setAdmin(authSwitch);
    }
  }, [isAuthenticated, user, roles]);

  console.log('admin: ', admin);
  const render = props => (isAuthenticated && admin === true ? <Component {...props} /> : <NotFound />);

  return <Route path={path} render={render} {...rest} />;
};

PrivateRouteWithRoles.propTypes = {
  // component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
  //   .isRequired,
  path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};

export default PrivateRouteWithRoles;
