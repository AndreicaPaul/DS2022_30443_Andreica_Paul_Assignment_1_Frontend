import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SelectMode} from "@app/shared/types/enums";
import { Location} from "@app/manager/types/interfaces";

@Component({
  selector: 'app-manager-first-time',
  templateUrl: './manager-first-time.component.html',
  styleUrls: ['./manager-first-time.component.scss']
})
export class ManagerFirstTimeComponent implements OnInit {

  @Input() availableLocations: Location[];


  public selectMode = SelectMode;
  public displayFn = (option: any): string => option.name;
  public valueFn = (option: any): string => option.id;
  public loading = true;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get locationControl(): FormControl {
    return this.form.get('location') as FormControl;
  }

  ngOnInit(): void {
    this.initForm();
    this.loading = false;
  }

  public onSaveLocationDetails(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      location: [null, [Validators.required]],
      deliveryZones: [null, [Validators.required]]
    });
  }
}
