import React from 'react';
import '../../index.css';
import moment from "moment";

export default function PartyList ({partyList, handlePanTo}) {


  const handleClick = ({lat,lng}) => {
    handlePanTo({lat,lng})
  }

  const parties = partyList.map(party => (
    <div className="item" onClick={() => handleClick(party)} id="partyList">
      <i class="calendar alternate outline icon large white"
          style={{marginRight:'60px'}}
      >

      </i>
      <div className="content"
        style={{textAlign:'left'}}
      >
        <div className="header">{party.name}</div>
        <div className="description">{party.artists}</div>
        <div className="description">
          <i class="map marker alternate icon small white"></i>
          {party.venue}
        </div>
        <p className="description"> {moment(party.date).format('MMM Do')} </p>
      </div>
    </div>
  )
  )

  return (
    <>
      <div id="MainPartyList">
        <div className="ui relaxed divided list" id="PartyListDisabled" style={{color:'white'}}>
          <h3 style={{color:'white', textAlign:'center'}}>
            <div style={{display:'flex', justifyContent: 'center'}}>
              <p style={{marginTop:'5px', marginLeft: '20px', marginBottom: '0'}}>
                MY LIST
              </p>
              <img src="/clipboard (1).svg" alt="kundi"style={{fontFamily:'Avenir',color:'yellow',backgroundColor:'transparent', height:'40px', width:'30px', marginLeft:'35px', top:'10px'}} />
            </div>
          </h3>
          <hr/>
          {parties}
        </div>
      </div>
      <img src='/clipboard.svg' alt='kundi' className="overflow"
            style={{fontFamily:'Avenir',color:'yellow',backgroundColor:'transparent', height:'50px', width:'50px', marginLeft:'50px', top:'10px'}}
          >
      </img>
    </>
  );
}