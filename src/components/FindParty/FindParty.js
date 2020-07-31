import React, { useEffect} from "react";
import axios from "axios";
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
// import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "../../mapStyles.js";


const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
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
  //initial api call to load data
  useEffect(()=> {
    const getDataAxios = async () => {
      const {data:parties} = await axios.get('http://localhost:3001/parties');
      console.log(parties);
      setAllParties(parties);
      const filteredParties = parties.filter(party => Date.parse(party.date) > Date.now())
      setParties(filteredParties);
    }
    getDataAxios(); //calling the above created function
  },[]);

  const handleChange = (e) => {
    const currentParties = [...allParties]
    const { value } = e.target;
    if (value ==='ALL') {
      setParties(allParties);
      return;
    }
    const filteredParties = currentParties.filter(party => party.genre === value)
    console.log(filteredParties);
    setParties(filteredParties);
  };

  const handleDateChange = (e) => {
    const currentParties = [...allParties]
    const { value } = e.target;
  }

  const handleGoing = async () => {

    await axios.post(`http://localhost:3001/parties/${selected._id}/going`)
    console.log('voted');
  }

  const handleMaybe = async () => {
    await axios.post(`http://localhost:3001/parties/${selected._id}/maybe`)
    console.log('maybe');
  }

  const handleNotGoing = async () => {

    await axios.post(`http://localhost:3001/parties/${selected._id}/not`)
    console.log('not');
  }


  //   {
  //     lat: 41.3861,
  //     lng: 2.1744,
  //     time: new Date(),
  //     venue: "RAZZMATAZZ",
  //     genre: "EDM",
  //     artist: "DISCLOSURE",
  //     score:70,
  //     iconURL: '/trance.png'

  //   },
  //   {
  //     lat: 41.38451,
  //     lng: 2.17934,
  //     time: new Date(),
  //     venue: "APOLO",
  //     genre: "TECHNO",
  //     artist: "DJWHATEVER",
  //     score:40,
  //     iconURL: '/dj.svg'
  //   },
  //   {
  //     lat: 41.3851,
  //     lng: 2.17834,
  //     time: new Date(),
  //     venue: "PACHA",
  //     genre: "ROCK",
  //     artist: "MEGADETH",
  //     score: 50,
  //     iconURL: '/rock2.svg'
  //   },
  //   {
  //     lat: 41.38851,
  //     lng: 2.17834,
  //     time: new Date(),
  //     venue: "PACHA",
  //     genre: "LATINO",
  //     artist: "MEGADETH",
  //     score: 50,
  //     iconURL: '/latin.png'
  //   },
  //   {
  //     lat: 41.38851,
  //     lng: 2.17334,
  //     time: new Date(),
  //     venue: "PACHA",
  //     genre: "HIP-HOP",
  //     artist: "MEGADETH",
  //     score: 50,
  //     iconURL: '/bass-guitar.png'
  //   },
  //   {
  //     lat: 41.38251,
  //     lng: 2.17534,
  //     time: new Date(),
  //     venue: "PACHA",
  //     genre: "JAZZ",
  //     artist: "JAZZER",
  //     score: 50,
  //     iconURL: '/sing.png'
  //   },
  // ]);

  const onMapClick = React.useCallback((e) => {
    // mkae post request to api here
    setParties((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18.5);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <div className="options">
        <h1 className="logo" style={{color: "yellow", fontFamily: "avenir", zIndex:100}}>
          <img src="/logo2.png" alt=""/>
        </h1>

        <Locate panTo={panTo} />
        <Search panTo={panTo} />
      </div>


      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        // onClick={onMapClick}
        onLoad={onMapLoad}
        clickableIcons={true}
      >
        {parties.map((party) => (
          <Marker
            className="bounce"
            draggable={true}
            zIndex={10}
            animation = {window.google.maps.Animation.BOUNCE}
            key={`${party.lat}-${party.lng}`+ Math.random()*100}
            position={{ lat: party.lat, lng: party.lng }}
            onClick={() => {
              setSelected(party);
            }}
            icon={{
              url : party.iconURL || '/bass-guitar.png',
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(party.score + 35 ||35 , party.score + 35 ||35),
              // scaledSize: new window.google.maps.Size(35, 35),

            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
          {/* TODO insert partyDetail component here for users route */}
            <div className="ui card">
            <div class="image"><img src="/sing.png" alt="party" /></div>
              <div className="content">
                <div className="header">Venue : {selected.venue}</div>
                <div className="header">Genre : {selected.genre}</div>
                <div className="header">ARTIST : {selected.artists}</div>
                <div className="header">DATE : {moment(selected.date).format('h:mm a - MMMM Do, YYYY ')} </div>
                <a  href={`${selected.instagram}`}>
                  <i class="instagram icon large"></i> Instagram
                </a>
                <div className="button_list">
                  <button onClick={handleGoing} className="ui animated button green"><div class="visible content">GOING</div><div class="hidden content"><i aria-hidden="true" class="thumbs up icon"></i></div></button>
                  <button onClick={handleMaybe} className="ui animated button orange"><div class="visible content">MAYBE</div><div class="hidden content"><i aria-hidden="true" class="thumbs up counterclockwise rotated icon"></i></div></button>
                  <button onClick={handleNotGoing} className="ui animated button red"><div class="visible content">NOPE!</div><div class="hidden content"><i aria-hidden="true" class="thumbs down icon"></i></div></button>
                </div>
              </div>
            </div>
          </InfoWindow>
          //filter by genre name

        ) : null}
      </GoogleMap>
      <div className="filter">
        <label htmlFor="genre" style={{color:'yellow'}}>
          <select
                placeholder="Select Genre"
                name="genre"
                // value={state.genre}
                onChange={handleChange}
                // className="ui button floating labeled dropdown icon"
                style={{fontFamily:'Avenir',color:'white',backgroundColor:'black'}}


              >
                <i aria-hidden="true" class="filter icon" style={{zindex:111}}></i>
                <option value="" disabled selected>Filter by Genre</option>
                <option value="EDM">EDM</option>
                <option value="TECHNO">TECHNO</option>
                <option value="ROCK">ROCK</option>
                <option value="JAZZ">JAZZ</option>
                <option value="ALL">ALL GENRES</option>
            </select>
        </label>
      </div>

      <div className="filterDate">
          <select
                name="date"
                // value={state.genre}
                // onChange={handleDateChange}
                style={{fontFamily:'Avenir',color:'white',backgroundColor:'black'}}
              >
                <option value="" disabled selected>Filter by Date </option>
                <option value="TODAY">TODAY</option>
                <option value="TOMORROW">TOMORROW</option>
                <option value="DAY-AFTER">DAY-AFTER</option>
            </select>
      </div>
      <div className="filterTheme">
          <select
                name="theme"
                // value={state.genre}
                // onChange={handleThemeChange}
                style={{fontFamily:'Avenir',color:'white',backgroundColor:'black'}}
              >
                <option value="" disabled selected>Change Theme </option>
                <option value="VINTAGE">VINTAGE</option>
                <option value="LIGHT">LIGHT</option>
                <option value="DEFAULT">DEFAULT</option>
            </select>
      </div>
    </div>

  );
}



function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
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
      <img src="/compass2.svg" alt="compass" />
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
      <Combobox onSelect={handleSelect} className="ui icon input">
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search for location or click on compass"
          className="ui search"
          id="ui_search"
          style={{fontFamily:'Avenir', color:'white'}}
        />
        <i aria-hidden="false" className="search icon" id="search_icon"></i>
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id + Math.random()*100 } value={description} style={{fontFamily:'Avenir', color:'white', backgroundColor:'black'}} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
