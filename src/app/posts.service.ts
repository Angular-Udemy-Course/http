import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';


@Injectable({providedIn: 'root'})
export class PostsService {
  url: string = 'https://ng-complete-guide-golkedj.firebaseio.com/posts.json';
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    this.http
      .post<{ name: string }>(
        this.url,
        postData
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(this.url)
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(this.url);
  }
}