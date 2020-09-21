import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import '../../index.css';
import Locate from '../Locate/Locate';
import Search from '../Search/Search';
import { generateIconURL } from '../../ApiClient'

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PartyList from '../PartyList/PartyList.js';
import mapStyles2 from "../../MapThemes/mapStyles2.js";

const libraries = ["places"];

const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
};

const options = {
  styles: mapStyles2,
  disableDefaultUI: true,
  zoomControl: true,
};

const center = {
  lat: 41.4056448,
  lng: 2.1725184000000004,
};

const serverApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

HostAParty.defaultProps = {
  userId: 123456789,
}

export default function HostAParty({ userId }) {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });


  const initialState = {
    artists: null,
    venue: null,
    date: null,
    genre: null,
    lat: null,
    lng: null,
    instagram: null
  }

  const [parties, setParties] = React.useState([]);
  const [partyList, setPartyList] = React.useState([]);
  const [state, setState] = React.useState(initialState);
  const [selected, setSelected] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [fileInputState, setFileInputState] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    const getDataAxios = async () => {
      const { data: parties } = await axios.get(`${serverApiUrl}/parties/${userId || 1234567}`);
      const filteredParties = parties.filter(party => Date.parse(party.date) > Date.now())

      setParties(filteredParties);
    }
    getDataAxios();
  }, []); //eslint-disable-line

  useEffect(() => {
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

  // CLOUDINARY
  const handleColudinaryFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    setTimeout(() => {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(17);
    }, 1000)
  }, []);


  const onMapClick = (e) => {
    setParties((current) => [...current,
    {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date(),
    },
    ]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImageAndPost(reader.result);
    };
    reader.onerror = () => {
      console.error('AHHHHHHHH!!');
    };
  }

  let party;

  async function uploadImageAndPost(base64EncodedImage) {
    try {
      fetch(`${serverApiUrl}/upload`, {
        method: 'POST',
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then(async imageURL => {
          setFileInputState('');
          const { date, venue, artists, genre, instagram } = state;
          const latitude = selected.lat;
          const longitude = selected.lng;
          const iconURL = generateIconURL(genre);

          party = { date, venue, artists, genre, latitude, longitude, iconURL, instagram, imageURL, userId }
          console.log('submitted', party)

          await axios.post(`${serverApiUrl}/parties`, {
            artists: artists,
            venue: venue,
            date: date,
            genre: genre,
            lat: latitude,
            lng: longitude,
            iconURL: iconURL,
            instagram: instagram,
            userId: Number(userId),
            partyImage: imageURL,
          })
          setSubmitted(true);

          const currentPartyList = [...partyList];
          currentPartyList.push(party);
          const sortedParties = currentPartyList.sort((a, b) => {
            if (a.date > b.date) return 1;
            return -1;
          });
          await setPartyList(sortedParties);
          setState(initialState);
          setSelected(null);
        })
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    return (
      !state.date || !state.venue || !state.artists || !state.genre || !selectedFile
    );
  };


  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";
  console.log('rendered')

  return (
    <div>
      <div className="options.." style={{ position: 'absolute', top: '5%', left: '40%', height: '1%', width: '5%' }}>
        <Search panTo={panTo} />
      </div>
      <Locate panTo={panTo} style={{ position: 'absolute', top: '55%', left: '55%' }} id="locate_host" />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
        clickableIcons={true}
        style={{ display: 'none' }}
      >
        {parties ? parties.map((party) => (
          <Marker
            draggable={true}
            zIndex={10}
            animation={window.google.maps.Animation.BOUNCE}
            key={`${party.lat}-${party.lng}` + Math.random() * 100}
            position={{ lat: party.lat, lng: party.lng }}
            onClick={() => setSelected(party)}
            icon={{
              url: `/google-maps.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 55),
              scaledSize: new window.google.maps.Size(60, 50),
            }}
          />
        )) : <h1>Loading</h1>}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
              setPreviewSource('');
            }}
          >
            <form className="ui form " onSubmit={handleSubmit}>
              <label htmlFor="venue">VENUE</label>
              <input
                type="text"
                required
                placeholder="Add venue"
                name="venue"
                value={state.venue}
                onChange={handleChange}
              />

              <label htmlFor="genre">SELECT GENRE</label>
              <select
                placeholder="Select Genre"
                required
                name="genre"
                value={state.genre}
                onChange={handleChange}
              >
                <option value="" disabled selected>Select Genre</option>
                <option value="EDM">EDM</option>
                <option value="TECHNO">TECHNO</option>
                <option value="ROCK">ROCK</option>
                <option value="JAZZ">JAZZ</option>
                <option value="LATINO">LATINO</option>
                <option value="PSY">JAZZ</option>
              </select>
              <label htmlFor="artists">ARTISTS</label>
              <input
                type="text"
                required
                placeholder="Artists performing.."
                name="artists"
                value={state.artists}
                onChange={handleChange}
              />

              <label htmlFor="date">DATE & TIME</label>
              <input
                type="datetime-local"
                required
                name="date"
                value={state.date}
                onChange={handleChange}
                placeholder="05/12/2019, 12:09"
              />
              <label htmlFor="instagram">Link to Instagram account</label>
              <input
                type="string"
                required={false}
                name="instagram"
                value={state.instagram}
                onChange={handleChange}
                placeholder="Add link here.."
              />
              <label htmlFor="partyImage">Select Image to upload</label>
              <input
                id="fileInput"
                type="file"
                name="image"
                onChange={handleColudinaryFileInputChange}
                value={fileInputState}
                className="form-input"
                placeholder="UpLoad Image"
              />
              <br />
              <button className="ui animated button primary" type="submit" disabled={validateForm()}>
                <div class="visible content">SUBMIT</div><div class="hidden content"><i aria-hidden="true" class="thumbs up icon"></i></div>
              </button>
            </form>
          </InfoWindow>
        ) : null}

        {submitted && previewSource ? (
          <InfoWindow
            position={{ lat: parties[parties.length - 1].lat, lng: parties[parties.length - 1].lng }}
            style={{ width: 'auto', height: 'auto' }}
            onCloseClick={() => {
              setSelected(null);
              setSubmitted(null);
            }}
          >
            <div style={{ display: 'flex', width: 'auto', height: 'auto' }}>
              <h1 style={{ position: 'absolute', color: 'yellow', top: 130, left: 110 }}>
                Your Party has been Registered!!
              </h1>
              <img
                src={previewSource}
                alt="chosen"
                style={{ height: '300px' }}
              />
            </div>
          </InfoWindow>
        ) : null}

        <Marker
          className="bounce"
          zIndex={10}
          animation={window.google.maps.Animation.BOUNCE}
          key={Math.random() * 100}
          position={{ lat: 41.4056448, lng: 2.1725184 }}
          icon={{
            url: `/kyle-2.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(30, 55),
            scaledSize: new window.google.maps.Size(60, 50),
            labelOrigin: new window.google.maps.Point(26, 57)
          }}
          label={{
            color: 'crimson', fontWeight: 'bolder', fontSize: '16px', text: 'You are here !', fontFamily: 'Avenir'
          }}
          labelAnchor={new window.google.maps.Point(200, 0)}
        />

      </GoogleMap>

      <div className="PartyList">
        {partyList ? (
          <PartyList partyList={partyList} />
        ) : <h1 style={{ zindex: 1000 }}>
            No parties in list
        </h1>}
      </div>
    </div>
  );
}
