import { Compiler, ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Injector, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';
import { LazyLoad } from '../../classes/lazy-load';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {
  public container!: ViewContainerRef;
  
  constructor(private compiler: Compiler, private injector: Injector, private resolver: ComponentFactoryResolver) { }


  async getModuleRef<T>(module: Type<T>): Promise<NgModuleRef<T>> {
    const moduleFactory: NgModuleFactory<T> = await this.compiler.compileModuleAsync(module);
    return moduleFactory.create(this.injector);
  }


  getComponent<T extends LazyLoad>(component: Type<T>, container: ViewContainerRef, injector?: Injector): T {
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(component);
    const componentRef: ComponentRef<T> = container.createComponent(componentFactory, undefined, injector);

    componentRef.instance.container = container;
    componentRef.instance.viewRef = componentRef.hostView;
    return componentRef.instance;
  }


  async getComponentAsync<T1 extends LazyLoad, T2>(component: Type<T1>, module: Type<T2>, container: ViewContainerRef): Promise<T1> {
    const moduleRef = await this.getModuleRef(module);
    return this.getComponent(component, container, moduleRef.injector);
  }
}