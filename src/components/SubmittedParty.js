import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.js';
import { history } from '../history';


export default function SubmittedParty() {
  const renderActions = () => {
    return (
      <>
        <Link to='/' className="ui primary button">OK</Link>
        <Link to='/host' className="ui button">BACK</Link>
      </>
    )
  }

  const renderContent = () => {
    return `Your party has been uploaded to our servers and is ready for the whole world to see. Click OK to go to Home Page or BACK to register another party`
  }

  return (
    <Modal
      title="🎉 🎉 🎉 Party Submitted 🎉 🎉 🎉"
      content={renderContent()}
      actions={renderActions()}
      onDismiss={() => history.push('/')}
    />
  )
}