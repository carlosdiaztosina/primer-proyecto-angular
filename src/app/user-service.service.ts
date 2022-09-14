import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from './login/login.service';
import { MoviesApiService } from './movies-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public userObservable = this.userSubject.asObservable();
  
  session_id: any;

  apiKey = "api_key=f160e6dfe95f15b5bf585afa806632f9";
  rootURL = 'https://api.themoviedb.org/3';

  constructor(
    private http: HttpClient, 
    private loginService: LoginService) {}

  setUser(data: any) {
    this.userSubject.next(data);
  }

  getSessionId() {
    this.loginService.sessionObservable.subscribe(data => {
      this.session_id = data;
    });
    return this.session_id;
  }

  getUser() {
    let session_id = this.getSessionId();
    if ( session_id) {
      const path = this.rootURL + "/account?" + this.apiKey + "&session_id=" + session_id;
      this.http.get(path).subscribe(user => {
        this.setUser(user);
      });
    }
  }

}
