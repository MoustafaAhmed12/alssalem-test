import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ApiCacheService {
  private cache: { [url: string]: any } = {};

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    if (this.cache[url]) {
      return of(this.cache[url]);
    } else {
      return this.http.get<T>(url).pipe(
        tap((response) => {
          this.cache[url] = response;
        })
      );
    }
  }

  clearCache(): void {
    this.cache = {};
  }
}
