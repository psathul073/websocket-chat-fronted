// Join room.
export const joinRoom = (socket, roomName, password) => {
    socket.send(JSON.stringify({
        action: 'join',
        roomName: roomName.trim(),
        password: password || '',
    }));
};

// Create room.
export const createRoom = (socket, userId, roomName, password, err) => {
    if (!roomName.trim()) return err('Enter a room name!');

    socket.send(JSON.stringify({
        action: 'create',
        roomName: roomName.trim(),
        password: password || '',
        uid: userId,
    }));

};

// Delete room.
export const deleteRoom = (socket, roomName, userId) => {

    socket.send(JSON.stringify({
        action: 'delete-room',
        roomName: roomName.trim(),
        uid: userId,
    }));


};

// Delete messages.
export const deleteMessage = (socket, msgId, roomName, userId) => {
    socket.send(JSON.stringify({
        action: 'delete-message',
        msgId,
        roomName,
        uid: userId,
    }));
};

// Delete account.
export const deleteAccount = (socket, userId) => {
    socket.send(JSON.stringify({
        action: 'delete-account',
        uid: userId,
    }));
};