import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public text="";

  constructor() { }

 setText(text: string) {
  this.text = text;
 }

 getText(){
  return this.text;
 }
}