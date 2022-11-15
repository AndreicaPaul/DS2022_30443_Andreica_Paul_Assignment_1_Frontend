import {Component, OnDestroy, OnInit} from '@angular/core';
import {CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent} from "ag-grid-community";
import {TableAction} from "@app/shared/types/interfaces";
import {first, Subject, take} from "rxjs";
import {RegisterRequest, User} from "@app/auth/types/interfaces";
import {ManagersService} from "@app/manager/services";
import {UserService} from "@app/shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "@app/auth/services";
import {debounceTime} from "rxjs/operators";
import {TableActionsComponent} from "@app/shared/components";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public columns: ColDef[];
  public gridApi: GridApi | null = null;
  public columnApi: ColumnApi | null = null;
  public gridOptions = {
    defaultColDef: {
      resizable: true,
      suppressSizeToFit: true,
    },
  };
  public tableActions: TableAction[];
  public resizeDebounce$ = new Subject<void>();
  public users: User[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  public addNewUserOverlayOpened: boolean = false;

  constructor(private managersService: ManagersService,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.initTableActions();
    this.initData();
    this.resizeDebounce$.pipe( debounceTime(500)).subscribe(() => {
      this.gridApi.sizeColumnsToFit();
    });
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

  public getRowNodeId(user: User): string {
    return String(user.id);
  }

  onRegister(user: RegisterRequest) {
    this.authService
      .registration(user)
      .pipe(
        first()
      )
      .subscribe(() => this.setUsers());
  }

  public onCellValueChange(event: CellValueChangedEvent): void {
    let updatedUser = event.data as User;
    this.managersService.editUser(updatedUser).subscribe( (newUserData) => {
      updatedUser = newUserData;
      this.gridApi.applyTransaction({ update: [updatedUser] });
      this.snackBar.open('Changes Saved', null, { duration: 2000 });
    });
  }

  private initColumns(): void {
    this.columns = [
      {
        headerName: 'ID',
        sortable: true,
        field: 'id',
        valueGetter: (params) => params.data.id,
        minWidth: 200,
        suppressSizeToFit: false,
        editable: false,
      },
      {
        headerName: 'NAME',
        sortable: true,
        field: 'username',
        valueGetter: (params) => params.data.username,
        minWidth: 200,
        suppressSizeToFit: false,
        editable: true,
      },
      {
        headerName: 'EMAIL',
        field: 'email',
        valueGetter: (params) => params.data.email,
        minWidth: 200,
        suppressSizeToFit: false,
        editable: true,
      },
      {
        cellRenderer: TableActionsComponent,
        cellRendererParams: {
          actions: this.tableActions,
        },
        field: 'id',
        headerName: '',
        maxWidth: 60,
        sortable: false,
        resizable: false,
        cellStyle: { border: 'none' },
      },
    ];
  }

  private initData(): void {
    this.setUsers();
  }

  private setUsers(): void {
    this.managersService
      .getAllUsers()
      .pipe(take(1))
      .subscribe((users) => {
        this.initColumns();
        this.resizeGrid();
        this.users = users;
      });
  }

  private initTableActions(): void {
    this.tableActions = [
      {
        label: 'Delete User',
        icon: 'close',
        onAction: (userId: number) => {
          this.managersService.deleteUser(userId).subscribe(() => this.setUsers());
        },
      },
    ];
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
    try {
      if (this.gridApi) {
        this.gridApi.destroy();
        this.gridApi = null;
      }
    } catch (err) {
      console.error('* Error caught while destroying agGrid instance');
    }
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
