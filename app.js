let currentWeekStart = getWeekStart(new Date());
let visitors = [];
let selectedGender = '女';
let modalVisible = false;

// 本地存储键名
const STORAGE_KEY = 'visitor_records';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化时间选择器（只需要开始时间）
  initTimePicker('hourPicker', 'minutePicker', 'startTime');

  // 开始时间改变时自动更新结束时间
  document.getElementById('startTime').addEventListener('change', function() {
    if (this.value) {
      const endTime = calculateEndTime(this.value);
      document.getElementById('endTime').value = endTime;
      document.getElementById('endTimeDisplay').value = endTime;
    }
  });

  // 日期改变时重新加载数据
  document.getElementById('date').addEventListener('change', function() {
    loadVisitors();
  });

  // 点击模态框外部关闭
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  loadVisitors();
  renderSchedule();
});

// 初始化时间选择器
function initTimePicker(hourPickerId, minutePickerId, outputId) {
  const hourPicker = document.getElementById(hourPickerId);
  const minutePicker = document.getElementById(minutePickerId);

  // 生成小时选项 (00-23)
  hourPicker.innerHTML = '<div class="time-spacer"></div>';
  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, '0');
    const option = document.createElement('div');
    option.className = 'time-option';
    option.textContent = hour;
    option.dataset.value = hour;
    option.onclick = () => {
      option.parentElement.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      updateTimeOutput(hourPickerId, minutePickerId, outputId);
    };
    hourPicker.appendChild(option);
  }
  hourPicker.innerHTML += '<div class="time-spacer"></div>';

  // 生成分钟选项 (00-59, 每隔5分钟)
  minutePicker.innerHTML = '<div class="time-spacer"></div>';
  for (let i = 0; i < 60; i += 5) {
    const minute = String(i).padStart(2, '0');
    const option = document.createElement('div');
    option.className = 'time-option';
    option.textContent = minute;
    option.dataset.value = minute;
    option.onclick = () => {
      option.parentElement.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      updateTimeOutput(hourPickerId, minutePickerId, outputId);
    };
    minutePicker.appendChild(option);
  }
  minutePicker.innerHTML += '<div class="time-spacer"></div>';

  // 使用 requestAnimationFrame 优化滚动事件
  let ticking = false;
  hourPicker.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        snapToOption(this);
        updateTimeOutput(hourPickerId, minutePickerId, outputId);
        ticking = false;
      });
      ticking = true;
    }
  });

  minutePicker.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        snapToOption(this);
        updateTimeOutput(hourPickerId, minutePickerId, outputId);
        ticking = false;
      });
      ticking = true;
    }
  });

  // 设置默认值
  setDefaultTime(hourPickerId, minutePickerId, outputId);
}

// 设置默认时间
function setDefaultTime(hourPickerId, minutePickerId, outputId) {
  const now = new Date();
  scrollToTime(hourPickerId, minutePickerId, now.getHours(), now.getMinutes());
}

// 滚动到指定时间
function scrollToTime(hourPickerId, minutePickerId, hours, minutes) {
  hours = Math.min(23, Math.max(0, hours));
  // 找到最接近的5分钟倍数
  minutes = Math.round(minutes / 5) * 5;
  minutes = Math.min(55, Math.max(0, minutes));

  const hourPicker = document.getElementById(hourPickerId);
  const minutePicker = document.getElementById(minutePickerId);

  setTimeout(() => {
    const optionHeight = 36;
    const spacerHeight = 36;
    
    // 计算滚动位置
    hourPicker.scrollTop = hours * optionHeight + spacerHeight - (hourPicker.clientHeight / 2) + (optionHeight / 2);
    minutePicker.scrollTop = (minutes / 5) * optionHeight + spacerHeight - (minutePicker.clientHeight / 2) + (optionHeight / 2);

    // 更新选中状态
    hourPicker.querySelectorAll('.time-option').forEach(opt => {
      opt.classList.toggle('selected', parseInt(opt.dataset.value) === hours);
    });
    minutePicker.querySelectorAll('.time-option').forEach(opt => {
      opt.classList.toggle('selected', parseInt(opt.dataset.value) === minutes);
    });

    updateTimeOutput(hourPickerId, minutePickerId, 'startTime');
  }, 50);
}

// 滚动对齐到选项
function snapToOption(picker) {
  const optionHeight = 36;
  const spacerHeight = 36;
  const scrollTop = picker.scrollTop;
  
  // 计算当前应该选中的选项索引
  const selectedIndex = Math.round((scrollTop - spacerHeight / 2 + optionHeight / 2) / optionHeight);
  
  // 确保索引在有效范围内
  const options = picker.querySelectorAll('.time-option');
  const validIndex = Math.max(0, Math.min(options.length - 1, selectedIndex));
  
  // 更新选中状态
  options.forEach((opt, index) => {
    opt.classList.toggle('selected', index === validIndex);
  });
}

