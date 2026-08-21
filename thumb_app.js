"use strict";
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ================= 14テーマ分のプリセット文言（knowledge_summary.mdの数値・フレーズから作成） ================= */
const THUMB_PRESETS={
theme01:{main:["あなたの腰痛はなぜ繰り返すのか","その腰痛、原因は足かもしれない","揉んでも戻る腰痛の正体"],sub:["誰も教えてくれない本当の理由","1日5,000回の見えない負担","マッサージで治らないワケ"],badge:["腰痛は足が原因だった","放置すると骨棘のリスク","体幹が入らない本当の理由"],bullets:["座りっぱなしで体幹が使えない","骨盤がグネグネ動いてしまう","負担が腰に蓄積していく","マッサージでは根本改善しない"]},
theme02:{main:["その外反母趾、まだ間に合うか","毎日見ても気づかない足の変形","パンプスを諦める前に"],sub:["進行すると筋肉が裏切り出す","15度を超えたら要注意","元に戻らなくなる前に"],badge:["早期発見がすべて","筋肉の役割が逆転する","靴と靴下の選び方"],bullets:["厚底靴・パンプスで指が使えない","脳が指の存在を忘れていく","筋肉の役割が裏切り始める","15度を超えると進行が加速"]},
theme03:{main:["あなたの足裏の痛みはなぜ治らないのか","朝の一歩目が激痛になる理由","夜治して朝壊すループ"],sub:["誰も教えてくれない本当の理由","3ヶ月〜3年続く悪循環の正体","湿布では組織は戻らない"],badge:["足底筋膜炎の唯一の必勝法","昼と夜の二刀流ケア","女性は男性の2.5倍"],bullets:["睡眠中に足底筋膜が短縮する","起床時に急に伸ばされ再断裂","湿布では組織は元に戻らない","女性は男性の2.5倍発症しやすい"]},
theme04:{main:["立ってるだけで疲れる本当の理由","あなたの足指、浮いていませんか","使われない指は衰える"],sub:["紙1枚で分かる浮き指チェック","足指は地面のセンサー","猫背・疲れやすさの隠れ原因"],badge:["浮き指は全身に連鎖する","休止した指を呼び覚ます","子どもの8割に浮き指"],bullets:["柔らかい靴・サンダルで指が休止","地面からの情報が届かなくなる","バランス反応が全身で崩れる","子どもの8割に浮き指の兆候"]},
theme05:{main:["何をしても脚が痩せない理由","ふくらはぎの外張りの正体","その脚の形、生まれつきじゃない"],sub:["ダイエットでは変わらない構造","黄金比率2:3:5から遠ざかる歩き","摩擦が脂肪を作るメカニズム"],badge:["美脚は足元から作られる","内側ホイップに注意","構造を変えれば脚が変わる"],bullets:["MTP関節が硬いと歩きが崩れる","内側ホイップという歩行のクセ","脛骨が外旋しふくらはぎが張る","ダイエットでは変わらない構造"]},
theme06:{main:["8時間立っても疲れない足がある","仕事終わりの棒のような足に","その疲れ、靴のせいかも"],sub:["ふくらはぎ3層構造の使い方","深層筋という省エネエンジン","柔らかい靴が疲れを作る"],badge:["立ち仕事の職業病を防ぐ","筋肉は第二の心臓","足裏の全面接地がカギ"],bullets:["表層筋ばかり使い疲労が蓄積","深層筋のポンプが働いていない","毛細血管の循環が悪化する","足裏の全面接地が疲れを防ぐ"]},
theme07:{main:["つまずく前にできることがある","その一歩の遅れが命取りに","転倒は突然やってこない"],sub:["歩行速度・時速2.88kmの警告ライン","10mを10秒で歩けますか","足指の握力とバランスの関係"],badge:["転ぶなら前に、が鉄則","足は体表面積のわずか2%","つまずきは防げる"],bullets:["浮き指で足指の握力が低下","地面からの情報が届きにくい","バランス反応が遅れてしまう","時速2.88kmが転倒リスクの境界"]},
theme08:{main:["夕方のパンパン足とサヨナラ","そのむくみ、水の飲みすぎじゃない","靴がきつくなる夕方の正体"],sub:["1日20リットルの回収が滞る時","あなたの歩きはヤクルトかオロナミンCか","ポンプを動かせば足は変わる"],badge:["むくみは体からのサイン","筋肉ポンプを目覚めさせる","リンパは3つの力で上がる"],bullets:["筋肉ポンプがうまく働いていない","静脈・リンパの回収が滞る","1日20Lの体液が滞留してしまう","ポンプを動かせば夕方も変わる"]},
theme09:{main:["偏平足、諦めるのはまだ早い","土踏まずがない本当のリスク","その疲れやすさ、足の形から"],sub:["13歳までが勝負の理由","大人は\u201c眼鏡\u201dで補えばいい","アーチは潰れるように出来ている"],badge:["偏平足が引き起こす連鎖","ニーインは膝を壊す","子どもの4割が偏平足"],bullets:["靭帯が緩み土踏まずが潰れる","ニーインポジションが生まれる","膝への負担が徐々に増加する","子どもの4割に偏平足の兆候"]},
theme10:{main:["その靴、子どもの足を壊すかも","子どもの靴選びは親の責任","デザインで選ぶと後悔する"],sub:["18歳で足の形は決まる","曲がらない靴は一発アウト","厚底は18歳以下NG"],badge:["選んではいけない子供の靴","足の骨は軟骨から育つ","7歳からのインソール"],bullets:["大人用の靴を縮小しただけの靴","MTP関節が曲がらず育たない","足の骨化が正しく進まない","18歳までに足の形が決まる"]},
theme11:{main:["猫背の原因、実は足指だった","姿勢を意識しても治らない理由","隠れ浮き指、3割の衝撃"],sub:["歩行時だけ浮く指がある","意識では姿勢は変わらない","足元から姿勢は連鎖する"],badge:["足指と姿勢の意外な関係","紙1枚でセルフチェック","エコな立ち方の落とし穴"],bullets:["歩行時だけ指が浮く人が3割","地面の情報を足指が拾えない","体幹が支えられず姿勢が崩れる","意識するだけでは変わらない"]},
theme12:{main:["その膝痛、軟骨のせいじゃない","階段が怖くなる前に","膝は被害者の関節だった"],sub:["痛みの7〜8割は擦り潰しが原因","年間260万歩の蓄積ダメージ","体重の6〜7倍が膝にかかる"],badge:["膝痛の本当の原因","ねじれが膝を壊す","足元から膝を守る"],bullets:["足元の崩れが膝に伝わっていく","脛骨がねじれ膝蓋骨がずれる","軟部組織が擦り潰されていく","体重の6〜7倍が膝にかかる"]},
theme13:{main:["脚の付け根の痛み、放置は危険","股関節痛は突然ドーンと来る","その違和感、体からのサイン"],sub:["騙し騙しが効かない関節","鼠径部の痛みは要注意","骨頭が前に飛び出す仕組み"],badge:["足と股関節の深い関係","反り腰は防衛反応かも","お尻と体幹はセット"],bullets:["骨盤の後傾・スマホ姿勢が原因","大腿骨頭が前方へ移動する","お尻の筋肉が反応しなくなる","違和感を放置すると悪化する"]},
theme14:{main:["「また捻挫した」を終わらせる","捻挫グセの正体を知っていますか","昔の捻挫が今も足首に残る"],sub:["トマトケチャップ現象という癒着","失われたセンサーの取り戻し方","繰り返す悪循環の断ち切り方"],badge:["捻挫はやばい、が結論","足首安定化の秘密兵器","腱あぶみが崩れる前に"],bullets:["靭帯損傷後に内出血が癒着する","パチニ小体の機能が低下する","足首のセンサーが働かなくなる","捻挫を繰り返す悪循環に陥る"]}
};

