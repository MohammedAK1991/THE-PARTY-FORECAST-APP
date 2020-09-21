import React from 'react';
import { Link } from 'react-router-dom';
import GoogeAuth from '../GoogleAuth/GoogleAuth.js';

const Header = ({ handleSignIn, handleSignOut, setIsSignedIn }) => {
  return (
    <div className="ui pointing menu large inverted" style={{ color: 'black' }}>
      <Link to="/" className="item">
        PRTYFRCST
      </Link>
      <div className="right menu">
        <Link to="/" className="item">
          FIND PARTIES
        </Link>
        <Link to="/host" className="item">
          HOST
        </Link>
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