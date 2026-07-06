"use strict";
const $=s=>document.querySelector(s);
const cv=$("#map"),ctx=cv.getContext("2d");
ctx.imageSmoothingEnabled=false;

/* ================= 部署・役割データ ================= */
const HUBS=[
 {id:"threads",name:"Threads運営部",roof:"#0f766e",url:"index.html",bx:30,by:120,
  roles:[
   {name:"戦略責任者",ai:"軸（ゴール・ペルソナ・比率・トンマナ）を全役割に共有する",human:["最初に一度、軸を入力して保存する","方針が変わったら更新する"]},
   {name:"リサーチ担当",ai:"バズ投稿・競合Note・自分の投稿の分析プロンプトを作る",human:["バズ投稿や競合Noteを見つけて貼り付ける","生成されたプロンプトをClaudeに貼る","分析結果を企画担当に活かす"]},
   {name:"企画担当",ai:"1週間分の投稿企画プロンプトを作る",human:["週の狙い・本数を選んで生成する","Claudeに貼って企画表を受け取る"]},
   {name:"編集担当",ai:"ナレッジ＋ペルソナ入りの投稿作成プロンプトを作る",human:["テーマをナレッジから選ぶ","Claudeに貼って投稿文を受け取る","薬機法を最終確認してThreadsに投稿する"]},
   {name:"マーケ担当",ai:"Note誘導・無料説明会案内の文面プロンプトを作る",human:["段階（網かけ/見極め/売り込み）を選ぶ","生成文をDM・固定投稿に反映する"]},
   {name:"秘書担当",ai:"タスク・見込み客をブラウザ内に記録する",human:["気づいたタスクを登録する","見込み客の反応を記録する","たまにバックアップを保存する"]}
  ]},
 {id:"note",name:"Note編集部",roof:"#1d4e89",url:"note.html",bx:270,by:120,
  roles:[
   {name:"構成担当",ai:"展開順序を再現した章立て・無料/有料ラインを設計する",human:["テーマと価格（480円等）を選ぶ","Claudeに貼って章立てを受け取る"]},
   {name:"執筆担当",ai:"章立てに沿った本文執筆プロンプトを作る",human:["確定した章立てを貼り付ける","Claudeに貼って本文を受け取る"]},
   {name:"セールス担当",ai:"タイトル・引き・購入前の一押し文を設計する",human:["作りたいものを選んで生成する","気に入った案をNoteに反映する"]},
   {name:"校正担当",ai:"薬機法込みの校正プロンプトを作る",human:["書き上がった原稿を貼り付ける","修正案を確認して公開する"]},
   {name:"秘書担当",ai:"記事の進行状況・売上メモを記録する",human:["記事を登録しステータスを更新する","売上をメモする"]}
  ]},
 {id:"seminar",name:"セミナー集客部",roof:"#a24a28",url:"seminar.html",bx:30,by:265,
  roles:[
   {name:"JBMリール担当",ai:"実例の型を踏襲した30秒リール台本を作る",human:["素材とゴールと訴求を選ぶ","Claudeに貼って台本を受け取る","映像編集してリールを投稿する"]},
   {name:"フック診断担当",ai:"弱いフックの原因診断と改善案を出す",human:["気になるフックを貼り付ける","改善案から採用を決める"]},
   {name:"月一セミナー担当",ai:"案内文からストーリーズ構成を作る",human:["冨永さんの案内文を貼る","日程を入力する","生成された構成でストーリーズを作成・投稿する"]},
   {name:"秘書担当",ai:"制作物の進行を記録する",human:["リール・ストーリーズの進捗を更新する"]}
  ]},
 {id:"company",name:"広報・取扱店営業部",roof:"#20242b",url:"company.html",bx:270,by:265,
  roles:[
   {name:"投稿制作担当",ai:"商品データ入りの画像プロンプト＋SEOキャプションを作る",human:["商品とアカウントと訴求を選ぶ","画像プロンプト＋商品写真をChatGPTへ","キャプションプロンプトをClaudeへ","完成品をInstagramに投稿する"]},
   {name:"秘書担当",ai:"どの商品をいつ投稿したか記録する",human:["投稿したら記録する（偏り防止）"]}
  ]},
 {id:"design",name:"デザイン室",roof:"#5b3d8a",url:"note-thumb.html",bx:150,by:40,small:true,
  roles:[
   {name:"サムネ職人",ai:"テーマを選ぶだけでNoteサムネイルを自動生成する",human:["テーマを選び文言を微調整する","PNGをダウンロードしてNoteに設定する","こだわる時はAI画像プロンプトでイラストを作って合成する"]}
  ]}
];
const CEO={id:"ceo",name:"社長室",roof:"#8a5a0d",bx:150,by:335,wide:true};

