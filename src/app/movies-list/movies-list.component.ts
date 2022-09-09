import { Component, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import { Router } from '@angular/router';
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
  url: any;
  id_user:any;

  session_id = sessionStorage.getItem('sessionId');

  private debounceTimer?: NodeJS.Timeout
  constructor(private _movies: MoviesApiService, private route: Router) { }

  ngOnInit(): void {
    console.log(this.session_id);
    this.getMovies();
    this.Search(null);
    this.getUser();
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
    if (!!event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.text = event.target.value;
        this.movies = [];
        if (event.target.value.length > 0) {
          console.log(this.text)
          this._movies.getMoviesSearch(this.text)
            .subscribe((data) => {
              console.log(data)
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

  login(login: any) {
    if (login == 1) {
      this.route.navigate(['/login']);
    } else {
      this._movies.setLogout()
      this.route.navigate([''])
        .then(() => {
          window.location.reload();
        });
    }
  }

  getUser(){
    if(this.session_id){
      this._movies.getUser(this.session_id).subscribe(data =>{
        console.log(data);
        this.id_user = data.id
        console.log(this.id_user)
      })
    }
  }



}
