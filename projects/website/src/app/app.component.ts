import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AccountService } from './services/account/account.service';
import { LazyLoadingService } from './services/lazy-loading/lazy-loading.service';
import { SpinnerService } from './services/spinner/spinner.service';
import { VideoApiService } from './services/video-api/video-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private container: ViewContainerRef,
    private lazyLoadingService: LazyLoadingService,
    private accountService: AccountService,
    private videoApiService: VideoApiService,
    private router: Router,
    private spinnerService: SpinnerService
  ) { }


  ngOnInit(): void {
    this.lazyLoadingService.container = this.container;
    this.accountService.setCustomer();

    if (this.accountService.customer) {
      this.accountService.refresh();
      this.accountService.startRefreshTokenTimer();
    }

    const w = window as any;

    // Create the YouTube object
    w.onYouTubeIframeAPIReady = () => {
      this.videoApiService.youTube = w.YT;
    }

    const youTubeScriptTag = document.createElement('script');
    youTubeScriptTag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(youTubeScriptTag);



    // Create the Vimeo object
    const vimeoScriptTag = document.createElement('script');
    vimeoScriptTag.src = 'https://player.vimeo.com/api/player.js';
    document.head.appendChild(vimeoScriptTag);

    vimeoScriptTag.onload = () => {
      this.videoApiService.vimeo = w.Vimeo;
    }


    // Create the Wistia object
    const wistiaScriptTag = document.createElement('script');
    wistiaScriptTag.src = '//fast.wistia.net/assets/external/E-v1.js';
    wistiaScriptTag.async = true;
    document.head.appendChild(wistiaScriptTag);

    wistiaScriptTag.onload = () => {
      this.videoApiService.wistia = w._wq || [];
    }


    // Router Events
    this.router.events
      .subscribe(
        (event: Event) => {

          // Navigation Start
          if (event instanceof NavigationStart) {
            this.spinnerService.show = true;
          }

          // Navigation End
          if (event instanceof NavigationEnd && !event.url.includes('scrollTo')) {
            this.spinnerService.show = false;
            window.scrollTo(0, 0);
          }
        });
  }
}