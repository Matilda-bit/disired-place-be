import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import {sortedPlacesByDistance} from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

//const places = localStorage.getItem();

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching ] = useState(false);
  const [ error, setError ] = useState();

  useEffect( () => {
    //browser func - fetch
    //await works only in async functions
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortedPlacesByDistance(
            places, 
            position.coords.latitude, 
            position.coords.longitude)
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });


      } catch (error) {
        setError({
          message: 
          error.message || "Could not fetch places, please try again later."
        });
        setIsFetching(false);
      }
     
    }
    fetchPlaces();
    }
    ,[]);// execute immediately after this component function executed, but only if it's dependency is changed - [] 


    if (error) {
      return <Error title="An error occurred!" message={error.message} />
    }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
