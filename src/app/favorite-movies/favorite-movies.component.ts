import { Component, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss']
})
export class FavoriteMoviesComponent implements OnInit {
  favoriteMovies:  any[] = [];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  session_id = sessionStorage.getItem('sessionId');
  user = JSON.parse(sessionStorage.getItem('user')!);

  constructor(private _movie: MoviesApiService) { }

  ngOnInit(): void {
    this.getFavoriteMovies();

  }

  getFavoriteMovies(){
    this._movie.getFavoriteMovies(this.session_id, this.user).subscribe((data:any)=>{
      data.results.map((element: any) => {
        this.favoriteMovies.push(element);
      });
    });
  }

  deleteFavoriteMovie(movieId:any){
    console.log(movieId)
    this._movie.setFavoriteMovie(this.session_id, this.user.id,movieId,false).subscribe(data=>{
      window.location.reload();
    });
  }
}
