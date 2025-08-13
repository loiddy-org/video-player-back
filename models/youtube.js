const axios = require('axios');
const ssmParams = require('../ssm-params');

const getVideoData = async (youtubeID) => {
  const params = await ssmParams.get();
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeID}&key=${params.YOUTUBE_API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.pageInfo.totalResults === 0) {
      throw new Error('Video not found in YouTube.');
    } else {
      return {
        youtubeID,
        title: response.data.items[0].snippet.title,
        thumbnailURL: response.data.items[0].snippet.thumbnails.medium.url,
      };
    }
  } catch (error) {
    //console.log('🙁 catch in youtube ', error);
    throw error;
  }
};

module.exports = {
  getVideoData: getVideoData,
};
