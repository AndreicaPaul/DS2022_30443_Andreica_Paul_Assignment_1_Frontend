import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldAppearance } from '@angular/material/form-field/form-field';
import { ThemePalette } from '@angular/material/core';
import { SelectMode } from '@app/shared/types/enums';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-select',
  template: `
    <ng-container *ngIf='simpleMode; else autocompleteMode'>
      <mat-form-field
        class='width-full'
        [color]='color'
        [appearance]='appearance'
      >
        <mat-label *ngIf='label'>
          {{ label | translate | titlecase }}
        </mat-label>
        <mat-select
          #matSelect
          [placeholder]='placeholder | translate'
          [formControl]='control'
          [multiple]='multiple'
          [compareWith]='compareWithFn'
          [required]='isRequired'
          [panelClass]='panelClass'
          (closed)='onCloseSelector()'
          (opened)='onOpen()'
          (selectionChange)='onSelectionChange($event.value)'
        >
          <div *ngIf='filterable' class='filter filter--sticky' fxLayout='row'>
            <mat-icon
              matPrefix
              class='filter--margin'
              svgIcon='search'></mat-icon>

            <input
              matInput
              placeholder='{{ filterPlaceholder }}'
              type='text'
              autocomplete='off'
              [formControl]='filterControl'
            />

            <mat-spinner *ngIf='loading' class='filter__loading' diameter='16'></mat-spinner>

            <button
              *ngIf='filterControl.value && clearFilter && !loading'
              matSuffix
              mat-icon-button
              (click)='onClearFilter()'
            >
              <mat-icon svgIcon='close'></mat-icon>
            </button>
          </div>

          <button
            *ngIf='hasValue && clear'
            (click)='onClear()'
            mat-button
            class='filter__clear'
          >
            {{ 'labels.clear' | translate }}
          </button>

          <mat-option *ngIf='(!loading && !this.options) || (this.options && this.options.length === 0)'>
            {{ noDataMessage || 'labels.noItems' | translate }}
          </mat-option>

          <mat-option
            *ngFor='let option of filteredOptions'
            [value]='option'
            [disabled]='option.disabled'
          >
            <span> {{ displayFn(option) }} </span>
          </mat-option>
        </mat-select>

        <mat-hint *ngIf='hint'>{{ hint | translate }}</mat-hint>

        <mat-error *ngIf="control.hasError('required')">
          {{ requiredMessage | translate }}
        </mat-error>
      </mat-form-field>
    </ng-container>

    <ng-template #autocompleteMode>
      <mat-form-field
        class='width-full'
        [appearance]='appearance'
      >
        <mat-label *ngIf='label'>
          {{ label | translate | titlecase }}
        </mat-label>

        <input
          class='width-full'
          matInput
          type='text'
          autocomplete='off'
          #input
          [formControl]='filterControl'
          [matAutocomplete]='auto'
          [required]='isRequired'
          [placeholder]='placeholder | translate'
          (click)='trigger.openPanel()'
        />

        <mat-error *ngIf="control.hasError('required') || filterControl.hasError('noSelection')">
          {{ 'errors.required' | translate }}
        </mat-error>

        <mat-spinner matSuffix *ngIf='loading' diameter='16'></mat-spinner>

        <mat-icon
          matSuffix
          *ngIf='control?.value && !control.disabled && !loading'
          [ngClass]="{ 'cursor-pointer': !control.disabled }"
          color='accent'
          [svgIcon]="'close'"
          (click)='onClear()'
        ></mat-icon>

        <mat-autocomplete
          #auto='matAutocomplete'
          (opened)='onOpen()'
          (optionSelected)='multiple? onChipSelected($event) : onSelectOption($event)'
          [displayWith]='displayFn'>
          <mat-option *ngIf='!options || options.length === 0'
                      [disabled]='true'>
            {{ noDataMessage || 'labels.noItems' | translate }}
          </mat-option>

          <mat-option *ngFor='let option of filteredOptions'
                      [value]='option'>
            {{ displayFn(option) }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
      <mat-chip-list *ngIf='multiple && !simpleMode'>
        <div class="full-width" fxLayout="row wrap" fxLayoutGap="6px">
          <mat-chip
            class="chip"
            *ngFor="let option of selectedOptions"
            [disabled]="option.disabled"
            [selectable]="true"
            [removable]="!option.disabled"
            (removed)="onRemove(option)"
          >
            {{ displayFn(option) }}
            <mat-icon
              mat-list-icon
              matChipRemove
              *ngIf="!option.disabled"
              [svgIcon]="'close'"
            ></mat-icon>
          </mat-chip>
        </div>
      </mat-chip-list>
    </ng-template>
  `,
  styleUrls: ['./select.component.scss']
})
export class SelectComponent<T extends { id: number }>
  implements OnInit, OnDestroy
{
  /**
   * Select mode to display
   */
  @Input('selectMode') set selectMode(selectMode: SelectMode) {
    this.multiple = selectMode.includes('multiple');
    this.simpleMode = selectMode.includes('simple');
  };

  @Input() hint: string;

  @Input() panelClass: string;

  @Input() color: ThemePalette = 'primary';

  /**
   * Form-control for this mat-form-field
   */
  @Input() control: FormControl;

  /**
   * Input Label
   */
  @Input() label: string;

  /**
   * Input placeholder
   */
  @Input() placeholder: string;

  /**
   * If we show the record-field-filter-value input
   * !only for simple select
   */
  @Input() filterable = true;

  /**
   * If we want to have a clear button where the user can clear the input
   */
  @Input() clear = true;

  /**
   * If we want to have an x icon that clears the filter value
   */
  @Input() clearFilter = true;

  /**
   * Use when we have all the values in memory and we need to filter only on those
   */
  @Input() localFiltering = true;

  /**
   * How the input should appear, by default outline
   */
  @Input() appearance: MatFormFieldAppearance = 'outline';

  /**
   * Display spinner
   */
  @Input() loading: boolean;

  /**
   * Filter placeholder
   * only for simple select
   */
  @Input() filterPlaceholder = 'Filter';

  /**
   * If this property is true, then the first option will be selected
   * works in simple select mode
   */
  @Input() selectFirst: boolean;

  /**
   * Messaged showed when the required error is available
   */
  @Input() requiredMessage = 'errors.required';

  /**
   * Messaged showed when the options input is null (not when it is empty - [])
   */
  @Input() noDataMessage: string;

  /**
   * Allow duplicates in chip selection (show the user values that are already
   * selected and allow them to be added multiple times)
   */
  @Input() allowDuplicates : boolean = false;

  /**
   * Pass function if we want to change how we are display the data
   */
  @Input() displayFn: any = option => option;

  @Input() valueFn: any = option => option;

  /**
   * Pass function which will determine if the value is selected or not
   */
  @Input() compareWithFn = (a: unknown, b: unknown): boolean => a === b;

  /**
   * Options to render
   */
  @Input('options') set inputOptions(options: T[]) {
    if (options) {
      this.allOptions = options;
      this.subscribeFilterControlChanges();
      this.options = options;
      return;
    }
    this.options = undefined;
    this.filteredOptions = [];
  }

  /**
   * Emits when control's value is changed from the mat-select component
   */
  @Output() selectionChange = new EventEmitter();

  /**
   * Emit when user types something in the search input
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Emit when options panel is opened
   */
  @Output() selectOpened = new EventEmitter<void>();

  filterControl: FormControl = new FormControl();
  filteredOptions: T[];
  options: T[] | undefined;
  selectedOptions: T[] = [];
  allOptions: T[] = [];
  multiple: boolean;
  simpleMode: boolean;

  @ViewChild('matSelect') matSelect: MatSelect;
  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger;

  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.selectFirstOption();
  }

  get isRequired(): boolean {
    if (this.label && this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      if (validator && validator['required']) {
        return true;
      }
    }

    return false;
  }

  get hasValue(): boolean {
    return this.control.value !== null && this.control.value !== undefined;
  }

  onOpen(): void {
    console.log(this.control.errors, this.control.value);
    this.selectOpened.emit();
  }

  onCloseSelector(): void {
    if (this.filterControl.value) {
      this.filterControl.reset();
      this.onClearFilter();
    }
  }

  onClear(): void {
    this.control.setValue('');
    this.onClearFilter();
    this.matSelect?.close();
  }

  onClearFilter(): void {
    this.filterControl.setValue('');
  }

  //For simple mode
  onSelectionChange(value: string): void {
    this.selectionChange.emit(value);
    this.control.markAsDirty();
  }

  //For autocomplete mode
  onSelectOption(event: MatAutocompleteSelectedEvent): void {
    this.control.setValue(this.valueFn(event.option.value));
    this.control.markAsDirty();
  }

  //For chip select
  onChipSelected(event: MatAutocompleteSelectedEvent): void {
    this.options = this.options.filter(
      option => this.valueFn(option) !== this.valueFn(event.option.value)
    );
    this.control.setValue([
      this.valueFn(event.option.value)
    ]);
    this.selectedOptions = [...this.selectedOptions, event.option.value];
    this.filterControl.setValue('');
    this.filterControl.setValidators([]);
    this.filterControl.updateValueAndValidity();
    this.control.markAsDirty();
  }

  onRemove(option: T): void {
    const index = this.selectedOptions.indexOf(option);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.setOptions(this.selectedOptions);
      this.control.setValue(this.selectedOptions);
      if (this.isRequired) {
        this.filterControl.setValidators([this.selectionRequiredValidator]);
        this.filterControl.updateValueAndValidity();
      }
      this.control.markAsDirty();
    }
  }

  private setOptions(selectedValues: any[]): void {
    this.options = this.allOptions.filter(
      (option: T) => !selectedValues.includes(this.valueFn(option))
    );
  }

  private selectionRequiredValidator: ValidatorFn = (control: FormControl) => {
    if (this.control?.value?.length && !control.value) {
      return null;
    }
    if (!this.control?.value?.length || !control.value) {
      return {
        noSelection: true
      };
    }
    return null;
  };


  private subscribeFilterControlChanges(): void {
    this.filterControl?.valueChanges
      .pipe(
        startWith(''),
        takeUntil(this.ngUnsubscribe),
        debounceTime(200),
        filter(value => typeof value === 'string')
      )
      .subscribe((searchText: string) => {
        const caseInsensitiveText = searchText
          ? searchText.toLowerCase()
          : searchText;
        this.search.emit(caseInsensitiveText);

        if (this.localFiltering) {
          this.searchOptions(caseInsensitiveText);
        }

        /**
        * If the autocomplete input matches one of the existing options automatically select it
        * Also sets the control to null if value is modified, and it does not match
        * any existing one
         */
        if(!this.simpleMode){
          let matchedValue = this.filteredOptions.find((option) => this.displayFn(option) === this.filterControl.value);
          matchedValue = matchedValue ? matchedValue : null;
          this.control.setValue(matchedValue);
        }
      });
  }

  private searchOptions(searchText: string): void {
    this.filteredOptions = this.options.filter((option: any) =>
      this.displayFn(option).toLowerCase().includes(searchText)
    );

    //Filter by selected chips when necessary
    if(!this.allowDuplicates && this.multiple && !this.simpleMode) {
      this.filteredOptions = this.filteredOptions.filter(
        (option: T) => !this.selectedOptions.includes(this.valueFn(option))
      );
    }
  }

  private selectFirstOption(): void {
    if (this.selectFirst) {
      this.setControlValue(this.simpleMode? this.control : this.filterControl, this.options[0]);
    }
  }

  private setControlValue(control: FormControl, value: any): void {
    if (this.options) {
      const _value = this.options.find(
        option => this.valueFn(option) === value
      );
      this.multiple && this.simpleMode? control.setValue([_value]) : control.setValue(_value);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
