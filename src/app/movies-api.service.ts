import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, range, throwError } from 'rxjs';
import { catchError, map, mergeMap, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MoviesApiService {
  constructor(private http: HttpClient) { }

  rootURL = 'https://api.themoviedb.org/3/discover/movie?api_key=f160e6dfe95f15b5bf585afa806632f9';

  getMovies():Observable<any>{
    return this.http.get(this.rootURL);
  }
}
