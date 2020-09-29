import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

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
        <Button negative fluid onClick={this.onSignOutClick}>
          <Icon name='google' />Sign Out
        </Button>
      )
    } else {
      return (
        <Button primary onClick={this.onSignInClick}>
          <Icon name='google' />Sign In with Google
        </Button>
      )
    }
  }

  onSignInClick = () => {
    this.auth.signIn();
    this.setState({
      isSignedIn: this.auth.isSignedIn.get(),
    })
    this.props.setIsSignedIn(true);
  }

  onSignOutClick = () => {
    this.auth.signOut();
    this.setState({
      isSignedIn: this.auth.isSignedIn.get(),
    })
    this.props.setIsSignedIn(false);
    // this.props.handleSignOut();
  }

  render() {
    if (this.state.isSignedIn) {
      return <div style={{ color: 'yellow', zindex: '1000', fontWeight: 'bolder' }}>
        {this.renderAuthButton()}
      </div>
    } else {
      return <div style={{ color: 'black', zindex: '1000', fontWeight: 'bolder' }}>
        {this.renderAuthButton()}
      </div>
    }
  }
}

export default GoogleAuth;