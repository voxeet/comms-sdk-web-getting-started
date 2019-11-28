const voxeet = new VoxeetSdk();

const avengersNames = ['Thor', 'Cap', 'Tony Stark', 'Black Panther', 'Black Widow', 'Hulk', 'Spider-Man'];
let randomName = avengersNames[Math.floor(Math.random() * avengersNames.length)];
let participants = {};

const main = () => {
  voxeet.initialize('customerKey', 'customerSecret', {name: randomName})
    .then((currentUserId) => {
      initUI();
    })
    .catch((err) => {
      console.log(err);
    });
  
  voxeet.on('participantJoined', (userId, stream) => {
    addParticipantNode(userId);
    addVideoNode(userId, stream);
  });
  
  voxeet.on('participantLeft', (userId) => {
    removeVideoNode(userId);
    delete participants[userId];
    removeParticipantNode(userId);
  });
  
  voxeet.on('participantAdded', (userId, userInfo) => {
    participants[userId] = userInfo;
  });
  
};

main();