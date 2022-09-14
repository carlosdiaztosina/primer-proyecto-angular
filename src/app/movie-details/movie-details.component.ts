import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MoviesApiService } from '../movies-api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})

export class MovieDetailsComponent implements OnInit, OnDestroy {
  movie: any = [];
  rateMovies: any = [];
  favoriteMovies: any = [];

  idMovie: any;
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  session_id :any;
  user :any;
  
  error = '';
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;
  isMouseover = true;
  rate = 0;

  favoriteMovie=false;

  counter = new BehaviorSubject(0)
  subscriptions = new Subscription()

  constructor(
    private _movie: MoviesApiService, 
    private activatedRoute: ActivatedRoute, 
    private route : Router,
    private userService: UserService,
  ) { 
    //
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.idMovie = params['id'];
      this.getMovieDeteils(this.idMovie)
    });
    this.userService.userObservable.subscribe(user => {
      this.user = user;
    });
    this.session_id = this.userService.getSessionId();

      this.getRate();
      this.getFavoriteMovies();
  
      this.favoriteMovie = false;
      this.selectedValue =  0;
   
  }

  getMovieDeteils(id: any) {
    this.subscriptions.add(
      this._movie.getMovieDeteils(id).subscribe((data) => {
        this.movie = data;
      
      }, err => {
        this.error = "This ID that you are searching is not valid"
      })
    )

  }

  getRate() {
    this.isMouseover = true;
    this.subscriptions.add(
      this._movie.getRate(this.user.id, this.session_id)?.subscribe(data => {

        data.results.map((element: any) => {
          this.rateMovies.push(element);
        })
        this.rateMovies.forEach((element: any) => {
          if (element.id == this.idMovie) {
  
            if (element.rating <= 2) {
  
              this.selectedValue = element.rating - 1;
            } else {
              this.selectedValue = element.rating / 2;
            }
          }
        });
      })
    )

  }

  countStar(star: number) {
    this.isMouseover = false;

    if (star == 1) {
      this.rate = star + 1;
    } else {
      this.rate = star * 2;
    }

    this._movie.setRateMovie(this.movie.id, this.rate, this.session_id).subscribe(data => {

      this.ngOnInit();

    });

  }

  addClass(star: number) {
    if (this.isMouseover) {
      this.selectedValue = star;
    }
  }

  removeClass() {
    if (this.isMouseover) {
      this.rateMovies.forEach((element: any) => {
        if (element.id == this.idMovie) {

          if (element.rating <= 2) {

            this.selectedValue = element.rating - 1;
          } else {
            this.selectedValue = element.rating / 2;
          }
        }
      });
    }
  }


  setFavoriteMovie() {
    if(!this.favoriteMovie){
      this.favoriteMovie = true
      this._movie.setFavoriteMovie(this.session_id, this.user.id, this.idMovie, this.favoriteMovie).subscribe(data => {
        this.ngOnInit();
      });
    }else{
      this.favoriteMovie = false
      this._movie.setFavoriteMovie(this.session_id, this.user.id, this.idMovie, this.favoriteMovie).subscribe(data => {
        this.ngOnInit();
      });
    }
  }

  getFavoriteMovies() {
    if(this.session_id){
      this._movie.getFavoriteMovies(this.session_id,this.user.id).subscribe((data:any) =>{
        data.results.map((element: any) => {
          this.favoriteMovies.push(element);
        })
        this.favoriteMovies.forEach((element: any) => {
          if (element.id == this.idMovie) {
            console.log("si es una peli favorita")
            this.favoriteMovie = true;
          }
        });
      })
    }
  }
  ngOnDestroy() {
    this.counter.unsubscribe()
    this.subscriptions.unsubscribe()
  }
}