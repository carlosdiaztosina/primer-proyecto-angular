import { Component, OnDestroy, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import { NavigationService } from '../navigation/navigation.service';
import { UserService } from '../user-service.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  imgMovie = '';
  page = 1;
  text = '';
  error = '';
  valueTextField: any;
  url: any;
  id_user: any;

  menuOn = false;

  session_id = sessionStorage.getItem('sessionId');
  counter = new BehaviorSubject(0);
  private debounceTimer?: NodeJS.Timeout;

  subscriptions = new Subscription();

  constructor(
    private _movies: MoviesApiService,
    private navigationService: NavigationService,
    private userService: UserService) { }


  ngOnInit(): void {
    this.userService.getUser();
    this.subscriptions.add(
      this.userService.userObservable.subscribe()
    );
    this.getMovies();
    this.Search(null);
    this.subscriptions.add(
      this.navigationService.textObservable.subscribe(text => {
        if (text) {
          this.text = text;
          this.getMoviesSearch(this.text);
        } else {
          this.movieTitle();
        }
      })
    );
  }

  getMovies() {
    this.subscriptions.add(
      this._movies.getMovies().subscribe((data) => {
        this.imgMovie = data.results.poster_path ? this.movieImgPath + data.results.poster_path : './assets/not-found.jpg';
        data.results.map((element: any) => {
          if (element.poster_path) {
            this.movies.push(element);
          }
        });
      })
    )
  }

  onScroll(): void {
    this.page++;
    if (this.text.length > 1) {
      this.subscriptions.add(
        this._movies.getMoviesSearchPage(this.page, this.text)
          .subscribe((data) => {
            const { page, total_pages, results } = data;
            if (page < total_pages) {
              results.map((element: any) => {
                this.movies.push(element);
              })
            }
          })
      )
    } else {
      this.subscriptions.add(
        this._movies.getMoviesPag(this.page).subscribe((data) => {
          const { page, total_pages, results } = data;
          if (page < total_pages) {
            results.map((element: any) => {
              this.movies.push(element);
            })
          }
        })
      )
    }
  }

  Search(event: any | any) {
    if (!!event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.text = event.target.value;
        this.movies = [];
        if (event.target.value.length > 0) {
          this.getMoviesSearch(this.text)
        } else {
          this.error = "";
          this.getMovies();
        }
      }, 500);
    }
  }

  getMoviesSearch(text: any) {
    this.subscriptions.add(
      this._movies.getMoviesSearch(text)
        .subscribe((data) => {
          if (data.total_results < 1 && text.length > 1) {
            this.error = "The Movie that you are searching not exit";
          } else {
            window.scrollTo(0, 0);
            this.movies = [];
            this.page = data.page;
            this.error = "";
            data.results.map((element: any) => {
              this.movies.push(element);
            });
          }
        })
    )
  }

  movieTitle() {
    this.movies = [];
    this.text = "";
    this.error = "";
    this.getMovies();
  }

  downMenu() {
    if (!this.menuOn) {
      this.menuOn = true
    } else {
      this.menuOn = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
