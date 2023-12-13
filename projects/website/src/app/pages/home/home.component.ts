import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageContent } from 'widgets';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public pageContent!: PageContent;

  constructor(private route: ActivatedRoute, private socialMediaService: SocialMediaService) { }

  ngOnInit(): void {
    this.pageContent = this.route.snapshot.data.pageContent;

    // Set the meta tags
    this.socialMediaService.addMetaTags('What\'s your niche?', 'Niche Shack is a user-friendly platform that brings together hundreds of offerings under one virtual roof. Whether you\'re into fitness, dating, business & marketing, or even animal care, we\'ve got you covered.', 'assets/NicheShackLogo.png');
  }
}