import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { MoviesApiService } from '../movies-api.service';
import { UserService } from '../user-service.service';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navegation',
  templateUrl: './navegation.component.html',
  styleUrls: ['./navegation.component.scss']
})
export class NavegationComponent implements OnInit {
  
  menuOn = false;
  fieldOn = false;
  textField:any;
  session_id:any;
  typeScroll="arrow_back";
  scrollOn=false;

  private debounceTimer?: NodeJS.Timeout

  text : any;

  constructor(
    private _movies: MoviesApiService, 
    private route: Router, 
    private naviServ: NavigationService,
    private userService: UserService,
    private loginService : LoginService) { }

  ngOnInit(): void {
    this.session_id = this.userService.getSessionId();
    if(this.route.url.length > 1){
      this.scrollOn=true;
    }
    window.addEventListener("scroll",(event)=>{
      this.getScroll();
    })
  }

  logout() {
    this.session_id = null;
    this.loginService.setSessionId(null);
    sessionStorage.removeItem('sessionId');
  }

  login(login: string) {
    if (login == "login") {
      this.route.navigate(['/login']);
    } else if (login == "favorite") {
      this.route.navigate(['/favorite/movies']);
    } else {
      this.logout();
    }
  }

  getText() {
    return this.text;
  }

  downMenu(){
    if(!this.menuOn){
      this.menuOn=true
    }else{
      this.menuOn = false;
    }
  }

  arrowClick(arrow:any){
    if(this.route.url.length > 1 &&  arrow == "arrow_back" ){  
      this.route.navigate(['']);
    }else{
      window.scrollTo(0,0);
    }
  }

  getScroll(){
    if(this.route.url.length <= 1 && window.scrollY == 0){
      this.scrollOn = false;
      this.fieldOn = false;
    }else if( this.route.url.length <= 1 && window.scrollY > 1){
      this.typeScroll = "arrow_upward";
      this.scrollOn = true;
    }else if(this.route.url.length > 1 && window.scrollY >= 0){
      this.typeScroll = "arrow_back";
      this.menuOn = false;
      this.scrollOn = false;
    }else{
      this.typeScroll = "arrow_back";
      this.scrollOn = true;
    }
  }

  fieldTextOn(){
    if(!this.fieldOn){
      this.fieldOn=true
    }else{
      this.fieldOn = false;
    }
  }

  Search(event:any){
    if (!!event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.text = event.target.value;
        this.naviServ.setText(this.text);
      }, 500);
    }
  }
}