/* ================= 状態 ================= */
let currentTheme=null;
let uploadedImg=null;

/* ================= テーマ選択肢の構築 ================= */
KNOWLEDGE_THEMES.forEach(t=>{
  const o=document.createElement("option");
  o.value=t.id;o.textContent=t.title;
  $("#theme-select").appendChild(o);
});

$("#theme-select").addEventListener("change",()=>{
  const id=$("#theme-select").value;
  currentTheme=id||null;
  renderPersona(id);
  if(id){
    const p=THUMB_PRESETS[id];
    $("#main-title").value=p?p.main[0]:"";
    $("#sub-title").value=p?p.sub[0]:"";
    $("#badge-text").value=p?p.badge[0]:"";
    setBullets(p?p.bullets.slice(0,4):[]);
  }
  draw();
});

function renderPersona(id){
  const box=$("#persona-box");
  const p=(id&&typeof PERSONAS!=="undefined")?PERSONAS[id]:null;
  if(!p){box.classList.remove("show");return;}
  box.innerHTML=`<b>想定読者：</b>${p.general.name}<br>${p.general.situation}<br><b>狙う心理：</b>${p.general.future}`;
  box.classList.add("show");
}

["main-title","sub-title","badge-text"].forEach(id=>{
  $("#"+id).addEventListener("input",draw);
});

