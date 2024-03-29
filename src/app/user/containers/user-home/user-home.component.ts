import { Component, OnInit } from '@angular/core';
import {ClientService} from "@app/user/services";
import {Router} from "@angular/router";
import {UserService} from "@app/shared/services/user.service";
import {Device} from "@app/manager/types/interfaces/device.interface";
import {User} from "@app/auth/types/interfaces";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {ColDef, ColumnApi, GridApi, GridReadyEvent} from "ag-grid-community";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChatService} from "@app/shared/services";
// Declare SockJS and Stomp
declare var SockJS;
declare var Stomp;
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {

  public columns: ColDef[];
  public gridApi: GridApi | null = null;
  public columnApi: ColumnApi | null = null;
  public gridOptions = {
    defaultColDef: {
      resizable: true,
      suppressSizeToFit: true,
    },
  };
  public userName: string = null;
  public user: User = null;
  public loading = false;
  public devices: Device[] = [];
  public resizeDebounce$ = new Subject<void>();
  public chatOpened = false;

  constructor(private clientService: ClientService, private router: Router, private userService: UserService, private chatService: ChatService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.resizeDebounce$.pipe( debounceTime(500)).subscribe(() => {
      this.gridApi.sizeColumnsToFit();
    });
    this.userService.setUser().subscribe((user)=> {
      this.user = user;
      this.userName = user.username;

      this.userService.getDevices(this.user.id).subscribe((devices) => {
        this.devices = devices;
        this.initColumns();
        this.resizeGrid();
        this.initializeWebSocketConnection();
        this.chatService.join('', '').then();
        this.chatService.receiveMessage().then();
        this.chatService.messageFor = '1';
      });
    });
  }

  public stompClient;
  public msg = [];
  private initializeWebSocketConnection() {
    const serverUrl = `http://localhost:8080/socket`;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.reconnect_delay = 5000;
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe('/alerts/message', (message) => {
        console.log(message);
        if (message.body) {
          that.snackBar.open(message.body, null, {duration: 5000});
          that.msg.push(message.body);
        }
      });

      that.stompClient.send("/app/hello", {}, "Message to you.");
    });
  }

  sendMessage(message) {
    this.stompClient.send('/app/send/message' , {}, message);
  }

  public onWindowResize(): void {
    this.resizeDebounce$.next();
  }

  public onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api as GridApi;
    this.columnApi = params.columnApi as ColumnApi;
  }

  public resizeGrid(): void {
    setTimeout(() => {
      if (this.gridApi) {
        this.gridApi.sizeColumnsToFit();
      }
    }, 10);
  }

  public getRowNodeId(device: Device): string {
    return String(device.id);
  }

  private initColumns(): void {
    this.columns = [
      {
        headerName: 'ID',
        sortable: true,
        field: 'id',
        valueGetter: (params) => params.data.id,
        minWidth: 100,
        suppressSizeToFit: false,
      },
      {
        headerName: 'NAME',
        sortable: true,
        field: 'name',
        valueGetter: (params) => params.data.name,
        minWidth: 100,
        suppressSizeToFit: false,
      },
      {
        headerName: 'DESCRIPTION',
        sortable: true,
        field: 'description',
        valueGetter: (params) => params.data.description,
        minWidth: 100,
        suppressSizeToFit: false,
      },
      {
        headerName: 'MAXIMUM HOURLY CONSUMPTION',
        sortable: true,
        field: 'maximumHourlyConsumption',
        valueGetter: (params) => params.data.maximumHourlyConsumption,
        minWidth: 100,
        suppressSizeToFit: false,
      },
      {
        headerName: 'LOCATION',
        field: 'location',
        valueGetter: (params) => params.data.location ? params.data.location.name : '',
        sortable: true,
        minWidth: 200,
        suppressSizeToFit: false,
      },
    ];
  }
}
