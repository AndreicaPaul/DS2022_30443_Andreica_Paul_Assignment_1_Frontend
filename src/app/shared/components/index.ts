import { InputComponent } from '@app/shared/components/input/input.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { TextareaComponent } from '@app/shared/components/textarea/textarea.component';
import { RadioGroupComponent } from '@app/shared/components/radio-group/radio-group.component';
import { ToggleTabComponent } from '@app/shared/components/toggle-tab/toggle-tab.component';
import { SelectComponent } from '@app/shared/components/select/select.component';
import {TableActionsComponent} from "@app/shared/components/table-actions/table-actions.component";
import {AgListSelectorComponent} from "@app/shared/components/ag-list-selector/ag-list-selector.component";

export const components = [
  InputComponent,
  ButtonComponent,
  TextareaComponent,
  RadioGroupComponent,
  ToggleTabComponent,
  SelectComponent,
  TableActionsComponent,
  AgListSelectorComponent,
];

export * from './button/button.component';
export * from './input/input.component';
export * from './textarea/textarea.component';
export * from './radio-group/radio-group.component';
export * from './toggle-tab/toggle-tab.component';
export * from './select/select.component';
export * from './table-actions/table-actions.component';
export * from './ag-list-selector/ag-list-selector.component';