/* ================= 箇条書き項目（動的入力欄） ================= */
function renderBulletInputs(values){
  const wrap=$("#bullet-list");
  wrap.innerHTML="";
  values.forEach((v,i)=>{
    const row=document.createElement("div");
    row.className="bullet-row";
    const input=document.createElement("input");
    input.value=v;
    input.placeholder=`箇条書き${i+1}（例：座りっぱなしで体幹が使えない）`;
    input.dataset.idx=i;
    row.appendChild(input);
    const del=document.createElement("button");
    del.type="button";del.className="btn small";del.textContent="✕";
    del.addEventListener("click",()=>{
      const cur=getBullets();
      cur.splice(i,1);
      renderBulletInputs(cur);
    });
    row.appendChild(del);
    wrap.appendChild(row);
  });
}
function getBullets(){
  return [...$("#bullet-list").querySelectorAll("input")].map(i=>i.value.trim()).filter(Boolean);
}
function setBullets(values){
  renderBulletInputs(values.length?values:["","",""]);
}
$("#btn-add-bullet").addEventListener("click",()=>{
  const cur=getBullets();
  if(cur.length>=5){alert("箇条書きは5個までです");return;}
  cur.push("");
  renderBulletInputs(cur);
});
// 初期表示は空欄3つ
setBullets([]);

/* ================= イラストアップロード ================= */
$("#upload-zone").addEventListener("click",()=>$("#img-input").click());
$("#img-input").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const img=new Image();
  img.onload=()=>{uploadedImg=img;$("#btn-clear-img").style.display="inline-block";draw();};
  img.src=URL.createObjectURL(f);
  e.target.value="";
});
$("#btn-clear-img").addEventListener("click",()=>{
  uploadedImg=null;
  $("#btn-clear-img").style.display="none";
  draw();
});

/* ================= Canvas描画（基準デザイン固定・変更なし） ================= */
const cv=$("#thumb-canvas"),ctx=cv.getContext("2d");
const W=1280,H=670;

