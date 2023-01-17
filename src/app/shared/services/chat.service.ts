import {Injectable} from "@angular/core";
import {ChatServiceClient, ChatServicejoin, ResponseStream} from "../../../../proto/generated/proto/chat_pb_service";
import {ChatMessage, Empty, JoinResponse, User} from "../../../../proto/generated/proto/chat_pb";
import {UserService} from "@app/shared/services/user.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: ChatServiceClient;
  private messagesArr = [];
  private messagesObs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public messageFor: string;

  constructor(private userService: UserService) {
    this.client = new ChatServiceClient('http://localhost:8090')
  }

  get messages(): Observable<any[]> {
    return this.messagesObs$;
  }

  join(path, val): Promise<JoinResponse> {
    return new Promise((resolve, reject) => {
      const req = new User();
      req.setName(this.userService.user.username);
      req.setId(this.userService.user.id.toString());
      this.client.join(req, null, (err, response: JoinResponse) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  sendMessage(message: string): Promise<Empty> {
    return new Promise((resolve, reject) => {
      const req = new ChatMessage();
      req.setFrom(this.userService.user.id.toString());
      req.setMsg(message);
      req.setTime(this.messageFor);
      this.client.sendMsg(req, null, (err, response: Empty) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  }

  receiveMessage(): Promise<ResponseStream<ChatMessage>> {
    return new Promise((resolve, reject) => {
      const req = new Empty();
      this.client.receiveMsg(req, null).on("data", (message: ChatMessage) => {
        console.log(message);
        this.messagesArr.push({ sender: message.getFrom(), text: message.getMsg(), target: message.getTime() });
        this.messagesObs$.next(this.messagesArr);
      })
    });
  }
}
