import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MoviesApiService } from '../movies-api.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private sessionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        this.getSessionIdFromStorage() || null
    );
    public sessionObservable = this.sessionSubject.asObservable();

    errorMessage: string | any;
    apiKey = "api_key=f160e6dfe95f15b5bf585afa806632f9";
    rootURL = 'https://api.themoviedb.org/3';
    sessionId = '';

    constructor(
        private http: HttpClient,
        private _token: MoviesApiService,
        private route: Router
    ) { }

    getSessionId(tokenValidate: any) {
        const path = this.rootURL + "/authentication/session/new?" + this.apiKey;
        return this.http.post(path, { request_token: tokenValidate });
    }

    setSessionId(data: any) {
        sessionStorage.setItem('sessionId', data);
        this.sessionSubject.next(data);
    }

    getSessionIdFromStorage(){
        return sessionStorage.getItem('sessionId');
    }

    login(form: any) {
        this._token.getToken().subscribe(data => {
            
            const token = data.request_token;
            this._token.getLogin(form, token).subscribe(data => {
                if (data.success) {
                    this.getSessionId(data.request_token).subscribe((dataSession: any) => {
                        const { success, session_id } = dataSession;
                        success && this.setSessionId(session_id);
                        this.route.navigate(['/']);
                    })
                }
            }, err => {
                this.errorMessage = err.error.status_message;
            });
        })
    }
}