function draw(){
  const isDark=bgTone==="dark";
  const COL={
    bg1:isDark?"#141b2e":"#eef1f5",
    bg2:isDark?"#0d1220":"#e7ebf1",
    grid:isDark?"rgba(255,255,255,0.06)":"rgba(30,42,74,0.07)",
    accent:isDark?"#e8681a":"#1e2a4a",
    title:isDark?"#ffffff":"#1e2a4a",
    sub:"#e8681a",
    chainBox:isDark?"#1e2a4a":"#ffffff",
    chainBoxBorder:isDark?"#3a4a6a":"#1e2a4a",
    chainText:isDark?"#ffffff":"#1e2a4a",
    chainArrow:isDark?"#e8681a":"#e8681a"
  };

  /* --- 背景 --- */
  ctx.clearRect(0,0,W,H);
  const bgGrad=ctx.createLinearGradient(0,0,W,H);
  bgGrad.addColorStop(0,COL.bg1);
  bgGrad.addColorStop(1,COL.bg2);
  ctx.fillStyle=bgGrad;
  ctx.fillRect(0,0,W,H);

  ctx.strokeStyle=COL.grid;
  ctx.lineWidth=1;
  const grid=76;
  for(let x=grid;x<W;x+=grid){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=grid;y<H;y+=grid){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  /* --- 左端アクセント縦線 --- */
  ctx.fillStyle=COL.accent;
  ctx.fillRect(34,30,5,H-60);

  /* --- 因果連鎖図 or イラスト（右側配置。連鎖図がONならそちら優先） --- */
  const chainOn=document.getElementById("chain-toggle")?.checked;
  const hasImg=!!uploadedImg;
  const showChain=chainOn&&currentTheme&&CHAIN_PRESETS[currentTheme];

  if(showChain){
    drawChainDiagram(CHAIN_PRESETS[currentTheme],COL);
  }else if(hasImg){
    const areaX=W*0.52,areaW=W-areaX-20,areaY=20,areaH=H-40;
    const r=Math.min(areaW/uploadedImg.width,areaH/uploadedImg.height);
    const dw=uploadedImg.width*r,dh=uploadedImg.height*r;
    const dx=areaX+(areaW-dw)/2,dy=areaY+(areaH-dh)/2;
    ctx.globalAlpha=0.96;
    ctx.drawImage(uploadedImg,dx,dy,dw,dh);
    ctx.globalAlpha=1;
  }

  /* --- テキスト描画エリア --- */
  const textX=76;
  const maxW=(hasImg||showChain)?W*0.46:W*0.80;

  const main=$("#main-title").value.trim();
  const sub=$("#sub-title").value.trim();
  const badge=$("#badge-text").value.trim();

  let y=150;

  /* メインタイトル：自動改行＋自動サイズ */
  if(main){
    let size=88;
    ctx.textBaseline="alphabetic";
    let lines=wrapText(main,maxW,size);
    while(lines.length>3&&size>54){size-=6;lines=wrapText(main,maxW,size);}
    ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
    ctx.fillStyle=COL.title;
    lines.forEach(line=>{
      ctx.fillText(line,textX,y);
      y+=size*1.22;
    });
    y+=18;
  }

  /* サブタイトル：オレンジ */
  if(sub){
    let size=42;
    ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
    while(ctx.measureText(sub).width>maxW&&size>26){
      size-=2;
      ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
    }
    ctx.fillStyle=COL.sub;
    ctx.fillText(sub,textX,y);
    y+=size*0.6+46;
  }

  /* バッジ：オレンジ角丸＋白文字 */
  if(badge){
    let size=34;
    ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
    let tw=ctx.measureText(badge).width;
    while(tw>maxW-60&&size>22){
      size-=2;
      ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
      tw=ctx.measureText(badge).width;
    }
    const padX=30,bh=size+34;
    const bw=tw+padX*2;
    const by=y-size;
    roundRect(textX,by-17,bw,bh,bh/2);
    ctx.fillStyle=COL.sub;
    ctx.fill();
    ctx.fillStyle="#fff";
    ctx.fillText(badge,textX+padX,by+size-14);
  }
}

/* ================= 因果連鎖図の描画（箱＋矢印・AI不使用で安定生成） ================= */
function drawChainDiagram(steps,COL){
  const areaX=W*0.52,areaW=W-areaX-40;
  const boxH=88,gapY=26;
  const totalH=steps.length*boxH+(steps.length-1)*gapY;
  let startY=(H-totalH)/2;
  const boxW=areaW;

  steps.forEach((text,i)=>{
    const by=startY+i*(boxH+gapY);
    const bx=areaX;

    /* 矢印（2つ目以降） */
    if(i>0){
      const ay1=by-gapY,ay2=by;
      const ax=bx+boxW/2;
      ctx.strokeStyle=COL.chainArrow;
      ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(ax,ay1+2);ctx.lineTo(ax,ay2-4);ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax-9,ay2-14);ctx.lineTo(ax,ay2-2);ctx.lineTo(ax+9,ay2-14);
      ctx.strokeStyle=COL.chainArrow;ctx.lineWidth=4;ctx.lineJoin="round";ctx.stroke();
    }

    /* 箱 */
    ctx.fillStyle=i===steps.length-1?COL.chainArrow:COL.chainBox;
    roundRect(bx,by,boxW,boxH,12);
    ctx.fill();
    ctx.strokeStyle=i===steps.length-1?COL.chainArrow:COL.chainBoxBorder;
    ctx.lineWidth=2.5;
    roundRect(bx,by,boxW,boxH,12);
    ctx.stroke();

    /* テキスト（自動改行対応・中央揃え） */
    let size=25;
    ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
    const innerW=boxW-36;
    let lines=wrapText(text,innerW,size);
    while(lines.length>2&&size>17){size-=2;ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;lines=wrapText(text,innerW,size);}
    ctx.fillStyle=i===steps.length-1?"#ffffff":COL.chainText;
    ctx.textAlign="center";
    const lineH=size*1.3;
    const blockH=lines.length*lineH;
    let ty=by+boxH/2-blockH/2+size*0.85;
    lines.forEach(line=>{ctx.fillText(line,bx+boxW/2,ty);ty+=lineH;});
    ctx.textAlign="left";
  });
}

function wrapText(text,maxW,size){
  ctx.font=`bold ${size}px "Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif`;
  const lines=[];let line="";
  for(const ch of text){
    if(ch==="\n"){lines.push(line);line="";continue;}
    if(ctx.measureText(line+ch).width>maxW&&line){lines.push(line);line=ch;}
    else line+=ch;
  }
  if(line)lines.push(line);
  return lines;
}
function roundRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

