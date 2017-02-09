import React, { Component } from 'react';
import axios from 'axios';

import initialState from '../initialState';
import AUDIO from '../audio';

import Albums from '../components/Albums.js';
import Album from '../components/Album';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

import { convertAlbum, convertAlbums, skip, convertSong } from '../utils';

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.toggle = this.toggle.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
  }

  componentDidMount () {
    axios.get('/api/albums/')
      .then(res => res.data)
      .then(album => this.onLoad(convertAlbums(album)));

    axios.get('/api/artists/')
      .then(res => res.data)
      .then(artists => this.setState({artists: artists}));




    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));
  }

  onLoad (albums) {
    this.setState({
      albums: albums
    });
  }

  play () {
    AUDIO.play();
    this.setState({ isPlaying: true });
  }

  pause () {
    AUDIO.pause();
    this.setState({ isPlaying: false });
  }

  load (currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    this.setState({
      currentSong: currentSong,
      currentSongList: currentSongList
    });
  }

  startSong (song, list) {
    this.pause();
    this.load(song, list);
    this.play();
  }

  toggleOne (selectedSong, selectedSongList) {
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }


  toggle () {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  next () {
    this.startSong(...skip(1, this.state));
  }

  prev () {
    this.startSong(...skip(-1, this.state));
  }

  setProgress (progress) {
    this.setState({ progress: progress });
  }

  selectAlbum (albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album => {
        this.setState({
              selectedAlbum: convertAlbum(album)
            })

      });
  }

  selectArtist (artistId) {
    axios.get(`/api/artists/${artistId}`)
      .then(res => res.data)
      .then( artist => {
        axios.get(`/api/artists/${artist.id}/songs`)
          .then(res => res.data)
          .then(songs => {
            songs = songs.map(convertSong);

            axios.get(`/api/artists/${artist.id}/albums`)
              .then(res => res.data)
              .then(albums => {
                albums = albums.map(convertAlbum);
                this.setState({
                  selectedArtist: artist,
                  selectedArtistSongs: songs,
                  selectedArtistAlbums: albums
                })
              })
          })
      })

  }



  render () {
    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar />
        </div>
        <div className="col-xs-10">
        {

          this.props.children ?
          React.cloneElement(this.props.children, {
                  album: this.state.selectedAlbum,
                  artist: this.state.selectedArtist,
                  currentSong: this.state.currentSong,
                  isPlaying: this.state.isPlaying,
                  toggleOne: this.toggleOne,

                  // Albums (plural) component's props
                  albums: this.state.albums,
                  selectAlbum: this.selectAlbum,
                  artists: this.state.artists,

                  //props for Artist rendering
                  selectArtist: this.selectArtist,
                  selectedArtistSongs: this.state.selectedArtistSongs,
                  selectedArtistAlbums: this.state.selectedArtistAlbums,
                  selectedArtist: this.state.selectedArtist
          })
          : null

        }
        </div>
        <Player
          currentSong={this.state.currentSong}
          currentSongList={this.state.currentSongList}
          isPlaying={this.state.isPlaying}
          progress={this.state.progress}
          next={this.next}
          prev={this.prev}
          toggle={this.toggle}
        />
      </div>
    );
  }
}
