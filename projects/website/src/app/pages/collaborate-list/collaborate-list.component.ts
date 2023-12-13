import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'common';
import { Subscription } from 'rxjs';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'collaborate-list',
  templateUrl: './collaborate-list.component.html',
  styleUrls: ['./collaborate-list.component.scss']
})
export class CollaborateListComponent implements OnInit {
  public listName!: string;
  public ownerName!: string;
  public profileImage!: string;
  public listId!: string;
  private dataServicePostSubscription!: Subscription;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private socialMediaService: SocialMediaService) { }

  ngOnInit() {
    const listInfo = this.route.snapshot.data.listInfo;

    this.listName = listInfo.listName;
    this.ownerName = listInfo.ownerName;
    this.profileImage = listInfo.profileImage;
    this.listId = listInfo.listId;

    // Set the meta tags
    this.socialMediaService.addMetaTags('Collaborate on ' + this.listName);
  }


  onAcceptClick() {
    this.dataServicePostSubscription = this.dataService.post('api/Lists/AddCollaborator', { collaborateId: this.route.snapshot.params.collaborateListId }, { authorization: true })
      .subscribe(() => {
        this.router.navigate(['account', 'lists', this.listId]);
      });
  }



  onCancelClick() {
    this.router.navigate(['account', 'lists']);
  }



  ngOnDestroy() {
    if (this.dataServicePostSubscription) this.dataServicePostSubscription.unsubscribe();
  }
}