/* ================= ダウンロード ================= */
$("#btn-download").addEventListener("click",()=>{
  if(!$("#main-title").value.trim()){alert("テーマを選ぶか、メインタイトルを入力してください");return;}
  const a=document.createElement("a");
  a.download="note-thumbnail_"+new Date().toISOString().slice(0,10)+".png";
  a.href=cv.toDataURL("image/png");
  a.click();
});

/* ================= 記事本文から見出し案を作るプロンプト生成 ================= */
$("#btn-gen-headline").addEventListener("click",()=>{
  const articleText=$("#article-text").value.trim();
  if(!articleText){alert("記事の本文を貼り付けてください");return;}
  const t=currentTheme?KNOWLEDGE_THEMES.find(x=>x.id===currentTheme):null;

  const p=`あなたはNoteサムネイルのアートディレクターです。以下は、すでに公開済みのNote記事の本文です。この実際の内容から、サムネイル用の見出し案を作成してください。

■ 公開済み記事の本文
${articleText}

■ 基準デザイン（このサムネイルメーカーの仕様）
- 濃紺の太字メインタイトル・一部を赤字で強調・統計数字の帯（濃紺背景に黄色文字）・オレンジのサブタイトル・オレンジ角丸バッジ・アイコン付き箇条書き（3〜5個）という構成
- メインタイトルは2〜3行までの範囲で自動改行される
- 記事に登場する具体的な数字（統計・件数等）があれば、それも別途教えてください（帯として使います）
- 箇条書きは、記事の要点・見出しを1項目10〜15字程度に圧縮したもの（3〜5個）

■ 作成ルール（最重要）
- 上記の本文を実際に読み、記事内に登場する具体的な言い回し・エピソード・数字から見出しを作ること
- 抽象的な要約ではなく、記事に実際に書かれている「印象的な一文・具体的な表現」をそのまま核にすること
- メインタイトル：一瞬で「え、自分のことだ」と思わせる、核心を突く短いフレーズ
- サブタイトル：メインタイトルを補足する、やや短めの一文
- バッジ：「このNoteでわかること」を一言で示す短い文言
- 箇条書き：記事内の見出し・小見出し・要点から、実際に書かれている内容をもとに3〜5個抽出（創作しないこと）
${t?`- このテーマの参考情報：${t.title}`:""}

【出力形式】
以下の項目を、それぞれ1行ずつ、そのままコピーできる形で出力してください。箇条書きは記事の内容に応じて3〜5行で構いません。
メインタイトル：（ここに）
サブタイトル：（ここに）
バッジ：（ここに）
統計・数字（あれば）：（ここに、無ければ「なし」）
箇条書き1：（ここに）
箇条書き2：（ここに）
箇条書き3：（ここに）
箇条書き4：（あれば。無ければ省略）
箇条書き5：（あれば。無ければ省略）`;

  $("#out-headline").textContent=p;
  $("#out-headline").classList.remove("empty");
  $("#headline-prompt-wrap").style.display="block";
});
$("#btn-copy-headline").addEventListener("click",async()=>{
  const out=$("#out-headline");
  if(!out.textContent.trim()){alert("先にプロンプトを生成してください");return;}
  try{await navigator.clipboard.writeText(out.textContent);}
  catch(e){
    const rg=document.createRange();rg.selectNodeContents(out);
    const sel=getSelection();sel.removeAllRanges();sel.addRange(rg);
    document.execCommand("copy");sel.removeAllRanges();
  }
  const b=$("#btn-copy-headline");
  const original=b.textContent;
  b.textContent="コピーしました ✓";b.classList.add("ok");
  setTimeout(()=>{b.textContent=original;b.classList.remove("ok");},1800);
});

/* Claudeの回答（メインタイトル：〜／サブタイトル：〜／バッジ：〜／統計・数字：〜／箇条書き1〜5：〜）を
   パースして、下の入力欄に自動で流し込む */
