import { Avatar } from '@material-ui/core';
import React from 'react';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';

export default function JdenticonAvatar({seed, children, ...props}) {
  let options = {};
  let avatars = new Avatars(sprites, options);
  let svg = avatars.create(seed);

  return (
    <Avatar {...props}>
      <div style={{width:"100%", height:"100%", position:"absolute"}} dangerouslySetInnerHTML={{__html:svg}}/>
      {children}
    </Avatar>
  );
}
