const loadPlaces = function (coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    const method = 'api';

    const PLACES = [
        {
            name: "Fruteria",
            location: {
                lat: 19.715469, // add here latitude if using static data
                lng: -103.465902, // add here longitude if using static data
            }
        },
    ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return Promise.resolve(PLACES);
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'HKAW5VITMAJNCPSOD3ADM3GGWN4SPT2MGPYAZLDWWOZRRNLZ',
        clientSecret: 'OCR21ENMN54X5JO4BIK3X2OOMNKDJYPJTJ3D0KFDXGBQ2WSI',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=5
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'https://www.facebook.com/JuggerGus/');
                    text.setAttribute('scale', '15 15 15');

                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: '19.715469'; longitude: '-103.465902' ;`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'https://drive.google.com/drive/u/0/my-drive');
                    text.setAttribute('scale', '15 15 15');
                    // add place icon
                    const icon = document.createElement('a-image');
                    icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                    icon.setAttribute('name', place.name);
                    icon.setAttribute('src', './map-marker.png');


                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
