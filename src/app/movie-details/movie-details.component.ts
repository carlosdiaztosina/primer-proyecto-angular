import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import { MoviesApiService } from '../movies-api.service';
import { Subscription } from 'rxjs';
import { UserService } from '../user-service.service';
import { LoginService } from '../login/login.service';

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
  session_id: any;
  user: any;

  error = '';
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: any;
  isMouseover = true;
  rate = 0;

  favoriteMovie :any;

  subscriptions = new Subscription()

  constructor(
    private _movie: MoviesApiService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private loginService: LoginService
  ) {
    //
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.idMovie = params['id'];
      this.getMovieDeteils(this.idMovie)
      this.loginService.sessionObservable.subscribe(data => {
        this.session_id = data;
      });
      this.userService.getUser();
      this.userService.userObservable.subscribe(user => {
        if(user){
          this.user = user;
          this.getRate();
          this.getFavoriteMovies();
        }
      });
    });
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
    if(this.user){
      this.subscriptions.add(
        this._movie.getRate(this.user.id, this.session_id)?.subscribe(data => {
          data.results.map((element: any) => {
            this.rateMovies.push(element);
          });
          this.setStrats();
        })
      )
    }
  }

  setStrats(){
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

  countStar(star: number) {
    this.isMouseover = false;
    if (star == 1) {
      this.rate = star + 1;
    } else {
      this.rate = star * 2;
    }
    this.setRateMovie(this.rate);
    
  }

  addClass(star: number) {
    this.selectedValue = star;
    if (this.isMouseover) {
      this.selectedValue = star;
    }
  }

  removeClass() {
    if (this.isMouseover) {
      this.setStrats();
    }
  }

  setRateMovie(rate:any){
    this._movie.setRateMovie(this.movie.id, rate, this.session_id).subscribe(data => {
      this.getRate();
    });
  }


  setFavoriteMovie(favoriteMovie:any) {
    if (!favoriteMovie) {
      this.favoriteMovie = true
      this._movie.setFavoriteMovie(this.session_id, this.user.id, this.idMovie, this.favoriteMovie).subscribe();
    } else {
      this.favoriteMovie = false
      this._movie.setFavoriteMovie(this.session_id, this.user.id, this.idMovie, this.favoriteMovie).subscribe();
    }
  }

  getFavoriteMovies() {
    if (this.session_id) {
      this._movie.getFavoriteMovies(this.session_id, this.user.id)?.subscribe((data: any) => {
        data.results.map((element: any) => {
          this.favoriteMovies.push(element);
        })
        this.favoriteMovies.forEach((element: any) => {
          if (element.id == this.idMovie) {
            this.favoriteMovie = true;
          }
        });
      })
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
