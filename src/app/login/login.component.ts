import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MoviesApiService } from '../movies-api.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  checkoutForm;

  toke:string | any;

  constructor(private formBuilder: FormBuilder, private _token: MoviesApiService, private route: Router) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  setSessionId(data: any) {
    sessionStorage.setItem('sessionId', data);
  }
  
  onSubmit(form: any) {
    this._token.getToken().subscribe(data=>{

      this.toke=data.request_token;
      this._token.getLogin(form, data.request_token).subscribe(data =>{
        if(data.success){
          console.log(data)
          this._token.getSessionId(data.request_token).subscribe(data =>{
            sessionStorage.setItem('sessionId', data.session_id);
            this.route.navigate(['/']);
          });
        }
      });
      // window.location.href = "https://www.themoviedb.org/authenticate/" + data.request_token+ "?redirect_to=http://localhost:4200/login";
    })
    
    //
  }
  

}
