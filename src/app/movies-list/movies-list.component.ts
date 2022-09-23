import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import { NavigationService } from '../navigation/navigation.service';
import { UserService } from '../user-service.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { ProvidersRegionsService } from '../providers-regions/providers-regions.service';

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
  provider: any;
  language: any;
  text = '';
  error = '';
  valueTextField: any;
  url: any;
  id_user: any;

  menuOn = false;

  showSpinner = true;

  session_id = sessionStorage.getItem('sessionId');
  counter = new BehaviorSubject(0);
  private debounceTimer?: NodeJS.Timeout;

  subscriptions = new Subscription();

  constructor(
    private _movies: MoviesApiService,
    private navigationService: NavigationService,
    private userService: UserService,
    private providerService: ProvidersRegionsService) {
    this.showSpinner = true;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.userObservable.subscribe(data=>{
      })
    );
    this.subscriptions.add(
      this.navigationService.textObservable.subscribe(text => {
        if (text) {
          this.text = text;
          this.getMoviesSearch(this.text);
        } else {
          this.movies = [];
          this.text = text;
          this.page = 1;
          this.getMovies();
          
        }
      })
    );
    this.subscriptions.add(
      this.providerService.providerMovieObservable.subscribe(data => {
        this.language = data.language;
        this.provider = data.provider;
        this.page = 1;
        this._movies.getMoviesAll(this.page, this.provider, this.language).subscribe(data => {
          this.movies = [];
          data.results.map((element: any) => {
            if (element.poster_path) {
              this.movies.push(element);
            }
          });
        })
      })
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showSpinner = false;
    }, 1000);
  }

  getMovies() {
   
    this._movies.getMoviesAll(null, null, null).subscribe(data => {
      data.results.map((element: any) => {
        if (element.poster_path) {
          this.movies.push(element);
        }
      });
    })
  }


  onScroll(): void {
    this.page++;
    if (this.text && this.text.length > 1) {
      
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
        this._movies.getMoviesAll(this.page, this.provider, this.language).subscribe((data) => {
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

  downMenu() {
    if (!this.menuOn) {
      this.menuOn = true
    } else {
      this.menuOn = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.providerService.setproviderMovie(null, null);
  }
}
