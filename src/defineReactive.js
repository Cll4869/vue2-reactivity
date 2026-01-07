import observe from './observe';
import Dep from './Dep';

/**
 * 
 * @param {*} obj 目标对象
 * @param {*} key 目标对象的属性名
 * @param {*} value 目标对象的属性值
 */
export default function(obj, key, value) {
  // 创建一个Dep实例，每一个响应式对象都有一个Dep实例，用于收集依赖
  const dep = new Dep();
  // 递归观察子对象，确保所有嵌套对象也具有响应式能力
  let childOb = observe(value);
  // 通过Object.defineProperty拦截属性的读取和设置，使其具有响应式能力
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 如果Dep.target存在，则收集依赖
      if(Dep.target) {
        dep.depend();
        // 如果子对象存在，则收集子对象的依赖
        if (childOb) {
          childOb.dep.depend();
        }
      }
      // 返回属性值
      return value;
    },
    // 设置属性值
    set(newValue) {
      if(newValue === value) return;
      value = newValue;
      // 更新子对象的响应式能力
      childOb = observe(newValue);
      dep.notify();
    },
  });
}