$("#btn-apply-headline").addEventListener("click",()=>{
  const reply=$("#headline-reply").value.trim();
  if(!reply){alert("Claudeの回答を貼り付けてください");return;}

  const pick=(label)=>{
    const re=new RegExp(label+"[：:]\\s*(.+)");
    const m=reply.match(re);
    return m?m[1].trim():"";
  };

  const main=pick("メインタイトル");
  const sub=pick("サブタイトル");
  const badge=pick("バッジ");
  let stat=pick("統計・数字")||pick("統計")||pick("数字");
  if(stat==="なし")stat="";

  const bullets=[];
  for(let i=1;i<=5;i++){
    const b=pick(`箇条書き${i}`);
    if(b&&b!=="なし"&&!/^省略$/.test(b))bullets.push(b);
  }

  let filled=0;
  if(main){$("#main-title").value=main;filled++;}
  if(sub){$("#sub-title").value=sub;filled++;}
  if(badge){$("#badge-text").value=badge;filled++;}
  if(stat){$("#thumb-stat").value=stat;filled++;}
  if(bullets.length){setBullets(bullets);filled+=bullets.length;}

  if(filled===0){
    alert("回答から項目を読み取れませんでした。「メインタイトル：」のような形式で書かれているか確認してください。");
    return;
  }

  const b=$("#btn-apply-headline");
  const original=b.textContent;
  b.textContent=`反映しました（${filled}項目）✓`;
  b.classList.add("ok");
  setTimeout(()=>{b.textContent=original;b.classList.remove("ok");},2200);

  // 反映した箇所まで自動スクロール
  $("#main-title").scrollIntoView({behavior:"smooth",block:"center"});
  draw();
});

