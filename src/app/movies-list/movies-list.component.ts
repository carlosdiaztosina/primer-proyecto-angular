import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import { debounceTime, distinctUntilChanged, filter, map, tap } from "rxjs/operators";
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  page = 0;
  text = '';
  
  constructor(private _movies: MoviesApiService) { }

  ngOnInit(): void {
      this.getMovies();
      this.Search();
  }

  getMovies() {
    this._movies.getMovies().subscribe((data) => {
      this.page = data.page;
      data.results.map((element: any) => {
        this.movies.push(element);
      });
    });
  }

  onScroll(): void {
    this.page++;
    if (this.text.length > 1){
      this._movies.getMoviesSearchPage(this.page, this.text)
      .subscribe((data) => {
        const {page, total_pages, results} = data;
        if (page < total_pages){
          results.map((element: any) => {
            this.movies.push(element);
          })
        }
      });
    }else{
      this._movies.getMoviesPag(this.page).subscribe((data) => {
        const {page, total_pages, results} = data;
        if (page < total_pages){
          results.map((element: any) => {
            this.movies.push(element);
          })
        }
      });
    }
   
  }

  @ViewChild('input', { static: true }) input: ElementRef | any; 
  Search() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged<any>(),
      ).subscribe((text: string) => {
        this.text = text;
        this.movies = [];
        if(text.length > 1){
          this._movies.getMoviesSearch(text).subscribe((data) => {
            this.page = data.page;
            data.results.map((element: any) => {
              this.movies.push(element);
            });
          });
        }else{
          this.getMovies();
        }
      });
  }

  movieTitle() {
    document.getElementsByTagName("input")[0].value = "";
    this.movies = [];
    this.text = "";
    this.getMovies();
  }

}
