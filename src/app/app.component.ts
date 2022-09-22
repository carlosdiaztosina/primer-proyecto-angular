import { INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS } from '@angular/cdk/a11y';
import { Component, OnInit} from '@angular/core';
import { UserService } from './user-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'first-proyect';
  constructor(
    private userService: UserService,
   ) { 
    //
   }
    ngOnInit(){
      this.userService.getUser()
    }

    
}