/* ================= 状態 ================= */
let view="map"; // "map" | hub.id | "ceo"
let hitAreas=[]; // {x,y,w,h,type,payload}

/* ================= ドット絵ヘルパー ================= */
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}

function drawTree(x,y){
  px(x+4,y+10,4,4,"#5a3a1e");
  px(x+1,y+2,10,8,"#256b42");
  px(x+2,y,8,4,"#2e7d4f");
  px(x+3,y+3,3,2,"#3f9b63");
}
function drawFlower(x,y){
  px(x,y,2,2,"#e8b8d0");px(x+3,y+2,2,2,"#f0e0a0");
}
function drawPerson(x,y,color){
  px(x+3,y,6,3,"#3a2a1a");          // 髪
  px(x+3,y+3,6,4,"#f0c8a0");        // 顔
  px(x+2,y+7,8,6,color);            // 体
  px(x+3,y+13,2,3,"#2a2a3a");       // 脚
  px(x+7,y+13,2,3,"#2a2a3a");
}
function drawDesk(x,y){
  px(x,y,26,14,"#8a5f36");
  px(x+1,y+1,24,3,"#a87848");
  px(x+8,y-8,10,8,"#d8e8f0");       // モニター
  px(x+9,y-7,8,6,"#4a7a9a");
  px(x+12,y,2,2,"#5a5a5a");
}

/* ================= 建物描画 ================= */
function drawBuilding(b){
  const w=b.wide?180:(b.small?120:180),h=b.small?70:85;
  const x=b.bx,y=b.by;
  // 影
  px(x+3,y+h,w,5,"rgba(0,0,0,0.18)");
  // 壁
  px(x,y+22,w,h-22,"#f0e6d2");
  px(x,y+22,w,3,"#d8cba8");
  // 屋根
  px(x-5,y,w+10,22,b.roof);
  px(x-5,y+19,w+10,3,"rgba(0,0,0,0.25)");
  // 窓
  const winCount=Math.floor(w/38);
  for(let i=0;i<winCount;i++){
    px(x+12+i*38,y+32,18,14,"#a8d8e8");
    px(x+12+i*38,y+32,18,2,"#7ab8d0");
    px(x+20+i*38,y+32,2,14,"#7ab8d0");
  }
  // ドア
  px(x+w/2-9,y+h-24,18,24,"#7a4a2b");
  px(x+w/2-7,y+h-22,14,20,"#94603a");
  px(x+w/2+3,y+h-13,3,3,"#e8d060");
  // 看板
  ctx.fillStyle="#1f2f24";
  ctx.font="bold 11px 'Hiragino Kaku Gothic ProN',Meiryo,sans-serif";
  ctx.textAlign="center";
  ctx.fillText(b.name,x+w/2,y+h+16);
  ctx.textAlign="left";
  hitAreas.push({x:x-5,y:y,w:w+10,h:h+5,type:"enter",payload:b});
}

/* ================= マップ描画 ================= */
function drawMap(){
  hitAreas=[];
  // 芝生
  for(let y=0;y<400;y+=16)for(let x=0;x<480;x+=16){
    px(x,y,16,16,(x/16+y/16)%2===0?"#8fd18a":"#84c67f");
  }
  // 外周の木
  for(let x=0;x<480;x+=16){drawTree(x,0);drawTree(x,384);}
  for(let y=16;y<384;y+=16){drawTree(0,y);drawTree(464,y);}
  // 道（十字）
  px(224,16,32,368,"#e8d8a8");
  px(16,208,448,32,"#e8d8a8");
  px(224,16,32,2,"#cbb87f");px(224,382,32,2,"#cbb87f");
  // 花
  drawFlower(200,100);drawFlower(300,180);drawFlower(120,320);drawFlower(380,90);drawFlower(90,180);
  // 建物
  HUBS.forEach(drawBuilding);
  // 社長室（下・横長・旗つき）
  drawBuilding(CEO);
  px(CEO.bx+8,CEO.by-26,3,26,"#6a5a3a");
  px(CEO.bx+11,CEO.by-26,14,9,"#c0392b");
  $("#caption").textContent="🏢 建物をクリックすると、中に入れます";
}

