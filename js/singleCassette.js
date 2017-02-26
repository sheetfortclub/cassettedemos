var audio_context,
recorder,
seekBtn,
playBtn,
recordBtn,
recordStatus,
stopBtn,
recordingLight,
IsActive,
WaveContainer,
windowWidth,
updateWidth,
recordedTrack,
trackInfo,
trackTimeNow,
trackTotalDuration,
analyzer,
changeName,
trackName,
downloadLink,
messaging,
appAbout,
wrapper,
aboutProject,
closeAbout;


var readyFunction = function () {
  recordBtn = document.querySelector('.recordBtn');
  playBtn = document.querySelector('.playBtn');
  stopBtn = document.querySelector('.stopBtn');
  seekBtn = document.querySelector('.seekBtn');
  recordingLight = document.querySelector('.recordingLight');
  recordStatus = document.querySelector('.recordStatus');
  IsActive = document.querySelector('.active');
  WaveContainer = document.querySelector('.animateWaveContainer');
  recordedTrack = document.querySelector('.recordedTrack');
  trackInfo = document.querySelector('.trackInfo');
  trackTimeNow = document.querySelector('#currentTime');
  trackTotalDuration = document.querySelector('#trackDuration');
  analyzer = document.querySelector('#analyser');
  trackName = document.querySelector('.trackName');
  changeName = document.querySelector('.changeName');
  downloadLink = document.querySelector('.downloadTrack');
  messaging = document.querySelector('.messaging');
  appAbout = document.querySelector('.appAbout');
  wrapper = document.querySelector('.wrapper');
  aboutProject = document.querySelector('.aboutProject');
  closeAbout = document.querySelector('.closeAbout');
  windowWidth = window.innerWidth;
  updateWidth = windowWidth / 4;




  appAbout.addEventListener('click', function (event) {
    wrapper.classList.add('blur');
    aboutProject.style.display = 'block';
  });

  closeAbout.addEventListener('click', function (event) {
    wrapper.classList.remove('blur');
    aboutProject.style.display = '';
  });

  playBtn.addEventListener('click', function (event) {
    playTrack();
  });

  seekBtn.addEventListener('click', function (event) {
    startOver();
  });

  recordBtn.addEventListener('click', function (event) {
    if (playBtn.classList.contains("active")) {
      console.log('you need to stop the tape before recording...');
    }
    if (recordBtn.classList.contains("active")) {
      stopRecording();
      recordStatus.innerText = 'RECORD';
      recordedTrack.style.display = 'block';
      setTimeout(function() {
        trackInfo.classList.remove('off');
      }, 600);

      analyzer.style.display = 'none';
      recordBtn.classList.remove('initial');
      recordBtn.classList.remove('active');
      playBtn.style.display = 'block';
      playBtn.classList.remove('active');
      stopBtn.style.display = 'block';
      seekBtn.style.display = 'block';
      stopBtn.classList.remove('PrintRecording');
      recordingLight.classList.remove('On');
      recordingLight.classList.remove('Play');
    }
    else {
      startRecording();
    }
  });

  stopBtn.addEventListener('click', function (event) {
    console.log(' Need to add if wavesurfer has played before firing this event');
    recordBtn.classList.remove('active');
    playBtn.classList.remove('active');
    recordingLight.classList.remove('On');
    recordingLight.classList.remove('Play');
    wavesurfer.pause();
  });

  keyCommands();

  function keyCommands() {
    // Key Commands on key down
    document.body.onkeydown = function(e){
      if(e.keyCode == 82){
        if (playBtn.classList.contains("active")) {
          console.log('you need to stop the tape before recording...');
        } 
        else {
          recordBtn.classList.add('active');
        }
      }
      if(e.keyCode == 13){
        seekBtn.classList.add('active');
      }
      if(e.keyCode == 32){
        if (playBtn.classList.contains("active")) {
          stopBtn.classList.add('active');
        }
        else {
          //playBtn.classList.add('active'); 
        }
      }
    }

    // Key Commands on key up
    document.body.onkeyup = function(e){
      if(e.keyCode == 82){
        if (playBtn.classList.contains("active")) {
          console.log('you need to stop the tape before recording...');
        } 
        else {
          startRecording();
        }
      }

      if(e.keyCode == 13){ // SEEK BUTTON ON ENTER
        startOver();
      }

      if(e.keyCode == 32){ // SPACEBAR STOP RECORDING
        if (recordBtn.classList.contains("active")) {
          stopRecording();

          recordedTrack.style.display = 'block';
          setTimeout(function() {
            trackInfo.classList.remove('off');
          }, 600);

          recordBtn.classList.remove('active');
          recordBtn.classList.remove('initial');
          recordStatus.innerText = 'RECORD';

          analyzer.style.display = 'none';
          
          playBtn.style.display = 'block';
          playBtn.classList.remove('active');

          seekBtn.style.display = 'block';

          stopBtn.style.display = 'block';
          stopBtn.classList.add('active');

          recordingLight.classList.remove('On');
          recordingLight.classList.remove('Play');

          setTimeout(function() {
            stopBtn.classList.remove('active');
            stopBtn.classList.remove('PrintRecording');
          }, 50);
        }
        else if(playBtn.classList.contains("active")) { // SPACEBAR PAUSE THE TRACK
          recordBtn.classList.remove('active');
          playBtn.classList.remove('active');
          stopBtn.classList.remove('active');
          recordingLight.classList.remove('On');
          recordingLight.classList.remove('Play'); 

          if(wavesurfer) {
            wavesurfer.pause();
          }
        }
        else if(wavesurfer) {  // SPACEBAR TO PLAY TRACK
          playTrack();     
        }
      }
    } // End on Keyup
  }


  function animateWaveTransition() {
    WaveContainer.style.display = 'block';
    for (i = 0; i < updateWidth; i++) {
      var animateBar = document.createElement('div');
      animateBar.style.left = i * 4 + 'px';
      animateBar.style.animationDelay = i * .2 + 'ms';
      //animateBar.style.animationDelay = i * .5 + 'ms';
      WaveContainer.appendChild(animateBar);
    }

    setTimeout(function() {
      recordedTrack.style.display = 'block';
    }, 0);
    setTimeout(function() {
      WaveContainer.style.display = 'none';
    }, 1500);
  }

  function startRecording() {
    recordBtn.classList.add('active');
    recordBtn.classList.add('initial');
    recordingLight.classList.add('On');
    playBtn.style.display = '';
    playBtn.classList.remove('active');
    stopBtn.style.display = '';
    seekBtn.style.display = '';
    
    analyzer.style.display = 'block';
    recordedTrack.style.display = 'none';
    trackInfo.classList.add('off');
    recordStatus.innerText = 'STOP';

    setTimeout(function() {
      recorder && recorder.record();
    }, 50);
  }

  function stopRecording() {
    recorder && recorder.stop(); 
   // wavesurfer.empty();
    createDownloadLink();
    recorder.clear();
    setTimeout(function() {
      editTrackName();
    }, 100);
  }

  function startOver() {
    wavesurfer.seekTo(0);
    wavesurfer.pause();
    seekBtn.classList.remove('active');
    recordBtn.classList.remove('active');
    playBtn.classList.remove('active');
    recordingLight.classList.remove('On');
    recordingLight.classList.remove('Play');
  }

  function playTrack() {
    playBtn.classList.add('active');
    recordingLight.classList.add('Play');
    stopBtn.classList.remove('active');
    wavesurfer.play();     
  }

  function editTrackName() {
    var trackName = document.querySelector('.trackName');
    var saveName = document.querySelector('.saveName');
    var trackPlaceholder = trackName.innerText;
    changeName.setAttribute('placeholder', trackPlaceholder);
    
    trackName.addEventListener('click', function (event) {
      trackName.style.display = 'none';
      saveName.style.display = 'block';
      changeName.style.display = 'block';
      changeName.value = '';
      changeName.focus();
      document.body.onkeydown = function(e){
        if(e.keyCode == 13){
          saveName.classList.add('active');
        }
      }
      document.body.onkeyup = function(e){
        if(e.keyCode == 13){
          saveName.classList.remove('active');
          saveNameExit();
        }
      }
    });

    saveName.addEventListener('click', function (event) {
      saveNameExit();
    });

    function saveNameExit() {
      var newName = changeName.value;
      if (newName.length > 0) {
        trackName.innerText = newName;
      }
      trackName.style.display = 'block';
      saveName.style.display = 'none';
      //changeName.setAttribute('placeholder', newName);
      changeName.placeholder = newName;
      changeName.style.display = 'none';

      var updatedName = newName.replace(/\s+/g, '-').toLowerCase();
      downloadLink.download = updatedName;

      keyCommands();
    }
  }

  // Get the tracks current time
  function getTheTime() {
    var currentTime = wavesurfer.getCurrentTime();
    var currentTime = Math.round(currentTime);
    var minutes = Math.floor(currentTime / 60); // 7
    var seconds = currentTime % 60; // 30
    var currentTime = ('0'  + minutes).slice(-2)+':'+('0' + seconds).slice(-2);
    trackTimeNow.innerHTML = currentTime;
  }

  // Events to fire when the track is playing
  wavesurfer.on('audioprocess', function () {
    getTheTime();
  });
  // Events to fire when the user seeks
  wavesurfer.on('seek', function () {
    getTheTime();
  });

  wavesurfer.on('pause', function () {
    recordBtn.classList.remove('active');
    playBtn.classList.remove('active');
    stopBtn.classList.remove('active');
    recordingLight.classList.remove('On');
    recordingLight.classList.remove('Play'); 
  });



} //End Ready

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);

  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');
  
  recorder = new Recorder(input);

  // USED FROM WAVEFORM.JS
  inputPoint = audioContext.createGain();

  // Create an AudioNode from the stream.
  realAudioInput = audioContext.createMediaStreamSource(stream);
  audioInput = realAudioInput;
  audioInput.connect(inputPoint);

  // audioInput = convertToMono( input );

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  inputPoint.connect( analyserNode );

  audioRecorder = new Recorder( inputPoint );

  zeroGain = audioContext.createGain();
  zeroGain.gain.value = 0.0;
  inputPoint.connect( zeroGain );
  zeroGain.connect( audioContext.destination );
  updateAnalysers();
}

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    var trackName = document.querySelector('.trackName');
    var url = URL.createObjectURL(blob);
    wavesurfer.loadBlob(blob);
    trackName.innerText = 'My New Recording';
    trackName = trackName.innerText;
    var friendlyName = trackName.replace(/\s+/g, '-').toLowerCase();
  
    downloadLink.href = url;
    downloadLink.download = friendlyName; 
  
    setTimeout(function() {
      // Get duration of track
      var trackDuration = wavesurfer.getDuration();
      var trackDuration = Math.round(trackDuration);
      var minutes = Math.floor(trackDuration / 60);
      var seconds = trackDuration % 60;
      var trackDuration = ('0'  + minutes).slice(-2)+':'+('0' + seconds).slice(-2);
      trackTotalDuration.innerText = trackDuration;
    }, 900);
    
  });
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    audio_context = new AudioContext;

  } catch (e) {
    //alert('No web audio support in this browser!');
    messaging.style.display = 'block';
    messaging.innerHTML = '<img src="../images/allowMicrophonePlease.svg" alt="allow microphone" />Sorry, your browser to does not support this app. Try using the latest version of Google Chrome.';
    recordBtn.style.display = 'none';
  }

    var onSuccess = function(stream) {
    alert('Success!');
  }

  var onError = function(error) {
      messaging.style.display = 'block';
      messaging.innerHTML = '<img src="../images/allowMicrophonePlease.svg" alt="allow microphone" />You need to allow microphone access to start recording. Refresh your browser (&#8984;R) and click <b>"Allow"</b>';
      recordBtn.style.display = 'none';
  }
  
  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    onError(); // Add in error messaging here
  });
};

// Wave surfer
var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#919AA2',
  progressColor: '#F50034',
  barWidth: 1,
  height: 200,
  cursorColor: '#ccc',
  cursorWidth: 1,
  normalize: true,
  pixelRatio: 5,
  minPxPerSec: 10,
  fillParent: true,
  audioRate: 1,
});

if (document.readyState != 'loading') {
  readyFunction();

}
else {
  document.addEventListener('DOMContentLoaded', readyFunction)
}