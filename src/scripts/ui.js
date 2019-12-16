const initUI = () => {
  const nameMessage = document.getElementById('name-message');
  const joinButton = document.getElementById('join-btn');
  const conferenceAliasInput = document.getElementById('alias-input');
  const leaveButton = document.getElementById('leave-btn');
  const startVideoBtn = document.getElementById('start-video-btn');
  const stopVideoBtn = document.getElementById('stop-video-btn');
  const startScreenShareBtn = document.getElementById('start-screenshare-btn');
  const stopScreenShareBtn = document.getElementById('stop-screenshare-btn');
  const startRecordingBtn = document.getElementById('start-recording-btn');
  const stopRecordingBtn = document.getElementById('stop-recording-btn');
  
  nameMessage.innerHTML = `You are logged in as ${randomName}`;
  joinButton.disabled = false;

  joinButton.onclick = () => {
      let conferenceAlias = conferenceAliasInput.value;

      /*
      1. Create a conference room with an alias
      2. Join the conference with its id
      */
      VoxeetSDK.conference.create({ alias: conferenceAlias })
          .then((conference) => VoxeetSDK.conference.join(conference, {}))
          .then(() => {
              joinButton.disabled = true;
              leaveButton.disabled = false;
              startVideoBtn.disabled = false;
              startScreenShareBtn.disabled = false;
              startRecordingBtn.disabled = false;
          })
          .catch((e) => console.log('Something wrong happened : ' + e))
  };

  leaveButton.onclick = () => {
      VoxeetSDK.conference.leave()
          .then(() => {
              joinButton.disabled = false;
              leaveButton.disabled = true;
              startScreenShareBtn.disabled = true;
              stopScreenShareBtn.disabled = true;
          })
          .catch((err) => {
              console.log(err);
          });
  };

  startVideoBtn.onclick = () => {
      VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant)
          .then(() => {
              startVideoBtn.disabled = true;
              stopVideoBtn.disabled = false;
          });
  };

  stopVideoBtn.onclick = () => {
      VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant)
          .then(() => {
              stopVideoBtn.disabled = true;
              startVideoBtn.disabled = false;
          });
  };

  startScreenShareBtn.onclick = () => {
      VoxeetSDK.conference.startScreenShare()
          .then(() => {
              startScreenShareBtn.disabled = true;
              stopScreenShareBtn.disabled = false;
          })
          .catch((e) => console.log(e))
  };

  stopScreenShareBtn.onclick = () => {
      VoxeetSDK.conference.stopScreenShare()
          .then(() => {
              startScreenShareBtn.disabled = false;
              stopScreenShareBtn.disabled = true;
          })
          .catch((e) => console.log(e))
  };

  startRecordingBtn.onclick = () => {
      let recordStatus = document.getElementById('record-status');
      VoxeetSDK.recording.start()
          .then(() => {
              recordStatus.innerText = 'Recording...';
              startRecordingBtn.disabled = true;
              stopRecordingBtn.disabled = false;
          })
          .catch((err) => {
              console.log(err);
          })
  };

  stopRecordingBtn.onclick = () => {
      let recordStatus = document.getElementById('record-status');
      VoxeetSDK.recording.stop()
          .then(() => {
              recordStatus.innerText = '';
              startRecordingBtn.disabled = false;
              stopRecordingBtn.disabled = true;
          })
          .catch((err) => {
              console.log(err);
          })
  };
};

const addVideoNode = (participant, stream) => {
  const videoContainer = document.getElementById('video-container');
  let videoNode = document.getElementById('video-' + participant.id);

  if(!videoNode) {
      videoNode = document.createElement('video');
      
      videoNode.setAttribute('id', 'video-' + participant.id);
      videoNode.setAttribute('height', 240);
      videoNode.setAttribute('width', 320);
      
      videoContainer.appendChild(videoNode);
      
      videoNode.autoplay = 'autoplay';
      videoNode.muted = true;
  }

  navigator.attachMediaStream(videoNode, stream);
};

const removeVideoNode = (participant) => {
  let videoNode = document.getElementById('video-' + participant.id);

  if (videoNode) {
      videoNode.parentNode.removeChild(videoNode);
  }
};

const addParticipantNode = (participant) => {
  const participantsList = document.getElementById('participants-list');

  // if the participant is the current session user, don't add himself to the list
  if (participant.id === VoxeetSDK.session.participant.id) return;

  let participantNode = document.createElement('li');
  participantNode.setAttribute('id', 'participant-' + participant.id);
  participantNode.innerText = `${participant.info.name}`;

  participantsList.appendChild(participantNode);
};

const removeParticipantNode = (participant) => {
  let participantNode = document.getElementById('participant-' + participant.id);

  if (participantNode) {
      participantNode.parentNode.removeChild(participantNode);
  }
};

const addScreenShareNode = (stream) => {
  const screenShareContainer = document.getElementById('screenshare-container');
  let screenShareNode = document.getElementById('screenshare');

  if (screenShareNode) return alert('There is already a participant sharing his screen !');

  screenShareNode = document.createElement('video');
  screenShareNode.setAttribute('id', 'screenshare');
  screenShareNode.autoplay = 'autoplay';
  navigator.attachMediaStream(screenShareNode, stream);

  screenShareContainer.appendChild(screenShareNode);
}

const removeScreenShareNode = () => {
  let screenShareNode = document.getElementById('screenshare');

  if (screenShareNode) {
      screenShareNode.parentNode.removeChild(screenShareNode);
  }
}


