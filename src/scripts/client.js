const avengersNames = ['Thor', 'Cap', 'Tony Stark', 'Black Panther', 'Black Widow', 'Hulk', 'Spider-Man'];
let randomName = avengersNames[Math.floor(Math.random() * avengersNames.length)];

const main = async () => {
    /* Events handlers */
    VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
        if (stream.type === 'ScreenShare') return addScreenShareNode(stream);
        addVideoNode(participant, stream);
        addParticipantNode(participant);
    });

    VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
        if (stream.type === 'ScreenShare') return removeScreenShareNode();
        removeVideoNode(participant);
        removeParticipantNode(participant);
    });

    try {
        await VoxeetSDK.initialize('customerKey', 'customerSecret');
        await VoxeetSDK.session.open({ name: randomName });
        initUI();
    } catch (e) {
        alert('Something went wrong : ' + e);
    }
}

main();