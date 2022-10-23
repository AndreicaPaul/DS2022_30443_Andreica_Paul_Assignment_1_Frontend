import { FormControl } from '@angular/forms';
import { MaskedInputType } from '@app/shared/types/enums/masked-input-type.enum';

export class MaskedInput {
  type: MaskedInputType;
  mask: ((control?: FormControl) => (RegExp | string)[]) | (RegExp | string)[];
}
