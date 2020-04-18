import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import useSWR from 'swr'; // React hook to fetch the data
import lookup from 'country-code-lookup'; // npm module to get ISO Code for countries

import '../../assets/Main.scss';

// Mapbox css - needed to make tooltips work later in this article
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGJ1cmJhY2gxOTgyIiwiYSI6ImNrNjhhbXNwbzAzMWczcG56azQ2anhlcmsifQ.oIeM3Zzm_nFsu-dbACDbZg';

function Main() {
    const mapboxElRef = useRef(null); // DOM element to render map

    const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) =>
        data.map((point, index) => ({
            type: 'Feature',
            geometry: {
            type: 'Point',
            coordinates: [
                point.coordinates.longitude,
                point.coordinates.latitude,
            ],
            },
            properties: {
            id: index,
            country: point.country,
            province: point.province,
            cases: point.stats.confirmed,
            deaths: point.stats.deaths,
            },
        }))
    );

    const { data } = useSWR('https://corona.lmao.ninja/v2/jhucsse', fetcher);

  // Initialize our map
    useEffect(() => {
    if (data) {
        const map = new mapboxgl.Map({
            container: mapboxElRef.current,
            style: 'mapbox://styles/notalemesa/ck8dqwdum09ju1ioj65e3ql3k',
            center: [16, 27],
            zoom: 2,
        });

      // Call this method when the map is loaded
      map.once('load', function() {
        // Add our SOURCE
        // with id 'points'
        map.addSource('points', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data
          }
        });
        map.addControl(new mapboxgl.NavigationControl());
        // Add our layer
        map.addLayer({
          id: 'circles',
          source: 'points', // this should be the id of the source
          type: 'circle',
          paint: {
            'circle-opacity': 0.75,
            'circle-stroke-width': 1,
            'circle-color': '#FFEB3B',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'cases'],
              1, 4,
              1000, 8,
              4000, 10,
              8000, 14,
              12000, 18,
              100000, 40
            ],
          }
        });
      });
    }
  }, [data]);


//     // Add navigation controls to the top right of the canvas
//     map.addControl(new mapboxgl.NavigationControl());
//   }, []);

  return (
    <div className='App'>
      <div className='mapContainer'>
        {/* Assigned Mapbox container */}
        <div className='mapBox' ref={mapboxElRef} />
      </div>
    </div>
  );
}

export default Main;
