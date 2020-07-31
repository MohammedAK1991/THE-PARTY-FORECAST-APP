import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import FindParty from '../FindParty/FindParty.js';
import HostAParty from '../HostAParty/HostAParty.js'
import Sidebar from '../SideBar/SideBar.js';
import '../../index.css'

export default function AppRouter() {

  return (

      <Router>
      <div>
        <div id="mySidenav" class="sidenav">
          <a href="#" id="projects">Login</a>
          <Link id="about" style={{textDecoration: 'none', color: 'black'}} to="/find">Find Parties around me</Link>
          <Link id="blog" style={{textDecoration: 'none', color: 'black'}} to="/host/">
            Host a Party <img style={{width:100,height:100}} src="../../../public/metal.svg" alt=""/>
          </Link>
          <a href="#" id="contact">Contact</a>
        </div>
          <Route path="/find"  component={FindParty} />
          <Route path="/host/" component={HostAParty} />

      </div>
      </Router>


  );
}

// export default AppRouter;