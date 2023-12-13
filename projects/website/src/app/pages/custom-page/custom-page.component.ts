import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContent } from 'widgets';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'custom-page',
  templateUrl: './custom-page.component.html',
  styleUrls: ['./custom-page.component.scss']
})
export class CustomPageComponent implements OnInit {
  public pageContent!: PageContent;

  constructor(private route: ActivatedRoute, private socialMediaService: SocialMediaService) { }

  ngOnInit(): void {
    this.pageContent = this.route.snapshot.data.pageContent;

    this.socialMediaService.addMetaTags('What\'s your niche?', 'Niche Shack is a user-friendly platform that brings together hundreds of offerings under one virtual roof. Whether you\'re into fitness, dating, business & marketing, or even animal care, we\'ve got you covered.', 'assets/NicheShackLogo.png');
  }
}