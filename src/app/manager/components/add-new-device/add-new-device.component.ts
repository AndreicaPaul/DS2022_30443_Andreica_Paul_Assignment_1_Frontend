import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SaveDevicePayload} from "@app/manager/types/interfaces";

@Component({
  selector: 'app-add-new-device',
  templateUrl: './add-new-device.component.html',
  styleUrls: ['./add-new-device.component.scss']
})
export class AddNewDeviceComponent implements OnInit {
  form: FormGroup;
  @Output() save = new EventEmitter<SaveDevicePayload>();

  constructor(private formBuilder: FormBuilder) { }

  get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get maximumHourlyConsumptionControl(): FormControl {
    return this.form.get('maximumHourlyConsumption') as FormControl;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSaveDevice(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      id: undefined,
      name: this.nameControl.value,
      description: this.descriptionControl.value,
      maximumHourlyConsumption: this.maximumHourlyConsumptionControl.value,
    });
  }

  private initForm(): void {
    this.form = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        description: [null, [Validators.required]],
        maximumHourlyConsumption: [0, [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]],
      },
    );
  }
}