// 更新时间输出
function updateTimeOutput(hourPickerId, minutePickerId, outputId) {
  const hourPicker = document.getElementById(hourPickerId);
  const minutePicker = document.getElementById(minutePickerId);

  const selectedHour = hourPicker.querySelector('.time-option.selected');
  const selectedMinute = minutePicker.querySelector('.time-option.selected');

  if (selectedHour && selectedMinute) {
    const time = `${selectedHour.dataset.value}:${selectedMinute.dataset.value}`;
    document.getElementById(outputId).value = time;
  }
}

// 获取周的起始日期（周一）
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 渲染课表
function renderSchedule() {
  updateHeader();
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';

  // 时间范围：6点到23点（共18个小时）
  const startHour = 6;
  const endHour = 23;

  // 收集所有有来访的时间段
  const timeSlots = getTimeSlots(startHour, endHour);

  // 渲染时间槽
  timeSlots.forEach(slot => {
    const tr = document.createElement('tr');

    // 时间列
    const timeTd = document.createElement('td');
    timeTd.className = 'time-col';
    timeTd.textContent = slot.label;
    timeTd.style.background = '#f8f9fa';
    timeTd.style.textAlign = 'center';
    timeTd.style.verticalAlign = 'middle';
    timeTd.style.fontSize = '12px';
    timeTd.style.color = '#666';
    timeTd.style.padding = '8px 4px';
    tr.appendChild(timeTd);

    // 为每一天创建单元格
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      const dateStr = formatDate(date);

      const td = document.createElement('td');
      td.className = 'schedule-cell';

      // 收集来访者
      let dayVisitors = [];
      if (slot.type === 'merged') {
        // 合并时间段：收集该时间段内的所有来访者
        dayVisitors = visitors.filter(v => {
          if (v.date !== dateStr) return false;
          const [startH] = v.startTime.split(':').map(Number);
          return startH >= slot.startHour && startH < slot.endHour;
        });
      } else {
        // 展开时间段：只收集该小时的来访者
        dayVisitors = visitors.filter(v => {
          if (v.date !== dateStr) return false;
          const [startH] = v.startTime.split(':').map(Number);
          return startH === slot.hour;
        });
      }
      // 按开始时间排序
      dayVisitors.sort((a, b) => a.startTime.localeCompare(b.startTime));

      // 添加来访者容器
      const container = document.createElement('div');
      container.className = 'visitor-card-container';

      // 添加来访者卡片
      dayVisitors.forEach(v => {
        const card = document.createElement('div');
        card.className = 'visitor-card';
        card.onclick = () => openEditModal(v);

        card.innerHTML = `
          <div class="visitor-info">
            <div class="info-row">
              <span class="info-name">${v.name}</span>
              <span class="info-gender ${v.gender === '男' ? 'gender-m' : 'gender-f'}">${v.gender || '女'}</span>
            </div>
            <div class="info-time">${v.startTime}-${v.endTime}</div>
          </div>
        `;
        container.appendChild(card);
      });

      td.appendChild(container);

      // 添加按钮 - 细线加号
      const addBtn = document.createElement('button');
      addBtn.className = 'cell-add-btn';
      addBtn.innerHTML = '+';
      addBtn.onclick = () => openAddModal(dateStr);
      td.appendChild(addBtn);

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}

// 获取智能时间槽
function getTimeSlots(startHour, endHour) {
  const slots = [];

  // 统计每个小时是否有来访
  const hourHasVisitors = {};
  for (let hour = startHour; hour < endHour; hour++) {
    hourHasVisitors[hour] = visitors.some(v => {
      const [startH] = v.startTime.split(':').map(Number);
      return startH === hour;
    });
  }

  // 智能合并连续的空闲时间段
  let mergedStart = null;
  for (let hour = startHour; hour < endHour; hour++) {
    if (hourHasVisitors[hour]) {
      // 如果有未合并的时间段，先添加
      if (mergedStart !== null) {
        slots.push({
          type: 'merged',
          label: `${String(mergedStart).padStart(2, '0')}:00-${String(hour).padStart(2, '0')}:00`,
          startHour: mergedStart,
          endHour: hour,
          hour: null
        });
        mergedStart = null;
      }
      // 添加有来访的小时
      slots.push({
        type: 'expanded',
        label: `${String(hour).padStart(2, '0')}:00`,
        hour: hour
      });
    } else {
      // 开始或继续合并时间段
      if (mergedStart === null) {
        mergedStart = hour;
      }
    }
  }

  // 处理最后的合并时间段
  if (mergedStart !== null) {
    slots.push({
      type: 'merged',
      label: `${String(mergedStart).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`,
      startHour: mergedStart,
      endHour: endHour,
      hour: null
    });
  }

  return slots;
}

// 更新表头
function updateHeader() {
  const today = formatDate(new Date());
  const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    const dateStr = formatDate(date);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const th = document.getElementById(`day${i}`);
    th.innerHTML = `<span class="date-num">${month}/${day}</span><span class="day-name">${dayNames[i]}</span>`;

    // 标记今天
    if (dateStr === today) {
      th.classList.add('today');
    } else {
      th.classList.remove('today');
    }
  }
}

// 切换周
function changeWeek(delta) {
  currentWeekStart.setDate(currentWeekStart.getDate() + delta * 7);
  loadVisitors();
  renderSchedule();
}

// 从本地存储加载来访者数据
function loadVisitors() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    visitors = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载数据失败:', error);
    visitors = [];
  }
}

