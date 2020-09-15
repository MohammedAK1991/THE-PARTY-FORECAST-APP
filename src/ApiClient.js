
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
