import { Observable } from 'rxjs';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { PaginatedResponse, PathParams } from '@app/shared/types/interfaces';
import { Params } from '@app/shared/types/interfaces/params.interface';
import { QueryParams } from '@app/shared/types/classes';

export abstract class CrudRepository<
  T extends { id: number },
  U extends PathParams = {}
> {
  protected constructor(protected http: HttpClient) {}

  protected get context(): HttpContext {
    return new HttpContext();
  }

  protected abstract get baseUrl(): string;

  protected getBaseUrl(params: U | undefined): string {
    return this.baseUrl;
  }

  protected getHttpParams(params?: Params<QueryParams, U>): HttpParams {
    const queryParams = params?.query;
    let httpParams = new HttpParams();

    if (queryParams?.page) {
      httpParams = httpParams.set('page', queryParams.page.toString());
    }

    if (queryParams?.pageSize) {
      httpParams = httpParams.set('pageSize', queryParams.pageSize.toString());
    }

    if (queryParams?.search) {
      httpParams = httpParams.set('search', queryParams.search);
    }

    if (queryParams?.ordering) {
      httpParams = httpParams.set('ordering', queryParams.ordering);
    }

    return httpParams;
  }

  list(
    params?: Params<QueryParams, U>,
    context?: HttpContext
  ): Observable<PaginatedResponse<T>> {
    const _context = context ? context : this.context;
    const baseUrl = this.getBaseUrl(params?.path);
    return this.http.get<PaginatedResponse<T>>(baseUrl, {
      params: this.getHttpParams(params),
      context: _context
    });
  }

  get(valueId: number, params?: Params<QueryParams, U>): Observable<T> {
    const baseUrl = this.getBaseUrl(params?.path);
    return this.http.get<T>(`${baseUrl}/${valueId}`, {
      context: this.context
    });
  }

  add(value: T | FormData, params?: Params<QueryParams, U>): Observable<T> {
    const baseUrl = this.getBaseUrl(params?.path);
    return this.http.post<T>(baseUrl, value, {
      context: this.context
    });
  }

  edit(value: T | FormData, params?: Params<QueryParams, U>): Observable<T> {
    const baseUrl = this.getBaseUrl(params?.path);
    const id = value instanceof FormData ? value.get('id') : value.id;
    return this.http.patch<T>(`${baseUrl}/${id}`, value, {
      context: this.context
    });
  }

  delete(id: number, params?: Params<QueryParams, U>): Observable<void> {
    const baseUrl = this.getBaseUrl(params?.path);
    return this.http.delete<void>(`${baseUrl}/${id}`, {
      context: this.context
    });
  }
}
