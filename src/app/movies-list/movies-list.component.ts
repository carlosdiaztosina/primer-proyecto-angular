import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import { Router } from '@angular/router';
import { NavigationService } from '../navigation/navigation.service';
import { UserService } from '../user-service.service';
import { BehaviorSubject, interval, tap } from 'rxjs';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  imgMovie = '';
  page = 0;
  text = '';
  error = '';
  valueTextField: any;
  url: any;
  id_user: any;

  menuOn = false;

  session_id = sessionStorage.getItem('sessionId');
  counter = new BehaviorSubject(0)
  private debounceTimer?: NodeJS.Timeout

  constructor(
    private _movies: MoviesApiService,
    private route: Router,
    private navigationService: NavigationService,
    private userService: UserService) { }


  ngOnInit(): void {
    this.userService.getUser();
    this.userService.userObservable.subscribe(user => {
      console.log('user', user);
    });

    this.getMovies();
    this.Search(null);
    // this.getUser();
  }


  getMovies() {
    this._movies.getMovies().subscribe((data) => {
      this.imgMovie = data.results.poster_path ? this.movieImgPath + data.results.poster_path : './assets/not-found.jpg';
      this.page = data.page;
      data.results.map((element: any) => {
        this.movies.push(element);
      });
    });
  }

  onScroll(): void {
    this.page++;
    if (this.text.length > 1) {
      this._movies.getMoviesSearchPage(this.page, this.text)
        .subscribe((data) => {
          const { page, total_pages, results } = data;
          if (page < total_pages) {
            results.map((element: any) => {
              this.movies.push(element);
            })
          }
        });
    } else {
      this._movies.getMoviesPag(this.page).subscribe((data) => {
        const { page, total_pages, results } = data;
        if (page < total_pages) {
          results.map((element: any) => {
            this.movies.push(element);
          })
        }
      });
    }
  }

  Search(event: any | any) {
    if (this.navigationService.getText().length > 1) {
      event = this.navigationService.getText();
    }
    if (!!event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.text = event.target.value;
        this.movies = [];
        if (event.target.value.length > 0) {
          this._movies.getMoviesSearch(this.text)
            .subscribe((data) => {
              if (data.total_results < 1 && this.text.length > 1) {
                this.error = "The Movie that you are searching not exit";
              } else {
                this.movies = [];
                this.page = data.page;
                this.error = "";
                data.results.map((element: any) => {
                  this.movies.push(element);
                });
              }
            });
        } else {
          this.error = "";
          this.getMovies();
        }
      }, 500);
    }
  }

  movieTitle() {
    this.movies = [];
    this.text = "";
    this.error = "";

    this.getMovies();
  }

  // getUser() {
  //   if (this.session_id) {
  //     this._movies.getUser(this.session_id).subscribe(data => {
  //       sessionStorage.setItem("user", JSON.stringify(data));
  //     })
  //   }
  // }

  downMenu() {
    if (!this.menuOn) {
      this.menuOn = true
    } else {
      this.menuOn = false;
    }
  }



}
