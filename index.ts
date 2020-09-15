import "reflect-metadata";
export type IConstructor<T> = new (...args: any[]) => T;
const FUNCTIONS = Symbol("functions");
const INSTANCES = Symbol("instances");

var GLOBAL_HANDLER: Array<(v: any) => any> = [];
export function Injectable<T>({ bootstrap }: { bootstrap?: false } = {}) {
  return (target: IConstructor<T>) => {
    const paramsTypes = Reflect.getMetadata("design:paramtypes", target);
    Reflect.defineMetadata(FUNCTIONS, paramsTypes, target);
    bootstrap && Ioc(target);
  };
}

// 获取某个依赖

export function Ioc<T>(target: IConstructor<T>): T {
  const instance = Reflect.getMetadata(INSTANCES, target);
  if (instance) {
    return instance;
  }
  // 获取这个target的依赖
  const paramsTypes: any[] = Reflect.getMetadata(FUNCTIONS, target) || [];
  // 接下来就需要获取所有的依赖
  const params = paramsTypes.map((rely: any) => {
    return Ioc(rely);
  });
  const tempInstance: T = new (target as any)(...params);

  Reflect.defineMetadata(
    INSTANCES,
    GLOBAL_HANDLER.reduce((v, h) => h(v), tempInstance),
    target
  );
  return tempInstance;
}

export function Inject() {
  return (target: any, key: string) => {
    const type = Reflect.getMetadata("design:type", target, key);
    target[key] = Ioc(type);
  };
}

export function AddGlobalIocHandler(handler: (v: object) => object) {
  GLOBAL_HANDLER.push(handler);
}
