"use strict";
(function(){
const $=s=>document.querySelector(s);
const LS_KEY="ceo-tasks-v1";

/* ハブ名 → マスコット種類・色（ロビーの各タブと統一） */
const HUB_MASCOT={
  threads:{label:"Threads",type:"phone",color:"#2f9e7a"},
  note:{label:"Note",type:"writing",color:"#3a7fd0"},
  seminar:{label:"セミナー集客",type:"camera",color:"#e08a5c"},
  company:{label:"会社・取扱店",type:"camera",color:"#3a6fc7"},
  thumb:{label:"サムネイル",type:"drawing",color:"#3a4a7a"},
  other:{label:"その他",type:"typing",color:"#8a8676"}
};

/* ================= データ ================= */
function loadTasks(){
  try{const d=JSON.parse(localStorage.getItem(LS_KEY));return Array.isArray(d)?d:[];}catch(e){return [];}
}
function saveTasks(tasks){
  try{localStorage.setItem(LS_KEY,JSON.stringify(tasks));}catch(e){}
}
let tasks=loadTasks();
let currentView="week";

/* ================= 日付ヘルパー ================= */
function todayStr(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function fmtYMD(d){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function startOfWeek(base){
  const d=new Date(base);
  const day=d.getDay(); // 0=日
  const diff=(day===0?-6:1-day); // 月曜始まり
  d.setDate(d.getDate()+diff);
  return d;
}
const WEEKDAY_LABEL=["日","月","火","水","木","金","土"];
const WEEKDAY_MON_LABEL=["月","火","水","木","金","土","日"];

/* ================= 追加 ================= */
$("#ceo-add-btn").addEventListener("click",()=>{
  const title=$("#ceo-title").value.trim();
  const date=$("#ceo-date").value;
  const type=$("#ceo-type").value;
  if(!title){alert("「やること」を入力してください");return;}
  if(!date){alert("日付を選んでください");return;}
  if(!type){alert("担当部署を選んでください");return;}
  tasks.push({id:Date.now()+Math.random().toString(16).slice(2),title,date,type,done:false});
  saveTasks(tasks);
  $("#ceo-title").value="";
  $("#ceo-type").value="";
  render();
});
let isComposingIME=false;
$("#ceo-title").addEventListener("compositionstart",()=>{isComposingIME=true;});
$("#ceo-title").addEventListener("compositionend",()=>{isComposingIME=false;});
$("#ceo-title").addEventListener("keydown",e=>{
  if(e.key==="Enter" && !isComposingIME && !e.isComposing && e.keyCode!==229){
    $("#ceo-add-btn").click();
  }
});

/* 日付初期値は今日 */
$("#ceo-date").value=todayStr();

/* ================= 表示切り替え ================= */
$("#ceo-view-week").addEventListener("click",()=>{currentView="week";updateToggle();render();});
$("#ceo-view-month").addEventListener("click",()=>{currentView="month";updateToggle();render();});
function updateToggle(){
  $("#ceo-view-week").classList.toggle("on",currentView==="week");
  $("#ceo-view-month").classList.toggle("on",currentView==="month");
}

/* ================= タスク行の生成 ================= */
function taskRowHTML(t){
  const overdue=(!t.done && t.date<todayStr());
  const hub=HUB_MASCOT[t.type]||HUB_MASCOT.other;
  const options=Object.keys(HUB_MASCOT).map(k=>`<option value="${k}" ${k===t.type?"selected":""}>${HUB_MASCOT[k].label}</option>`).join("");
  return `<div class="task-row ${t.done?"done":""}" data-id="${t.id}">
    <canvas class="t-mascot" width="26" height="26"></canvas>
    <select class="t-hub-select" data-id="${t.id}" style="color:${hub.color}">${options}</select>
    <span class="t-title ${overdue?"overdue":""}">${esc(t.title)}</span>
    <button class="t-check" data-id="${t.id}" aria-label="完了にする">${t.done?"✓":""}<span class="star-pop">★</span></button>
    <button class="t-del" data-id="${t.id}" aria-label="削除">✕</button>
  </div>`;
}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

function paintMascots(container){
  container.querySelectorAll(".task-row").forEach(row=>{
    const id=row.dataset.id;
    const t=tasks.find(x=>x.id===id);
    if(!t)return;
    const hub=HUB_MASCOT[t.type]||HUB_MASCOT.other;
    const cv=row.querySelector(".t-mascot");
    if(cv&&window.drawMascot)drawMascot(cv,hub.type,hub.color);
  });
  container.querySelectorAll(".s-mascot").forEach(cv=>{
    const key=cv.dataset.hubkey;
    const hub=HUB_MASCOT[key];
    if(hub&&window.drawMascot)drawMascot(cv,hub.type,hub.color);
  });
}

/* canvas要素を直接受け取れるようdrawMascotのラッパー互換対応 */
const _origDrawMascot=window.drawMascot;
function drawMascotCompat(target,type,color){
  if(typeof target==="string"){_origDrawMascot&&_origDrawMascot(target,type,color);return;}
  // 要素が直接渡された場合、一時的にidを振って既存関数を呼ぶ
  if(!target.id)target.id="mascot-tmp-"+Math.random().toString(16).slice(2);
  _origDrawMascot&&_origDrawMascot(target.id,type,color);
}
window.drawMascot=drawMascotCompat;

/* ================= 週間ビュー ================= */
function renderWeek(){
  const monday=startOfWeek(new Date());
  const days=[...Array(7)].map((_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return d;});
  const today=todayStr();
  let html=`<div class="week-grid">`;
  days.forEach(d=>{
    const ymd=fmtYMD(d);
    const isToday=ymd===today;
    const dayTasks=tasks.filter(t=>t.date===ymd).sort((a,b)=>a.done-b.done);
    html+=`<div class="day-col ${isToday?"today":""}">
      <div class="day-head"><span>${d.getMonth()+1}/${d.getDate()}（${WEEKDAY_LABEL[d.getDay()]}）</span>${isToday?"<span>今日</span>":""}</div>
      <div class="day-tasks">${dayTasks.length?dayTasks.map(taskRowHTML).join(""):'<p class="empty-day">予定なし</p>'}</div>
    </div>`;
  });
  html+=`</div>`;
  return html;
}

/* ================= 月間ビュー ================= */
/* ================= 今月の実績サマリー ================= */
function renderMonthStats(monthTasks){
  const done=monthTasks.filter(t=>t.done);
  const totalCount=done.length;
  const byHub={};
  Object.keys(HUB_MASCOT).forEach(k=>byHub[k]=0);
  done.forEach(t=>{byHub[t.type]=(byHub[t.type]||0)+1;});
  const maxCount=Math.max(1,...Object.values(byHub));

  let rows="";
  Object.keys(HUB_MASCOT).forEach(key=>{
    const count=byHub[key]||0;
    if(count===0)return; // 実績ゼロの部署は表示しない（見た目をすっきりさせる）
    const hub=HUB_MASCOT[key];
    const widthPct=Math.round((count/maxCount)*100);
    rows+=`<div class="stats-row">
      <canvas class="s-mascot" data-hubkey="${key}" width="22" height="22"></canvas>
      <span class="s-label">${hub.label}</span>
      <div class="s-bar-wrap"><div class="s-bar" style="width:${widthPct}%;background:${hub.color}"></div></div>
      <span class="s-count">${count}件</span>
    </div>`;
  });
  if(!rows)rows=`<p class="stats-empty">まだ実行済みのタスクがありません。達成したらここに積み上がっていきます。</p>`;

  return `<div class="stats-card">
    <div class="stats-head">
      <h4>📊 今月の実績</h4>
      <span class="stats-total"><b>${totalCount}</b>件 完了</span>
    </div>
    <div class="stats-bars">${rows}</div>
  </div>`;
}

/* ================= 月間ビュー ================= */
function renderMonth(){
  const now=new Date();
  const y=now.getFullYear(),m=now.getMonth();
  const monthTasks=tasks.filter(t=>{
    const td=new Date(t.date+"T00:00:00");
    return td.getFullYear()===y&&td.getMonth()===m;
  });

  const statsHTML=renderMonthStats(monthTasks);
  const today=todayStr();

  /* カレンダーの表示範囲を計算（月曜始まり、前後の月の日もマス目埋めのため表示） */
  const firstOfMonth=new Date(y,m,1);
  const lastOfMonth=new Date(y,m+1,0);
  const gridStart=startOfWeek(firstOfMonth);
  const gridEndBase=startOfWeek(lastOfMonth);
  const gridEnd=new Date(gridEndBase);gridEnd.setDate(gridEndBase.getDate()+6);

  let html=statsHTML;
  html+=`<div class="cal-grid">`;
  WEEKDAY_MON_LABEL.forEach(w=>html+=`<div class="cal-weekday">${w}</div>`);

  const cursor=new Date(gridStart);
  while(cursor<=gridEnd){
    const ymd=fmtYMD(cursor);
    const inMonth=cursor.getMonth()===m;
    const isToday=ymd===today;
    const dayTasks=tasks.filter(t=>t.date===ymd).sort((a,b)=>a.done-b.done);

    let chips="";
    dayTasks.forEach(t=>{
      const hub=HUB_MASCOT[t.type]||HUB_MASCOT.other;
      chips+=`<div class="cal-chip ${t.done?"done":""}" data-id="${t.id}" title="${esc(t.title)}"><span class="dot" style="background:${hub.color}"></span><span class="check-mark">${t.done?"✓":""}</span>${esc(t.title)}</div>`;
    });

    html+=`<div class="cal-cell ${inMonth?"":"other-month"} ${isToday?"today":""}">
      <div class="cal-cell-head"><span class="cal-daynum">${cursor.getDate()}</span><button class="cal-add-btn" data-date="${ymd}" aria-label="この日にタスクを追加">＋</button></div>
      <div class="cal-tasks">${chips}</div>
    </div>`;
    cursor.setDate(cursor.getDate()+1);
  }
  html+=`</div>`;
  return html;
}

/* ================= 全体描画 ================= */
function render(){
  const area=$("#ceo-view-area");
  area.innerHTML=currentView==="week"?renderWeek():renderMonth();
  paintMascots(area);

  /* カレンダー：＋ボタンで日付をセットして入力欄にフォーカス */
  area.querySelectorAll(".cal-add-btn").forEach(b=>b.addEventListener("click",()=>{
    $("#ceo-date").value=b.dataset.date;
    $("#ceo-title").focus();
    $("#ceo-title").scrollIntoView({behavior:"smooth",block:"center"});
  }));
  /* カレンダー：タスクのチップをクリックで完了トグル */
  area.querySelectorAll(".cal-chip[data-id]").forEach(chip=>chip.addEventListener("click",()=>{
    const id=chip.dataset.id;
    const t=tasks.find(x=>x.id===id);
    if(!t)return;
    t.done=!t.done;
    saveTasks(tasks);
    render();
  }));

  area.querySelectorAll(".t-check").forEach(b=>b.addEventListener("click",()=>{
    const id=b.dataset.id;
    const t=tasks.find(x=>x.id===id);
    if(!t)return;
    const willDone=!t.done;
    t.done=willDone;
    saveTasks(tasks);
    if(willDone){
      const star=b.querySelector(".star-pop");
      const row=b.closest(".task-row");
      row.classList.add("done");
      b.textContent="✓";
      const s=document.createElement("span");
      s.className="star-pop go";s.textContent="★";
      b.appendChild(s);
      setTimeout(render,650);
    }else{
      render();
    }
  }));
  area.querySelectorAll(".t-del").forEach(b=>b.addEventListener("click",()=>{
    const id=b.dataset.id;
    tasks=tasks.filter(x=>x.id!==id);
    saveTasks(tasks);
    render();
  }));
  area.querySelectorAll(".t-hub-select").forEach(sel=>sel.addEventListener("change",()=>{
    const id=sel.dataset.id;
    const t=tasks.find(x=>x.id===id);
    if(!t)return;
    t.type=sel.value;
    saveTasks(tasks);
    render();
  }));
}

window.renderCeoTasks=render;
render();
})();
