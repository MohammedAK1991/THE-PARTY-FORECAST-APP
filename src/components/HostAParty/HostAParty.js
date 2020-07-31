import React from "react";
import axios from 'axios';
import '../../index.css';
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
import mapStyles2 from "../../mapStyles2.js";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles2,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 41.3851,
  lng: 2.1734,
};


export default function HostAParty() {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [parties, setParties] = React.useState([]);
  //   {
  //     lat: 41.3951,
  //     lng: 2.1934,
  //     time: new Date(),
  //     venue: "RAZZMATAZZ",
  //     genre: "EDM",
  //     artist: "DISCLOSURE"
  //   },
  //   {
  //     lat: 41.38951,
  //     lng: 2.18934,
  //     time: new Date(),
  //     venue: "APOLO",
  //     genre: "TECHNO",
  //     artist: "DISCLOSURE"
  //   },
  //   {
  //     lat: 41.38851,
  //     lng: 2.18834,
  //     time: new Date(),
  //     venue: "PACHA",
  //     genre: "EDM",
  //     artist: "ROCK"
  //   },
  // ]);

  const initialState = {
    artists: null,
    venue: null,
    date: null,
    genre: null,
    lat: null,
    lng: null,
    instagram: null
  }

  const [state, setState] = React.useState(initialState);
  const [selected, setSelected] = React.useState(null);

/*
  const onMapClick = React.useCallback((e) => {
    console.log(e.latLng.lat(),e.latLng.lng());
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
  */
  const onMapClick = (e) => {
    // mkae post request to api here
    setParties((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  };

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(17);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";


//for the form

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateIconURL = (genre) => {
    switch(genre) {
      case 'JAZZ':
        return '/sing.png';
      case 'EDM':
        return '/dj.svg';
      case 'ROCK':
        return '/rock2.svg';
      case 'TECHNO':
        return '/trance.png';
      default:
        return '/latin.png';
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add logic to send send a request to the API service /register
    const { date, venue, artists, genre, instagram } = state;
    const latitude = selected.lat;
    const longitude = selected.lng;
    const iconURL = generateIconURL(genre);
    const party = { date, venue, artists, genre, latitude, longitude,iconURL,instagram }
    console.log('submitted', party)
    // const res = await apiService.register(user);
    await axios.post('http://localhost:3001/parties/', {
      artists: artists,
      venue: venue,
      date: date,
      genre: genre,
      lat: latitude,
      lng: longitude,
      iconURL: iconURL,
      instagram: instagram,
      })
    setState(initialState);
    setSelected(null);

  };
  const validateForm = () => {
    return (
      !state.date || !state.venue || !state.artists || !state.genre
    );
  };

  return (
    <div>
      <div className="options">
        <Locate panTo={panTo} />
        <Search panTo={panTo} />
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
        {parties ? parties.map((party) => (
          <Marker
            draggable={true}
            zIndex={10}
            // animation = {window.google.maps.Animation.BOUNCE}
            key={`${party.lat}-${party.lng}`+ Math.random()*100}
            position={{ lat: party.lat, lng: party.lng }}
            onClick={() => {
              setSelected(party);
            }}

            icon={{
              url: `/google-maps.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 55),
              scaledSize: new window.google.maps.Size(60, 50),
            }}
          />
        )):<h1>Loading</h1>}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >

          {/* TODO insert partyDetail component here for users route */}
              <form className="ui form " onSubmit={handleSubmit}>
                <label  htmlFor="venue">VENUE</label>
                <input
                  type="text"
                  required
                  placeholder="Add venue"
                  name="venue"
                  value={state.venue}
                  onChange={handleChange}
                />

                <label  htmlFor="genre">SELECT GENRE</label>
                <select
                  placeholder="Select Genre"
                  required
                  name="genre"
                  value={state.genre}
                  onChange={handleChange}
                >
                  <option value="EDM">EDM</option>
                  <option value="TECHNO">TECHNO</option>
                  <option value="ROCK">ROCK</option>
                  <option value="JAZZ">JAZZ</option>
                </select>
                <label  htmlFor="artists">ARTISTS</label>
                <input
                  type="text"
                  required
                  placeholder="Artists performing.."
                  name="artists"
                  value={state.artists}
                  onChange={handleChange}
                />

                <label  htmlFor="date">DATE & TIME</label>
                <input
                  type="datetime-local"
                  required
                  name="date"
                  value={state.date}
                  onChange={handleChange}
                  placeholder="05/12/2019, 12:09"
                />
                <label  htmlFor="instagram">Link to Instagram account</label>
                <input
                  type="string"
                  required={false}
                  name="instagram"
                  value={state.instagram}
                  onChange={handleChange}
                  placeholder="Add link here.."
                />
                <br/>
                <button className="ui button primary" type="submit" disabled={validateForm()}>
                  &nbsp;Register&nbsp;
                </button>
              </form>
          </InfoWindow>
        ) : null}
      </GoogleMap>
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
      <Combobox onSelect={handleSelect}className="ui icon input">
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
