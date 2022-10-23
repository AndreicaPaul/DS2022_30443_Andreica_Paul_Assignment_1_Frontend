import { PathParams } from '@app/shared/types/interfaces/path-params.interface';
import { QueryParams } from '@app/shared/types/classes';

export interface Params<
  T extends QueryParams = QueryParams,
  K extends PathParams = {}
> {
  query?: T;
  path?: K;
}
