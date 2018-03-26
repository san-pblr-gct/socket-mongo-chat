import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import mongo from 'mongodb';

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
io.liste
let port = process.env.PORT || 3000;
let users = [];
let mongoClient = mongo.MongoClient;

server.listen(port, function () {
    console.log('listening on *:' + port);
});
mongoClient.connect('mongodb://127.0.0.1/mongochat', function (err, database) {
    if (err) {
        throw err;
    }
    console.log('Mongo db started');
    let db = database.db('chatroomApp');
    io.origins('*:*');
    io.on('connection', (socket) => {
        console.log("User connected");
        let chat = db.collection('chats');

        let sendStatus = (s) => {
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
            if (err) {
                throw err;
            }
            // Emit the messages
            socket.emit('output', res);
        });


        // Handle input events
        socket.on('input', function (data) {
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if (name == '' || message == '') {
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({ name: name, message: message }, function () {
                    io.emit('output', [data]);
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });

        socket.on('clear', function (data) {
            // Remove all chats from collection
            chat.remove({}, function () {
                // Emit cleared
                io.emit('cleared');
            });
        });

        socket.on('disconnect', () => {
            console.log("User disconnected");
        });

    })
});


