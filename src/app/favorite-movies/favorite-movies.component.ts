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
  favoriteMovies: any[] = [];
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  session_id: any;
  user: any;


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
        data.results.map((element: any) => {
          this.favoriteMovies.push(element);
        });
      });
    } else {
      this.route.navigate(['/']);
    }
  }

  deleteFavoriteMovie(movieId: any) {
    this._movie.setFavoriteMovie(this.session_id, this.user.id, movieId, false).subscribe(data => {
      this.favoriteMovies=[];
      this.getFavoriteMovies()
    });
  }
}
