const { Worker } = require('bullmq');
const redisClient = require('../config/redisConfig');
const { transcodeToHLS } = require('../controllers/transcode'); 
const path=require('path');

const worker = new Worker('video-transcode-queue', async (job) => {
  const { inputPath, outputPath } = job.data;

  console.log(`🔄 Processing video: ${inputPath} -> ${outputPath}`);
  await transcodeToHLS(inputPath, outputPath); 
  console.log(`✅ Transcoded: ${outputPath}`);

return {
 status: 'success',
    outputPath,
    playlistUrl: `/processed/${path.basename(outputPath)}/index.m3u8`,
    resolutions: ['360p', '480p', '720p', '1080p'],
    videoId: path.basename(outputPath) 
  

}
}, {
  connection: redisClient,
  concurrency:4
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job failed [${job.id}]:`, err);
});

worker.on('completed', (job) => {
  console.log(`🎉 Job completed [${job.id}]`);
  
});
worker.on('error', (err) => {
  console.error('Worker error:', err);
});