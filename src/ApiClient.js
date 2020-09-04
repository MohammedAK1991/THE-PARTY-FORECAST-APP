const serverApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

export const generateIconURL = (genre) => {
  switch (genre) {
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

// export const handleColudinaryFileInputChange = (e) => {
//   const file = e.target.files[0];
//   previewFile(file);
//   setSelectedFile(file);
//   setFileInputState(e.target.value);
// };

// export const previewFile = (file) => {
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onloadend = () => {
//     setPreviewSource(reader.result);
//   };
// };