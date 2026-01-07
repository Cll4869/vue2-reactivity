// 获取数组原型
const arrayPrototype = Array.prototype;

// 创建一个新对象，原型为arrayPrototype
const arrayMethods = Object.create(arrayPrototype);

// 定义需要重写的方法
const newMethods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];
// 遍历需要重写的方法，并重写
newMethods.forEach((method) => {
  
  // 获取原始方法
  const originFn = arrayPrototype[method];

  // 重写方法
  Object.defineProperty(arrayMethods, method, {
    value: function(){
      // 执行原始方法
      const result = originFn.apply(this, arguments);
      // 获取当前对象的__ob__属性
      const ob = this.__ob__;
      // 获取参数并转换为数组
      const args = [...arguments];
      // 定义插入的元素
      let inserted = [];
      switch(method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      if(inserted.length) {
        // 遍历插入的元素，并将其转换为响应式对象
        ob.observeArray(inserted);
      }
      ob.dep.notify();
      return result;
    },
    enumerable: false,
    configurable: true,
  });
});

export default arrayMethods;
