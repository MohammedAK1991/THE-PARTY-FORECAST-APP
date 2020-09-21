import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { history } from '../../history.js';
import '../../index.css';
import FindParty from '../FindParty/FindParty.js';
import Header from './Header.js'
const HostAParty = lazy(() => import('../HostAParty/HostAParty'));
const GoogleAuth = lazy(() => import('../GoogleAuth/GoogleAuth'));

export default function AppRouter() {
  const [isSignedIn, setIsSignedIn] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const handleSignIn = (userId) => {
    setUserId(userId);
    setIsSignedIn(true)
  }

  const handleSignOut = () => {
    setUserId(null);
    setIsSignedIn(false)
  }

  return (
    <Router history={history} >
      <div>
        <Header
          handleSignIn={handleSignIn}
          handleSignOut={handleSignOut}
          setIsSignedIn={setIsSignedIn}
        />
        <Route path="/" exact={true}>
          <FindParty
            userId={userId}
          />
        </Route>
        <Route path="/host/">
          <Suspense fallback={<div>Loading...</div>}>
            <HostAParty userId={userId} />
          </Suspense>
        </Route>
      </div>
    </Router>
  );
}
