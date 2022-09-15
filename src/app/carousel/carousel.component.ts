import { Component, Input, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import SwiperCore, { Navigation, Pagination, Scrollbar} from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  movieImgPath = 'https://image.tmdb.org/t/p/w300';
  movies: any[] = [];
  bestMovies: any[] = [];
  
  constructor(private _movies: MoviesApiService) { }

  ngOnInit(): void {
    this.getBestMovies();
  }

  getBestMovies(){

    this._movies.getMovies().subscribe((data) => {
      for (let index = 0; index < 10; index++) {
        this.movies.push(data.results[index]);
      }
    });
  }

  // onSwiper(swiper:any) {
  // }
  onSlideChange() {
  }

}
