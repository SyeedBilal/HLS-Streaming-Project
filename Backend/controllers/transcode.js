const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const transcodeToHLS = (uploadedVideoPath, outputFolderRootPath) => {
    // Ensure output directory exists
    if (!fs.existsSync(outputFolderRootPath)) {
        fs.mkdirSync(outputFolderRootPath, { recursive: true });
    }

    const outputFolderSubDirectoryPath = {
        '360p': `${outputFolderRootPath}/360p`,
        '480p': `${outputFolderRootPath}/480p`,
        '720p': `${outputFolderRootPath}/720p`,
        '1080p': `${outputFolderRootPath}/1080p`,
    };

    // Always ensure all subdirectories exist
    for (const dir of Object.values(outputFolderSubDirectoryPath)) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    const ffmpegCommands = [
        // 360p resolution
        `ffmpeg -i "${uploadedVideoPath}" -vf "scale=w=640:h=360" -c:v libx264 -b:v 800k -c:a aac -b:a 96k -f hls -hls_time 8 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['360p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['360p']}/index.m3u8"`,
        // 480p resolution
        `ffmpeg -i "${uploadedVideoPath}" -vf "scale=w=854:h=480" -c:v libx264 -b:v 1400k -c:a aac -b:a 128k -f hls -hls_time 8 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['480p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['480p']}/index.m3u8"`,
        // 720p resolution
        `ffmpeg -i "${uploadedVideoPath}" -vf "scale=w=1280:h=720" -c:v libx264 -b:v 2800k -c:a aac -b:a 128k -f hls -hls_time 8 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['720p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['720p']}/index.m3u8"`,
        // 1080p resolution
        `ffmpeg -i "${uploadedVideoPath}" -vf "scale=w=1920:h=1080" -c:v libx264 -b:v 5000k -c:a aac -b:a 192k -f hls -hls_time 8 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['1080p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['1080p']}/index.m3u8"`,
    ];

    const executeCommand = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    };

    // Return a promise so the worker can handle errors
    return Promise.all(ffmpegCommands.map((cmd) => executeCommand(cmd)))
        .then(() => {
            // Create master playlist
            const masterPlaylistPath = `${outputFolderRootPath}/index.m3u8`;
            const masterPlaylistContent = `
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
480p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/index.m3u8
            `.trim();

            fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);
            return true;
        })
        .catch((error) => {
            // Clean up: Delete the uploaded video file
            try {
                fs.unlinkSync(uploadedVideoPath);
            } catch (err) {
                console.error(`Failed to delete original video file: ${err}`);
            }

            // Clean up: Delete the generated HLS files and folders
            try {
                fs.rmSync(outputFolderRootPath, { recursive: true, force: true });
            } catch (err) {
                console.error(`Failed to delete generated HLS files: ${err}`);
            }

            // Rethrow error so worker can handle it
            throw error;
        });
};

module.exports = { transcodeToHLS };