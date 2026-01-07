import defineReactive from "./defineReactive";
import observe from "./observe";
import arrayMethods from "./array";
import Dep from "./Dep";

export default class Observer {
  constructor(value) {
    // 每一个Observer实例都有一个Dep实例
    this.dep = new Dep();
    // 将传入的普通对象加入__ob__属性，值为当前Observer实例（打上标记）
    Object.defineProperty(value, "__ob__", {
      value: this,
      enumerable: false,
      configurable: true,
    });
    // 具体判断传入的是对象还是数组，并进行相应的处理
    if (Array.isArray(value)) {
      // 将数组对象的原型设置为arrayMethods
      Object.setPrototypeOf(value, arrayMethods);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  // 遍历当前对象的属性，并将其转换为响应式对象
  walk(value) {
    for (let key in value) {
      // 如果属性名是__ob__，则跳过
      if (key === "__ob__") continue;
      // 将属性转换为响应式对象
      defineReactive(value, key, value[key]);
    }
  }
  // 遍历数组对象，并将其转换为响应式对象
  observeArray(array) {
    for (let i = 0, l = array.length; i < l; i++) {
      observe(array[i]);
    }
  }
}
