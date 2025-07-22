
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Film, Settings } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [step, setStep] = useState('Upload');
  const [data, setData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert('Please upload a valid video file.');
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Please select a video first.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('videoFile', videoFile); 

    try {
      const res = await fetch('http://localhost:3000/uploadVideo', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      setData(result); // Optional: store returned data
      alert(result.message || 'Upload successful!');
      setStep('Play'); // Move to next step
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {step === 'Upload' ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Upload Your Video</h1>
              <p className="text-slate-300 text-lg">Share your content with the world</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-purple-400/50 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-purple-500/5 transition-all duration-300">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-white text-lg font-medium mb-2">
                    {videoFile ? videoFile.name : 'Click to select a video file'}
                  </p>
                  <p className="text-slate-400">or drag and drop your video here</p>
                </div>
              </div>

              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl"></div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!videoFile || isUploading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <VideoPlayer data={data} />
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
