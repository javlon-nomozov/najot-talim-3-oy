// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    height: '360',
    width: '640',
    videoId: '${{videoId}}',
    playerVars: {
      'autoplay': 1,
      'mute': 1,
      'controls': 0,
      'loop': 1,
      'playlist': '${{videoId}}',
      'showinfo': 0,
      'rel': 0,
      'iv_load_policy': 3,
      'modestbranding': 1
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}
