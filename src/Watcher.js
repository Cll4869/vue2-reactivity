import Dep from "./Dep";

let uid = 0;

// 将路径按点号分割成数组，如 'user.name' -> ['user', 'name']
function parsePath(expression) {
  const segments = expression.split(".");
  // 返回一个函数，这个函数接收一个对象，返回路径对应的值
  return function (obj) {
    // 依次访问路径的每一层
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}
/**
 *
 * @param {*} target 目标对象，如 user
 * @param {*} expression 表达式，如 'user.name'，用于访问目标对象的属性
 * @param {*} callback 回调函数，当数据变化时执行，参数为新值和旧值
 */
export default class Watcher {
  constructor(target, expression, callback) {
    // 每个Watcher的唯一ID
    this.id = uid++;
    // 目标对象，如 user
    this.target = target;
    // 表达式，如 'user.name'
    this.expression = expression;
    // 将表达式解析成getter函数
    this.getter = parsePath(expression);
    // 回调函数，当数据变化时执行，参数为新值和旧值
    this.callback = callback;
    // 存储这个Watcher订阅的所有Dep实例（用于清理时取消订阅）
    this.deps = [];
    // 存储已订阅的Dep的ID（用于快速判断是否已订阅，避免重复）
    this.depIds = new Set();
    // 获取初始值，同时收集依赖
    this.value = this.get();
  }
  
  // 获取初始值
  get() {
    // 给Dep.target（当前全局唯一的变量）赋值为当前Watcher实例
    Dep.target = this;
    let value;
    try {
      value = this.getter.call(this.target, this.target);
    } finally {
      // 无论是否出错，都清空Dep.target
      Dep.target = null;
    }
    return value;
  }
  // 添加依赖函数
  addDep(dep) {
    const id = dep.id;
    // 如果当前Watcher实例没有订阅过该Dep实例，则订阅并添加到deps数组中
    if (!this.depIds.has(id)) {
      // 添加到depIds集合中
      this.depIds.add(id);
      // 添加到deps数组中
      this.deps.push(dep);
      // 将当前Watcher实例添加到Dep实例的subs数组中
      dep.addSub(this);
    }
  }
  // 更新
  update() {
    const oldValue = this.value;
    this.value = this.get();
    if (this.callback) {
      this.callback.call(this.target, this.value, oldValue);
    }
  }
  // 清理
  teardown() {
    for (let i = 0; i < this.deps.length; i++) {
      this.deps[i].removeSub(this);
    }
    this.deps = [];
    this.depIds.clear();
  }
}
