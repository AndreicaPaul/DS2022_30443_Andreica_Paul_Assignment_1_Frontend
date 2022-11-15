import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { TableCellActionParams } from '@app/shared/types/interfaces';
import { ICellRendererParams } from 'ag-grid-community';
import {TableAction} from "@app/shared/types/interfaces";

@Component({
  selector: 'app-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
})
export class TableActionsComponent<T extends { id: number }> implements ICellRendererAngularComp {
  tableActions: TableAction[];
  entityId: number;

  constructor() {}

  agInit(params: TableCellActionParams<T>): void {
    this.tableActions = params.actions;
    this.entityId = params.data.id;
  }

  public refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
