import React from 'react';

class GoogleAuth extends React.Component {
  state = {
    isSignedIn: null,
    userId: null,
    userName: null
  };

  componentDidMount() {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: process.env.REACT_APP_OAUTH2_CLIENTID,
        scope: 'email'
      }).then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();
        this.setState({ isSignedIn: this.auth.isSignedIn.get() });
        this.props.setIsSignedIn(this.auth.isSignedIn.get())
        this.onAuthChange(this.auth.isSignedIn.get())
        this.auth.isSignedIn.listen(this.onAuthChange);
      })
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      this.setState({
        isSignedIn: this.auth.isSignedIn.get(),
      })
    } else {
      this.setState({
        isSignedIn: this.auth.isSignedIn.get(),
      })
    }
  }

  renderAuthButton() {
    if (this.state.isSignedIn == null) {
      return null;
    } else if (this.state.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button ">
          Sign Out
        </button>
      )
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui blue google button ">
          Sign In
        </button>
      )
    }
  }

  onSignInClick = () => {
    this.auth.signIn();
    this.setState({
      isSignedIn: this.auth.isSignedIn.get(),
    })
    this.props.handleSignIn(this.auth.currentUser.get().getId());
  }

  onSignOutClick = () => {
    this.auth.signOut();
    this.setState({
      isSignedIn: this.auth.isSignedIn.get(),
    })
    this.props.handleSignOut();
  }

  render() {
    if (this.state.isSignedIn) {
      return <div style={{ color: 'yellow', zindex: '1000', fontWeight: 'bolder' }}>
        {this.renderAuthButton()}
      </div>
    } else {
      return <div style={{ color: 'yellow', zindex: '1000', fontWeight: 'bolder' }}>
        {this.renderAuthButton()}
      </div>
    }
  }
}

export default GoogleAuth;