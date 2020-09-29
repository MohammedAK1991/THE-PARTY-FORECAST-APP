import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react'
import GoogeAuth from '../GoogleAuth/GoogleAuth.js';

const Header = ({ handleSignIn, handleSignOut, setIsSignedIn, isSignedIn }) => {

  const[activeItem, setActiveItem] = React.useState('');

  const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })
  /*
  return (
    <div className="ui pointing menu inverted" style={{ color: 'black' }}>
      <Link to="/" className="ui large item bold" style={{ backgroundColor: 'black', fontWeight: 900}}>
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
  */
  return (
    <Menu stackable style={{ backgroundColor: 'orange', paddingTop: '0em', fontWeight: 'bolder'}}>
      <Menu.Item href='/'>
        {/* <Link to="/" style={{ fontWeight: 900}}> */}
          PRTY FRCST
        {/* </Link> */}
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          name='find'
          active={activeItem === 'find'}
          onClick={handleItemClick}
          href='/'
        >
          WHERE MA PARTIES AT??
        </Menu.Item>

        {/* <Menu.Item
          name='host'
          active={activeItem === 'host'}
          onClick={handleItemClick}
        > */}
          {isSignedIn
          ?
          (<Menu.Item to="/host" className="item">
            HOST
          </Menu.Item>)
          :
          (<Menu.Item to="/loginPrompt" className="item">
            HOST
          </Menu.Item>)}
        {/* </Menu.Item> */}

        <Menu.Item
          name='sign-in'
          // active={activeItem === 'sign-in'}
          // onClick={this.handleItemClick}
        >
          <GoogeAuth
            className="item"
            handleSignIn={handleSignIn}
            handleSignOut={handleSignOut}
            setIsSignedIn={setIsSignedIn}
          />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

export default Header;