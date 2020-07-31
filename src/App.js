import React from "react";
import './index.css'
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
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles.js";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  // styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
};
const center = {
  lat: 41.3851,
  lng: 2.1734,
};

const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    // "/Users/mohammedabdulkhader/otherJSexercises/DA-PARTY-FORECAST-APP/public/noun_Flower_308192.png"
    // '/public/edm.svg'

export default function App() {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [parties, setParties] = React.useState([
    {
      lat: 41.3951,
      lng: 2.1934,
      time: new Date(),
      venue: "RAZZMATAZZ",
      genre: "EDM",
      artist: "DISCLOSURE"
    },
    {
      lat: 41.38951,
      lng: 2.18934,
      time: new Date(),
      venue: "APOLO",
      genre: "TECHNO",
      artist: "DISCLOSURE"
    },
    {
      lat: 41.38851,
      lng: 2.18834,
      time: new Date(),
      venue: "PACHA",
      genre: "EDM",
      artist: "ROCK"
    },
  ]);

  const [selected, setSelected] = React.useState(null);
/*
  // make initial getallParties api call here to load all the parties
  React.useEffect(()=> {
    const getDataAxios = async () => {
      const {data:parties} = await axios.get('http://localhost:3001/parties');
      const filteredParties = parties.filter(party => Date.parse(party.date) > Date.now())

      setParties(filteredParties);

    }
    getDataAxios(); //calling the above created function
  },[])
*/
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
    mapRef.current.setZoom(17);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <div className="options">
        <h1 className="logo" style={{color: "yellow", fontFamily: "avenir"}}>
          THE PARTY FORECAST APP{" "}
          <span role="img" aria-label="tent">
            🕺🏻
          </span>
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
        onClick={onMapClick}
        onLoad={onMapLoad}
        clickableIcons={true}
      >
        {parties.map((party) => (
          <Marker
            draggable={true}
            // title={'party'}
            // label={'party'}
            zIndex={10}
            animation = {window.google.maps.Animation.BOUNCE}
            key={`${party.lat}-${party.lng}`+ Math.random()*100}
            position={{ lat: party.lat, lng: party.lng }}
            onClick={() => {
              setSelected(party);
            }}
            // icon = {{
            //   path: new window.google.maps.SymbolPath.CIRCLE,
            //   scale: 10
            // }}
            // icon={image}
            icon={{
              url: `https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png`,
              // url:'DA-PARTY-FORECAST-APP/public/noun_Flower_308192.png',
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(50, 50),
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
          {/* TODO insert createParty component here for client route */}
          {/* TODO insert partyDetail component here for users route */}
            <div>
              <h2>
                <span role="img" aria-label="bear">
                  😈
                </span>{" "}
                PARTY ALERT!
              </h2>
              <p>Party {formatRelative(selected.time, new Date())}</p>
              <p>Venue : {selected.venue}</p>
              <p>Genre : {selected.genre}</p>
              <p>ARTIST : {selected.artist}</p>
            </div>
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
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search for location or click on compass"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id + Math.random()*100 } value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
