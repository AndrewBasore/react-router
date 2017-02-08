import React,  {Component} from 'react';
import Songs from '../components/Songs';

export default class Album extends Component {

  constructor(props){
    super(props);

    this.album = props.album;
    this.currentSong = props.currentSong;
    this.isPlaying = props.isPlaying;
    this.toggleOne = props.toggleOne;

  }

  componentDidMount() {
    const albumId = this.props.routeParams.albumId;
    const selectAlbum = this.props.selectAlbum;
    console.log("componentDidMount!");
    selectAlbum(albumId);
  }


  render () {
    console.log(this.album);
    return (
      <div className="album">
        <div>
          <h3>{ this.album.name }</h3>
          <img src={ this.album.imageUrl } className="img-thumbnail" />
        </div>
        <Songs
          songs={this.album.songs}
          currentSong={this.currentSong}
          isPlaying={this.isPlaying}
          toggleOne={this.toggleOne} />
      </div>
    );
  }

}

