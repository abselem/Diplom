import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapContainer extends Component {
  render() {
    const mapStyles = {
      width: '100%',
      height: '100%',
    };

    const address = '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA';

    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{ lat: 37.7749, lng: -122.4194 }}
      >
        <Marker position={{ lat: 37.7749, lng: -122.4194 }} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBCIK6mitPP0zrkYI4nVT48bMZONaRGqkE',
})(MapContainer);