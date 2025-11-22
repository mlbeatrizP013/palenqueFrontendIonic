import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/header/header.component';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.component.html',
  styleUrls: ['./tab4.component.scss'],
  imports: [HeaderComponent] 
})
export class Tab4Component  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
