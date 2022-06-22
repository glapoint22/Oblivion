import { KeyValue } from '@angular/common';
import { Compiler, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, NgModuleFactory, ViewChild, ViewContainerRef } from '@angular/core';
import { ContainerHost } from '../../classes/container-host';
import { ViewPortDimension } from '../../classes/view-port-dimension';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetCursor } from '../../classes/widget-cursor';
import { WidgetService } from '../../services/widget/widget.service';
import { PageDevComponent } from '../page-dev/page-dev.component';
import { PageDevModule } from '../page-dev/page-dev.module';
import { BreakpointService } from '../../services/breakpoint/breakpoint.service';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements ContainerHost {
  @ViewChild('viewPort') viewPort!: ElementRef<HTMLElement>;
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public page!: PageDevComponent;
  public showResizeCover!: boolean;
  public document = document;
  public widgetCursors = WidgetCursor.getWidgetCursors();
  public widgetInspectorView = WidgetInspectorView;
  public viewPortDimensions: Array<KeyValue<string, ViewPortDimension>> = [
    {
      key: 'Responsive',
      value: {
        width: 1600,
        height: 800
      }
    },
    {
      key: 'BlackBerry Z30',
      value: {
        width: 360,
        height: 640
      }
    },
    {
      key: 'BlackBerry PlayBook',
      value: {
        width: 600,
        height: 1024
      }
    },
    {
      key: 'Galaxy S8',
      value: {
        width: 360,
        height: 740
      }
    },
    {
      key: 'Galaxy S9+',
      value: {
        width: 320,
        height: 658
      }
    },
    {
      key: 'Galaxy Tab S4',
      value: {
        width: 712,
        height: 1138
      }
    },
    {
      key: 'Kindle Fire HDX',
      value: {
        width: 800,
        height: 1280
      }
    },
    {
      key: 'LG Optimus L70',
      value: {
        width: 384,
        height: 640
      }
    },
    {
      key: 'Microsoft Lumia 550',
      value: {
        width: 640,
        height: 360
      }
    },
    {
      key: 'Nexus 5X',
      value: {
        width: 412,
        height: 732
      }
    },
    {
      key: 'Nexus 7',
      value: {
        width: 600,
        height: 960
      }
    },
    {
      key: 'Nokia Lumia 520',
      value: {
        width: 320,
        height: 533
      }
    },
    {
      key: 'Nokia N9',
      value: {
        width: 480,
        height: 854
      }
    },
    {
      key: 'Pixel 3',
      value: {
        width: 393,
        height: 786
      }
    },
    {
      key: 'Pixel 4',
      value: {
        width: 353,
        height: 745
      }
    },
    {
      key: 'iPad Mini',
      value: {
        width: 768,
        height: 1024
      }
    },
    {
      key: 'iPhone 4',
      value: {
        width: 320,
        height: 480
      }
    },
    {
      key: 'JioPhone 2',
      value: {
        width: 240,
        height: 320
      }
    },
    {
      key: 'iPhone SE',
      value: {
        width: 375,
        height: 667
      }
    },
    {
      key: 'iPhone XR',
      value: {
        width: 414,
        height: 896
      }
    },
    {
      key: 'iPhone 12 Pro',
      value: {
        width: 390,
        height: 844
      }
    },
    {
      key: 'Pixel 5',
      value: {
        width: 393,
        height: 851
      }
    },
    {
      key: 'Samsung Galaxy S20 Ultra',
      value: {
        width: 412,
        height: 915
      }
    },
    {
      key: 'iPad Air',
      value: {
        width: 820,
        height: 1180
      }
    },
    {
      key: 'Surface Pro 7',
      value: {
        width: 912,
        height: 1368
      }
    },
    {
      key: 'Surface Duo',
      value: {
        width: 540,
        height: 720
      }
    },
    {
      key: 'Galaxy Fold',
      value: {
        width: 280,
        height: 653
      }
    },
    {
      key: 'Galaxy A51/71',
      value: {
        width: 412,
        height: 914
      }
    },
    {
      key: 'Nest Hub',
      value: {
        width: 1024,
        height: 600
      }
    },
    {
      key: 'Nest Hub Max',
      value: {
        width: 1280,
        height: 800
      }
    },
    {
      key: 'Pixel 2',
      value: {
        width: 411,
        height: 731
      }
    },
    {
      key: 'Pixel 2 XL',
      value: {
        width: 411,
        height: 823
      }
    },
    {
      key: 'iPhone 5/SE',
      value: {
        width: 320,
        height: 568
      }
    },
    {
      key: 'iPhone 6/7/8 Plus',
      value: {
        width: 414,
        height: 736
      }
    },
    {
      key: 'iPhone X',
      value: {
        width: 375,
        height: 812
      }
    },
    {
      key: 'iPad Pro',
      value: {
        width: 1024,
        height: 1366
      }
    }
  ]

  public selectedViewPortDimension: KeyValue<string, ViewPortDimension> = this.viewPortDimensions[0];

  constructor
    (
      public widgetService: WidgetService,
      public breakpointService: BreakpointService,
      private viewContainerRef: ViewContainerRef,
      private resolver: ComponentFactoryResolver,
      private compiler: Compiler,
      private injector: Injector
    ) { }


  ngAfterViewInit() {
    this.onEditorWidnowSizeChange();
  }


  onLoad(iframe: HTMLIFrameElement) {
    const iframeContentDocument = iframe.contentDocument!;
    const compFactory = this.resolver.resolveComponentFactory(PageDevComponent);
    const moduleFactory: NgModuleFactory<PageDevModule> = this.compiler.compileModuleSync(PageDevModule);
    const moduleRef = moduleFactory.create(this.injector);
    const componentRef: ComponentRef<PageDevComponent> = this.viewContainerRef.createComponent(compFactory, undefined, moduleRef.injector);

    this.page = componentRef.instance;
    this.page.host = this;
    this.widgetService.widgetDocument = iframeContentDocument;
    iframeContentDocument.head.innerHTML = document.head.innerHTML;
    iframeContentDocument.body.appendChild(componentRef.location.nativeElement);
  }


  onIconMousedown(widgetCursor: WidgetCursor) {
    this.widgetService.setWidgetCursor(widgetCursor);

    window.addEventListener('mouseup', () => {
      this.widgetService.clearWidgetCursor();
    }, { once: true });
  }



  onResizeMousedown(direction?: number) {
    // Assign the resize cursor
    if (direction) {
      document.body.style.cursor = 'e-resize'
    } else {
      document.body.style.cursor = 's-resize';
    }

    this.showResizeCover = true;

    const onResizeMousemove = (mousemoveEvent: MouseEvent) => {


      // Size the editor window
      if (direction) {
        const minSize = 240;
        const maxSize = 1600;
        const width = Math.min(Math.max(minSize, this.selectedViewPortDimension.value.width + mousemoveEvent.movementX * 2 * (direction as number)), maxSize);

        this.selectedViewPortDimension.value.width = width;

      }
      else {
        const minSize = 240;
        const maxSize = window.innerHeight - 71;
        const height = Math.min(Math.max(minSize, this.selectedViewPortDimension.value.height + mousemoveEvent.movementY), maxSize);

        this.selectedViewPortDimension.value.height = height;
      }

      this.onEditorWidnowSizeChange();
    }

    const onResizeMouseUp = () => {
      this.showResizeCover = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onResizeMousemove);
      window.removeEventListener('mouseup', onResizeMouseUp);
    }

    window.addEventListener('mousemove', onResizeMousemove);
    window.addEventListener('mouseup', onResizeMouseUp);
  }


  onEditorWidnowSizeChange() {
    this.viewPort.nativeElement.style.maxWidth = this.selectedViewPortDimension.value.width + 8 + 'px';
    this.viewPort.nativeElement.style.maxHeight = this.selectedViewPortDimension.value.height + 5 + 'px';
    this.breakpointService.setCurrentBreakpoint(this.selectedViewPortDimension.value.width);
  }


  onInputEnter(widthValue: string, heightValue: string) {
    this.selectedViewPortDimension.value.width = parseInt(widthValue);
    this.selectedViewPortDimension.value.height = parseInt(heightValue);
    this.onEditorWidnowSizeChange();
  }

  onRowChange(maxBottom: number): void {
    if (this.selectedViewPortDimension.key == 'Responsive' && maxBottom > this.selectedViewPortDimension.value.height - 4) {
      this.selectedViewPortDimension.value.height = maxBottom + 4;
      this.onEditorWidnowSizeChange();
    }
  }
}