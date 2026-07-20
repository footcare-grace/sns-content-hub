"use strict";
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ================= 14テーマ分のプリセット文言（knowledge_summary.mdの数値・フレーズから作成） ================= */
const THUMB_PRESETS={
theme01:{main:["あなたの腰痛はなぜ繰り返すのか","その腰痛、原因は足かもしれない","揉んでも戻る腰痛の正体"],sub:["誰も教えてくれない本当の理由","1日5,000回の見えない負担","マッサージで治らないワケ"],badge:["腰痛は足が原因だった","放置すると骨棘のリスク","体幹が入らない本当の理由"]},
theme02:{main:["その外反母趾、まだ間に合うか","毎日見ても気づかない足の変形","パンプスを諦める前に"],sub:["進行すると筋肉が裏切り出す","15度を超えたら要注意","元に戻らなくなる前に"],badge:["早期発見がすべて","筋肉の役割が逆転する","靴と靴下の選び方"]},
theme03:{main:["あなたの足裏の痛みはなぜ治らないのか","朝の一歩目が激痛になる理由","夜治して朝壊すループ"],sub:["誰も教えてくれない本当の理由","3ヶ月〜3年続く悪循環の正体","湿布では組織は戻らない"],badge:["足底筋膜炎の唯一の必勝法","昼と夜の二刀流ケア","女性は男性の2.5倍"]},
theme04:{main:["立ってるだけで疲れる本当の理由","あなたの足指、浮いていませんか","使われない指は衰える"],sub:["紙1枚で分かる浮き指チェック","足指は地面のセンサー","猫背・疲れやすさの隠れ原因"],badge:["浮き指は全身に連鎖する","休止した指を呼び覚ます","子どもの8割に浮き指"]},
theme05:{main:["何をしても脚が痩せない理由","ふくらはぎの外張りの正体","その脚の形、生まれつきじゃない"],sub:["ダイエットでは変わらない構造","黄金比率2:3:5から遠ざかる歩き","摩擦が脂肪を作るメカニズム"],badge:["美脚は足元から作られる","内側ホイップに注意","構造を変えれば脚が変わる"]},
theme06:{main:["8時間立っても疲れない足がある","仕事終わりの棒のような足に","その疲れ、靴のせいかも"],sub:["ふくらはぎ3層構造の使い方","深層筋という省エネエンジン","柔らかい靴が疲れを作る"],badge:["立ち仕事の職業病を防ぐ","筋肉は第二の心臓","足裏の全面接地がカギ"]},
theme07:{main:["つまずく前にできることがある","その一歩の遅れが命取りに","転倒は突然やってこない"],sub:["歩行速度・時速2.88kmの警告ライン","10mを10秒で歩けますか","足指の握力とバランスの関係"],badge:["転ぶなら前に、が鉄則","足は体表面積のわずか2%","つまずきは防げる"]},
theme08:{main:["夕方のパンパン足とサヨナラ","そのむくみ、水の飲みすぎじゃない","靴がきつくなる夕方の正体"],sub:["1日20リットルの回収が滞る時","あなたの歩きはヤクルトかオロナミンCか","ポンプを動かせば足は変わる"],badge:["むくみは体からのサイン","筋肉ポンプを目覚めさせる","リンパは3つの力で上がる"]},
theme09:{main:["偏平足、諦めるのはまだ早い","土踏まずがない本当のリスク","その疲れやすさ、足の形から"],sub:["13歳までが勝負の理由","大人は\u201c眼鏡\u201dで補えばいい","アーチは潰れるように出来ている"],badge:["偏平足が引き起こす連鎖","ニーインは膝を壊す","子どもの4割が偏平足"]},
theme10:{main:["その靴、子どもの足を壊すかも","子どもの靴選びは親の責任","デザインで選ぶと後悔する"],sub:["18歳で足の形は決まる","曲がらない靴は一発アウト","厚底は18歳以下NG"],badge:["選んではいけない子供の靴","足の骨は軟骨から育つ","7歳からのインソール"]},
theme11:{main:["猫背の原因、実は足指だった","姿勢を意識しても治らない理由","隠れ浮き指、3割の衝撃"],sub:["歩行時だけ浮く指がある","意識では姿勢は変わらない","足元から姿勢は連鎖する"],badge:["足指と姿勢の意外な関係","紙1枚でセルフチェック","エコな立ち方の落とし穴"]},
theme12:{main:["その膝痛、軟骨のせいじゃない","階段が怖くなる前に","膝は被害者の関節だった"],sub:["痛みの7〜8割は擦り潰しが原因","年間260万歩の蓄積ダメージ","体重の6〜7倍が膝にかかる"],badge:["膝痛の本当の原因","ねじれが膝を壊す","足元から膝を守る"]},
theme13:{main:["脚の付け根の痛み、放置は危険","股関節痛は突然ドーンと来る","その違和感、体からのサイン"],sub:["騙し騙しが効かない関節","鼠径部の痛みは要注意","骨頭が前に飛び出す仕組み"],badge:["足と股関節の深い関係","反り腰は防衛反応かも","お尻と体幹はセット"]},
theme14:{main:["「また捻挫した」を終わらせる","捻挫グセの正体を知っていますか","昔の捻挫が今も足首に残る"],sub:["トマトケチャップ現象という癒着","失われたセンサーの取り戻し方","繰り返す悪循環の断ち切り方"],badge:["捻挫はやばい、が結論","足首安定化の秘密兵器","腱あぶみが崩れる前に"]}
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
  renderCands(id);
  if(id){
    const p=THUMB_PRESETS[id];
    $("#main-title").value=p?p.main[0]:"";
    $("#sub-title").value=p?p.sub[0]:"";
    $("#badge-text").value=p?p.badge[0]:"";
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

function renderCands(id){
  const p=id?THUMB_PRESETS[id]:null;
  const build=(wrapId,items,inputId)=>{
    const wrap=$(wrapId);wrap.innerHTML="";
    if(!p)return;
    items.forEach(txt=>{
      const b=document.createElement("button");
      b.className="cand";b.type="button";b.textContent=txt;
      b.addEventListener("click",()=>{
        $(inputId).value=txt;
        wrap.querySelectorAll(".cand").forEach(x=>x.classList.remove("on"));
        b.classList.add("on");
        draw();
      });
      wrap.appendChild(b);
    });
  };
  build("#main-cands",p?p.main:[],"#main-title");
  build("#sub-cands",p?p.sub:[],"#sub-title");
  build("#badge-cands",p?p.badge:[],"#badge-text");
}

["main-title","sub-title","badge-text"].forEach(id=>{
  $("#"+id).addEventListener("input",draw);
});

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

/* ================= Canvas描画（基準デザイン固定） ================= */
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

/* ================= AI画像プロンプト生成 ================= */
$("#btn-gen-prompt").addEventListener("click",()=>{
  if(!currentTheme){alert("先にテーマを選んでください");return;}
  const t=KNOWLEDGE_THEMES.find(x=>x.id===currentTheme);
  const p=(typeof PERSONAS!=="undefined")?PERSONAS[currentTheme]:null;
  const preset=THUMB_PRESETS[currentTheme];
  const main=$("#main-title").value.trim()||preset.main[0];
  const sub=$("#sub-title").value.trim()||preset.sub[0];
  const badge=$("#badge-text").value.trim()||preset.badge[0];

  /* ---- ①企画メモ（コンセプト・タイトル案・視認性チェック。参考資料であり、AIに渡さない） ---- */
  const conceptText=`【テーマ】
${t.title}

【基準デザイン（全テーマ共通・必ず踏襲）】
- 方眼グリッドの入った薄いグレー〜青みグレーの背景
- 左側にテキストエリア（濃紺 #1e2a4a の太字メインタイトル、オレンジ #e8681a のサブタイトル、オレンジ角丸バッジ）
- 右側に医学イラスト（骨格・関節の線画タッチ、紺の線）
- 痛み・問題の発生箇所にオレンジ色の光彩・警告マークで強調

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

【ビジュアルの方向性】
・基準デザインとの統一感：方眼背景＋紺×オレンジの配色を厳守
・配置：左側テキスト／右側イラストの2分割構成
・挿絵・アイコン：このテーマに合った部位（${t.title.replace(/テーマ\d+：/,"")}に関連する足・関節）の医学線画イラスト。問題箇所をオレンジで強調

【視認性チェックポイント】
・濃紺の文字×薄グレー背景のコントラスト比が十分か（文字がくっきり読めるか）
・スマホの一覧表示（幅150px程度の縮小サイズ）でもメインタイトルが読めるか
・オレンジのバッジが背景に埋もれず、最初に目に入るアクセントになっているか
・イラストの線が細すぎて縮小時に消えていないか

※下の②③が、実際にGemini/ChatGPTに貼るプロンプトです。この企画メモ自体は貼らないでください。`;

  /* ---- ②Gemini用プロンプト（単体で完結・そのままコピペしてよい） ---- */
  const geminiPrompt=`アスペクト比16:9、解像度1280×720pxのNote記事サムネイル画像を作成してください。

■ レイアウト（数値指定・厳守）
- 背景：薄いグレー〜青みグレー（#e7ebf1〜#eef1f5のグラデーション）に、間隔76px程度の細い方眼グリッド線（色は背景よりわずかに濃い程度、目立たせない）
- 左端：横幅5px・縦は画面の上下10%ずつを除いた紺色（#1e2a4a）の縦線を1本
- テキストは画面左端から6%の位置を左マージンとして開始し、右方向は画面幅の46%までを使用範囲とする
- 右側46%〜100%の領域にイラストを配置する

■ テキスト（数値指定・厳守）
- メインタイトル「${main}」：濃紺（#1e2a4a）、極太ゴシック体、文字の高さは画面全体の高さの11〜13%。2〜3行までの範囲で自動改行してよい。行間は文字高さの1.2倍
- サブタイトル「${sub}」：オレンジ（#e8681a）、太字、文字の高さはメインタイトルの約48%。メインタイトルの下、余白（画面高さの3%程度）を空けて配置
- バッジ「${badge}」：オレンジ（#e8681a）の角丸長方形（角丸の半径は高さの50%＝ピル型）。内側の余白は文字の上下に高さの30%ずつ、左右に文字幅の25%ずつ。バッジの中の文字は白・太字
- 使用する文字色は「濃紺」「オレンジ」「白」の3色のみ。他の色は一切使わないこと

■ イラスト（医学書・学術論文の図解のような、正確で権威性のあるスタイルにすること）
- ${t.title.replace(/テーマ\d+：/,"").replace(/（.+）/,"")}に関連する足・関節部位の医学的な線画イラスト
- スタイルの参考：整形外科の教科書・理学療法の専門書に載っているような図解。均一な線の太さ、正確な解剖学的比率、装飾のないフラットな2Dベクター画風
- 線の色は濃紺（#1e2a4a）、太さは全体を通して均一にすること（部位によって線の強弱をつけない）
- 問題・痛みの発生箇所に、オレンジ色（#e8681a）の光彩・放射状の強調マークを1箇所入れる
- イラストは右側の領域内に収め、上下左右に画面高さの3%程度の余白を残す

■ AI生成特有の不自然さを避けるための指示（重要）
- 手や指を描く場合、本数・関節の数を解剖学的に正確にすること（余分な指・不自然な関節を描かない）
- 左右対称であるべき部位（骨盤・肩など）は、正確に対称に描くこと
- 単一のイラストスタイルで統一し、部分ごとに画風が変わらないようにすること
- 実在の医学教科書の図解を模写するような、事実に忠実な表現にすること（誇張・デフォルメをしない）

■ 禁止事項（厳守）
- ドロップシャドウ（影）を一切使わないこと
- グラデーション効果を、指定した背景色以外に使わないこと（テキスト・イラストの線・バッジには使わない）
- ネオン風のグロー効果を使わないこと（オレンジの光彩マーク以外）
- 指定した3色（濃紺・オレンジ・白）＋背景の薄グレー以外の色を使わないこと
- 写真的な質感・3Dレンダリング表現を使わないこと（線画・フラットデザインで統一）
- テキストを縁取り・立体化させないこと（フラットな単色で表示）

※期待通りの結果が出ない場合は、上記の「禁止事項」に該当する要素（影・グラデーション・余計な色）が入っていないか確認し、該当箇所だけ再指示してください。`;

  /* ---- ③ChatGPT用プロンプト（単体で完結・そのままコピペしてよい） ---- */
  const chatgptPrompt=`アスペクト比16:9の横長イラスト素材を作成してください。

■ 背景・配置（数値指定・厳守）
- 背景は透明、または薄いグレー（#eef1f5）の単色のみ
- 画像の左側46%は完全に空白（何も配置しない余白）にすること
- イラストは右側54%の領域内に収め、上下は画像高さの3%ずつ余白を残すこと

■ イラスト仕様（医学書・学術論文の図解のような、正確で権威性のあるスタイルにすること）
- ${t.title.replace(/テーマ\d+：/,"").replace(/（.+）/,"")}に関連する足・関節部位の医学的な線画イラスト
- スタイルの参考：整形外科の教科書・理学療法の専門書に載っているような図解。均一な線の太さ、正確な解剖学的比率、装飾のないフラットな2Dベクター画風
- 線の色は濃紺（#1e2a4a）の単色のみ、太さは全体を通して均一にすること
- 問題・痛みの発生箇所に、オレンジ色（#e8681a）の光彩・放射状の強調マークを1箇所だけ入れる

■ AI生成特有の不自然さを避けるための指示（重要）
- 手や指を描く場合、本数・関節の数を解剖学的に正確にすること
- 左右対称であるべき部位は、正確に対称に描くこと
- 単一のイラストスタイルで統一すること（部分ごとに画風が変わらないこと）

■ 禁止事項（厳守）
- 文字・テキスト・数字・ロゴを一切含めないこと
- ドロップシャドウ（影）を使わないこと
- 濃紺とオレンジ以外の色を使わないこと（背景の薄グレーは除く）
- 写真的な質感・3Dレンダインを使わないこと（線画・フラットデザインのみ）
- グラデーション・ネオン風グローを使わないこと（オレンジの光彩マーク以外）
- 背景に模様・グリッド線を入れないこと（それはこのツール側で別途重ねるため）

※生成した画像は、このサムネイルメーカーの「③イラストを入れる」からアップロードすると、文字と自動合成できます。`;

  $("#out-concept").textContent=conceptText;
  $("#out-concept").classList.remove("empty");
  $("#out-gemini").textContent=geminiPrompt;
  $("#out-gemini").classList.remove("empty");
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
bindCopyBtn("#btn-copy-gemini","#out-gemini");
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
