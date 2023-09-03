import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
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

  constructor(private spinnerService: SpinnerService) { }


  public async load<T1 extends LazyLoad, T2>(callback: () => Promise<LazyLoadResult<T1, T2>>, spinnerAction: SpinnerAction, container?: ViewContainerRef) {
    if (spinnerAction == SpinnerAction.Start || spinnerAction == SpinnerAction.StartEnd) this.spinnerService.show = true;

    const lazyLoadResult: LazyLoadResult<T1, T2> = await callback();
    // const moduleRef = await this.getModuleRef(lazyLoadResult.module);

    return this.getComponent(lazyLoadResult.component, container ? container : this.container, spinnerAction == SpinnerAction.End || spinnerAction == SpinnerAction.StartEnd);
  }



  // private async getModuleRef<T>(module: Type<T>): Promise<NgModuleRef<T>> {
  //   const moduleFactory = await this.compiler.compileModuleAsync(module);
  //   return moduleFactory.create(this.injector);
  // }


  private getComponent<T extends LazyLoad>(component: Type<T>, container: ViewContainerRef, endSpinner: boolean): T {
    // const componentFactory = this.resolver.resolveComponentFactory(component);
    // const componentRef: ComponentRef<T> = container.createComponent(componentFactory, undefined, injector);

    const componentRef: ComponentRef<T> = container.createComponent(component)

    componentRef.instance.container = container;
    componentRef.instance.viewRef = componentRef.hostView;

    if (endSpinner) this.spinnerService.show = false;

    return componentRef.instance;
  }
}