import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.js';
import { history } from '../history';
// import GoogleAuth from './GoogleAuth/GoogleAuth';


export default function LoginPrompt() {
  const renderActions = () => {
    return (
      <>
        {/* <button onClick={() => this.props.deleteStream(id)} className="ui button negative"> DELETE </button> */}
        {/* <GoogleAuth /> */}
        <Link to='/' className="ui secondary button">OK</Link>
        {/* <button className="ui button">CANCEL</button> */}
      </>
    )
  }

  const renderContent = () => {
    return `You must login first in order to be able to host a party `
  }

  return (
    <Modal
      title="Not so fast champ !! ✋🏻"
      content={renderContent()}
      actions={renderActions()}
      onDismiss={() => history.push('/')}
    />
  )
}