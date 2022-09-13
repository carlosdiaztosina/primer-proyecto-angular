import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MoviesListComponent } from './movies-list/movies-list.component';
import { MovieDeteilsComponent } from './movie-deteils/movie-deteils.component';
import { LoginComponent } from './login/login.component';
import { FavoriteMoviesComponent } from './favorite-movies/favorite-movies.component';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule }  from '@angular/material/button-toggle';
import { NavegationComponent } from './navigation/navegation.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    MoviesListComponent,
    MovieDeteilsComponent,
    LoginComponent,
    FavoriteMoviesComponent,
    NavegationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