/* ================= AI画像プロンプト生成 ================= */
$("#btn-gen-prompt").addEventListener("click",()=>{
  if(!currentTheme){alert("先にテーマを選んでください");return;}
  const t=KNOWLEDGE_THEMES.find(x=>x.id===currentTheme);
  const p=(typeof PERSONAS!=="undefined")?PERSONAS[currentTheme]:null;
  const preset=THUMB_PRESETS[currentTheme];
  const main=$("#main-title").value.trim()||preset.main[0];
  const stat=$("#thumb-stat").value.trim();
  const sub=$("#sub-title").value.trim()||preset.sub[0];
  const badge=$("#badge-text").value.trim()||preset.badge[0];
  const bullets=getBullets().length?getBullets():(preset.bullets||[]).slice(0,4);
  const bulletsText=bullets.map((b,i)=>`${i+1}. ${b}`).join("\n");
  // 帯に表示する文言：統計数字があればそれを優先、無ければサブタイトルで代替（帯を必ず表示するため）
  const bandText=stat||sub;
  const bandHasNumber=/[0-9０-９]/.test(bandText);

  /* ---- ①企画メモ（コンセプト・タイトル案・視認性チェック。参考資料であり、AIに渡さない） ---- */
  const conceptText=`【テーマ】
${t.title}

【基準デザイン（全テーマ共通・必ず踏襲）】
- 白〜薄いグレーの背景
- 左側にテキストエリア：濃紺の太字メインタイトル（一部の重要語のみ赤字で強調）、統計数字の帯（濃紺背景×黄色文字）、オレンジのサブタイトル、アイコン付き箇条書き（3〜5個）
- 右側に実写真（または人物写真）をメインに配置。情報があれば円形の医学イラスト・詳細図をインセットとして重ねる

【サムネイルコンセプト】
ペルソナ：${p?p.general.name:"（テーマの一般読者）"}
狙う心理：${p?p.general.future:"不安の言語化と、変われるかもしれないという希望"}

【メインタイトル案（3パターン）】
①${preset.main[0]}
②${preset.main[1]}
③${preset.main[2]}
※現在の採用案：「${main}」

【サブタイトル案（3パターン）】
①${preset.sub[0]}
②${preset.sub[1]}
③${preset.sub[2]}
※現在の採用案：「${sub}」

【バッジ文言】
「${badge}」

【帯の文言（統計数字があれば優先、無ければサブタイトルで代替）】
「${bandText}」${stat?"（統計数字を使用）":"（統計未入力のため、サブタイトルを帯に使用。この場合、別枠でのサブタイトル表示はしない）"}
${bandHasNumber?"※数字部分のみ黄色で強調されます":"※数字を含まないため、帯全体が白文字になります"}

【箇条書き項目（現在の採用案）】
${bulletsText||"（未入力）"}

【ビジュアルの方向性】
・配置：左側テキスト／右側実写真＋インセットの2構成
・配色：ネイビー×赤（強調）×黄色（数字）を基調とし、清潔感のある印象
・箇条書きは1画像につき最大5個。情報を詰め込みすぎない

【視認性チェックポイント】
・濃紺の文字×白背景のコントラスト比が十分か（文字がくっきり読めるか）
・スマホの一覧表示（幅150px程度の縮小サイズ）でもメインタイトルが読めるか
・統計の帯が背景に埋もれず、最初に目に入るアクセントになっているか
・箇条書きアイコンが小さすぎて縮小時に潰れていないか

※下の②が、実際にChatGPTに貼るプロンプトです。この企画メモ自体は貼らないでください。`;

  /* ---- ②ChatGPT用プロンプト（テキスト＋実写真込みで1枚生成・単体で完結） ---- */
  const chatgptPrompt=`アスペクト比16:9、解像度1280×720pxのNote記事サムネイル画像を作成してください。

■ 全体レイアウト（数値指定・厳守）
- 背景：白〜薄いグレー（#f7f7f5〜#ffffff）
- 左45%にテキスト要素を縦に積む（上から：メインタイトル→統計数字の帯→サブタイトル→箇条書き）
- 右55%に実写真（または人物写真）をメインで配置し、画面の縦いっぱいに使う
- 右側の実写真の一部に、円形のインセット画像（医学イラストや別カットの人物写真）を1〜2個重ねてもよい（情報がある場合のみ。無理に追加しない）

■ テキスト（数値指定・厳守）
- メインタイトル「${main}」：濃紺（#1e2a4a）の極太ゴシック体、文字の高さは画面全体の高さの9〜11%。2〜3行までの範囲で自動改行してよい。タイトルの中で特に重要な単語やフレーズ（症状名・誤解されがちな言葉など）だけを赤（#d92b2b）にして強調すること（全部ではなく一部のみ）
- 帯：メインタイトルの直下に、濃紺（#1e2a4a）で塗りつぶした横長の帯を1本配置。帯の中に、以下の文言を一字一句そのまま使用すること：「${bandText}」。${bandHasNumber?"この文言の中の数字部分だけを黄色（#f5c518）・太字で大きく、それ以外の文言は白・太字で表示すること。":"文言全体を白・太字で表示すること（今回は数字を含まないため、黄色は使わない）。"}帯は左右に画面幅の6%の余白を残す
- 【最重要・厳守】帯に入れる文言は、上記「${bandText}」以外は絶対に使用しないこと。より印象的だから、デザイン上収まりが良いから、といった理由で別の数字・文言に置き換えたり、創作したりすることは固く禁止する。指定した文言をそのまま使うこと
${stat?`- サブタイトル「${sub}」：帯の下、権威性を感じさせる一文として濃紺またはダークグレーの太字で配置。文字の高さはメインタイトルの約40%`:"- サブタイトルは帯の内容として使用済みのため、別枠では表示しないこと（重複表示の禁止）"}
- バッジ「${badge}」：${stat?"サブタイトルの下、":"帯の下、"}箇条書きの上に配置。赤（#d92b2b）の角丸長方形（ピル型）で、内側の余白は文字の上下に高さの30%ずつ、左右に文字幅の25%ずつ。バッジの中の文字は白・太字。「このNoteでわかること」を一言で示す短いラベルとして機能させること
${bullets.length?`- 箇条書き（${bullets.length}項目、横並びまたは2段組で配置）：各項目の上に丸いアイコン（項目内容に合わせたシンプルな線画アイコン）、下に短い要点テキストを2行以内で配置。テキストは濃紺、太字\n${bulletsText}`:""}
- 使用する文字色は「濃紺」「赤（強調・バッジのみ）」「黄色（数字のみ）」「白」の4色に絞ること。他の色は使わない

■ 右側の写真・イラスト
- ${t.title.replace(/テーマ\d+：/,"").replace(/（.+）/,"")}に関連する、実写真らしいクローズアップ（患部や体の一部、または人物が体の一部に触れている構図）
- 写真はドキュメンタリー・雑誌広告のような、自然光を活かした高品質な実写風のトーンにすること（イラスト調にしない）
- 情報がある場合のみ、右側の一部に円形のインセットを重ねる：医学的な構造図（骨格・関節の内部が透けて見えるような表現）や、笑顔の人物写真など。インセットは最大2個までとし、無理に追加しない
- 写真全体は自然な奥行き・ボケ感を持たせ、被写体（患部または人物）にフォーカスが合っている状態にする

■ AI生成特有の不自然さを避けるための指示（重要）
- 手や指を描く場合、本数・関節の数を解剖学的に正確にすること（余分な指・不自然な関節を描かない）
- 実写風の写真部分と、円形インセットの図解部分とで、画風の一貫性（同じトーン・同じ色温度）を保つこと
- 実在の医学的な資料を参考にしたような、事実に忠実な表現にすること（誇張・デフォルメをしない）

■ 禁止事項（厳守）
- 統計数字・パーセンテージ・人数・回数など、この指示に書かれていない数値を新たに創作して画像内に配置すること（最重要・絶対禁止）
- 指定した配色（濃紺・赤・黄色・白＋背景の白〜薄グレー）以外の色を多用しないこと
- テキストを過度に立体化・縁取りしすぎないこと（フラットに近い、読みやすい表示を優先）
- ごちゃごちゃした情報過多のレイアウトにしないこと（箇条書きは5個まで、インセットは2個まで）
- 商品写真・実写真の内容を、事実と異なる形に誇張・改変しないこと

■ 生成後のセルフチェック（必ず行うこと）
画像を生成した後、以下を自己確認してください：
- 画像内に表示した数字・統計は、すべてこの指示文に明記されたものと完全に一致しているか
- この指示文にない数字（％・人数・回数等）を、独自の判断で追加していないか
一致していない場合は、その部分だけ修正して再生成してください。

※期待通りの結果が出ない場合は、上記の「禁止事項」に該当する要素（色の使いすぎ・情報過多）が入っていないか確認し、該当箇所だけ再指示してください。`;

  $("#out-concept").textContent=conceptText;
  $("#out-concept").classList.remove("empty");
  $("#out-chatgpt").textContent=chatgptPrompt;
  $("#out-chatgpt").classList.remove("empty");
  $("#prompt-wrap").style.display="block";
});

