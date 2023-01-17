import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/shared/services/user.service";
import {ChatService} from "@app/shared/services";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: any[] = [];
  newMessage = '';

  constructor(private userService: UserService, private chatService: ChatService) { }

  ngOnInit() {
    if(this.userService.user.userRole === 'ADMIN') {
      this.chatService.messages.subscribe((allMessages) => {
        this.messages = allMessages.filter((message) => message.sender === this.chatService.messageFor || (message.sender === this.userService.user.id.toString() && message.target === this.chatService.messageFor));
      })
    } else {
      this.chatService.messages.subscribe((allMessages) => {
        this.messages = allMessages.filter((message) => message.target === this.userService.user.id.toString() || message.sender === this.userService.user.id.toString());
      })
    }
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage).then();
    this.newMessage = '';
  }

}
