import React from 'react';


class GoogleAuth extends React.Component {

  state = {
    isSignedIn : null,
    userId : null,
    userName : null
  };

  componentDidMount() {
    window.gapi.load('client:auth2', ()=> {
      window.gapi.client.init({
        clientId: '176907200640-moopicdqra2b703hb4skd0khu9ock7d6.apps.googleusercontent.com',
        scope: 'email'
      }).then(()=> {
        this.auth = window.gapi.auth2.getAuthInstance();

        this.setState({ isSignedIn : this.auth.isSignedIn.get()});

        this.props.setIsSignedIn(this.auth.isSignedIn.get())

        this.onAuthChange(this.auth.isSignedIn.get())
        this.auth.isSignedIn.listen(this.onAuthChange);
      })
    });
  }

  onAuthChange = (isSignedIn) => {
    if(isSignedIn) {

      this.setState({
        isSignedIn:this.auth.isSignedIn.get(),
        userId:this.auth.currentUser.get().getId(),
        userName:this.auth.currentUser.get().Ot.Cd
      })
    } else {
      this.setState({
        isSignedIn:this.auth.isSignedIn.get(),
        userId:null,
        userName:null
      })
    }
  }

  renderAuthButton () {
    if (this.state.isSignedIn == null ) {
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
    console.log('signed in')
    this.auth.signIn();
    this.setState({
      isSignedIn:this.auth.isSignedIn.get(),
      userId:this.auth.currentUser.get().getId(),
      userName:this.auth.currentUser.get().Ot.Cd || ''
    })

    this.props.handleSignIn(this.auth.currentUser.get().getId());
  }

  onSignOutClick = () => {
    console.log('signed out');
    this.auth.signOut();
    this.setState({
      isSignedIn:this.auth.isSignedIn.get(),
      userId:null,
      userName:null
    })
    console.log(this.auth.currentUser.get().Ot.Cd);
    this.props.handleSignOut();
  }

  render() {
    if (this.state.isSignedIn) {
      return <div style={{color:'yellow',zindex:'1000', fontWeight:'bolder'}}>
        {this.renderAuthButton()}
        {/* <p>Welcome {this.state.userName}</p> */}
        {/* {this.state.userName ? <p>Welcome {this.auth.currentUser.get().Ot.Cd}</p> : <p>hi</p>} */}
      </div>
    } else {
      return <div style={{color:'yellow',zindex:'1000', fontWeight:'bolder'}}>
        {this.renderAuthButton()}
      </div>
    }


  }
}

export default GoogleAuth;