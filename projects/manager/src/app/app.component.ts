import { Component, HostListener, ViewContainerRef } from '@angular/core';
import { LazyLoadingService } from 'common';
import { InputService } from './services/input/input.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private container: ViewContainerRef, public lazyLoadingService: LazyLoadingService, private inputService: InputService) {
    
  }
  

  ngOnInit() {
    this.lazyLoadingService.container = this.container;
  }


  @HostListener('window:keydown.Control', ['$event'])
  onControlKeydown(e: KeyboardEvent) {
    if (!e.repeat) {
      this.inputService.ctrlKeydown = true;
      const onKeyup = (event: KeyboardEvent) => {
        if (event.key == 'Control') {
          window.removeEventListener('keyup', onKeyup);
          this.inputService.ctrlKeydown = false;
        }
      }
      window.addEventListener('keyup', onKeyup);
    }
  }
}
