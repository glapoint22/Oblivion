import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LazyLoad, LazyLoadingService } from 'common';
import { Subject } from 'rxjs';
import { Niche } from '../../classes/niche';
import { NichesService } from '../../services/niches/niches.service';

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
  public onClose: Subject<void> = new Subject<void>();
  @ViewChild('nicheMenu') nicheMenu!: ElementRef<HTMLElement>;
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
    window.addEventListener('mousedown', this.mousedown);
    window.addEventListener('blur', this.windowBlur);
  }


  mousedown = () => {
    this.close();
  }


  windowBlur = () => {
    this.close();
  }


  onOpen() {
    document.getElementById(this.selectedNicheName)?.focus();
  }


  onArrowUp(e: KeyboardEvent): void {
    this.getSelectedNicheIndex(-1);
  }


  onArrowDown(e: KeyboardEvent): void {
    this.getSelectedNicheIndex(1);
  }


  onScroll() {
    this.nicheMenu.nativeElement.scrollTop = Math.round(this.nicheMenu.nativeElement.scrollTop / 22) * 22;
  }


  onMouseWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    this.nicheMenu.nativeElement.scrollTop += (delta * 44);
  }




  onNicheClick(niche: Niche) {
    this.selectedNicheName = niche.name;
    this.onNicheMenuItemClick.emit(niche);
    this.close();
  }




  getSelectedNicheIndex(direction: number) {
    let indexOfCurrentSelectedNiche = this.niches.findIndex(x => x.name == this.selectedNicheName);

    // Get the index of the niche that lies before or after the current selected niche (depending on direction)
    indexOfCurrentSelectedNiche = indexOfCurrentSelectedNiche + direction;
    // If the index increments past the end of the list or decrements beyond the begining of the list, then loop back around
    if (indexOfCurrentSelectedNiche == (direction == 1 ? this.niches.length : -1)) indexOfCurrentSelectedNiche = direction == 1 ? 0 : this.niches.length - 1;
    // Select the newly selected niche
    this.selectedNicheName = this.niches[indexOfCurrentSelectedNiche].name;
    // Set focus to the selected list item. This is so the scrollbar can scroll to it (if scrollbar exists)
    document.getElementById(this.selectedNicheName)?.focus();
    // Output the newly selected niche
    this.onNicheMenuItemClick.emit(this.niches[indexOfCurrentSelectedNiche]);
    // Move the arrow on the niche button
    this.arrowContainer.nativeElement.style.left = this.arrow.nativeElement.offsetLeft - 8 + 'px';
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('blur', this.windowBlur);
  }
}