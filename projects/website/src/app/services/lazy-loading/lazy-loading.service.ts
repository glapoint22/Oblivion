import { Compiler, ComponentFactory, ComponentFactoryResolver, Injectable, Injector, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {

  constructor(private compiler: Compiler, private injector: Injector, private resolver: ComponentFactoryResolver) { }

  createComponent<T>(component: Type<T>, container: ViewContainerRef, index?: number, injector?: Injector): T {
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(component);
    return container.createComponent(componentFactory, index, injector).instance;
  }


  async getModuleRef<T>(module: Type<T>): Promise<NgModuleRef<T>> {
    const moduleFactory: NgModuleFactory<T> = await this.compiler.compileModuleAsync(module);
    return moduleFactory.create(this.injector);
  }
}