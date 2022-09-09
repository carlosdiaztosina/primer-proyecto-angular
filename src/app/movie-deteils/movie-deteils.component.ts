import { Component, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import {ActivatedRoute, Params} from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-movie-deteils',
  templateUrl: './movie-deteils.component.html',
  styleUrls: ['./movie-deteils.component.scss']
})

export class MovieDeteilsComponent implements OnInit {
  movie:any =[];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  error='';
  form: FormGroup | any;
  session_id = sessionStorage.getItem('sessionId');
 
  
  constructor(private _movie: MoviesApiService,private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      let id = params['id'];
      this.getMovieDeteils(id);
    });
  }

  getMovieDeteils(id:any){
    this._movie.getMovieDeteils(id).subscribe((data) => {
      this.movie = data;
    },err => {
      this.error = "This ID that you are searching is not valid"
    });
  }
}
