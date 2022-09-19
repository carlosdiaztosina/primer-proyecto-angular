import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, MonoTypeOperatorFunction, Observable, range, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MoviesApiService {
  path = "";
  apiKey = "api_key=f160e6dfe95f15b5bf585afa806632f9";
  rootURL = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient, private route: Router) { }

  getMovies(): Observable<any> {
    this.path = this.rootURL + "/discover/movie";
    return this.http.get(`${this.path}?${this.apiKey}`);
  }

  getMoviesPag(page: any): Observable<any> {
    this.path = this.rootURL + "/discover/movie";
    return this.http.get(`${this.path}?${this.apiKey}` + "&page=" + page);
  }

  getMovieDeteils(id: any): Observable<any> {
    this.path = this.rootURL + "/movie/" + id;
    return this.http.get(`${this.path}?${this.apiKey}`);
  }

  getMoviesSearch(title: string): Observable<any> {
    this.path = this.rootURL + "/search/movie?query=" + title;
    return this.http.get(`${this.path}&${this.apiKey}`);
  }

  getMoviesSearchPage(page: any, title: string): Observable<any> {
    this.path = this.rootURL + "/search/movie?query=" + title;
    return this.http.get(`${this.path}&${this.apiKey}` + "&page=" + page);
  }

  getToken(): Observable<any> {
    this.path = this.rootURL + "/authentication/token/new";
    return this.http.get(`${this.path}?${this.apiKey}`);
  }

  getLogin(user: any, token: any): Observable<any> {
    this.path = this.rootURL + "/authentication/token/validate_with_login?" + this.apiKey;
    return this.http.post(this.path, { username: user.name, password: user.password, request_token: token });
  }

  getSessionId(tokenValidate: any): Observable<any> {
    this.path = this.rootURL + "/authentication/session/new?" + this.apiKey;
    return this.http.post(this.path, { request_token: tokenValidate });
  }

  setRateMovie(idMovie: any, rate: any, session_id: any): Observable<any> {
    this.path = this.rootURL + "/movie/" + idMovie + "/rating?" + this.apiKey + "&session_id=" + session_id;
    return this.http.post(this.path, { value: rate });
  }

  getRate(idUser: any, session_id: any): Observable<any> | void {
    if (session_id) {
      this.path = this.rootURL + "/account/" + idUser + "/rated/movies?" + this.apiKey + "&language=en-US&sort_by=created_at.asc&page=1&session_id=" + session_id;
      return this.http.get(this.path);
    }
  }

  setFavoriteMovie(session_id: any, idUser: any, idMovie: any, favoriteMovie: any): Observable<any> {
    this.path = this.rootURL + "/account/" + idUser + "/favorite?" + this.apiKey + "&session_id=" + session_id;
    return this.http.post(this.path, { media_type: "movie", media_id: idMovie, favorite: favoriteMovie });
  }

  getFavoriteMovies(session_id: any, idUser: any): Observable<any> | void {
    if (session_id) {
      this.path = this.rootURL + "/account/" + idUser + "/favorite/movies?" + this.apiKey + "&session_id=" + session_id;
      return this.http.get(this.path);
    }
  }

  getGenreList(): Observable<any> {
    this.path = this.rootURL + "/genre/movie/list";
    return this.http.get(`${this.path}?${this.apiKey}`);
  }


  getMoviesWithGenre(genreId: any) : Observable<any>{
    this.path = this.rootURL + "/discover/movie?sort_by=popularity.desc&page=1";
    return this.http.get(`${this.path}&${this.apiKey}&with_genres=${genreId}`);
  }

}
