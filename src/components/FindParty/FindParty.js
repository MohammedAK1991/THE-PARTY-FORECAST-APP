import React, { useEffect } from "react";
import axios from "axios";
import { Image, Transformation } from 'cloudinary-react';

import moment from "moment";
import '../../index.css'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";


import "@reach/combobox/styles.css";
import mapStyles from "../../mapStyles.js";
import mapStyles2 from "../../mapStyles2.js";
import mapStyles3 from "../../mapStyles3.js";
import mapStyles4 from "../../mapStyles4.js";
import avocadoTheme from "../../avocadoTheme"
import PartyList from '../PartyList/PartyList.js';


const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};

const center = {
  lat: 41.3851,
  lng: 2.1734,
};

export default function FindParty() {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [selected, setSelected] = React.useState(null);
  const [allParties, setAllParties] = React.useState([]);
  const [parties, setParties] = React.useState([]);
  const [partyList, setPartyList] = React.useState([]);
  const [theme, setTheme] = React.useState(mapStyles);


  const options = {
    styles: theme,
    disableDefaultUI: true,
    zoomControl: true,
  };

  //initial api call to load data
  useEffect(() => {
    const getDataAxios = async () => {
      const { data: parties } = await axios.get('http://localhost:3001/parties');
      const filteredParties = parties.filter(party => Date.parse(party.date) > Date.now())
      setAllParties(filteredParties);
      setParties(filteredParties);
    }
    getDataAxios(); //calling the above created function
  }, []);

  React.useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  },
    []);

  const handleChange = (e) => {
    const currentParties = [...allParties]
    const { value } = e.target;
    if (value === 'ALL') {
      setParties(allParties);
      return;
    }
    const filteredParties = currentParties.filter(party => party.genre === value)
    setParties(filteredParties);
  };

  const handleDateChange = (e) => {
    const currentParties = [...allParties]
    const { value } = e.target;

    if (value === 'THIS WEEK') {
      setParties(allParties);
      return;
    }
    if (value === 'TODAY') {
      const filteredParties = currentParties.filter(party => Date.parse(party.date) < (Date.now() + 7.2e+7))
      setParties(filteredParties);
      return;
    }
    if (value === 'TOMORROW') {
      const filteredParties = currentParties.filter(party => Date.parse(party.date) < (Date.now() + 1.44e+8) && Date.parse(party.date) > (Date.now() + 7.2e+7))
      setParties(filteredParties);
      return;
    }
  }

  const handleThemeChange = (e) => {
    const { value } = e.target;

    switch (value) {
      case 'VINTAGE':
        setTheme(mapStyles2);
        return;
      case 'LIGHT':
        setTheme(mapStyles3);
        return;
      case 'DEFAULT':
        setTheme(mapStyles);
        return;
      case 'APPLE':
        setTheme(mapStyles4);
        return;
      case 'AVOCADO':
        setTheme(avocadoTheme);
        return;
      default:
        return;

    }

  }

  const handleGoing = async (selected) => {

    await axios.post(`http://localhost:3001/parties/${selected._id}/going`)

    const currentPartyList = [...partyList];
    if (currentPartyList.find(party => party._id === selected._id)) {
      return;
    }
    currentPartyList.push(selected);
    const sortedParties = currentPartyList.sort((a, b) => {
      if (a.date > b.date) return 1;
      return -1;
    });
    await setPartyList(sortedParties);


  }


  const handleMaybe = async () => {
    await axios.post(`http://localhost:3001/parties/${selected._id}/maybe`)
  }

  const handleNotGoing = async () => {

    await axios.post(`http://localhost:3001/parties/${selected._id}/not`)
  }


  const onMapClick = (e) => {
    setSelected(null);
  };


  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;

  }, []);

  const handlePanTo = async ({ lat, lng }) => {
    setTimeout(() => {
      mapRef.current.panTo({ lat, lng });
    }, 500)

    setTimeout(() => {
      mapRef.current.setZoom(18.5);
    }, 700)
  }

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18.5);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <div id="options">
        <Locate panTo={panTo} />
        <Search panTo={panTo} />

        <div className="filter">
          <label htmlFor="genre" style={{ color: 'yellow' }}>
            <select
              placeholder="Select Genre"
              name="genre"
              onChange={handleChange}
              style={{ fontFamily: 'Avenir', color: 'white', backgroundColor: 'black' }}


            >
              <i aria-hidden="true" className="filter icon" style={{ zindex: 111 }}></i>
              <option value="NO" disabled selected>Filter by Genre ↡ </option>
              <option value="EDM">EDM</option>
              <option value="TECHNO">TECHNO</option>
              <option value="ROCK">ROCK</option>
              <option value="JAZZ">JAZZ</option>
              <option value="LATINO">LATINO</option>
              <option value="ALL">ALL GENRES</option>
            </select>
          </label>
        </div>

        <div className="filterDate">
          <select
            name="date"
            // value={state.genre}
            onChange={handleDateChange}
            style={{ fontFamily: 'Avenir', color: 'white', backgroundColor: 'black' }}
          >
            <option value="" disabled selected>Filter by Date ↡ </option>
            <option value="TODAY">TODAY</option>
            <option value="TOMORROW">TOMORROW</option>
            <option value="THIS WEEK">THIS WEEK</option>
          </select>
        </div>

        <div className="filterTheme">
          <select
            name="theme"
            // value={state.genre}
            onChange={handleThemeChange}
            style={{ fontFamily: 'Avenir', color: 'white', backgroundColor: 'black' }}
          >
            <option value="" disabled selected>Change Theme ↡ </option>
            <option value="VINTAGE">VINTAGE</option>
            <option value="LIGHT">ORANGE</option>
            <option value="DEFAULT">DARK</option>
            <option value="APPLE">APPLE</option>
            <option value="AVOCADO">AVOCADO</option>
          </select>
        </div>

      </div>

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
        clickableIcons={true}
      >
        {parties.map((party) => (
          <Marker
            className="bounce"
            zIndex={10}
            animation={window.google.maps.Animation.BOUNCE}
            key={`${party.lat}-${party.lng}` + Math.random() * 100}
            position={{ lat: party.lat, lng: party.lng }}
            onClick={() => {
              setSelected(party);
            }}
            icon={{
              url: party.iconURL || '/bass-guitar.png',
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(party.score + 35 || 35, party.score + 35 || 35),
            }}
          />
        ))}

        {true ? (
          <Marker
            className="bounce"
            zIndex={10}
            animation={window.google.maps.Animation.BOUNCE}
            key={Math.random() * 1000}
            position={{ lat: 41.3851, lng: 2.1734 }}
            icon={{
              url: `/cartman-1.png`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 55),
              scaledSize: new window.google.maps.Size(60, 50),
              labelOrigin: new window.google.maps.Point(26, 55)
            }}
            label={{
              color: 'orange', fontWeight: 'bold', fontSize: '14px', text: 'You are here!', fontFamily: 'Avenir'
              // origin: new window.google.maps.Point(110, 110),
              // anchor: new window.google.maps.Point(30, 55),
            }}
            labelAnchor={new window.google.maps.Point(200, 0)}
          />
        ) : null

        }

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >

            <div className="ui card" id="party_details" style={{ paddingLeft: '8px', width: 'auto' }}>
              <div class="image">
                {/* <img
                // src={ selected.iconURL || '/dj.svg'}
                src={ selected.partyImage||  selected.iconURL}
                // src={ 'http://res.cloudinary.com/partyforecast/image/upload/v1596556305/dev_setups/qcpd66japnjdcuysis8j.jpg'}
                alt="party" /> */}
                <Image
                  key={selected._id}
                  // cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                  cloudName='partyforecast'
                  publicId={selected.partyImage || selected.iconURL}
                  width="10"
                  height='50'
                  crop="crop"
                >
                  <Transformation width="10" height="10" crop="crop" />
                </Image>

              </div>
              <div className="content" >
                <div className="header" style={{ margin: '5px', fontSize: '2rem' }}>
                  {' ' + selected.artists}
                </div>
                <div className="header" style={{ margin: '5px', color: 'blue', letterSpacing: 2.5 }}>
                  {selected.genre}
                </div>
                <div className="description" style={{ margin: '5px', }}>
                  <i class="map marker alternate icon orange"></i> {selected.venue}
                </div>
                <div className="description" style={{ margin: '5px', marginRight: '5px' }}>
                  <i class="calendar alternate outline icon red"></i>
                  {moment(selected.date).format('MMMM Do, h:mm a')}
                </div>
                <a className="ui text blue" href={`https://www.instagram.com/mohmedak_/`}>
                  <i class="instagram icon large"
                    style={{ paddingLeft: '4px', paddingRight: '0px' }}
                  >
                  </i>
                  Instagram
                </a>
                <div className="button_list" style={{ margin: '5px', marginTop: '10px' }}>
                  <button onClick={() => handleGoing(selected)}
                    style={{ paddingRight: '10px' }}
                    className="ui animated button green">
                    <div class="visible content"
                      style={{ paddingRight: '12px' }}
                    > GOING  </div><div class="hidden content"><i aria-hidden="true" class="thumbs up icon"></i></div>
                  </button>
                  <button onClick={handleMaybe}
                    style={{ paddingRight: '12px' }}
                    className="ui animated button orange">
                    <div class="visible content"
                      style={{ paddingRight: '12px' }}
                    >MAYBE {''}{''}
                    </div><div class="hidden content"><i aria-hidden="true" class="question circle icon"></i></div>
                  </button>
                  <button onClick={handleNotGoing} className="ui animated button red"><div class="visible content">NOPE</div><div class="hidden content"><i aria-hidden="true" class="thumbs down icon"></i></div></button>
                </div>
              </div>
            </div>
          </InfoWindow>


        ) : null}

      </GoogleMap>


      <div className="PartyList">
        {partyList ? (
          <PartyList partyList={partyList} {...panTo} handlePanTo={handlePanTo} />
        ) : <h1>No parties in list </h1>}

      </div>

    </div>
  );
}



function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={(e) => {
        e.preventDefault()
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 41.3851, lng: () => 2.1734 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect} className="ui icon input"
      // key={Math.random()*1000}
      >
        <ComboboxInput
          // key={Math.random()*1000}
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search for location or click on compass"
          className="ui_search"
          id="ui_search"
          style={{ fontFamily: 'Avenir', color: 'white' }}
        />
        <i aria-hidden="false" className="search icon large" id="search_icon"></i>
        <ComboboxPopover
        // key={Math.random()*1000}
        >
          <ComboboxList
          // key={Math.random()*1000}
          >
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id + Math.random() * 1000} value={description} style={{ fontFamily: 'Avenir', color: 'white', backgroundColor: 'black' }} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
