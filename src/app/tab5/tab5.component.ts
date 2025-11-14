import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';


@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.component.html',
  styleUrls: ['./tab5.component.scss'],
    imports: [HeaderComponent] 
  
})
export class Tab5Component  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
