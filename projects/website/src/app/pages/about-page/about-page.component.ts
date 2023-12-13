import { Component } from '@angular/core';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'about',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  constructor(private socialMediaService: SocialMediaService) { }

  ngOnInit(): void {
    // Set the meta tags
    this.socialMediaService.addMetaTags('About', 'Niche Shack is a user-friendly platform that brings together hundreds of offerings under one virtual roof. Whether you\'re into fitness, dating, business & marketing, or even animal care, we\'ve got you covered.', 'assets/NicheShackLogo.png');
  }
}