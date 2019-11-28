/**
* addVideoNode(participant, stream): void
* create a video Node element on the video-container <div> for a participant
*/
const addVideoNode = (participant, stream) => {
  const videoContainer = document.getElementById('video-container');

  var node = document.createElement('video');
  node.setAttribute('id', 'video-' + participant.id);
  node.setAttribute('width', 320);
  node.setAttribute('height', 240);

  videoContainer.appendChild(node);
  navigator.attachMediaStream(node, stream);

  node.autoplay = 'autoplay';
  node.muted = true;
};

/**
* removeVideoNode(participant): void
* remove the video Node element of a participant
*/
const removeVideoNode = (participant) => {
  var node = document.getElementById('video-' + participant.id);

  if (node) {
    node.parentNode.removeChild(node);
  }
};

const addParticipantNode = (userId) => {
  const participantsList = document.getElementById('participants-list');
  let participantNode = document.getElementById('participant-' + userId);

  // if the participant is the current session user, don't add himself to the list
  if (userId === voxeet.userId) return;

  let participant = participants[userId];
  participantNode = document.createElement('li');
  participantNode.setAttribute('id', 'participant-' + userId);
  participantNode.innerText = `${participant.name}`;

  participantsList.appendChild(participantNode);
};

const removeParticipantNode = (userId) => {
  var participantNode = document.getElementById('participant-' + userId);

  if (participantNode) {
      participantNode.parentNode.removeChild(participantNode);
  }
};

// ui.js
const initUI = () => {
  const nameMessage = document.getElementById('name-message');
  nameMessage.innerHTML = `You are logged in as ${randomName}`;

  const joinButton = document.getElementById('join-button');
  const conferenceAliasInput = document.getElementById('alias-input');
  const startVideoBtn = document.getElementById('start-video-btn');
  const stopVideoBtn = document.getElementById('stop-video-btn');
  const leaveButton = document.getElementById('leave-button');

  joinButton.disabled = false;

  joinButton.onclick = () => {
    let conferenceAliasValue = conferenceAliasInput.value;

    /*
    * 1. Create a conference room with an alias
    * 2. Join the conference with its id
    */
    voxeet.createConference({ alias: conferenceAliasValue })
        .then((res) => voxeet.joinConference(res.conferenceId))
        .then(() => {
            joinButton.disabled = true;
            leaveButton.disabled = false;
            startVideoBtn.disabled = false;
        })
        .catch((e) => alert('Something wrong happened : ' + e));
  };

  leaveButton.onclick = () => {
    voxeet.leaveConference()
        .then(() => {
            joinButton.disabled = false;
            leaveButton.disabled = true;
        })
        .catch((err) => {
            console.log(err);
        });
  };
  
  startVideoBtn.onclick = () => {
    voxeet.startVideoForUser(voxeet.userId)
        .then(() => {
            startVideoBtn.disabled = true;
            stopVideoBtn.disabled = false;
        });
  };

  stopVideoBtn.onclick = () => {
    voxeet.stopVideoForUser(voxeet.userId)
        .then(() => {
            stopVideoBtn.disabled = true;
            startVideoBtn.disabled = false;
        });
  };
};