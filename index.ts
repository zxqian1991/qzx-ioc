import 'reflect-metadata';
export type IConstructor<T> = new (...args: any[]) => T;

export function Injectable<T>({
    bootstrap = false,
}: { bootstrap?: boolean } = {}) {
    return (target: IConstructor<T>) => {
        // const paramsTypes = Reflect.getMetadata('design:paramtypes', target);
        bootstrap && Ioc(target);
    };
}

// 获取某个依赖

export function Ioc<T>(target: IConstructor<T>): T {
    const instance = Reflect.getMetadata('qzx-ioc:instance', target);
    if (instance) {
        return instance;
    }
    // 获取这个target的依赖
    const paramsTypes: any[] =
        Reflect.getMetadata('design:paramtypes', target) || [];
    // 接下来就需要获取所有的依赖
    const params = paramsTypes.map((rely: any) => {
        return Ioc(rely);
    });

    const result: T = new (target as any)(...params);
    Reflect.defineMetadata('qzx-ioc:instance', result, target);
    return result;
}
