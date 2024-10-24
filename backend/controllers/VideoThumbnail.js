const VideoDetails = require('../models/VideoDetailsSchema');

const generateThumbnail = (target, title) => {
  title = title.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, '');
  const videoDetails = new VideoDetails({
    upload_title: title,
    video_path: target,
  });
  videoDetails
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  generateThumbnail: generateThumbnail
}