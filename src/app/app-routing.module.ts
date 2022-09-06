import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MovieDeteilsComponent } from './movie-deteils/movie-deteils.component';
const routes: Routes = [
{path:"", component: MoviesListComponent},
{path:":id", component: MovieDeteilsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
