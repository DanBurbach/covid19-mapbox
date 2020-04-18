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
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'cases'],
                1, '#ffffb2',
                5000, '#fed976',
                10000, '#feb24c',
                25000, '#fd8d3c',
                50000, '#fc4e2a',
                75000, '#e31a1c',
                100000, '#b10026'
            ],
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

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        let lastId;

        map.on('mousemove', 'circles', (e) => {
            const id = e.features[0].properties.id;
            if (id !== lastId) {
                lastId = id;

                const { cases, deaths, country, province} = e.features[0].properties;

                map.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();

                const countryISO = lookup.byCountry(country)?.iso2 || lookup.byInternet(country)?.iso2;

                const provinceHTML = province !== 'null' ? `<p>Province: <b>${province}</b></p>` : '';

                const mortalityRate = ((deaths / cases) * 100).toFixed(2);

                const countryFlagHTML = Boolean(countryISO) 
                    ? `<img src="https://www.countryflags.io/${countryISO}/flat/64.png"></img>` 
                    : '';

                const HTML = `<p>Country: <b>${country}</b></p>
                        ${provinceHTML}
                        <p>Cases: <b>${cases}</b></p>
                        <p>Deaths: <b>${deaths}</b></p>
                        <p>Mortality Rate: <b>${mortalityRate}%</b></p>
                        ${countryFlagHTML}`;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                popup.setLngLat(coordinates).setHTML(HTML).addTo(map);
                }
            });

            map.on("mouseleave", "circles", function() {
                lastId = undefined;
                map.getCanvas().style.cursor = "";
                popup.remove();
            });
      });
    }
  }, [data]);

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
