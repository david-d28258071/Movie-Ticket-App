import React from "react";
import ReactPlayer from "react-player";

const TestPlayer = () => {
  return (
    <div>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
        controls
      />
    </div>
  );
};

export default TestPlayer;
