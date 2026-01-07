import Observer from "./Observer";

export default function (value) {
  // 判断传入的value是否为对象且不为null
  if (typeof value !== "object" || value === null) return;
  // 如果value已经有__ob__属性，则直接返回
  if (value.__ob__) return value.__ob__;
  // 创建并返回一个Observer实例
  return new Observer(value);
}
