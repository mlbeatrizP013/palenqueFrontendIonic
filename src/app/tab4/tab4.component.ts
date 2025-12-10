import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { IonicModule } from "@ionic/angular";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.component.html',
  styleUrls: ['./tab4.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class Tab4Component  implements OnInit {
  apiKey = 'AIzaSyC3ws9P2fMAhK6w7W6TV9cn6bAk4RsF6Ko';
  blogID = '5584682618555401483';
  posts: any[] = [];

  constructor(
    private http: HttpClient,
    private router : Router
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(){
    const url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogID}/posts?key=${this.apiKey}`;
    this.http.get(url).subscribe((data:any)=>{
      this.posts = data.items.map((item:any)=>{
        return{
          id:item.id,
          title:item.title,
          contentSnippet: item.content.substring(0,80) + '...',
          fullContent: item.content
        }
      });
    });
  }

  openPost(post:any){
    this.router.navigate(['/post-detail',post.id]);
  }

  async abrirHistorias() {
    await Browser.open({
      url: 'https://historiaspalenque.blogspot.com/2025/11/historias-palenque.html',
      presentationStyle: 'fullscreen'
    });
  }

}
