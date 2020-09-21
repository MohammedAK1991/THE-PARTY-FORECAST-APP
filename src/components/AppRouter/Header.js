import React from 'react';
import { Link } from 'react-router-dom';
import GoogeAuth from '../GoogleAuth/GoogleAuth.js';

const Header = () => {
  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        PARTYFORECAST
      </Link>
      <div className="right menu">
        <Link to="/" className="item">
          WHERE MA PARTIES AT??
        </Link>
        <Link to="/host" className="item">
          HOST
        </Link>
        <GoogeAuth className="item" />
      </div>
    </div>
  );
}

export default Header;