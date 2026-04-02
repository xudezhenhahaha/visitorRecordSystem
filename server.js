const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据库初始化
const defaultData = {
  visitors: []
};
const file = path.join(__dirname, 'db.json');
const db = new Low(new JSONFile(file), defaultData);

// 读取数据库
db.read();

// 获取所有来访者记录
app.get('/api/visitors', (req, res) => {
  res.json(db.data.visitors);
});

// 按日期范围查询
app.get('/api/visitors/range', (req, res) => {
  const { startDate, endDate } = req.query;
  const visitors = db.data.visitors.filter(v => {
    const date = v.date;
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });
  res.json(visitors);
});

// 创建来访者记录
app.post('/api/visitors', (req, res) => {
  const { name, gender, phone, date, startTime, endTime, notes } = req.body;
  
  if (!name || !date || !startTime) {
    return res.status(400).json({ error: '姓名、日期和开始时间是必填项' });
  }
  
  // 检查时间冲突
  const hasConflict = db.data.visitors.some(v => {
    return v.date === date && 
           v.startTime < endTime && 
           v.endTime > startTime;
  });
  
  if (hasConflict) {
    return res.status(400).json({ error: '该时间段已有预约' });
  }
  
  const newVisitor = {
    id: Date.now().toString(),
    name,
    gender: gender || '',
    phone: phone || '',
    date,
    startTime,
    endTime: endTime || startTime,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  db.data.visitors.push(newVisitor);
  db.write();
  
  res.status(201).json(newVisitor);
});

// 更新来访者记录
app.put('/api/visitors/:id', (req, res) => {
  const { id } = req.params;
  const { name, gender, phone, date, startTime, endTime, notes } = req.body;
  
  const index = db.data.visitors.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '记录不存在' });
  }
  
  // 检查时间冲突（排除自己）
  const hasConflict = db.data.visitors.some(v => {
    return v.id !== id && v.date === date && 
           v.startTime < endTime && 
           v.endTime > startTime;
  });
  
  if (hasConflict) {
    return res.status(400).json({ error: '该时间段已有预约' });
  }
  
  db.data.visitors[index] = {
    ...db.data.visitors[index],
    name,
    gender,
    phone,
    date,
    startTime,
    endTime,
    notes,
    updatedAt: new Date().toISOString()
  };
  
  db.write();
  
  res.json(db.data.visitors[index]);
});

// 删除来访者记录
app.delete('/api/visitors/:id', (req, res) => {
  const { id } = req.params;
  
  const index = db.data.visitors.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: '记录不存在' });
  }
  
  db.data.visitors.splice(index, 1);
  db.write();
  
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
