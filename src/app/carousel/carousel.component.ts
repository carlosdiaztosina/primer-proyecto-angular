import { Component, OnDestroy, OnInit,OnChanges, Input, SimpleChanges } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import SwiperCore, { Navigation, Pagination, Scrollbar, SwiperOptions, Autoplay } from 'swiper';
import { elementAt, Subscription } from 'rxjs';
SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit,OnChanges ,OnDestroy {
  movieImgPath = 'https://image.tmdb.org/t/p/w1280/';
  movieImgPath2 = 'https://image.tmdb.org/t/p/w300/';

  genresMovie: any;

  objeto: any;



  config: SwiperOptions = {
    loopedSlides: 3,
    loop: true,
    setWrapperSize: true,
    grabCursor: true,
    pagination: false,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false,
    },
    speed: 7000,
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      1100: {
        slidesPerView: 2
      },
      2000: {
        slidesPerView: 3
      }

    }
  };
  configDetails: SwiperOptions = {
    spaceBetween: 10,
    setWrapperSize: true,
    breakpoints: {
      320: {
        slidesPerView: 2
      },
      1100: {
        slidesPerView: 4
      },
      2000: {
        slidesPerView: 6
      }, 2500: {
        slidesPerView: 7
      }
    }

  }

  movies: any[] = [];
  genres: any[] = [];
  bestMovies: any[] = [];
  relatedMovies: any[] = [];

  genreTitle: any[] = [];

  subscriptions = new Subscription();

  @Input() idMovie: any;

  constructor(private _movies: MoviesApiService) { 
  }

  ngOnInit(): void {
    if (this.idMovie) {
      this.getGenreMovie(this.idMovie);
    } else {
      this.getBestMovies(null);
      this.getGenreList();
    }

  }

  ngOnChanges(changes: SimpleChanges): void{
    if(!changes['idMovie'].firstChange){
      this.getGenreMovie(changes['idMovie'].previousValue)
    }
  }

  getBestMovies(genreId: any) {
    this.movies = [];
    if (genreId == null) {
      this.subscriptions.add(
        this._movies.getMovies().subscribe((data) => {
          for (let index = 0; index < 10; index++) {
            this.movies.push(data.results[index]);
          }
        })
      )
    } else {
      this.subscriptions.add(
        this._movies.getMoviesWithGenre(genreId).subscribe((data) => {
          for (let indexGenre = 0; indexGenre < 10; indexGenre++) {
            this.movies.push(data.results[indexGenre]);
          }
        })
      )
    }
  }

  getGenreList() {
    this.subscriptions.add(
      this._movies.getGenreList().subscribe(data => {
        this.genres.push(data)
      })
    )
  }

  getGenreMovie(idMovie: any) {
    this._movies.getMovieDeteils(idMovie).subscribe(data => {
      this.genresMovie = data.genres;
      this.getMoviesByGenre(this.genresMovie);
    })
  }

  getMoviesByGenre(genresMovie: any) {

    const allRelated = genresMovie.map((genre: any) => {
      const relatedMovies: any = [];
      this._movies.getMoviesWithGenre(genre.id).subscribe(data => {
        data.results.map((element: any) => {
          if (element.id != this.idMovie) {
            relatedMovies.push(element);
          }
        })
      });
      const related = {
        title: genre.name,
        relatedMovies
      }
      return related;
    });
    this.relatedMovies = allRelated;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
