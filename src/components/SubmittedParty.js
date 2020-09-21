import React from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal.js';
import { history } from '../history';


export default function SubmittedParty() {
  const renderActions = () => {
    return (
      <>
        {/* <button onClick={() => this.props.deleteStream(id)} className="ui button negative"> DELETE </button> */}
        <Link to='/' className="ui primary button">OK</Link>
        {/* <button className="ui button">CANCEL</button> */}
      </>
    )
  }

  const renderContent = () => {
    // return `Are you sure you want to delete the stream "${this.props.stream.title}"`
    return `Your party has been uploaded to our servers and is ready for the whole world to see. Click OK to go back to HomePage`
  }

  return (
    <Modal
      title="Party Submitted 🥳 🥳 🎉"
      content={renderContent()}
      actions={renderActions()}
      onDismiss={() => history.push('/')}
    />
  )
}