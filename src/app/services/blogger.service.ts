import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BloggerService {

  private apiKey = 'AIzaSyC3ws9P2fMAhK6w7W6TV9cn6bAk4RsF6Ko';
  private blogId = '5584682618555401483';
  private base = 'https://www.googleapis.com/blogger/v3';

  constructor(private http: HttpClient) {}

  getPosts(maxResults = 20, pageToken?: string): Observable<any> {
    const url = `${this.base}/blogs/${this.blogId}/posts`;
    let params = new HttpParams().set('key', this.apiKey).set('maxResults', maxResults);
    if (pageToken) params = params.set('pageToken', pageToken);
    return this.http.get(url, { params });
  }

  getPost(postId: string): Observable<any> {
    const url = `${this.base}/blogs/${this.blogId}/posts/${postId}`;
    const params = new HttpParams().set('key', this.apiKey);
    return this.http.get(url, { params });
  }
}
