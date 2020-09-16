import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../../index.css';

import FindParty from '../FindParty/FindParty.js';

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
    <Router>
      <div>
        <div id="mySidenav" className="sidenav" style={{ color: 'black' }}>
          {/* eslint-disable-next-line */}
          <a href="#" id="logo" style={{ color: 'orange', zindex: '0', fontWeight: 'bolder', fontFamily: 'monospace', fontSize: '50px', paddingRight: '10px', width: '249px', left: 0, paddingBottom: '20px' }}>
            PARTY FRCST
          </a>
          {/* eslint-disable-next-line */}
          <a href="#" id="login" >
            <div>
              <Suspense fallback={<div>Loading OAuth... </div>}>
                <GoogleAuth
                  handleSignIn={handleSignIn}
                  handleSignOut={handleSignOut}
                  setIsSignedIn={setIsSignedIn}
                />
              </Suspense>
            </div>
            <img src='/icons8-google.svg' alt='google icon'
              style={{ fontFamily: 'Avenir', color: 'black', backgroundColor: 'transparent', height: '50px', width: '50px', marginLeft: '13px' }}
            >
            </img>
          </a>
          {isSignedIn ?
            <Link id="host" style={{ textDecoration: 'none', color: 'black' }} to="/host/">
              <div className="hosting">
                HOST A PARTY
            </div>
              <img src='/submit.svg' alt='host party'
                style={{ fontFamily: 'Avenir', color: 'black', backgroundColor: 'transparent', height: '50px', width: '50px', marginLeft: '24px', marginTop: '11px' }}
              >
              </img>
            </Link>
            : <Link id="host" style={{ textDecoration: 'none', color: 'black' }} >
              <div className="hosting" style={{ color: 'black' }}>
                SIGN IN TO HOST
            </div>
              <img src='/submit.svg' alt='host party'
                style={{ fontFamily: 'Avenir', color: 'black', backgroundColor: 'transparent', height: '50px', width: '50px', marginLeft: '24px', marginTop: '11px' }}
              >
              </img>
            </Link>
          }
          <Link id="find" style={{ textDecoration: 'none', color: 'black' }} to="/">
            <div className="finding" style={{ color: 'black' }}>
              FIND PARTIES
            </div>
            <img src='/search (1).svg' alt='search icon'
              style={{ fontFamily: 'Avenir', color: 'black', backgroundColor: 'transparent', height: '50px', width: '50px', marginLeft: '10px' }}
            >
            </img>
          </Link>
        </div>
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
