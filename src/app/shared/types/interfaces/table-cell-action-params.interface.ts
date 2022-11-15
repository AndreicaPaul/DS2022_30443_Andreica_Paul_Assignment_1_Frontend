import { ICellRendererParams } from 'ag-grid-community';
import { TableAction } from '@app/shared/types/interfaces/table-action.interface';

export interface TableCellActionParams<T extends { id: number }> extends ICellRendererParams {
  actions: TableAction[];
  data: T;
}
