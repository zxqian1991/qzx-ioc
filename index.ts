import "reflect-metadata";
const FUNCTIONS = Symbol('functions');
const INSTANCES = Symbol('instances');
export function Injectable() {
    return (target: any) => {
        const paramsTypes = Reflect.getMetadata('design:paramtypes', target);
        // 存储这个值
        Reflect.defineMetadata(FUNCTIONS, paramsTypes, target)
    }
}

// 获取某个依赖
export function Ioc<T>(target: any): T {
    const instance = Reflect.getMetadata(INSTANCES, target);
    if (instance) {
        return instance;
    }
    // 获取这个target的依赖
    const  paramsTypes: any[] = Reflect.getMetadata(FUNCTIONS, target) || [];
    // 接下来就需要获取所有的依赖
    const params = paramsTypes.map(rely => {
        return Ioc(rely);
    });
    const tempInstance: T = new (target as any)(...params);
    Reflect.defineMetadata(INSTANCES, tempInstance, target);
    return tempInstance;
}