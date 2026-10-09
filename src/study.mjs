export const subjects=[{id:'math',name:'数学',short:'数',color:'#47735e',goal:180},{id:'english',name:'英语',short:'英',color:'#9b6742',goal:90},{id:'cs',name:'408',short:'专',color:'#597b9a',goal:180},{id:'politics',name:'政治',short:'政',color:'#917a9c',goal:60}];
export const initialSettings={startDate:'2026-10-09',examDate:'2026-12-19',dailyGoal:510};
export function validDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
export function dateDiff(a,b){return Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);}
export function dayNumber(start,date){return dateDiff(start,date)+1;}
export function remainingDays(date,exam){return Math.max(0,dateDiff(date,exam));}
export function today(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());}
export function shiftDate(date,n){return new Date(Date.parse(date+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);}
export function phase(day){return day<=10?'基础收尾':day<=35?'强化训练':day<=56?'真题突破':'冲刺复盘';}
export function defaultTasks(start,date){const day=dayNumber(start,date);const titles=day<=10?['数学重点章节复习与配套练习','英语真题阅读精读 · 单词复习','计算机组成原理收尾 · 章节练习','政治知识点梳理与选择题']:day<=35?['数学综合题训练 · 整理错题','英语阅读训练 · 长难句分析','408 强化复习 · 专项练习','政治选择题强化']:day<=56?['数学真题限时训练 · 订正','英语真题套卷 · 作文练习','408 真题训练 · 查漏补缺','政治真题与重点梳理']:['数学错题回顾 · 模拟训练','英语作文与阅读复盘','408 高频考点与错题复盘','政治重点背诵 · 模拟题'];
return subjects.map((s,i)=>({id:date+'-'+s.id,date,subject:s.id,title:titles[i],planned:s.goal,done:false}));}

