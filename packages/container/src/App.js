import React, { lazy, Suspense, useState, useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";
import Progress from "./components/Progress";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";

const MarketingLazy = lazy(() => import("./components/MarketingApp"));
const AuthLazy = lazy(() => import("./components/AuthApp"));
const DashboardLazy = lazy(() => import("./components/DashboardApp"));

const generateClassName = createGenerateClassName({
  productionPrefix: "co",
});

const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push("/dashboard");
    }
  }, [isSignedIn]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("isSignedIn"));
    if (items) {
      setIsSignedIn(items);
    }
  }, []);

  const onSignIn = () => {
    localStorage.setItem("isSignedIn", true);
    
    setIsSignedIn(true);
  };

  const onSignOut = () => {
    localStorage.setItem("isSignedIn", false);
    setIsSignedIn(false);
  }

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            onSignOut={onSignOut}
            isSignedIn={isSignedIn}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route
                path="/auth"
                render={(props) => {
                  if (isSignedIn) {
                    return <Redirect to="/dashboard"></Redirect>;
                  }

                  return (
                    <ErrorBoundary {...props}>
                      <AuthLazy onSignIn={onSignIn} />
                    </ErrorBoundary>
                  );
                }}
              />
              <Route
                path="/dashboard"
                render={(props) => {
                  if (!isSignedIn) {
                    return <Redirect to="/" />;
                  }
                  return (
                    <ErrorBoundary {...props}>
                      <DashboardLazy />
                    </ErrorBoundary>
                  );
                }}
              />
              <Route
                path="/"
                render={(props) => (
                  <ErrorBoundary {...props}>
                    <MarketingLazy />
                  </ErrorBoundary>
                )}
              />
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};
