import React, {Component} from 'react';
import {Link} from 'react-router';


export default class Artists extends Component {

	render(){

		return (
			<div>
			  <h3>Artists</h3>
			    <div className="list-group">
			    {
			      this.props.artists.map(artist => {
			        return (
			          <div className="list-group-item" key={artist.id}>
			            {/* determine where to actually Link to later! */}
			            <Link to={`/artists/${artist.id}`}>{ artist.name }</Link>
			          </div>
			        )
			      })
			    }
			  </div>
			</div>
		);
	}
}
