import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import FindParty from '../FindParty/FindParty.js';
import HostAParty from '../HostAParty/HostAParty.js'
import GoogleAuth from '../GoogleAuth/GoogleAuth.js'

import '../../index.css'

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
        <div id="mySidenav" className="sidenav" style={{ color: 'black' }} >
          <a href="/" id="logo" style={{ color: 'orange', zindex: '0', fontWeight: 'bolder', fontFamily: 'monospace', fontSize: '50px', paddingRight: '10px', width: '249px', left: 0, paddingBottom: '20px' }}> //eslint-disable-line
            PARTY FRCST
          </a>

          <a href="/" id="login" >
            <div>
              <GoogleAuth
                handleSignIn={handleSignIn}
                handleSignOut={handleSignOut}
                setIsSignedIn={setIsSignedIn}
              />
            </div>
            <img src='/icons8-google.svg' alt='kundi'
              style={{ fontFamily: 'Avenir', color: 'black', backgroundColor: 'transparent', height: '50px', width: '50px', marginLeft: '13px' }}
            >
            </img>
          </a>
          {isSignedIn ?
            <Link id="host" style={{ textDecoration: 'none', color: 'black' }} to="/host/">
              <div className="hosting">
                HOST A PARTY
            </div>
              <img src='/submit.svg' alt='kundi'
                style={{ fontFamily: 'Avenir', color: 'black', backgroundColor: 'transparent', height: '50px', width: '50px', marginLeft: '24px', marginTop: '11px' }}
              >
              </img>
            </Link>
            : <Link id="host" style={{ textDecoration: 'none', color: 'black' }} >
              <div className="hosting" style={{ color: 'black' }}>
                SIGN IN TO HOST
            </div>
              <img src='/submit.svg' alt='kundi'
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
          <HostAParty
            userId={userId}
          />
        </Route>

      </div>
    </Router>
  );
}
