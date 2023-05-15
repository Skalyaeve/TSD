import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets';  

import { Socket, Server } from "socket.io";

@WebSocketGateway(8001, {cors: "*"})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { user: string, message: string }, @ConnectedSocket() client: Socket): void {
    console.log(data.user);
    console.log(data.message);
    client.broadcast.emit('message', data); // Use broadcast.emit() to send the message to all clients except the sender
  }

  handleConnection(client: Socket, ...args:any[])
  {
    console.log('success');
    console.log(client.handshake);

    client.emit('connectionResult', { msg: 'helloworld'})
  }
}
// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   MessageBody,
//   WebSocketServer
// } from '@nestjs/websockets';

// import { Socket, Server } from "socket.io";

// @WebSocketGateway(8001, {cors: "*"})
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;
//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() data: { user: string, message: string }): void {
//     console.log(data.user);
//     console.log(data.message);
//     client.broadcast.emit('message', data);
//   }
// }
