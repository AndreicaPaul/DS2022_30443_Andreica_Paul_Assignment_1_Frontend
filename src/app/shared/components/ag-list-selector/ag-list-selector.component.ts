import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { FormControl } from '@angular/forms';
import { SelectMode } from '@app/shared/types/enums';

interface IAgListSelectParams<T extends { id: number }> extends ICellEditorParams {
  options: T[];
  initialValue: T;
  displayFn: (value: T) => string;
  valueFn: (value: T) => number;
  placeholder: string | null;
  label: string;
  hasClear: boolean;
  isFilterable: boolean;
  columnKey: string;
}
@Component({
  selector: 'app-ag-list-selector',
  templateUrl: './ag-list-selector.component.html',
  styleUrls: ['./ag-list-selector.component.scss'],
})
export class AgListSelectorComponent<T extends { id: number }> implements ICellEditorAngularComp {
  public params: IAgListSelectParams<T>;
  public control = new FormControl();
  public value!: T;
  public selectMode = SelectMode.SIMPLE_SINGLE_OPTION;

  constructor() {}

  agInit(params: IAgListSelectParams<T>): void {
    this.params = params;
    this.value = this.params.initialValue;
    this.initControlValue();
  }

  public onChange(): void {
    this.value = this.control.value;
    this.params.data[this.params.columnKey] = this.params.valueFn(this.value);
  }

  private initControlValue() {
    this.control.setValue(this.value);
  }

  getValue() {
    return this.params.valueFn(this.value);
  }
}
