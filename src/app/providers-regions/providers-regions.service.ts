import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvidersRegionsService {
  //Aquí hacer un Subject<String>
  private providerMovieSubject: BehaviorSubject<any> = new BehaviorSubject<any>({provider:null,language:null});
  public providerMovieObservable = this.providerMovieSubject.asObservable();


  constructor() { }

 setproviderMovie(provider:any,language:any) {
    this.providerMovieSubject.next({provider:provider,language:language});
 }
}
