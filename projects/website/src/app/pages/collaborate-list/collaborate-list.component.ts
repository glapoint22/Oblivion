import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-collaborate-list',
  templateUrl: './collaborate-list.component.html',
  styleUrls: ['./collaborate-list.component.scss']
})
export class CollaborateListComponent implements OnInit {
  public listName!: string;
  public ownerName!: string;
  public profilePic!: string;
  public listId!: string;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.dataService.get('api/Lists/ListInfo', [{ key: 'collaborateId', value: this.route.snapshot.params.collaborateListId }], true)
      .subscribe((listInfo: any) => {
        if (listInfo.exists) {
          this.router.navigate(['account', 'lists', listInfo.listId]);
        } else {
          this.listName = listInfo.listName;
          this.ownerName = listInfo.ownerName;
          this.profilePic = listInfo.profilePic;
          this.listId = listInfo.listId;
        }
      });
  }


  onAcceptClick() {
    this.dataService.put('api/Lists/Collaborator', { name: this.route.snapshot.params.collaborateListId }, true)
      .subscribe(() => {
        this.router.navigate(['account', 'lists', this.listId]);
      });
  }



  onCancelClick() {
    this.router.navigate(['account', 'lists']);
  }
}
