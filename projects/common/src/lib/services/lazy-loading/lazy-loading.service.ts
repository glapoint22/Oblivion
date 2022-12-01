import { Compiler, ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Injector, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';
import { SpinnerAction } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { LazyLoadResult } from '../../classes/lazy-load-result';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {
  public container!: ViewContainerRef;
  public showBackdrop!: boolean;
  public backdropFadeIn!: boolean;
  public paddingRight: number = 0;

  constructor
    (
      private compiler: Compiler,
      private injector: Injector,
      private resolver: ComponentFactoryResolver,
      private spinnerService: SpinnerService
    ) { }


  public async load<T1 extends LazyLoad, T2>(callback: () => Promise<LazyLoadResult<T1, T2>>, spinnerAction: SpinnerAction, container?: ViewContainerRef) {
    if (spinnerAction == SpinnerAction.Start || spinnerAction == SpinnerAction.StartEnd) this.spinnerService.show = true;

    const lazyLoadResult: LazyLoadResult<T1, T2> = await callback();
    const moduleRef = await this.getModuleRef(lazyLoadResult.module);

    return this.getComponent(lazyLoadResult.component, container ? container : this.container, moduleRef.injector, spinnerAction == SpinnerAction.End || spinnerAction == SpinnerAction.StartEnd);
  }



  private async getModuleRef<T>(module: Type<T>): Promise<NgModuleRef<T>> {
    const moduleFactory: NgModuleFactory<T> = await this.compiler.compileModuleAsync(module);
    return moduleFactory.create(this.injector);
  }


  private getComponent<T extends LazyLoad>(component: Type<T>, container: ViewContainerRef, injector: Injector, endSpinner: boolean): T {
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(component);
    const componentRef: ComponentRef<T> = container.createComponent(componentFactory, undefined, injector);

    componentRef.instance.container = container;
    componentRef.instance.viewRef = componentRef.hostView;

    if (endSpinner) this.spinnerService.show = false;

    return componentRef.instance;
  }
}