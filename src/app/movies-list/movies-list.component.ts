import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import { debounceTime, distinctUntilChanged, filter, map, tap } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent implements OnInit {
  movies: any[] = [];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  page = 0;
  search = false;
  moviesSearch = 0;
  moviesPageTotal = 0;
  text = '';

  constructor(private _movies: MoviesApiService) { }

  ngOnInit(): void {
      this.getMovies();
      this.Search();
  }

  getMovies() {
    this._movies.getMovies().subscribe((data) => {
      console.log(data);
      this.page = data.page;
      data.results.map((element: any) => {
        this.movies.push(element);
      });
    });
  }

  onScroll(): void {
    this.page++;
    if (this.search){
      this._movies.getMoviesSearchPage(this.page, this.text)
      .subscribe((data) => {
        console.log(data);
        const {page, total_pages, results} = data;
        console.log(total_pages);
        if (page < total_pages){
          console.log(this.page)
          results.map((element: any) => {
            this.movies.push(element);
          })
        }
      });
    }else{
      this._movies.getMoviesPag(this.page).subscribe((data) => {
        console.log(data);
        const {page, total_pages, results} = data;
        console.log(total_pages);
        if (page < total_pages){
          console.log(this.page)
          results.map((element: any) => {
            this.movies.push(element);
          })
        }
      });
    }
   
  }

  @ViewChild('input', { static: true }) input: ElementRef | any; 
  Search() {
    this.search = true;
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
        console.log(text.length)
        this.movies = [];
        this._movies.getMoviesSearch(text).subscribe((data) => {
          console.log(data);
          this.page = data.page;
          data.results.map((element: any) => {
            this.movies.push(element);
          });
        });
      });
  }

  movieTitle() {
    document.getElementsByTagName("input")[0].value = "";
    this.movies = [];
    this.getMovies();
  }

}