/* ================= フロア内部描画 ================= */
function drawInterior(hub){
  hitAreas=[];
  // 床
  for(let y=0;y<400;y+=16)for(let x=0;x<480;x+=16){
    px(x,y,16,16,(x/16+y/16)%2===0?"#e8dcc0":"#e0d2b0");
  }
  // 壁
  px(0,0,480,46,"#c8b890");
  px(0,44,480,4,"#a89468");
  // 窓
  for(let i=0;i<5;i++){px(30+i*90,10,40,24,"#a8d8e8");px(30+i*90,10,40,3,"#88b8c8");}
  // 部署名プレート
  ctx.fillStyle="#4a3a22";
  ctx.font="bold 13px 'Hiragino Kaku Gothic ProN',Meiryo,sans-serif";
  ctx.textAlign="center";
  ctx.fillText(hub.name,240,30);
  ctx.textAlign="left";
  // デスク配置（2列）
  const roleColor=["#0f766e","#1d4e89","#a24a28","#5b3d8a","#8a5a0d","#5f5e56"];
  hub.roles.forEach((r,i)=>{
    const col=i%2,row=Math.floor(i/2);
    const dx=90+col*220,dy=100+row*95;
    drawDesk(dx,dy);
    drawPerson(dx+34,dy-2,roleColor[i%roleColor.length]);
    ctx.fillStyle="#3a3020";
    ctx.font="bold 10px 'Hiragino Kaku Gothic ProN',Meiryo,sans-serif";
    ctx.fillText(r.name,dx-2,dy+28);
    hitAreas.push({x:dx-6,y:dy-14,w:60,h:46,type:"role",payload:{hub,role:r,color:roleColor[i%roleColor.length]}});
  });
  $("#caption").textContent="💺 デスクをクリックすると、業務内容が右に表示されます";
}

/* ================= 社長室描画 ================= */
function drawCEO(){
  hitAreas=[];
  for(let y=0;y<400;y+=16)for(let x=0;x<480;x+=16){
    px(x,y,16,16,(x/16+y/16)%2===0?"#d8c8a8":"#d0bf9c");
  }
  px(0,0,480,46,"#8a5a3a");px(0,44,480,4,"#6a4228");
  px(190,8,100,30,"#a8d8e8");
  ctx.fillStyle="#f8f0e0";
  ctx.font="bold 13px 'Hiragino Kaku Gothic ProN',Meiryo,sans-serif";
  ctx.textAlign="center";
  ctx.fillText("社長室",240,30);
  ctx.textAlign="left";
  // 大きなデスク＋社長
  px(170,180,140,26,"#6a4a2a");
  px(172,182,136,5,"#8a643a");
  px(210,158,22,16,"#d8e8f0");px(212,160,18,12,"#4a7a9a");
  drawPerson(234,132,"#8a5a0d");
  ctx.fillStyle="#3a3020";
  ctx.font="bold 11px 'Hiragino Kaku Gothic ProN',Meiryo,sans-serif";
  ctx.fillText("あなた（社長）",200,230);
  // 観葉植物
  drawTree(30,300);drawTree(430,300);
  $("#caption").textContent="📊 右のパネルに全部署の状況が表示されています";
}

