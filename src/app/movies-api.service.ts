import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonoTypeOperatorFunction, Observable, range, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesApiService {
  pipe(arg0: MonoTypeOperatorFunction<unknown>) {
    throw new Error('Method not implemented.');
  }
  path ="";
  apiKey="api_key=f160e6dfe95f15b5bf585afa806632f9";
  constructor(private http: HttpClient) { }

  rootURL = 'https://api.themoviedb.org/3';

  getMovies():Observable<any>{
    this.path = this.rootURL + "/discover/movie" ;
    return this.http.get(`${this.path}?${this.apiKey}`);
  }

  getMoviesPag(page:any):Observable<any>{
    this.path = this.rootURL + "/discover/movie" ;
    return this.http.get(`${this.path}?${this.apiKey}` + "&page=" + page);
  }

  getMovieDeteils(id:any):Observable<any>{
    this.path = this.rootURL + "/movie/" + id ;
    return this.http.get(`${this.path}?${this.apiKey}`);
  }

  getMoviesSearch(title:string): Observable<any>{
    this.path = this.rootURL + "/search/movie?query=" + title ;
    return this.http.get( `${this.path}&${this.apiKey}`);
  }

  getMoviesSearchPage(page:any,title:string):Observable<any> {
      this.path = this.rootURL + "/search/movie?query=" + title ;
      return this.http.get(`${this.path}&${this.apiKey}` + "&page=" + page);
    }
  }
