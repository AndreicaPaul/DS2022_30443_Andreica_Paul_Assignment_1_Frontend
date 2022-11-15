import {Component, OnDestroy, OnInit} from '@angular/core';
import {CellValueChangedEvent, ColDef, ColumnApi, GridApi, GridReadyEvent} from "ag-grid-community";
import {TableAction} from "@app/shared/types/interfaces";
import { Subject, take} from "rxjs";
import {ManagersService} from "@app/manager/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {debounceTime} from "rxjs/operators";
import {AgListSelectorComponent, TableActionsComponent} from "@app/shared/components";
import {Location, SaveDevicePayload} from "@app/manager/types/interfaces";
import {Device} from "@app/manager/types/interfaces/device.interface";
import {DevicesService} from "@app/manager/services/devices.service";
import {User} from "@app/auth/types/interfaces";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {
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
  public devices: Device[] = [];
  public users: User[] = [];
  public locations: Location[] = [];
  public addNewDeviceOverlayOpened: boolean = false;

  private ngUnsubscribe$ = new Subject<void>();

  constructor(private managersService: ManagersService,
              private devicesService: DevicesService,
              private snackBar: MatSnackBar,
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

  public getRowNodeId(device: Device): string {
    return String(device.id);
  }

  onSaveDevice(device: SaveDevicePayload) {
    this.devicesService
      .addDevice(device)
      .subscribe(() => this.setDevices());
  }

  public onCellValueChange(event: CellValueChangedEvent): void {
    let updatedDevice: any = {
      description: event.data.description,
      id: event.data.id,
      location: Number(event.data.location?.id),
      maximumHourlyConsumption: event.data.maximumHourlyConsumption,
      name: event.data.name,
      user: Number(event.data.user?.id),
    };
    this.devicesService.editDevice(updatedDevice).subscribe( (newDevice) => {
      updatedDevice = newDevice;
      this.gridApi.applyTransaction({ update: [updatedDevice] });
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
        minWidth: 100,
        suppressSizeToFit: false,
        editable: false,
      },
      {
        headerName: 'NAME',
        sortable: true,
        field: 'name',
        valueGetter: (params) => params.data.name,
        minWidth: 100,
        suppressSizeToFit: false,
        editable: true,
      },
      {
        headerName: 'DESCRIPTION',
        sortable: true,
        field: 'description',
        valueGetter: (params) => params.data.description,
        minWidth: 100,
        suppressSizeToFit: false,
        editable: true,
      },
      {
        headerName: 'MAXIMUM HOURLY CONSUMPTION',
        sortable: true,
        field: 'maximumHourlyConsumption',
        valueGetter: (params) => params.data.maximumHourlyConsumption,
        minWidth: 100,
        suppressSizeToFit: false,
        editable: true,
      },
      {
        headerName: 'LOCATION',
        field: 'location',
        valueGetter: (params) => params.data.location ? params.data.location.name : 'Click to Set a Location',
        cellEditor: AgListSelectorComponent,
        cellEditorParams: (params) => {
          return {
            options: this.locations,
            initialValue: params.data.location,
            displayFn: (location: Location) =>  location ? location.name : null,
            valueFn: (location: Location) => location?.id,
            placeholder: 'Select a Location',
            label: null,
            hasClear: true,
            isFilterable: true,
            columnKey: 'location',
          };
        },
        editable: true,
        sortable: true,
        valueSetter: (params ) => {
          params.data.location = this.locations.find((location) => location.id === params.data.location);
          return true;
        },
        minWidth: 200,
        suppressSizeToFit: false,
      },
      {
        headerName: 'USER',
        field: 'user',
        cellEditor: AgListSelectorComponent,
        cellEditorParams: (params) => {
          return {
            options: this.users,
            initialValue: params.data.user,
            displayFn: (user: User) =>  user ? user.username : null,
            valueFn: (user: User) => user?.id,
            placeholder: 'Select A User',
            label: null,
            hasClear: true,
            isFilterable: true,
            columnKey: 'user',
          };
        },
        editable: true,
        sortable: true,
        valueGetter: (params) => {
          if (params.data.user) {
            return params.data.user.username;
          }

          return 'Click to Set A User';
        },
        valueSetter: (params ) => {
          params.data.user = this.users.find((user) => user.id === params.data.user);
          return true;
        },
        minWidth: 200,
        suppressSizeToFit: false,
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
    this.setDevices();
    this.setUsers();
    this.setLocations();
  }

  private setDevices(): void {
    this.devicesService
      .getAllDevices()
      .pipe(take(1))
      .subscribe((devices) => {
        this.initColumns();
        this.resizeGrid();
        this.devices = devices;
      });
  }

  private setUsers(): void {
    this.managersService.getAllUsers().subscribe((users) => this.users = users);
  }

  private setLocations(): void {
    this.managersService.getLocations().subscribe((locations) => this.locations = locations);
  }

  private initTableActions(): void {
    this.tableActions = [
      {
        label: 'Delete Device',
        icon: 'close',
        onAction: (deviceId: number) => {
          this.devicesService.deleteDevice(deviceId).subscribe(() => this.setDevices());
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
