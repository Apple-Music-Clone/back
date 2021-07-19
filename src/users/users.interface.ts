interface User {
  uuid: string;
  name: string;
  country: string;
  playlists: any[];
  favoritedPlaylists: any[];
  likedMusics: any[];
  library: any[];
  devices: any[];
}

export default User;
