import { Component, Input, OnInit } from '@angular/core';
import { MoviesApiService } from '../movies-api.service';
import SwiperCore, { Navigation, Pagination, Scrollbar, SwiperOptions, Autoplay } from 'swiper';
SwiperCore.use([Navigation, Pagination, Scrollbar,Autoplay]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  movieImgPath = 'https://image.tmdb.org/t/p/w1280/';
  config: SwiperOptions = {
    loopedSlides: 3,
    loop: true,
    setWrapperSize: true,
    grabCursor:true,
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      1100: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      2000:{
        slidesPerView: 3,
        spaceBetween:20
      }

    }
  };

  movies: any[] = [];
  bestMovies: any[] = [];  
  constructor(private _movies: MoviesApiService) { }

  ngOnInit(): void {
    this.getBestMovies();
  }

  getBestMovies(){

    this._movies.getMovies().subscribe((data) => {
      console.log(data)
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
