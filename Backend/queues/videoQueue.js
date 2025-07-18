
// set up in config.js
const {Queue}=require('bullmq');
const redisClient=require('../config/redisConfig');

const videoQueue=new Queue('video-transcode-queue',{
  connection:redisClient,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 3,
  }
})


module.exports=videoQueue;