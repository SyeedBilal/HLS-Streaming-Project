// routes/download.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const downloadRouter = express.Router();

downloadRouter.get('/video/:videoId/:resolution', async (req, res) => {
  const { videoId, resolution } = req.params;

  const inputPath = path.join(
  __dirname,
  '..',
  'uploads',
  'processed',
  videoId,
  resolution,
  'index.m3u8'
);

const outputDir = path.join(__dirname, '..', 'downloads');
const outputFile = path.join(outputDir, `${videoId}_${resolution}.mp4`);


  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // If already exists, return it directly
  if (fs.existsSync(outputFile)) {
    return res.download(outputFile);
  }

  // Convert .m3u8 to .mp4 using ffmpeg
  const cmd = `ffmpeg -y -protocol_whitelist "file,http,https,tcp,tls" -i "${inputPath}" -c copy -bsf:a aac_adtstoasc "${outputFile}"`;

  exec(cmd, (err) => {
    if (err) {
      console.error('FFmpeg error:', err);
      return res.status(500).json({ error: 'Conversion failed' });
    }

    return res.download(outputFile);
  });
});

module.exports = downloadRouter;
