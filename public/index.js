//index.js
$(document).ready(() => {
    const socket = io.connect();

    //Keep track of the current user
    let currentUser;
    
    // Get the online users from the server
    // socket.emit('get online users');
    $('#createUserBtn').click((e)=>{
            e.preventDefault();
            if($('#usernameInput').val().length > 0){
                // Emit to the server the new user
                socket.emit('new user', $('#usernameInput').val());
                // Save the current user when created
                currentUser = $('#usernameInput').val();
                $('.usernameForm').remove();
                // Have the main page visable
                $('.mainContainer').css('display', 'flex');
            }
        });
    // $('#createUserBtn').click((e)=>{
    //   e.preventDefault();
    //   console.log("in create usr button")
    //   let username = $('#usernameInput').val();
    //   if(username.length > 0){
    //  //Emit to the server the new user
    //     socket.emit('new user', username);
    //   // if($('#usernameInput').val().length > 0){
    //   //   socket.emit('new user', $('#usernameInput').val());
    //   //   // Save the current user when created
    //   //   currentUser = $('#usernameInput').val();
    //     $('.usernameForm').remove();
    //     $('.mainContainer').css('display', 'flex');
    //   }
    // });

    $('#sendChatBtn').click((e) => {
        e.preventDefault();
        // Get the message text value
        let message = $('#chatInput').val();
        // Make sure it's not empty
        if (message.length > 0) {
            // Emit the message with the current user to the server
            socket.emit('new message', {
                sender: currentUser,
                message: message,
            });
            $('#chatInput').val("");
        }
    });

    // //socket listeners
    // socket.on('new user', (username) => {
    //     console.log(`${username} has joined the chat`);
    //     $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
    // })
    // socket listeners
    socket.on('new user', (username) => {
        console.log(`✋  ${username} has joined the chat! ✋ `);
        // Add the new user to the online users div
        $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
    })
    //Output the new message
    socket.on('new message', (data) => {
        $('.messageContainer').append(`
      <div class="message">
        <p class="messageUser">${data.sender}: </p>
        <p class="messageText">${data.message}</p>
      </div>
    `);
    })
    socket.on('get online users', (onlineUsers) => {
        //You may have not have seen this for loop before. It's syntax is for(key in obj)
        //Our usernames are keys in the object of onlineUsers.
        for (username in onlineUsers) {
            $('.usersOnline').append(`<div class="userOnline">${username}</div>`);
        }
    })
    //Refresh the online user list
    socket.on('user has left', (onlineUsers) => {
        $('.usersOnline').empty();
        for (username in onlineUsers) {
            $('.usersOnline').append(`<p>${username}</p>`);
        }
    });
})
