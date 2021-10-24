import { Compiler, ComponentFactory, ComponentFactoryResolver, Injectable, Injector, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';
import { LazyLoading } from '../../classes/lazy-loading';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {
  public container!: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector, private resolver: ComponentFactoryResolver) { }

  createComponent<T extends LazyLoading>(component: Type<T>, index?: number, injector?: Injector): T {
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(component);
    const componentRef = this.container.createComponent(componentFactory, index, injector);

    componentRef.instance.viewRef = componentRef.hostView;
    return componentRef.instance;
  }


  async getModuleRef<T>(module: Type<T>): Promise<NgModuleRef<T>> {
    const moduleFactory: NgModuleFactory<T> = await this.compiler.compileModuleAsync(module);
    return moduleFactory.create(this.injector);
  }
}