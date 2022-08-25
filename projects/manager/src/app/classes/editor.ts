import { Compiler, ComponentFactoryResolver, ComponentRef, Directive, Injector, NgModuleFactory, OnInit, ViewContainerRef } from "@angular/core";
import { PageDevComponent } from "../components/page-dev/page-dev.component";
import { PageDevModule } from "../components/page-dev/page-dev.module";
import { WidgetService } from "../services/widget/widget.service";
import { ContainerHost } from "./container-host";
import { WidgetCursor } from "./widget-cursor";

@Directive()
export abstract class Editor implements OnInit, ContainerHost {
    public page!: PageDevComponent;
    public document = document;

    constructor
        (
            private widgetService: WidgetService,
            private viewContainerRef: ViewContainerRef,
            private resolver: ComponentFactoryResolver,
            private compiler: Compiler,
            private injector: Injector
        ) { }


    ngOnInit() {
        this.widgetService.viewPortTop = document.getElementById('view-port')?.getBoundingClientRect().y!;
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

        iframeContentDocument.addEventListener('keydown', (event: KeyboardEvent) => window.dispatchEvent(new KeyboardEvent('keydown', event)));
        iframeContentDocument.addEventListener('mousemove', (event: MouseEvent) => {
            window.dispatchEvent(new MouseEvent('mousemove', { clientY: event.clientY + this.widgetService.viewPortTop }));
        });
    }


    onIconMousedown(widgetCursor: WidgetCursor) {
        this.widgetService.setWidgetCursor(widgetCursor);

        window.addEventListener('mouseup', () => {
            this.widgetService.clearWidgetCursor();
        }, { once: true });
    }

    public abstract onRowChange(maxBottom: number): void;
}