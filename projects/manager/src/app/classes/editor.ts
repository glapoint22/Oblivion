import { Compiler, ComponentFactoryResolver, ComponentRef, Directive, Injector, OnInit, ViewContainerRef } from "@angular/core";
import { WidgetService } from "../services/widget/widget.service";
import { ContainerHost } from "./container-host";
import { WidgetCursor } from "./widget-cursor";

@Directive()
export abstract class Editor<T> implements OnInit, ContainerHost {
    public document = document;

    constructor
        (
            public widgetService: WidgetService,
            public viewContainerRef: ViewContainerRef,
            public resolver: ComponentFactoryResolver,
            public compiler: Compiler,
            public injector: Injector
        ) { }


    ngOnInit() {
        this.widgetService.viewPortTop = document.getElementById('view-port')?.getBoundingClientRect().y!;
    }

    onLoad(iframe: HTMLIFrameElement) {
        const iframeContentDocument = iframe.contentDocument!;
        const componentRef: ComponentRef<T> = this.getComponentRef();

        this.setPage(componentRef);
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
    public abstract getComponentRef(): ComponentRef<T>;
    public abstract setPage(componentRef: ComponentRef<T>): void;
}