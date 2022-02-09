import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Niche } from '../../classes/niche';
import { LazyLoad } from '../../classes/lazy-load';
import { NichesService } from '../../services/niches/niches.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'niche-menu-popup',
  templateUrl: './niche-menu-popup.component.html',
  styleUrls: ['./niche-menu-popup.component.scss']
})
export class NicheMenuPopupComponent extends LazyLoad implements OnInit {
  @Output() onNicheMenuItemClick: EventEmitter<Niche> = new EventEmitter();
  public niches!: Array<Niche>;
  public selectedNicheName!: string;
  public arrow!: ElementRef<HTMLElement>;
  public nicheMenuElement!: HTMLElement;
  private listItemHeight!: number;
  @ViewChild('arrowContainer') arrowContainer!: ElementRef<HTMLElement>;


  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private nichesService: NichesService
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    this.addEventListeners();
    this.nichesService.getNiches()
      .subscribe((niches: Array<Niche>) => {
        this.niches = niches;
      });
  }


  onNicheClick(niche: Niche) {
    this.selectedNicheName = niche.name;
    this.onNicheMenuItemClick.emit(niche);
    this.close();
  }

  onOpen() {
    if (this.selectedNicheName) {
      this.nicheMenuElement = document.getElementById('nicheMenu')!;

      if (this.nicheMenuElement) {
        const nicheElement: HTMLElement = document.getElementById(this.selectedNicheName) as HTMLElement;

        this.listItemHeight = 22//nicheElement.clientHeight;
        const offsetTop = nicheElement?.offsetTop;

        this.nicheMenuElement.scrollTop = offsetTop;
      }
    }
  }


  getSelectedNicheIndex(direction: number): number {
    // Get the current selected niche
    const currentSelectedNiche = this.niches.find(x => {
      return x.name == this.selectedNicheName;
    });
    // Get the index of the current selected niche
    const indexOfCurrentSelectedNiche = direction == -1 ? Math.max(1, this.niches.indexOf(currentSelectedNiche!)) : Math.min(this.niches.length - 2, this.niches.indexOf(currentSelectedNiche!));
    // Get the index of the niche that lies before or after the current selected niche (depending on direction)
    const newIndex = indexOfCurrentSelectedNiche + (1 * direction);
    // Select the newly selected niche
    this.selectedNicheName = this.niches[newIndex].name;
    // Output the newly selected niche
    this.onNicheMenuItemClick.emit(this.niches[newIndex]);
    // Move the arrow on the niche button
    this.arrowContainer.nativeElement.style.left = this.arrow.nativeElement.offsetLeft - 8 + 'px';

    return newIndex;
  }


  onArrowUp(e: KeyboardEvent): void {
    e.preventDefault();
    const selectedNicheIndex = this.getSelectedNicheIndex(-1);

    if (selectedNicheIndex * this.listItemHeight < this.nicheMenuElement.scrollTop) {
      const listHeight = (this.nicheMenuElement.clientHeight / this.listItemHeight) - 1;
      this.nicheMenuElement.scrollTop = selectedNicheIndex * this.listItemHeight;
    }
  }


  onArrowDown(e: KeyboardEvent): void {
    e.preventDefault();
    const selectedNicheIndex = this.getSelectedNicheIndex(1);

    if(selectedNicheIndex >= Math.round((this.nicheMenuElement.clientHeight + this.nicheMenuElement.scrollTop) / this.listItemHeight)) {
      const listHeight = (this.nicheMenuElement.clientHeight / this.listItemHeight) - 1;
      this.nicheMenuElement.scrollTop = (selectedNicheIndex - listHeight) * this.listItemHeight;
    }
  }
}