import React from 'react';
import { Menu } from 'semantic-ui-react'
import GoogeAuth from '../GoogleAuth/GoogleAuth.js';

const Header = ({ handleSignIn, handleSignOut, setIsSignedIn, isSignedIn }) => {

  const[activeItem, setActiveItem] = React.useState('');

  const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })

  return (
    <Menu stackable style={{ backgroundColor: 'teal', paddingTop: '0em', fontWeight: 'bolder'}}>
      <Menu.Item href='/' color='teal'>
          <h2>PARTY FORECAST APP</h2>
          <span><img src='/cartman-1.png' width='35px' alt="eric"/> </span>
          <span><img src='/kyle-2.png' width='35px' alt="kyle"/> </span>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          name='find'
          // active={activeItem === 'find'}
          onClick={handleItemClick}
          href='/'
        >
          <h3> WHERE MA PARTIES AT ??</h3>
        </Menu.Item>
        {isSignedIn
        ?
        (<Menu.Item href="/host">
          <h3>HOST</h3>
        </Menu.Item>)
        :
        (<Menu.Item href="/loginPrompt">
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