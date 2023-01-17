// package: 
// file: proto/chat.proto

import * as proto_chat_pb from "../proto/chat_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ChatServicejoin = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_chat_pb.User;
  readonly responseType: typeof proto_chat_pb.JoinResponse;
};

type ChatServicesendMsg = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_chat_pb.ChatMessage;
  readonly responseType: typeof proto_chat_pb.Empty;
};

type ChatServicereceiveMsg = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof proto_chat_pb.Empty;
  readonly responseType: typeof proto_chat_pb.ChatMessage;
};

type ChatServicegetAllUsers = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof proto_chat_pb.Empty;
  readonly responseType: typeof proto_chat_pb.UserList;
};

export class ChatService {
  static readonly serviceName: string;
  static readonly join: ChatServicejoin;
  static readonly sendMsg: ChatServicesendMsg;
  static readonly receiveMsg: ChatServicereceiveMsg;
  static readonly getAllUsers: ChatServicegetAllUsers;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class ChatServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  join(
    requestMessage: proto_chat_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_chat_pb.JoinResponse|null) => void
  ): UnaryResponse;
  join(
    requestMessage: proto_chat_pb.User,
    callback: (error: ServiceError|null, responseMessage: proto_chat_pb.JoinResponse|null) => void
  ): UnaryResponse;
  sendMsg(
    requestMessage: proto_chat_pb.ChatMessage,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_chat_pb.Empty|null) => void
  ): UnaryResponse;
  sendMsg(
    requestMessage: proto_chat_pb.ChatMessage,
    callback: (error: ServiceError|null, responseMessage: proto_chat_pb.Empty|null) => void
  ): UnaryResponse;
  receiveMsg(requestMessage: proto_chat_pb.Empty, metadata?: grpc.Metadata): ResponseStream<proto_chat_pb.ChatMessage>;
  getAllUsers(
    requestMessage: proto_chat_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: proto_chat_pb.UserList|null) => void
  ): UnaryResponse;
  getAllUsers(
    requestMessage: proto_chat_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: proto_chat_pb.UserList|null) => void
  ): UnaryResponse;
}

