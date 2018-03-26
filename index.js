import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import mongo from 'mongodb';

let app=express();
let server=http.Server(app);
let io=new SocketIO(server);
io.liste
let port=process.env.PORT||3000;
let users=[];
let mongoClient=mongo.MongoClient;

http.listen(port, function () {
    console.log('listening on *:'+port);
});
