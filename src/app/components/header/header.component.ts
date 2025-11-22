import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // 1. Importa IonicModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports:[
    IonicModule, 
    CommonModule
  ]
})
export class HeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
