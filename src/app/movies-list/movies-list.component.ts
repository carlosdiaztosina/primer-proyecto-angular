import { Component, OnInit } from '@angular/core';
import{MoviesApiService} from '../movies-api.service';

@Component({ 
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})


export class MoviesListComponent implements OnInit {
  movies: any[]=[];
  movieImgPath = "https://image.tmdb.org/t/p/w300"
  constructor(private _movies:MoviesApiService) { }

  ngOnInit(): void {
    console.log(this.movies)
    this.getLibros()
  }

  getLibros(){
    this._movies.getMovies().subscribe(data =>{
      data.results.map((element:any) => {
        this.movies.push(element);
      });
      
    })
  }


}
