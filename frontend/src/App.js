import React, { Suspense } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useAuth0 } from './hooks/useAuth0';
import PrivateRoute from './components/PrivateRoute';
// import PrivateRouteWithRoles from './components/PrivateRouteWithRoles';
import NotFound from './components/NotFound';
import Loading from './components/Loading';
import theme from './theme';
import { MapProvider } from './pages/Map/MapProvider';

const MapPage = React.lazy(() => import('./pages/Map'));
const UsgsPage = React.lazy(() => import('./pages/Stories/Usgs'));
const Stories2 = React.lazy(() => import('./pages/Stories/Stories2'));
const ExternalLinks = React.lazy(() => import('./pages/ExternalLinks'));
const DataListInputsPage = React.lazy(() => import('./pages/DataManagement/Inputs'));
const DataListInputTypesPage = React.lazy(() => import('./pages/DataManagement/InputTypes'));
const DataListInputBinsPage = React.lazy(() => import('./pages/DataManagement/InputBins'));

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Switch>
            <PrivateRoute path="/" exact render={() => <Redirect to="/map" />} />
            <PrivateRoute
              path="/map"
              exact
              render={() => (
                <MapProvider>
                  <MapPage />
                </MapProvider>
              )}
            />
            <PrivateRoute path="/external-links" exact render={() => <ExternalLinks />} />
            <PrivateRoute path="/usgs" exact render={() => <UsgsPage />} />
            <PrivateRoute path="/stories2" exact render={() => <Stories2 />} />
            <PrivateRoute path="/data/inputs" exact render={() => <DataListInputsPage />} />
            <PrivateRoute path="/data/input-types" exact render={() => <DataListInputTypesPage />} />
            <PrivateRoute path="/data/input-bins" exact render={() => <DataListInputBinsPage />} />
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export default App;
