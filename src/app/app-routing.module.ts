import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MovieDeteilsComponent } from './movie-deteils/movie-deteils.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
{path:"", component: MoviesListComponent},
{path:"search/:id", component: MovieDeteilsComponent},
{path:"login",component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
