import React from "react";
import {
    GoogleMap,
    withGoogleMap,
    withScriptjs,
    Marker
} from "react-google-maps";
// import { AroundMarker } from './AroundMarker';
// import { POS_KEY } from "../constants";

class NormalAroundMap extends React.Component {
    render() {
        return (
            <GoogleMap
                defaultZoom={8}
                defaultCenter={{ lat: -34.397, lng: 150.644 }}
            >
                <Marker position={{ lat: -34.397, lng: 150.644 }} />
            </GoogleMap>
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
