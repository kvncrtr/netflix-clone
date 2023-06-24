import { Component, OnInit } from '@angular/core';

import { OauthService } from './services/oauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: string;
  
  constructor(private oauthService: OauthService) {
    this.isLoggedIn = this.oauthService.isLoggedIn;
  }

  ngOnInit(): void {
    
  }
}
