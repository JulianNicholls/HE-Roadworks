import { useState, useEffect } from 'react';
import axios from 'axios';

import LoadingPanel from './LoadingPanel';
import ReactModal from 'react-modal';
import RoadworksMap from 'google-map-react';

const nearbySite = `https://nearby-proxy.vercel.app/api/getLatLong?place=`;

ReactModal.setAppElement('#root');

ReactModal.defaultStyles = {
  ...ReactModal.defaultStyles,
  overlay: {
    ...ReactModal.defaultStyles.overlay,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    ...ReactModal.defaultStyles.content,
    top: '10vh',
    bottom: '10vh',
    left: '10vw',
    right: '10vw',
  },
};

interface LatLong {
  lat: number;
  lng: number;
}

const Pointer = (props: LatLong): JSX.Element => {
  return (
    <span className="pointer" role="img" aria-label="roadworks-location">
      👆
    </span>
  );
};

interface MapModalProps {
  centre: ENLocation;
}

const MapModal = ({ centre }: MapModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mapCentre, setMapCentre] = useState<LatLong>({ lat: 0, lng: 0 });

  useEffect(() => {
    const translateCentre = async () => {
      let response, fullURL;

      setLoading(true);

      try {
        fullURL = `${nearbySite}${centre.east},${centre.north}`;
        response = await axios.get(fullURL);

        if (response.status === 200) {
          const { lat, lng } = response.data;
          setMapCentre({ lat, lng });
          setLoading(false);
          setOpen(true);
        } else {
          console.warn({ fullURL, response });
          setLoading(false);
        }
      } catch (error) {
        console.error({ error });
        console.warn({ fullURL, response });
        setLoading(false);
      }
    };

    if (centre.north === 0 && centre.east === 0) {
      setOpen(false);
    } else translateCentre();
  }, [centre]);

  return (
    <>
      {loading ? (
        <LoadingPanel />
      ) : (
        <ReactModal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          contentLabel="Roadworks Map"
        >
          <div id="map">
            <RoadworksMap
              bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY! }}
              defaultCenter={mapCentre}
              defaultZoom={14}
            >
              <Pointer {...mapCentre} />
            </RoadworksMap>
          </div>
        </ReactModal>
      )}
    </>
  );
};

export default MapModal;
