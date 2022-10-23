import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { QueryParams } from '@app/shared/types/classes';
import { PaginatedResponse, PathParams } from '@app/shared/types/interfaces';
import { CrudRepository } from '@app/shared/repositories';
import { Params } from '@app/shared/types/interfaces/params.interface';

export abstract class CrudService<
  T extends { id: number },
  U extends PathParams = {}
> {
  private _values = new BehaviorSubject<T[] | null>(null);
  protected queryParams = new BehaviorSubject<QueryParams>(new QueryParams());
  protected fetching = new BehaviorSubject<boolean>(false);
  protected fetchFailed = new BehaviorSubject<boolean>(false);
  protected count = new BehaviorSubject<number>(0);

  protected constructor(protected repository: CrudRepository<T, U>) {}

  protected getPath() {
    return undefined;
  }

  get values$(): Observable<T[] | null> {
    return this._values.asObservable();
  }

  get fetching$(): Observable<boolean> {
    return this.fetching.asObservable();
  }

  get page$(): Observable<number> {
    return this.queryParams.asObservable().pipe(map(value => value.page));
  }

  get pageSize$(): Observable<number> {
    return this.queryParams.asObservable().pipe(map(value => value.pageSize));
  }

  get search$(): Observable<string> {
    return this.queryParams.asObservable().pipe(map(value => value.search));
  }

  get count$(): Observable<number> {
    return this.count.asObservable();
  }

  loadMore() {
    const queryParams = this.queryParams.getValue();
    queryParams.page += 1;
    this.queryParams.next(queryParams);
  }

  loadPrevious() {
    const queryParams = this.queryParams.getValue();
    queryParams.page -= 1;
    this.queryParams.next(queryParams);
  }

  /**
   * Main method
   * @param queryParams
   */
  subscribeValues(queryParams?: QueryParams): Observable<T[]> {
    if (queryParams) {
      this.queryParams.next(queryParams);
    }

    return this.queryParams.asObservable().pipe(
      switchMap(params => this.list(queryParams)),
      tap(response => this.count.next(response.count)),
      tap(response => this._values.next(response.results)),
      switchMap(() => this._values.asObservable() as Observable<T[]>)
    );
  }

  list(queryParams?: QueryParams): Observable<PaginatedResponse<T>> {
    const params: Params<QueryParams, U> = {
      path: this.getPath(),
      query: queryParams
    };

    return this.repository
      .list(params)
      .pipe(catchError(err => of(this.errorResponse())));
  }

  get(id: number): Observable<T> {
    return this.repository.get(id);
  }

  add(value: T | FormData): Observable<T> {
    return this.repository
      .add(value)
      .pipe(tap((_value: T) => this.addValue(_value)));
  }

  delete(id: number): Observable<void> {
    return this.repository.delete(id).pipe(tap(() => this.deleteValue(id)));
  }

  edit(value: T): Observable<T> {
    return this.repository
      .edit(value)
      .pipe(tap((_value: T) => this.editValue(value.id, _value)));
  }

  protected getRequest(id: number): Observable<T> {
    return this.repository.get(id);
  }

  protected addValue(value: T): void {
    const currentValues: T[] = this._values.value ? this._values.value : [];
    const values: T[] = [...currentValues, value];
    this._values.next(values);
  }

  protected editValue(id: number | string, value: T): void {
    const values: T[] = this._values.value ? [...this._values.value] : [];
    const index: number = values.findIndex((item: T) => item.id === id);
    values[index] = value;
    this._values.next(values);
  }

  protected deleteValue(id: number | string): void {
    if (!this._values.value) {
      return;
    }
    const values: T[] = this._values.value.filter(value => value.id !== id);
    this._values.next(values);
  }

  private errorResponse(): PaginatedResponse<T> {
    return {
      count: 0,
      results: [],
      next: null,
      previous: null
    };
  }
}
