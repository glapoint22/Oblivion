import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridWidgetService, PageContent } from 'widgets';
import { BrowseResolver } from '../../resolvers/browse/browse.resolver';
import { Subscription } from 'rxjs';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy {
  public pageContent!: PageContent;
  private routeParentDataSubscription!: Subscription;

  constructor
    (
      private route: ActivatedRoute,
      private gridWidgetService: GridWidgetService,
      private browseResolver: BrowseResolver,
      private socialMediaService: SocialMediaService
    ) { }

  ngOnInit(): void {
    this.routeParentDataSubscription = this.route.parent!.data.subscribe(data => {
      if (data.browseData.rows) {
        this.pageContent = data.browseData;
      } else {
        this.gridWidgetService.gridData.next(data.browseData);
      }
    });

    this.socialMediaService.addMetaTags('What\'s your niche?', 'Niche Shack is a user-friendly platform that brings together hundreds of offerings under one virtual roof. Whether you\'re into fitness, dating, business & marketing, or even animal care, we\'ve got you covered.', 'assets/NicheShackLogo.png');
  }



  ngOnDestroy(): void {
    this.browseResolver.currentId = null;
    if (this.routeParentDataSubscription) this.routeParentDataSubscription.unsubscribe();
  }
}
