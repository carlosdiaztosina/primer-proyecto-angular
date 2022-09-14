import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  //Aquí hacer un Subject<String>
  private textSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public textObservable = this.textSubject.asObservable();


  constructor() { }

 setText(text: any) {
  this.textSubject.next(text);
 }
}
