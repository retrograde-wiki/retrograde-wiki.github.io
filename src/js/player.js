var RETROGRADE_TRACKS = [
  { artist: 'MACHINE GIRL', title: 'BLACK GLASS',            src: 'https://files.catbox.moe/2rlaoq.wav' },
  { artist: 'STEVE MILLER BAND', title: 'FLY LIKE AN EAGLE',    src: 'https://files.catbox.moe/c8k6fy.wav' },
];

document.addEventListener('DOMContentLoaded', function () {
  var tracks = RETROGRADE_TRACKS;
  if (!tracks || !tracks.length) return;

  var audio = new Audio();
  var current = 0;
  var playing = false;

  var toggleBtn = document.getElementById('playerToggle');
  var nextBtn = document.getElementById('playerNext');
  var trackText = document.getElementById('playerTrackText');
  var trackWrap = trackText ? trackText.parentElement : null;

  function loadTrack(index, autoplay) {
    current = (index + tracks.length) % tracks.length;
    var track = tracks[current];
    audio.src = track.src;
    if (trackText) {
      trackText.textContent = track.artist + ' — ' + track.title;
    }
    checkOverflow();
    if (autoplay) audio.play();
  }

  function checkOverflow() {
    if (!trackWrap || !trackText) return;
    trackWrap.classList.remove('is-overflowing');
    void trackText.offsetWidth;
    if (trackText.scrollWidth > trackWrap.clientWidth) {
      trackWrap.classList.add('is-overflowing');
    }
  }

  function updateButton() {
    if (!toggleBtn) return;
    toggleBtn.innerHTML = playing
      ? '<i class="fa-solid fa-pause"></i>'
      : '<i class="fa-solid fa-play"></i>';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (playing) {
        audio.pause();
      } else {
        if (!audio.src) loadTrack(0, false);
        audio.play();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      loadTrack(current + 1, playing);
    });
  }

  audio.addEventListener('play', function () { playing = true; updateButton(); });
  audio.addEventListener('pause', function () { playing = false; updateButton(); });
  audio.addEventListener('ended', function () { loadTrack(current + 1, true); });

  loadTrack(0, false);
  window.addEventListener('resize', checkOverflow);
});
