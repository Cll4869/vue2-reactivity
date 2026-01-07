import observe from './observe';
import Watcher from './Watcher';

// 创建一个普通的用户对象
const user = {
  name: 'cll',
  age: 23,
  hobby: ['篮球', '足球', '乒乓球'],
  address: {
    province: '浙江省',
    city: '杭州市',
    area: '萧山区',
  },
};

// 将user对象转换为响应式对象
observe(user);

window.user = user;

function updateDisplay() {
  const nameEl = document.getElementById('name');
  const ageEl = document.getElementById('age');
  const provinceEl = document.getElementById('province');
  const cityEl = document.getElementById('city');
  const areaEl = document.getElementById('area');
  const hobbyEl = document.getElementById('hobby');

  if (nameEl) nameEl.textContent = user.name;
  if (ageEl) ageEl.textContent = user.age;
  if (provinceEl) provinceEl.textContent = user.address.province;
  if (cityEl) cityEl.textContent = user.address.city;
  if (areaEl) areaEl.textContent = user.address.area;
  if (hobbyEl) hobbyEl.textContent = user.hobby.join('、');
}

// 给name属性添加一个Watcher实例
new Watcher(user, 'name', () => {
  updateDisplay();
});

new Watcher(user, 'age', () => {
  updateDisplay();
});

new Watcher(user, 'address.province', () => {
  updateDisplay();
});

new Watcher(user, 'address.city', () => {
  updateDisplay();
});

new Watcher(user, 'address.area', () => {
  updateDisplay();
});

new Watcher(user, 'hobby', () => {
  updateDisplay();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateDisplay);
} else {
  updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('nameInput');
  const ageInput = document.getElementById('ageInput');
  const provinceInput = document.getElementById('provinceInput');
  const cityInput = document.getElementById('cityInput');
  const areaInput = document.getElementById('areaInput');
  const hobbyInput = document.getElementById('hobbyInput');
  const addHobbyBtn = document.getElementById('addHobbyBtn');

  if (nameInput) {
    nameInput.value = user.name;
    nameInput.addEventListener('input', (e) => {
      user.name = e.target.value;
    });
  }

  if (ageInput) {
    ageInput.value = user.age;
    ageInput.addEventListener('input', (e) => {
      user.age = parseInt(e.target.value) || 0;
    });
  }

  if (provinceInput) {
    provinceInput.value = user.address.province;
    provinceInput.addEventListener('input', (e) => {
      user.address.province = e.target.value;
    });
  }

  if (cityInput) {
    cityInput.value = user.address.city;
    cityInput.addEventListener('input', (e) => {
      user.address.city = e.target.value;
    });
  }

  if (areaInput) {
    areaInput.value = user.address.area;
    areaInput.addEventListener('input', (e) => {
      user.address.area = e.target.value;
    });
  }

  if (hobbyInput && addHobbyBtn) {
    addHobbyBtn.addEventListener('click', () => {
      const hobby = hobbyInput.value.trim();
      if (hobby) {
        user.hobby.push(hobby);
        hobbyInput.value = '';
      }
    });
  }
});
