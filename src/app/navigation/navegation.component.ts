import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  fieldOn=false;
  windowWidth=false;
  searchBotton=true;

  textField:any;
  session_id:any;
  
  typeScroll="arrow_back";
  scrollOnArrow=false;
  scrollOnSearch=true;

  private debounceTimer?: NodeJS.Timeout

  subscriptions = new Subscription();

  text : any;

  show=true;

  constructor(
    private _movies: MoviesApiService, 
    private route: Router, 
    private naviServ: NavigationService,
    private userService: UserService,
    private loginService : LoginService) { }

  ngOnInit(): void {
    this.session_id = this.userService.getSessionId();
    if(this.route.url.length > 1){
      this.scrollOnArrow=true;
      this.scrollOnSearch=false;
      this.fieldOn = false;
      this.searchBotton = false;
    }
    window.addEventListener("scroll",(event)=>{
      this.getScroll();
    })

  }

  logout() {
    this.session_id = null;
    this.loginService.setSessionId(null);
    this.userService.removeUser();
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
      this.naviServ.setText(null);
      this.route.navigate(['']);
    }else{
      window.scrollTo(0,0);
    }
  }

  getScroll(){
    if(this.route.url.length <= 1 && window.scrollY == 0){
      this.scrollOnArrow=false;
      this.scrollOnSearch=true;
    }else if(this.route.url.length > 1  && window.scrollY == 0){
      this.typeScroll = "arrow_back";
      this.scrollOnArrow=true;
      this.scrollOnSearch=false;
      this.fieldOn = false;
    }else if( window.scrollY > 400){
      this.typeScroll = "arrow_upward";
      this.scrollOnArrow=true;
      this.scrollOnSearch=false;
    }
  }

  Search(event:any){
    
    if (!!event && event.target.value !=="") {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.text = event.target.value;
        this.naviServ.setText(this.text);
      }, 500);
    }else{
      this.naviServ.setText(null);
    }
  }

  showField(fieldOn:any){
    if(fieldOn){
      this.fieldOn =false;
    }else if(!fieldOn && window.screen.width <= 600){
      this.fieldOn = true;
      this.windowWidth = true;
    }else{
      this.fieldOn = true;
      this.windowWidth = false;
    }
  }
}
