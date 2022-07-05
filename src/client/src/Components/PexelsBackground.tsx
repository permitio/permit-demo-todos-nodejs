import { Tooltip } from '@material-ui/core';
import _ from 'lodash';
import { createClient } from 'pexels';
import React, { useState } from 'react';
import Config from '../config';

export default function PexelsBackground({ children = undefined }) {
  const client = createClient(Config.services.pexelsKey);
  const [photo, setPhoto] = useState(null);
  const options = [
    'ocean',
    'beach',
    'sky',
    'clouds',
    'forest',
    'river',
    'road',
    'stars',
    'mountain',
    'nature',
    'lion',
    'tiger',
    'magic',
  ];
  const [option] = useState(_.sample(options));

  React.useEffect(() => {
    client.photos.search({ query: option }).then((result) => {
      const photos = _.get(result, 'photos');
      setPhoto(_.sample(photos));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url("${photo?.src.original}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100wh',
        height: '100vh',
      }}
    >
      {children}

      <div style={{ position: 'absolute', bottom: 6, right: 50, padding: 6 }}>
        <Tooltip title={option + ' background from Pexels'}>
          <a target='_blank' rel='noreferrer' href='https://www.pexels.com'>
            <img
              alt={option + ' background from Pexels'}
              style={{ height: 20 }}
              src='https://images.pexels.com/lib/api/pexels.png'
            />
          </a>
        </Tooltip>
      </div>
    </div>
  );
}
