import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress"

const Loading = (props) => {
  let style = null;
  if (props?.centered || false) {
    style = {
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }
  return (
    <div style={style}>
      <CircularProgress />
    </div>
  );
}

export default Loading;
