import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { MoviesApiService } from '../movies-api.service';
import { ProvidersRegionsService } from './providers-regions.service';

@Component({
  selector: 'app-providers-regions',
  templateUrl: './providers-regions.component.html',
  styleUrls: ['./providers-regions.component.scss']
})
export class ProvidersRegionsComponent implements OnInit {
  showFilter = false;
  countries: any;
  providers: any;
  moviesProvider: any;
  language = "";

  myControl = new FormControl<any>('');
  filteredOptions: Observable<any> | undefined;

  pathImg = "https://image.tmdb.org/t/p/original";

  constructor(
    private serviceApi: MoviesApiService,
    private providerService: ProvidersRegionsService,
  ) { }

  ngOnInit() {
    this.getRegions();
  }

  setShowFilter(showFilter: any) {
    if (showFilter) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
  }

  getRegions() {
    this.serviceApi.getRegions().subscribe(data => {
      this.countries = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        debounceTime(500),
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.english_name;
          return name ? this._filter(name) : this.countries.results.slice();
        }),
      );
    })
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.countries.results.filter((option: any) => option.english_name.toLowerCase().includes(filterValue));
  }

  setLowerCase(e: any) {
    return e.toLowerCase();
  }

  setRegionProvider(e: any) {
    if (e) {
      this.language = e;
      this.serviceApi.getProvidersRegion(e).subscribe(data => {
        this.providers = data
      })
    } else {
      this.providers = null;
      this.providerService.setproviderMovie(null, null)
    }

  }

  setMoviesProvider(provider: any, language: any) {
    this.providerService.setproviderMovie(provider, language);
  }
}
