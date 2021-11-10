import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from '../../classes/category';
import { LazyLoad } from '../../classes/lazy-load';
import { NichesService } from '../../services/niches/niches.service';

@Component({
  selector: 'niche-menu-popup',
  templateUrl: './niche-menu-popup.component.html',
  styleUrls: ['./niche-menu-popup.component.scss']
})
export class NicheMenuPopupComponent extends LazyLoad implements OnInit {
  @Output() onNicheMenuItemClick: EventEmitter<Category> = new EventEmitter();
  public niches!: Array<Category>;
  public selectedNicheName!: string;
  public arrowPos!: number;


  constructor(private nichesService: NichesService) { super() }


  ngOnInit(): void {
    this.nichesService.getNiches()
      .subscribe((niches: Array<Category>) => {
        this.niches = niches;
      });
  }


  onNicheClick(niche: Category) {
    this.selectedNicheName = niche.name;
    this.onNicheMenuItemClick.emit(niche);
    this.close();
  }

  onOpen() {
    if (this.selectedNicheName) {
      const nicheMenuElement: HTMLElement = document.getElementById('nicheMenu') as HTMLElement;
      const nicheElement: HTMLElement = document.getElementById(this.selectedNicheName) as HTMLElement;
      const offsetTop = nicheElement?.offsetTop;

      nicheMenuElement.scrollTop = offsetTop;
    }
  }
}