function bindCopyBtn(btnId,outId){
  $(btnId).addEventListener("click",async()=>{
    const out=$(outId);
    if(!out.textContent.trim()){alert("先に生成ボタンを押してください");return;}
    try{await navigator.clipboard.writeText(out.textContent);}
    catch(e){
      const rg=document.createRange();rg.selectNodeContents(out);
      const sel=getSelection();sel.removeAllRanges();sel.addRange(rg);
      document.execCommand("copy");sel.removeAllRanges();
    }
    const b=$(btnId);
    const original=b.textContent;
    b.textContent="コピーしました ✓";b.classList.add("ok");
    setTimeout(()=>{b.textContent=original;b.classList.remove("ok");},1800);
  });
}
bindCopyBtn("#btn-copy-concept","#out-concept");
bindCopyBtn("#btn-copy-chatgpt","#out-chatgpt");

/* ================= 初期描画 ================= */
draw();

/* ================= 因果連鎖図データ（14テーマ・knowledge_summary.mdの連鎖ロジックより） ================= */
const CHAIN_PRESETS={
theme01:["座りっぱなし","体幹が使えない","骨盤がグネグネ動く","腰への負担蓄積"],
theme02:["厚底靴・パンプス","指が使えない","脳が指を忘れる","外反母趾が進行"],
theme03:["睡眠中に足底筋膜が短縮","起床時に急に伸ばされる","組織が再断裂","朝一歩目の激痛"],
theme04:["柔らかい靴・サンダル","指が使われない","センサー機能が低下","浮き指・ハンマートウ"],
theme05:["MTP関節が硬い","内側ホイップが発生","脛骨が外旋","ふくらはぎが外に張る"],
theme06:["表層筋ばかり使う","深層筋のポンプが働かない","毛細血管の循環が悪化","ふくらはぎのだるさ"],
theme07:["浮き指・足指の握力低下","地面からの情報が届かない","バランス反応が遅れる","転倒リスク上昇"],
theme08:["筋肉ポンプが働かない","静脈・リンパの回収が滞る","1日20Lの体液が滞留","夕方のむくみ"],
theme09:["靭帯が緩む（13歳以降は固定）","土踏まずが潰れる","ニーインポジション","膝への負担増加"],
theme10:["大人用の靴を縮小しただけ","MTP関節が曲がらない","足の骨化が妨げられる","足の変形が定着"],
theme11:["歩行時だけ指が浮く","足指が地面の情報を拾えない","体幹が支えられない","猫背・姿勢の崩れ"],
theme12:["足元の崩れ","脛骨のねじれ","膝蓋骨の位置ずれ","軟部組織の擦り潰し"],
theme13:["骨盤の後傾・スマホ姿勢","大腿骨頭が前方へ","お尻の筋肉が反応しない","股関節の痛み"],
theme14:["捻挫で靭帯を損傷","内出血が組織と癒着","パチニ小体の機能不全","捻挫を繰り返す悪循環"]
};

/* ================= 背景トーン選択 ================= */
let bgTone="light"; // "light" | "dark"
document.addEventListener("DOMContentLoaded",()=>{
  const toneSel=document.getElementById("bg-tone");
  if(toneSel)toneSel.addEventListener("change",()=>{bgTone=toneSel.value;draw();});
  const chainToggle=document.getElementById("chain-toggle");
  if(chainToggle)chainToggle.addEventListener("change",()=>{draw();});
});
