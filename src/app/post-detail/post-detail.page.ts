import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  imports: [IonHeader, IonicModule],
})
export class PostDetailPage {

  post: any;

  constructor(private router: Router) {
    this.post = this.router.getCurrentNavigation()?.extras.state?.['post'];
  }

}
