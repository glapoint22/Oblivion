import { Compiler, ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Injector, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';

@Injectable({
  providedIn: 'root'
})
export class LazyLoadingService {
  public container!: ViewContainerRef;

  constructor(private compiler: Compiler, private injector: Injector, private resolver: ComponentFactoryResolver) { }

  createComponent<T>(component: Type<T>, index?: number, injector?: Injector): ComponentRef<T> {
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(component);
    return this.container.createComponent(componentFactory, index, injector);
  }


  async getModuleRef<T>(module: Type<T>): Promise<NgModuleRef<T>> {
    const moduleFactory: NgModuleFactory<T> = await this.compiler.compileModuleAsync(module);
    return moduleFactory.create(this.injector);
  }
}