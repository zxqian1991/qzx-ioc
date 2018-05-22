import 'reflect-metadata';
let targetLists: Map<any, any[]> = new Map();
let instanceLists: Map<any, any> = new Map(); // 实例列表
/**
 * 
 * @param _constructor 由于有webpack提前引入，所以能够保证所有的依赖都已经加载
 */
export function Injectable(_constructor: Function) {
    // 通过反射机制，获取参数类型列表    
    let paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', _constructor);
    targetLists.set(_constructor, paramsTypes);
}
// 这个实例用来获取依赖注入的实例
export function Ioc(injet: any) {
    return getIocInstance(injet);
}
function getIocInstance(inject: any) {
    // 存在这个实例
    if(instanceLists.has(inject)) {
        return instanceLists.get(inject);
    } else {
        // 不存在
        let relies = targetLists.get(inject) || [];
        let instance = new inject(...relies.map((rely) => {
            return getIocInstance(rely);
        }));
        instanceLists.set(inject, instance);
        return instance;
    }
}