import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  public facebookAppId: string = '1311208896056527';

  constructor(private metaService: Meta) { }

  facebookShare(url: string, quote?: string) {
    const _window = window as any;

    _window.FB.ui({
      method: 'share',
      href: location.origin + url,
      quote: quote
    });
  }



  twitterShare(url: string, text: string) {
    this.openWindow('https://twitter.com/share?text=' + text + '&url=' + location.origin + url);
  }

  pinterestShare(url: string, image: string, description: string) {
    this.openWindow('https://www.pinterest.com/pin/create/button/?url=' + location.origin + url
      + '&media=' + location.origin + '/images/' + image
      + '&description=' + description)
  }

  openWindow(url: string) {
    let width: number = 580;
    let height: number = 360;
    let horizontalCenter = (window.innerWidth - width) / 2;
    let verticalCenter = (window.innerHeight - height) / 2;

    window.open(url, '_blank', 'toolbar=yes,scrollbars=no,resizable=yes,top=' +
      verticalCenter + ',left=' + horizontalCenter + ',width=' + width + ',height=' + height);
  }


  addMetaTags(title: string, description: string, image: string) {
    // Facebook
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("property='og:site_name'");
    this.metaService.removeTag("property='og:type'");
    this.metaService.removeTag("property='og:locale'");
    this.metaService.removeTag("property='fb:app_id'");
    this.metaService.removeTag("property='og:url'");
    this.metaService.removeTag("property='og:image'");
    this.metaService.removeTag("property='og:image:width'");
    this.metaService.removeTag("property='og:image:height'");
    this.metaService.removeTag("property='og:description'");

    this.metaService.addTag({ property: 'og:title', content: title });
    this.metaService.addTag({ property: 'og:site_name', content: 'Niche Shack' });
    this.metaService.addTag({ property: 'og:type', content: 'website' });
    this.metaService.addTag({ property: 'og:locale', content: 'en_US' });
    this.metaService.addTag({ property: 'fb:app_id', content: this.facebookAppId });
    this.metaService.addTag({ property: 'og:url', content: document.location.href });
    this.metaService.addTag({ property: 'og:image', content: document.location.origin + '/images/' + image });
    this.metaService.addTag({ property: 'og:image:width', content: '675' });
    this.metaService.addTag({ property: 'og:image:height', content: '675' });

    // Might have to strip html tags
    this.metaService.addTag({ property: 'og:description', content: description });

    // Twitter
    this.metaService.removeTag("name='twitter:card'");
    this.metaService.removeTag("name='twitter:site'");
    this.metaService.removeTag("name='twitter:title'");
    this.metaService.removeTag("name='twitter:description'");
    this.metaService.removeTag("name='twitter:image'");

    this.metaService.addTag({ name: 'twitter:card', content: 'summary' });
    this.metaService.addTag({ name: 'twitter:site', content: '@Niche_Shack' });
    this.metaService.addTag({ name: 'twitter:title', content: title });

    // Might have to strip html tags
    this.metaService.addTag({ name: 'twitter:description', content: description });
    this.metaService.addTag({ name: 'twitter:image', content: document.location.origin + '/images/' + image });
  }
}
