import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from './login/login.service';
import { MoviesApiService } from './movies-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>("");
  public userObservable = this.userSubject.asObservable();
  
  session_id: any;

  apiKey = "api_key=f160e6dfe95f15b5bf585afa806632f9";
  rootURL = 'https://api.themoviedb.org/3';

  constructor(
    private http: HttpClient, 
    private loginService: LoginService) {
      this.loginService.sessionObservable.subscribe(data => {
        this.session_id = data;
        this.getUser();
      });
    }

  setUser(data: any) {
    this.userSubject.next(data);
  }

  getSessionId() {
    this.loginService.sessionObservable.subscribe(data => {
      this.session_id = data;
    });
    return this.session_id;
  }
  getUserLoged(){
    return sessionStorage.getItem('user');
  }


  getUser() {
    if (this.session_id) {
      const path = this.rootURL + "/account?" + this.apiKey + "&session_id=" + this.session_id;
      this.http.get(path).subscribe(user => {
        sessionStorage.setItem('user',JSON.stringify(user))
        this.setUser(user);
      });
    }
  }

  removeUser() {
    this.setUser(null)
  }


}
