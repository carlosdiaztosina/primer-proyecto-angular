import { Component, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-movie-deteils',
  templateUrl: './movie-deteils.component.html',
  styleUrls: ['./movie-deteils.component.scss']
})

export class MovieDeteilsComponent implements OnInit {
  movie:any =[];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  error='';
  
  constructor(private _movie: MoviesApiService,private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      
      let id = params['id'];
      console.log(id);
      this.getMovieDeteils(id);
    });
  }

  getMovieDeteils(id:any){
    this._movie.getMovieDeteils(id).subscribe((data) => {
      
      console.log(data)
      this.movie = data;
    },err => {
      
      this.error = "This ID that you are searching is not valid"
      console.log(this.error)
    });
  }
}
