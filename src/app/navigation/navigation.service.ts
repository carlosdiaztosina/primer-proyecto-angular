import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  //Aquí hacer un Subject<String>
  public text="";

  constructor() { }

 setText(text: string) {
  this.text = text;
 }

 getText(){
  return this.text;
 }
}
