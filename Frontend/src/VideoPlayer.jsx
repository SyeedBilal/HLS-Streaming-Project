
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ data: backendData }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [selectedResolution, setSelectedResolution] = useState('720p');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Default fallback values
  const videoId = backendData?.videoId;
  const resolutions = backendData?.resolutions || ['360p', '480p', '720p', '1080p'];

  const getPlaylistUrl = (res) => 
    `http://localhost:3000/processed/${videoId}/${res}/index.m3u8`;

  const loadVideoSource = (resolution) => {
    if (playerRef.current) {
      playerRef.current.src({
        src: getPlaylistUrl(resolution),
        type: 'application/x-mpegURL'
      });
      playerRef.current.play();
    }
  };
  const handleDownload = () => {
  const url = `http://localhost:3000/download/video/${videoId}/${selectedResolution}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `video_${selectedResolution}.mp4`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  useEffect(() => {
    // Initialize player only when component is mounted
    setIsPlayerReady(true);

    return () => {
      // Cleanup on unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isPlayerReady && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: getPlaylistUrl(selectedResolution),
          type: 'application/x-mpegURL'
        }]
      });
    }
  }, [isPlayerReady, selectedResolution]);

  const handleResolutionChange = (e) => {
    const res = e.target.value;
    setSelectedResolution(res);
  };

  // Update source when resolution changes
  useEffect(() => {
    if (playerRef.current) {
      loadVideoSource(selectedResolution);
    }
  }, [selectedResolution]);

  return (
<div className="max-w-6xl mx-auto p-4 bg-gray-50 rounded-xl shadow-lg">
  {/* Header with controls */}
  <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
    <h2 className="text-xl font-bold text-gray-800">Video Player</h2>
    
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Resolution Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Quality:</label>
        <select
          value={selectedResolution}
          onChange={handleResolutionChange}
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 bg-white transition-all"
        >
          {resolutions.map((res) => (
            <option key={res} value={res} className="text-sm">
              {res}
            </option>
          ))}
        </select>
      </div>

      {/* Download Button */}
      <button
        onClick={()=>handleDownload()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Download
      </button>
    </div>
  </div>

  {/* Video Container with Aspect Ratio */}
  <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-xl bg-black">
    <div data-vjs-player className="absolute top-0 left-0 w-full h-full">
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
        controls
        preload="auto"
      />
    </div>
  </div>

  {/* Video Info (optional) */}
  <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
    <p>Current quality: <span className="font-medium">{selectedResolution}</span></p>
    <p className="text-gray-400">HLS Streaming</p>
  </div>
</div>
  );
};

export default VideoPlayer;
