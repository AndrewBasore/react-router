import React, {Component} from 'react';
import {Link} from 'react-router';
import axios  from 'axios';
import Albums from './Albums';
import Songs from './Songs';

export default class Artist extends Component {

	componentDidMount(){
		const artistId = this.props.routeParams.artistId;
		const selectArtist = this.props.selectArtist;

		selectArtist(artistId);
	}




	render(){

		const selectedArtist = this.props.selectedArtist;
		const children = this.props.children;
		const propsToPassToChildren = {
			artist: this.props.artist,
			currentSong: this.props.currentSong,
		    isPlaying: this.props.isPlaying,
		    toggleOne: this.props.toggleOne,
		    albums: this.props.selectedArtistAlbums,
			songs: this.props.selectedArtistSongs
		}
		return (
			<div>
			  <h3> {selectedArtist.name}</h3>
			  <ul className="nav nav-tabs">
			    <li><Link activeClassName="active" to={`/artists/${selectedArtist.id}/albums`}>ALBUMS</Link></li>
			    <li><Link activeClassName="active" to={`/artists/${selectedArtist.id}/songs`}>SONGS</Link></li>
			  </ul>
			  { children && React.cloneElement(children, propsToPassToChildren) }
			</div>
		);
	}
}
