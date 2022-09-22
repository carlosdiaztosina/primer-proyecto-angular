import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MoviesListComponent } from './movies-list/movies-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { LoginComponent } from './login/login.component';
import { FavoriteMoviesComponent } from './favorite-movies/favorite-movies.component';
import { SwiperModule } from 'swiper/angular';
import { NavegationComponent } from './navigation/navegation.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProvidersRegionsComponent } from './providers-regions/providers-regions.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule }  from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  declarations: [
    AppComponent,
    MoviesListComponent,
    MovieDetailsComponent,
    LoginComponent,
    FavoriteMoviesComponent,
    NavegationComponent,
    CarouselComponent,
    SpinnerComponent,
    ProvidersRegionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatExpansionModule,
    SwiperModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
