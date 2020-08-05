import React, {useRef, useState} from "react";
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


import "@reach/combobox/styles.css";

import mapStyles2 from "../../mapStyles2.js";
import PartyList from '../PartyList/PartyList.js';

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


export default function HostAParty({userId}) {


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [parties, setParties] = React.useState([]);
  const [partyList,setPartyList] = React.useState([]);

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
  const [submitted,setSubmitted] = React.useState(false);
  const [fileInputState, setFileInputState] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [selectedFile, setSelectedFile] = useState();

  const markerRef = React.useRef(null);



  React.useEffect(()=> {
  const getDataAxios = async () => {
    const {data:parties} = await axios.get('http://localhost:3001/parties');

    const filteredParties = parties.filter(party => (Date.parse(party.date) > Date.now()) && (party.userId == userId))
    await setPartyList(filteredParties);
  }
  getDataAxios(); //calling the above created function
},[userId]);

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
  //CLOUDINARY

  const handleFileInputChange = (e) => {
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



  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    setTimeout(() => {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(17);
    },1000)
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const onMapClick = (e) => {
    console.log(e.latLng.lat());
    panTo({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }); // to make map pan to the marker
    setParties((current) => [
      // ...current, // to render only one marker
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  };

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
        return '/jazz.svg';
      case 'EDM':
        return '/musician.svg';
      case 'ROCK':
        return '/rock2.svg';
      case 'TECHNO':
        return '/techno-music.svg';
      case 'LATINO':
        return '/woman.svg';
      case 'PSY':
        return '/trance.png';
      default:
        return '/latin.png';
    }
  }

  let party;
  let daImageURL;

  const handleSubmit = async (e) => {
    e.preventDefault();

     //code for cloudinary handlesubmit
    if (!previewFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
        uploadImage(reader.result);
    };
    reader.onerror = () => {
        console.error('AHHHHHHHH!!');

    };

  };

  async function uploadImage (base64EncodedImage) {
    try {
        fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: JSON.stringify({ data: base64EncodedImage }),
            headers: { 'Content-Type': 'application/json' },
        })
          .then(res => res.json())
          .then( async imageURL => {

            setFileInputState('');
            const { date, venue, artists, genre, instagram } = state;
            const latitude = selected.lat;
            const longitude = selected.lng;
            const iconURL = generateIconURL(genre);
            party = { date, venue, artists, genre, latitude, longitude,iconURL,instagram,userId, imageURL }
            console.log('submitted', party)

            await axios.post('http://localhost:3001/parties/', {
              artists: artists,
              venue: venue,
              date: date,
              genre: genre,
              lat: latitude,
              lng: longitude,
              iconURL : iconURL,
              instagram : instagram,
              userId : Number(userId),
              partyImage : imageURL
              })
              //party created message
            setSubmitted(true);

            //adding to partyList
            const currentPartyList = [...partyList];

            currentPartyList.push(party);
            // await setPartyList(currentPartyList);
            // await setPartyList([...partyList, party]);
            const sortedParties = currentPartyList.sort((a, b) => {
              if(a.date > b.date) return 1;
              return -1;
            });
            await setPartyList(sortedParties);

            setState(initialState);
            setSelected(null);



          })


        // setSuccessMsg('Image uploaded successfully');
    } catch (err) {
        console.error(err);
        // setErrMsg('Something went wrong!');
    }
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
            ref={markerRef}
            animation = {window.google.maps.Animation.BOUNCE}
            key={`${party.lat}-${party.lng}`+ Math.random()*100}
            position={{ lat: party.lat, lng: party.lng }}
            onClick={() => {
              markerRef.current.animation = window.google.maps.Animation.BOUNCE;
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
              setPreviewSource('');
            }}
          >
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
                  <option value="" disabled selected>Select Genre</option>
                  <option value="EDM">EDM</option>
                  <option value="TECHNO">TECHNO</option>
                  <option value="ROCK">ROCK</option>
                  <option value="JAZZ">JAZZ</option>
                  <option value="LATINO">LATINO</option>
                  <option value="PSY">JAZZ</option>
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
                <label  htmlFor="partyImage">Select Image to upload</label>
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                    placeholder="UpLoad Image"
                />
                <br/>
                <button className="ui animated button primary" type="submit" disabled={validateForm()}>

                <div class="visible content">SUBMIT</div><div class="hidden content"><i aria-hidden="true" class="thumbs up icon"></i></div>
                </button>
              </form>
          </InfoWindow>
        ) : null}

        {submitted && previewSource ? (
          <InfoWindow
            position={{ lat: parties[parties.length - 1].lat, lng: parties[parties.length - 1].lng }}
            style={{width:'auto',height:'auto'}}
            onCloseClick={() => {
              setSelected(null);
              setSubmitted(null);
            }}
          >
            <div style={{display:'flex',width:'auto',height:'auto'}}>
              <h1 style={{position:'absolute', top:120, left:110}}>
                Party Registered!!
              </h1>
              {/* <img src={ party.iconURL || '/dj.svg' } alt="icon"/> */}
              {/* <img src={ '/dj.svg' } alt="icon"/> */}
              <img
                src={previewSource}
                alt="chosen"
                style={{ height: '300px' }}
              />

            </div>
          </InfoWindow>
        ) : null}

        {true ? (
          <Marker
            className="bounce"
            zIndex={10}
            animation = {window.google.maps.Animation.BOUNCE}
            key={Math.random()*100}
            position={{ lat: 41.3851, lng: 2.1734}}
            icon={{
              url: `/kyle-2.png`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(30, 55),
              scaledSize: new window.google.maps.Size(60, 50),
              labelOrigin: new window.google.maps.Point(26,57)
            }}
            label={{
              color: 'crimson', fontWeight: 'bolder', fontSize: '16px', text: 'You are here !',fontFamily: 'Avenir'
              // origin: new window.google.maps.Point(110, 110),
              // anchor: new window.google.maps.Point(30, 55),
            }}
            labelAnchor={new window.google.maps.Point(200, 0)}
          />
        ) :null
        }

      </GoogleMap>

      <div className="PartyList">
        {partyList ? (
          <PartyList partyList={partyList} />
        ): <h1 style={{zindex:1000}}>
          No parties in list
        </h1> }

      </div>

    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate_host"
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
    <div className="search_host">
      <Combobox onSelect={handleSelect} className="ui icon input">
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search for location or click on compass"
          className="ui_search"
          id="ui_search_find"
          style={{fontFamily:'Avenir', color:'white'}}
        />
        <i aria-hidden="false" className="search icon large" id="search_icon"></i>
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id + Math.random()*1000 } value={description} style={{fontFamily:'Avenir', color:'white', backgroundColor:'black'}} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
