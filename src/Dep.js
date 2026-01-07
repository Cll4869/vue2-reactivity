// 定义一个uid，用于记录Dep实例的id
let uid = 0;

export default class Dep {
  constructor() {
    this.id = uid++;
    // 存储Watcher实例
    this.subs = [];
  }

  // 添加Watcher实例
  addSub(sub) {
    this.subs.push(sub);
  }

  // 移除Watcher实例
  removeSub(sub) {
    const index = this.subs.indexOf(sub);
    if (index > -1) {
      this.subs.splice(index, 1);
    }
  }

  // 收集依赖
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  // 通知所有订阅的Watcher实例更新
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

Dep.target = null;