/* ================= localStorage集計（社長室ダッシュボード） ================= */
function readLS(key){
  try{const d=JSON.parse(localStorage.getItem(key));return Array.isArray(d)?d:null;}catch(e){return null;}
}
function ceoSummaryHTML(){
  const notes=readLS("note-articles-v1");
  const semi=readLS("seminar-hub-tasks-v1");
  const logs=readLS("company-hub-logs-v1");
  const rows=[];
  const count=(arr,key)=>{const m={};(arr||[]).forEach(a=>{m[a[key]]=(m[a[key]]||0)+1});return m;};
  if(notes&&notes.length){
    const m=count(notes,"status");
    rows.push(`<div class="stat-row"><span>📝 Note記事</span><b>${notes.length}本（${Object.entries(m).map(([k,v])=>k+v).join("・")}）</b></div>`);
  }else rows.push(`<div class="stat-row"><span>📝 Note記事</span><b>未登録</b></div>`);
  if(semi&&semi.length){
    const m=count(semi,"status");
    rows.push(`<div class="stat-row"><span>🎬 セミナー制作物</span><b>${semi.length}件（${Object.entries(m).map(([k,v])=>k+v).join("・")}）</b></div>`);
  }else rows.push(`<div class="stat-row"><span>🎬 セミナー制作物</span><b>未登録</b></div>`);
  if(logs&&logs.length){
    rows.push(`<div class="stat-row"><span>📷 商品投稿記録</span><b>${logs.length}件</b></div>`);
  }else rows.push(`<div class="stat-row"><span>📷 商品投稿記録</span><b>未登録</b></div>`);
  return rows.join("");
}

/* ================= パネル描画 ================= */
function showHubPanel(hub){
  $("#panel").innerHTML=`
    <h2><span class="dot" style="background:${hub.roof}"></span>${hub.name}</h2>
    <p style="font-size:12.5px;color:#6b604a;margin-top:4px">メンバー：${hub.roles.length}名。デスクをクリックすると、それぞれの業務内容と「社長（あなた）がやること」が見られます。</p>
    <a class="go-btn" href="${hub.url}">この部署のハブを開く →</a>`;
}
function showRolePanel(p){
  const humanList=p.role.human.map(h=>`<li>${h}</li>`).join("");
  $("#panel").innerHTML=`
    <h2><span class="dot" style="background:${p.color}"></span>${p.role.name}<span style="font-size:11px;color:#8a7a5a;font-weight:400">（${p.hub.name}）</span></h2>
    <div class="duty-label">🤖 このメンバー（AI）の仕事</div>
    <p style="font-size:12.5px">${p.role.ai}</p>
    <div class="duty-label">👔 社長（あなた）の仕事</div>
    <ul>${humanList}</ul>
    <a class="go-btn" href="${p.hub.url}">${p.role.name}の席へ行く →</a>`;
}
function showCEOPanel(){
  $("#panel").innerHTML=`
    <h2><span class="dot" style="background:#8a5a0d"></span>社長室：全社サマリー</h2>
    <p style="font-size:12px;color:#6b604a;margin:6px 0 10px">各部署の秘書が記録したデータの集計です（このブラウザ内のデータ）。</p>
    <div class="ceo-stats">${ceoSummaryHTML()}</div>
    <p style="font-size:11.5px;color:#8a7a5a;margin-top:12px">※記録が「未登録」の部署は、各ハブの秘書担当タブから登録すると、ここに反映されます。</p>`;
}

/* ================= クリック処理 ================= */
cv.addEventListener("click",e=>{
  const r=cv.getBoundingClientRect();
  const x=(e.clientX-r.left)*(cv.width/r.width);
  const y=(e.clientY-r.top)*(cv.height/r.height);
  for(const a of hitAreas){
    if(x>=a.x&&x<=a.x+a.w&&y>=a.y&&y<=a.y+a.h){
      if(a.type==="enter"){
        if(a.payload.id==="ceo"){view="ceo";drawCEO();showCEOPanel();}
        else{view=a.payload.id;drawInterior(a.payload);showHubPanel(a.payload);}
        $("#btn-back").classList.add("show");
      }else if(a.type==="role"){
        showRolePanel(a.payload);
      }
      return;
    }
  }
});
$("#btn-back").addEventListener("click",()=>{
  view="map";drawMap();
  $("#btn-back").classList.remove("show");
  $("#panel").innerHTML=`<p class="empty-msg">ここに、クリックした部署・メンバーの情報が表示されます。<br><br>まずはマップ上の建物をクリックしてください。</p>`;
});

/* ================= 初期化 ================= */
drawMap();
