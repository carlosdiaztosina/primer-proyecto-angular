import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MoviesApiService } from '../movies-api.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  checkoutForm;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    this.loginService.login(form);
  }

}
