const express=require('express');
const upload=require('../config/multerConfig')
const uploadRouter=express.Router();
const path = require('path');
const videoQueue=require('../queues/videoQueue')
const fs = require('fs');
const { QueueEvents } = require('bullmq');


// Create a single QueueEvents instance for the queue
const queueEvents = new QueueEvents('video-transcode-queue', {
  connection: require('../config/redisConfig')
});





uploadRouter.get('/upload',(req,res)=>{
  res.render('videoUpload.ejs');
})


uploadRouter.post('/uploadVideo', upload.single('videoFile'), async (req, res) => {
  if (!req.file || req.file.length === 0) {
    return res.status(400).send('No file uploaded.');
  }
  try {
   
      
 const inputPath = path.resolve(req.file.path);
      const filename = path.parse(req.file.filename).name + '_processed.mp4';
      const outputPath = path.resolve(
        path.join(__dirname, '..', 'uploads', 'processed', filename)
      );

 const processedDir = path.dirname(outputPath);
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }

console.log(`Adding job to queue: ${inputPath} -> ${outputPath}`);


     const job= await videoQueue.add('video-transcode-queue', {
        inputPath,
        outputPath
      });
      // Pass the queueEvents instance here
const result = await job.waitUntilFinished(queueEvents);
      

      // Cleanup original file
      fs.unlinkSync(inputPath);
  


console.log('redirecting to video player with result:', result);

      // Redirect to video player with the result

const data= {
  videoId: result.videoId,
  playlistUrl: result.playlistUrl,
  resolutions: JSON.stringify(result.resolutions)
}

res.status(200).json(data);

      
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during transcoding');
  }


})
module.exports=uploadRouter;