# Vue2 响应式系统实现

这是一个基于 Vue2 响应式原理的简化实现，使用 `Object.defineProperty` 实现数据的响应式转换，包含依赖收集和派发更新的完整机制。

## 📚 目录

- [核心概念](#核心概念)
- [项目结构](#项目结构)
- [核心模块](#核心模块)
- [使用示例](#使用示例)
- [工作流程](#工作流程)
- [安装和使用](#安装和使用)
- [在线演示](#在线演示)

## 🎯 核心概念

### 响应式系统三要素

1. **Observer（观察者）**：将普通对象转换为响应式对象
2. **Dep（依赖收集器）**：收集和管理依赖（Watcher）
3. **Watcher（观察者）**：观察数据变化并执行回调

### 响应式原理

- 使用 `Object.defineProperty` 拦截属性的读取和设置
- 在 `getter` 中收集依赖（Dep）
- 在 `setter` 中派发更新（notify）
- 递归处理嵌套对象和数组

## 📁 项目结构

```
src/
├── observe.js          # 入口函数，判断是否需要转换为响应式
├── Observer.js         # 观察者类，处理对象和数组
├── defineReactive.js   # 定义响应式属性
├── Dep.js              # 依赖收集器
├── Watcher.js          # 观察者，执行回调
├── array.js            # 数组方法重写
└── index.js            # 示例入口
```

## 🔧 核心模块

### 1. observe.js - 入口函数

负责判断对象是否需要转换为响应式，避免重复处理。

```javascript
observe(value)
```

**功能：**
- 检查是否为对象（排除 null）
- 检查是否已被观察（通过 `__ob__` 标记）
- 创建 Observer 实例

### 2. Observer.js - 观察者类

将普通对象转换为响应式对象，处理对象和数组两种情况。

**核心方法：**
- `walk(value)`: 遍历对象属性，调用 `defineReactive` 处理（会跳过 `__ob__` 属性，避免循环引用）
- `observeArray(array)`: 遍历数组元素，递归处理

**特点：**
- 每个 Observer 实例都有一个 `Dep` 实例，用于收集依赖
- 通过 `__ob__` 属性标记对象已被观察（不可枚举，避免被遍历到）
- 数组会使用 `Object.setPrototypeOf` 将原型指向重写的方法对象

### 3. defineReactive.js - 定义响应式属性

使用 `Object.defineProperty` 定义响应式属性，实现依赖收集和派发更新。

**核心逻辑：**
- 每个属性对应一个 `Dep` 实例
- `getter`: 收集依赖（Dep.target）
- `setter`: 派发更新（dep.notify）
- 递归处理嵌套对象

### 4. Dep.js - 依赖收集器

管理所有订阅该依赖的 Watcher 实例。

**核心方法：**
- `depend()`: 收集依赖，将当前 Watcher 添加到订阅列表
- `notify()`: 通知所有 Watcher 更新
- `addSub(sub)`: 添加 Watcher
- `removeSub(sub)`: 移除 Watcher

**静态属性：**
- `Dep.target`: 当前正在执行的 Watcher（用于依赖收集）

### 5. Watcher.js - 观察者

观察数据变化并执行回调函数。

**核心方法：**
- `get()`: 获取值并收集依赖
- `update()`: 数据变化时调用，执行回调
- `addDep(dep)`: 添加 Dep 到订阅列表（避免重复）
- `teardown()`: 清理所有订阅

**特点：**
- 支持路径表达式（如 `'user.name'`）
- 使用 `Set` 避免重复订阅同一个 Dep

### 6. array.js - 数组方法重写

重写数组的变异方法（push、pop、shift、unshift、splice、sort、reverse），使其能够触发响应式更新。

**实现原理：**
- 创建以原生数组原型为原型的新对象
- 重写 7 个变异方法
- 在方法执行后调用 `ob.dep.notify()` 通知更新
- 处理新增元素（push、unshift、splice）

## 💡 使用示例

### 基本使用

```javascript
import observe from './observe';

// 创建普通对象
const user = {
  name: 'cll',
  age: 23,
  address: {
    province: '浙江省',
    city: '杭州市'
  }
};

// 转换为响应式对象
observe(user);

// 现在 user 对象已经是响应式的了
console.log(user.name); // 触发 getter
user.age = 24;          // 触发 setter，派发更新
```

### 使用 Watcher 监听变化

```javascript
import observe from './observe';
import Watcher from './Watcher';

const user = {
  name: 'cll',
  age: 23
};

observe(user);

// 创建 Watcher，监听 user.name 的变化
const watcher = new Watcher(user, 'name', (newVal, oldVal) => {
  console.log(`name 从 ${oldVal} 变为 ${newVal}`);
});

// 修改 name，会触发回调
user.name = 'newName'; // 输出: name 从 cll 变为 newName
```

### 嵌套对象处理

```javascript
const user = {
  name: 'cll',
  address: {
    province: '浙江省',
    city: '杭州市',
    area: {
      name: '萧山区'
    }
  }
};

observe(user);

// 所有层级的属性都是响应式的
user.address.city = '宁波市';        // ✅ 响应式
user.address.area.name = '余杭区';   // ✅ 响应式
```

### 数组处理

```javascript
const user = {
  name: 'cll',
  hobby: ['篮球', '足球']
};

observe(user);

// 使用数组方法会触发更新
user.hobby.push('乒乓球');  // ✅ 触发更新
user.hobby[0] = '羽毛球';    // ⚠️ 不会触发更新（Vue2 的限制）
```

## 🔄 工作流程

### 1. 响应式转换流程

```
observe(user)
  ↓
new Observer(user)
  ├─ 创建 Dep 实例
  ├─ 标记 __ob__
  └─ walk(user) / observeArray(user)
      ↓
  defineReactive(user, 'name', 'cll')
      ├─ 创建 Dep 实例
      ├─ observe('cll') → 递归处理
      └─ 定义 getter/setter
```

### 2. 依赖收集流程

```
Watcher.get()
  ↓
Dep.target = Watcher
  ↓
访问响应式数据（触发 getter）
  ↓
dep.depend()
  ↓
Watcher.addDep(dep)
  ↓
dep.addSub(Watcher)
  ↓
建立依赖关系
  ↓
Dep.target = null
```

### 3. 派发更新流程

```
修改响应式数据（触发 setter）
  ↓
dep.notify()
  ↓
遍历所有 Watcher
  ↓
Watcher.update()
  ↓
重新获取值 + 执行回调
```

## 🚀 安装和使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后，在浏览器中打开 `dist/index.html` 查看演示页面。

### 生产构建

```bash
npm run build
```

## 🎮 在线演示

项目包含一个完整的演示页面（`dist/index.html`），展示了响应式系统的实际效果：

- **数据展示区域**：实时显示响应式数据
- **数据编辑区域**：通过输入框修改数据，观察响应式更新
- **控制台测试**：在浏览器控制台中使用 `user.name = '新名字'` 等命令测试

### 演示功能

1. 修改输入框中的值，观察数据展示区域的实时更新
2. 在控制台输入 `user.hobby.push('新爱好')` 测试数组响应式
3. 修改嵌套对象属性，如 `user.address.city = '新城市'`

所有代码都包含详细的中文注释，方便理解实现原理。

## 📝 核心特性

- ✅ 对象属性响应式转换
- ✅ 嵌套对象递归处理
- ✅ 数组方法拦截（push、pop、shift、unshift、splice、sort、reverse）
- ✅ 依赖收集机制（Dep + Watcher）
- ✅ 派发更新机制（自动通知所有依赖）
- ✅ 避免重复处理（`__ob__` 标记）
- ✅ 避免循环引用（Observer 不保存 value 属性）
- ✅ 完整的中文注释，易于理解

## 🔍 技术细节

### 为什么需要 Dep？

每个响应式属性都需要一个 `Dep` 实例来管理订阅它的所有 `Watcher`。当属性变化时，`Dep` 负责通知所有相关的 `Watcher` 更新。

### 为什么需要 Watcher？

`Watcher` 是观察者模式的实现，它：
- 观察数据的变化
- 在数据变化时执行回调
- 管理自己订阅的所有 `Dep`

### 数组处理的限制

Vue2 无法检测到以下数组变化：
- 通过索引直接设置项：`arr[0] = newValue`
- 修改数组长度：`arr.length = 2`

需要使用 `Vue.set` 或 `splice` 方法。

### 依赖收集的时机

依赖收集发生在：
- `Watcher` 首次创建时（`get()` 方法）
- 访问响应式数据时（触发 `getter`）

### 代码注释

所有源代码文件都包含详细的中文注释，解释：
- 每个函数/类的作用
- 关键步骤的实现原理
- 参数和返回值的说明
- 使用示例和注意事项

## 📖 参考

- [Vue2 响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
- [Object.defineProperty MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

