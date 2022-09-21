import { Component, OnInit, OnDestroy, AfterViewInit,OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MoviesApiService } from '../movies-api.service';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../user-service.service';
import { LoginService } from '../login/login.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})

export class MovieDetailsComponent implements OnInit,OnChanges, AfterViewInit, OnDestroy {
  movie: any = [];
  rateMovies: any = [];
  favoriteMovies: any = [];

  showSpinner = true;
  showVideo = false;
  spinnerVideo = true;
  showPlay :any;

  idMovie: any;
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  session_id: any;
  user: any;
  key: any;

  error = '';
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 0;
  isMouseover = true;
  rate = 0;
  res = 0;

  favoriteMovie: any;
  safeSrc: SafeResourceUrl | any;

  subjectId = new Subject();
  subscriptions = new Subscription()

  constructor(
    private _movie: MoviesApiService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private loginService: LoginService,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params: Params) => {
        this.idMovie = params['id'];
        this.subjectId.next(params['id']);
        this.getMovieDeteils(this.idMovie);

        this.loginService.sessionObservable.subscribe(data => {
          this.session_id = data;
        });
        
        this.userService.getUser();
        this.userService.userObservable?.subscribe(user => {
          if (user) {
            this.user = user;
          }
          this.getRate();
          this.getFavoriteMovies();
          this.getVideoMovie();
        });
        this.showSpinner = true;
        this.showVideo = false;
        this.ngAfterViewInit();
      })
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showSpinner = false;
    }, 1000)
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.subjectId.subscribe(data =>{
    })
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
    if (this.user) {
      this.subscriptions.add(
        this._movie.getRate(this.user.id, this.session_id)?.subscribe(data => {
          data.results.map((element: any) => {
            this.rateMovies.push(element);
          })
          this.setStrats();
        })
      )
    }
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
    if (this.user) {
      this.setStrats();
    }

  }

  setStrats() {
    this.selectedValue = 0;
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

  setRateMovie(rate: any) {
    this._movie.setRateMovie(this.movie.id, rate, this.session_id).subscribe(() => {
      this.getRate();
    });
  }


  setFavoriteMovie(favoriteMovie: any) {
    if (!favoriteMovie) {
      this.favoriteMovie = true;
      this._movie.setFavoriteMovie(this.session_id, this.user.id, this.idMovie, this.favoriteMovie).subscribe();
    } else {
      this.favoriteMovie = false;
      this._movie.setFavoriteMovie(this.session_id, this.user.id, this.idMovie, this.favoriteMovie).subscribe();
    }

  }

  getFavoriteMovies() {
    if (this.session_id && this.user) {
      this.subscriptions.add(
        this._movie.getFavoriteMovies(this.session_id, this.user.id)?.subscribe((data: any) => {
          data.results.map((element: any) => {
            this.favoriteMovies.push(element);
          })
          this.favoriteMovie = false;
          this.favoriteMovies.forEach((element: any) => {
            if (element.id == this.idMovie) {
              this.favoriteMovie = true;
            }
          });
        })
      )
    }
  }

  setShowVideo(showVideos: boolean) {
    if (showVideos) {
      this.showVideo = false;
      this.showPlay = true;
    } else {
      this.showPlay = false;
      this.showVideo = true;
      this.spinnerVideo = true;
      this.res = 0;
    }
  }

  onLoad() {
    this.res = this.res + 1;
    if (this.res == 2) {
      this.spinnerVideo = false;
    }
  }

  getVideoMovie() {
    this._movie.getVideosMovie(this.idMovie).subscribe(data => {
      if (data.results.length > 1) {
        this.showPlay = true;
        data.results.map((element: any) => {
          if (element.type === "Trailer") {
            this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + element.key + "?autoplay=1&mute=1&controls=1");
          }
        });
      } else {
        this.showPlay = false;
      }

    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
