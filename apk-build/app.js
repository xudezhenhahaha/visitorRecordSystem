let currentWeekStart = getWeekStart(new Date());
let visitors = [];
let modal;

// 本地存储键名
const STORAGE_KEY = 'visitor_records';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  modal = new bootstrap.Modal(document.getElementById('visitorModal'));
  
  // 开始时间改变时自动更新结束时间
  document.getElementById('startTime').addEventListener('change', function() {
    if (this.value) {
      document.getElementById('endTime').value = calculateEndTime(this.value);
    }
  });
  
  // 日期改变时重新加载数据（确保显示正确的已有预约）
  document.getElementById('date').addEventListener('change', function() {
    loadVisitors();
  });
  
  loadVisitors();
  renderSchedule();
});

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

// 格式化显示日期范围
function displayWeekRange() {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const startStr = formatDate(currentWeekStart);
  const endStr = formatDate(weekEnd);
  document.getElementById('currentWeek').textContent = `${startStr} ~ ${endStr}`;
  
  // 更新表头日期
  const today = formatDate(new Date());
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    const dateStr = formatDate(date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
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

// 保存到来者数据到本地存储
function saveVisitorsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  } catch (error) {
    console.error('保存数据失败:', error);
    alert('保存失败，存储空间可能已满');
  }
}

// 渲染课表
function renderSchedule() {
  displayWeekRange();
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';

  const timeSlots = generateTimeSlots();

  timeSlots.forEach(time => {
    const tr = document.createElement('tr');

    // 时间列
    const timeTd = document.createElement('td');
    timeTd.className = 'time-slot';
    timeTd.textContent = time;
    tr.appendChild(timeTd);

    // 周一到周日
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      const dateStr = formatDate(date);

      const td = document.createElement('td');

      // 创建容器
      const container = document.createElement('div');
      container.className = 'visitor-card-container';

      // 获取该日期该时间段的来访者（精确匹配开始时间）
      const slotVisitors = visitors.filter(v =>
        v.date === dateStr && v.startTime === time
      );

      // 添加来访者卡片
      slotVisitors.forEach(v => {
        const card = document.createElement('div');
        card.className = 'visitor-card';
        card.onclick = () => openEditModal(v);

        const genderClass = v.gender === '男' ? 'gender-m' : 'gender-f';
        card.innerHTML = `
          <div class="name">${v.name} <span class="${genderClass}">${v.gender || '女'}</span></div>
          <div class="time">${v.startTime}-${v.endTime}</div>
        `;
        container.appendChild(card);
      });

      td.appendChild(container);

      // 每个单元格都添加添加按钮
      const addBtn = document.createElement('button');
      addBtn.className = 'add-btn';
      addBtn.innerHTML = '+ 添加';
      addBtn.onclick = () => openAddModal(dateStr, time);
      td.appendChild(addBtn);

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}

// 生成时间段
function generateTimeSlots() {
  return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00'];
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

// 打开添加模态框
function openAddModal(date, time = '09:00') {
  document.getElementById('modalTitle').textContent = '添加来访者';
  document.getElementById('visitorId').value = '';
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('date').value = date;
  document.getElementById('startTime').value = time;
  document.getElementById('endTime').value = calculateEndTime(time);
  document.getElementById('genderF').checked = true;
  document.getElementById('deleteBtn').style.display = 'none';
  modal.show();
}

// 打开编辑模态框
function openEditModal(visitor) {
  document.getElementById('modalTitle').textContent = '编辑来访者';
  document.getElementById('visitorId').value = visitor.id;
  document.getElementById('name').value = visitor.name;
  document.getElementById('date').value = visitor.date;
  document.getElementById('startTime').value = visitor.startTime;
  document.getElementById('endTime').value = visitor.endTime;
  document.getElementById('phone').value = visitor.phone;
  document.getElementById('notes').value = visitor.notes;

  if (visitor.gender === '男') {
    document.getElementById('genderM').checked = true;
  } else {
    document.getElementById('genderF').checked = true;
  }

  document.getElementById('deleteBtn').style.display = 'block';
  modal.show();
}

// 检查时间冲突
function hasTimeConflict(excludeId, date, startTime, endTime) {
  return visitors.some(v => {
    if (v.id === excludeId) return false;
    if (v.date !== date) return false;
    // 时间重叠判断：(start1 < end2) && (end1 > start2)
    return v.startTime < endTime && v.endTime > startTime;
  });
}

// 保存来访者
function saveVisitor() {
  const id = document.getElementById('visitorId').value;
  const visitorData = {
    id: id || Date.now().toString(),
    name: document.getElementById('name').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    phone: document.getElementById('phone').value,
    date: document.getElementById('date').value,
    startTime: document.getElementById('startTime').value,
    endTime: document.getElementById('endTime').value,
    notes: document.getElementById('notes').value
  };

  if (!visitorData.name || !visitorData.date || !visitorData.startTime) {
    alert('请填写必填项');
    return;
  }

  // 验证结束时间大于开始时间
  if (visitorData.endTime <= visitorData.startTime) {
    alert('结束时间必须大于开始时间');
    return;
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
  modal.hide();
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
    modal.hide();
    loadVisitors();
    renderSchedule();
  }
}
