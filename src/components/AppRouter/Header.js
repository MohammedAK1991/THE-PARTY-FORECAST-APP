import React from 'react';
import { Menu } from 'semantic-ui-react'
import GoogeAuth from '../GoogleAuth/GoogleAuth.js';

const Header = ({ handleSignIn, handleSignOut, setIsSignedIn, isSignedIn }) => {

  const[activeItem, setActiveItem] = React.useState('');

  const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })

  return (
    <Menu stackable style={{ backgroundColor: 'orange', paddingTop: '0em', fontWeight: 'bolder'}}>
      <Menu.Item href='/'>
          <h3>PARTY FORECAST APP</h3>
          <span><img src='/cartman-1.png' width='50px' alt="eric"/> </span>
          <span><img src='/kyle-2.png' width='50px' alt="kyle"/> </span>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          name='find'
          active={activeItem === 'find'}
          onClick={handleItemClick}
          href='/'
        >
          <h3>WHERE MA PARTIES AT??</h3>
        </Menu.Item>
        {isSignedIn
        ?
        (<Menu.Item href="/host" className="item">
          <h3>HOST</h3>
        </Menu.Item>)
        :
        (<Menu.Item hred="/loginPrompt" className="item">
          <h3>HOST</h3>
        </Menu.Item>)}

        <Menu.Item
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