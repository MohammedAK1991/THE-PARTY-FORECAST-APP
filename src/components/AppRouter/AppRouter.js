import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { history } from '../../history.js';
import '../../index.css';

import Header from './Header.js'
import SubmittedParty from '../SubmittedParty';
import LoginPrompt from '../LoginPrompt'

const HostAParty = lazy(() => import('../HostAParty/HostAParty'));
const FindParty = lazy(() => import('../FindParty/FindParty'));

export default function AppRouter() {
  const [isSignedIn, setIsSignedIn] = React.useState(null);
  const [center, setCenter] = React.useState({lat: null, lng: null})
  const [userId, setUserId] = React.useState(null);

  const handleSignIn = (userId) => {
    setUserId(userId);
    setIsSignedIn(true)
  }

  const handleSignOut = () => {
    setUserId(null);
    setIsSignedIn(false)
  }

  React.useEffect(() => {
    async function getCurrentCoordinates() {
      await window.navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => null
      );
    }
    getCurrentCoordinates();
  }, []);

  return (
    <Router history={history} >
      <div>
        <Header
          handleSignIn={handleSignIn}
          handleSignOut={handleSignOut}
          setIsSignedIn={setIsSignedIn}
          isSignedIn={isSignedIn}
        />
        <Route path="/" exact={true}>
          <Suspense fallback={<div>Loading...</div>}>
            <FindParty userId={userId} center={center} />
          </Suspense>
        </Route>
        <Route path="/host/">
          <Suspense fallback={<div>Loading...</div>}>
            <HostAParty userId={userId} center={center} />
          </Suspense>
        </Route>
        <Route path='/submitted/' component={SubmittedParty} />
        <Route path='/loginPrompt/' component={LoginPrompt} />
      </div>
    </Router>
  );
}


