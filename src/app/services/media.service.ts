import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, Subject, BehaviorSubject } from "rxjs";
import { map, tap } from 'rxjs/operators'

import { Media } from '../interfaces/media.interface'

@Injectable({
   providedIn: 'root'
})
export class MediaService {
  url: string = 'http://localhost:3000/movies/';
  usersUrl: string = 'http://localhost:3000/users/';
  
  mediaData: Media[] = [];
  memory: object = {}
  uuid = localStorage.getItem('uuid');

  private memorySubscription = new BehaviorSubject<object>(this.memory)
  currentMemory = this.memorySubscription.asObservable();

  constructor(private http: HttpClient) {}

  fetchData(): Subject<Media[]> {
    const subject = new Subject<Media[]>();

    this.http.get<Media>(`${this.url}`)
      .pipe(
        map(responseData => {
          const setupArray = Object.entries(responseData);
          const mediaArray: Media[] = [];
          
          for (const key in setupArray) {
            const mediaObj = Object.fromEntries(setupArray);
            mediaArray.push({ ...mediaObj[key], id: key });
          };

          return mediaArray;
        })
      )
      .subscribe(data => {
        subject.next(data);
      });

    return subject;
  }

  patchNewBookmarkValue(id: any, body: object): Observable<any> {
    return this.http.patch(`${this.url}/${id}`, body)
      .pipe(
        tap(() => {
          const current = this.memorySubscription.getValue();
          const update = {...current, ...body}
          this.memorySubscription.next(update)
        })
      )
  }

  switchMemory(newMemory: object) {
    this.memorySubscription.next(newMemory);
  }
}