// 保存来访者数据到本地存储
function saveVisitorsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  } catch (error) {
    console.error('保存数据失败:', error);
    alert('保存失败，存储空间可能已满');
  }
}

// 计算结束时间（开始后 50 分钟）
function calculateEndTime(startTime) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes + 50, 0, 0);

  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  return `${endHours}:${endMinutes}`;
}

// 选择性别
function selectGender(gender) {
  selectedGender = gender;
  document.getElementById('genderMLabel').classList.toggle('active', gender === '男');
  document.getElementById('genderFLabel').classList.toggle('active', gender === '女');
  document.querySelector(`input[name="gender"][value="${gender}"]`).checked = true;
}

// 打开添加模态框（从周视图）
function openAddModalForWeek() {
  // 默认选择今天或周一
  const today = new Date();
  const todayStr = formatDate(today);
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  let selectedDate = today;
  if (today < currentWeekStart || today > weekEnd) {
    selectedDate = new Date(currentWeekStart);
  }

  openAddModal(formatDate(selectedDate));
}

// 打开添加模态框
function openAddModal(date) {
  document.getElementById('modalTitle').textContent = '添加来访者';
  document.getElementById('visitorId').value = '';
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('date').value = date;
  selectGender('女');
  document.getElementById('deleteBtn').style.display = 'none';

  // 设置默认时间
  scrollToTime('hourPicker', 'minutePicker', 9, 0);
  document.getElementById('endTimeDisplay').value = '';
  document.getElementById('endTime').value = '';

  modalVisible = true;
  document.getElementById('modal').classList.add('active');
}

// 打开编辑模态框
function openEditModal(visitor) {
  document.getElementById('modalTitle').textContent = '编辑来访者';
  document.getElementById('visitorId').value = visitor.id;
  document.getElementById('name').value = visitor.name;
  document.getElementById('phone').value = visitor.phone || '';
  document.getElementById('date').value = visitor.date;
  document.getElementById('notes').value = visitor.notes || '';

  selectGender(visitor.gender || '女');

  // 设置时间
  const [startHour, startMinute] = visitor.startTime.split(':').map(Number);
  scrollToTime('hourPicker', 'minutePicker', startHour, startMinute);

  // 显示结束时间（只读）
  document.getElementById('endTimeDisplay').value = visitor.endTime;
  document.getElementById('endTime').value = visitor.endTime;

  document.getElementById('deleteBtn').style.display = 'block';

  modalVisible = true;
  document.getElementById('modal').classList.add('active');
}

// 关闭模态框
function closeModal() {
  modalVisible = false;
  document.getElementById('modal').classList.remove('active');
}

// 检查时间冲突
function hasTimeConflict(excludeId, date, startTime, endTime) {
  return visitors.some(v => {
    if (v.id === excludeId) return false;
    if (v.date !== date) return false;
    return v.startTime < endTime && v.endTime > startTime;
  });
}

// 保存来访者
function saveVisitor() {
  const id = document.getElementById('visitorId').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  
  const visitorData = {
    id: id || Date.now().toString(),
    name: document.getElementById('name').value,
    gender: selectedGender,
    phone: document.getElementById('phone').value,
    date: document.getElementById('date').value,
    startTime: startTime,
    endTime: endTime,
    notes: document.getElementById('notes').value
  };

  if (!visitorData.name || !visitorData.date || !visitorData.startTime) {
    alert('请填写必填项');
    return;
  }

  // 检查结束时间是否有效
  if (!visitorData.endTime) {
    visitorData.endTime = calculateEndTime(visitorData.startTime);
  }

  // 检查时间冲突
  if (hasTimeConflict(visitorData.id, visitorData.date, visitorData.startTime, visitorData.endTime)) {
    const conflictTime = visitors.find(v =>
      v.date === visitorData.date &&
      v.startTime < visitorData.endTime &&
      v.endTime > visitorData.startTime
    );
    alert(`该时间段已有预约：${conflictTime?.name} (${conflictTime?.startTime}-${conflictTime?.endTime})，请选择其他时间`);
    return;
  }

  if (id) {
    // 更新
    const index = visitors.findIndex(v => v.id === id);
    if (index !== -1) {
      visitors[index] = { ...visitors[index], ...visitorData };
    }
  } else {
    // 新增
    visitors.push(visitorData);
  }

  saveVisitorsToStorage();
  closeModal();
  loadVisitors();
  renderSchedule();
}

// 删除来访者
function deleteVisitor() {
  const id = document.getElementById('visitorId').value;

  if (!confirm('确定要删除这条记录吗？')) {
    return;
  }

  const index = visitors.findIndex(v => v.id === id);
  if (index !== -1) {
    visitors.splice(index, 1);
    saveVisitorsToStorage();
    closeModal();
    loadVisitors();
    renderSchedule();
  }
}
