import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { MoviesApiService } from '../movies-api.service';
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss']
})
export class FavoriteMoviesComponent implements OnInit {
  favoriteMovies: any | undefined;
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  session_id: any;
  user: any;

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: any;


  constructor(
    private _movie: MoviesApiService,
    private userService: UserService,
    private loginService: LoginService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUser();
    this.userService.userObservable.subscribe(user => {
      this.user = user;
    });
    this.loginService.sessionObservable.subscribe(data => {
      this.session_id = data
      this.getFavoriteMovies();
    });
  }

  getFavoriteMovies() {

    if (this.session_id) {
      this._movie.getFavoriteMovies(this.session_id, this.user)?.subscribe((data: any) => {
        this.favoriteMovies = data.results;
        this.getRate()
        console.log(this.favoriteMovies)
        this.selectedValue=this.favoriteMovies.rating
      });
    } else {
      this.route.navigate(['/']);
    }

  }
  getRate() {
    if (this.session_id) {
      this._movie.getRate(this.user.id, this.session_id)?.subscribe(data => {
        data.results.map((element: any) => {
          
          this.favoriteMovies?.forEach((favMovie: any) => {
            if (favMovie.id == element.id) {
              
              if (element.rating <= 2) {
                favMovie.rating = element.rating - 1;
              } else {
                favMovie.rating = element.rating / 2;
              }
            }
          })
        })
        
      });
    }
  }

  deleteFavoriteMovie(movieId: any) {
    this._movie.setFavoriteMovie(this.session_id, this.user.id, movieId, false).subscribe(data => {
      this.favoriteMovies = [];
      this.getFavoriteMovies()
    });
  }
}
