import React from 'react';
import { Link } from 'react-router-dom';
import GoogeAuth from '../GoogleAuth/GoogleAuth.js';

const Header = ({ handleSignIn, handleSignOut, setIsSignedIn, isSignedIn }) => {

  return (
    <div className="ui pointing menu inverted" style={{ color: 'black' }}>
      <Link to="/" className="ui large orange item bold" style={{ backgroundColor: 'black', fontWeight: 900}}>
        PRTY FRCST
      </Link>
      <div className="right menu">
        <Link to="/" className="purple item">
          FIND PARTIES
        </Link>
        {isSignedIn
          ?
          (<Link to="/host" className="item">
            HOST
          </Link>)
          :
          (<Link to="/loginPrompt" className="item">
            HOST
          </Link>)}
        <GoogeAuth
          className="item"
          handleSignIn={handleSignIn}
          handleSignOut={handleSignOut}
          setIsSignedIn={setIsSignedIn}
        />
      </div>
    </div>
  );
}

export default Header;