"use strict";
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ================= 共通定数 ================= */
const YAKKIHO_RULES=`■ 薬機法・広告表現の制約（必ず守ること）
- 「治る」「治す」「治療」「改善する」など医療効果を断定する表現は使わないこと
- 「痛みが消える」「必ず良くなる」「誰でも」「◯◯%改善」等の効果保証・数値保証は使わないこと
- 体験談・お客様の声を使う場合は「個人の感想です」の前提が伝わる書き方にすること
- 「〜と言われています」「〜と感じる方が多いです」等、伝聞・傾向の表現に言い換えること
- インソールは医療機器ではないため、医療的効果を想起させる表現は避けること`;

const HALLUCINATION_RULES=`■ 情報の正確性（絶対ルール）
- 上記の商品データに書かれていない数値・機能・実績・お客様の声を創作しないこと
- 商品データと矛盾する情報は書かないこと`;

/* ================= 役割切り替え ================= */
function switchRole(r){
  $$(".role").forEach(x=>x.classList.remove("on"));
  $$(".pane").forEach(x=>x.classList.remove("on"));
  const btn=$(`.role[data-r="${r}"]`);
  if(btn)btn.classList.add("on");
  $("#pane-"+r).classList.add("on");
}
$$(".role").forEach(b=>b.addEventListener("click",()=>switchRole(b.dataset.r)));
$$(".flowmap-card").forEach(c=>c.addEventListener("click",()=>{
  switchRole(c.dataset.goto);
  document.querySelector(".layout").scrollIntoView({behavior:"smooth",block:"start"});
}));

$("#about-toggle")?.addEventListener("click",()=>{
  $("#about-toggle").classList.toggle("open");
  $("#about-panel").classList.toggle("open");
});

/* ================= 投稿制作担当 ================= */
/* 商品プルダウン構築 */
PRODUCT_ITEMS.forEach(p=>{
  const o=document.createElement("option");
  o.value=p.id;o.textContent=p.title;
  $("#ps-product").appendChild(o);
});

/* アカウント切り替え */
let account="company";
const ACCOUNT_HINT={
  company:"会社アカウント：ブランドの信頼感・Google検索「spiral turn」対策を重視した投稿になります",
  dealer:"取扱店専用アカウント：導入を検討する施術者・店舗向けに、専門性と取扱メリットを重視した投稿になります"
};
$("#ps-account").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  $$("#ps-account button").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  account=b.dataset.v;
  $("#ps-account-hint").textContent=ACCOUNT_HINT[account];
});

/* 訴求チップ */
const PS_POINTS=["機能性・技術（特許・5,000億通り）","権威性（理学療法士博士・MLB選手愛用）","検索性（SEOキーワード重視）","悩み解決（対象の悩みから入る）","保証・安心感（分割・作り直し保証）","ブランドストーリー（豪州発・想い）"];
const psSelected=new Set();
PS_POINTS.forEach(pt=>{
  const b=document.createElement("button");
  b.className="chip";b.textContent=pt;b.type="button";
  b.addEventListener("click",()=>{
    b.classList.toggle("on");
    b.classList.contains("on")?psSelected.add(pt):psSelected.delete(pt);
  });
  $("#ps-points").appendChild(b);
});

/* スライド構成テンプレート（枚数ごとの役割分担） */
const SLIDE_STRUCTURES={
  1:[{role:"単体",desc:"商品の魅力を1枚に凝縮した紹介画像",photo:true}],
  3:[
    {role:"1枚目：フック",desc:"悩み・問題提起を投げかける導入スライド（商品はまだ出さない）",photo:false},
    {role:"2枚目：解決",desc:"商品が悩みにどうアプローチするかを、実物写真で見せるスライド",photo:true},
    {role:"3枚目：商品詳細",desc:"商品の特徴・スペックを実物写真＋図解ラベルで見せるスライド",photo:true}
  ],
  4:[
    {role:"1枚目：悩み",desc:"対象読者の悩み・共感を引き出す導入スライド（商品はまだ出さない）",photo:false},
    {role:"2枚目：原因",desc:"その悩みが起きる原因を説明するスライド（実物写真に図解ラベルを重ねる）",photo:true},
    {role:"3枚目：解決策",desc:"商品がその原因にどうアプローチするかを、実物写真の別カットで見せるスライド",photo:true},
    {role:"4枚目：商品",desc:"商品写真を主役にした、購入・相談を後押しする最終スライド",photo:true}
  ],
  5:[
    {role:"1枚目：悩み",desc:"対象読者の悩み・共感を引き出す導入スライド（商品はまだ出さない）",photo:false},
    {role:"2枚目：原因",desc:"その悩みが起きる原因を説明するスライド（実物写真に図解ラベルを重ねる）",photo:true},
    {role:"3枚目：解決策",desc:"商品がその原因にどうアプローチするかを、実物写真の別カットで見せるスライド",photo:true},
    {role:"4枚目：商品",desc:"商品写真を主役にした、機能訴求スライド（別アングルの実物写真）",photo:true},
    {role:"5枚目：信頼",desc:"お客様の声・保証制度・権威性を、商品写真とあわせて見せる最終スライド",photo:true}
  ]
};

/* 生成 */
$("#btn-gen-post").addEventListener("click",()=>{
  if(!psSelected.size){alert("訴求ポイントを1つ以上選んでください");return;}
  const prod=PRODUCT_ITEMS.find(p=>p.id===$("#ps-product").value);
  if(!prod){alert("商品を選んでください");return;}
  const points=[...psSelected].join("／");
  const isCompany=account==="company";
  const accountName=isCompany?"会社アカウント（SPIRAL TURN公式）":"取扱店専用アカウント";
  const slideCount=$("#ps-slides").value;
  const baseStructure=SLIDE_STRUCTURES[slideCount];
  const productName=prod.title.replace(/^[①-⑧]\s*/,"");
  const addThumb=$("#ps-hookthumb").checked;

  /* 商品データから悩み・問題提起の元ネタを自動抽出（サムネイル・1枚目の悩みスライドで使う） */
  /* ①「解決する悩み」がある商品（WALK・BEAUTY）はそれを使う */
  const painMatch=prod.body.match(/解決する悩み[：:]\s*(.+)/);
  /* ②ない商品（GOLF等）は「訴求」「ロジック」から代替の問題提起を組み立てる */
  const appealMatch=prod.body.match(/訴求[：:]\s*(.+)/);
  const logicMatch=prod.body.match(/ロジック[：:]\s*(.+)/);
  let painList="";
  if(painMatch){
    painList=painMatch[1].trim();
  }else if(appealMatch||logicMatch){
    painList=[appealMatch?appealMatch[1].trim().replace(/^「|」$/g,""):"",logicMatch?logicMatch[1].trim():""].filter(Boolean).join("／");
  }else if(psSelected.size){
    /* ③どちらもなければ、選択中の訴求ポイントを最終フォールバックにする */
    painList=[...psSelected].join("／");
  }

  /* 商品データから技術情報を自動抽出（商品を見せるスライドのラベル精度を上げる） */
  const techLines=[];
  const techMatch=prod.body.match(/独自技術[：:]\s*(.+)/);
  if(techMatch)techLines.push(`独自技術：${techMatch[1].trim()}`);
  const expMatch=prod.body.match(/実験結果[：:]\s*(.+)/);
  if(expMatch)techLines.push(`実験結果：${expMatch[1].trim()}`);
  const roleMatch=prod.body.match(/(?:①②③|の役割)[：:]\s*(.+)/);
  if(roleMatch)techLines.push(roleMatch[1].trim());
  const techDetail=techLines.join("\n");

  /* サムネイルを先頭に追加する場合、構成配列そのものの先頭に差し込む（通し番号にするため） */
  const structure=addThumb&&painList
    ? [{role:"サムネイル（強いフック）",desc:"一瞬で「え、私のことだ」と思わせる、単体でも成立する強いフック",photo:false,isThumb:true},...baseStructure]
    : baseStructure;
  const totalCount=structure.length;

  /* ---- ① ChatGPT用・画像生成プロンプト（スライドごとに1枚ずつ・通し番号） ---- */
  const wrap=$("#image-slides");
  wrap.innerHTML="";
  const allSlidePrompts=[];
  structure.forEach((slide,i)=>{
    const needsProduct=slide.photo;
    const isPainSlide=(!slide.isThumb && i===(addThumb&&painList?1:0) && !needsProduct);
    const isThumb=!!slide.isThumb;

    let prompt;
    if(isThumb){
      prompt=`【${i+1}枚目／全${totalCount}枚：サムネイル】
このスライドは商品写真の添付は必須ではありません。関連する写真があれば添付して構いません。

Instagram投稿用の画像（縦長・アスペクト比4:5・推奨サイズ1080×1350px）を作成してください。
このシリーズの先頭に置く「サムネイル」です。フィードをスクロールする指を止める強さを最優先にすること。

■ このスライドの役割
${slide.role}：${slide.desc}

■ 商品情報（このシリーズ全体で共通）
${productName}｜SPIRAL TURNのオーダーメイドインソール
このスライドで扱う具体的な悩み：${painList}

■ このスライドで扱う商品固有の情報（必ずこの内容から言葉を作ること）
商品名：${productName}
具体的な悩み・訴求の核：${painList}

■ フックの文言の作り方（最重要・厳守）
- 見出しの文言は、上記「具体的な悩み・訴求の核」に書かれている単語・フレーズを直接使って作ること
- 「その不調、原因は足元です」のような、商品によらず使い回せる汎用フレーズは絶対に使わないこと。必ず${productName}特有の悩み（上記参照）に言及すること
- 型のイメージ（あくまで型であり、下の例文をそのまま使わないこと）
  - 断定型：具体的な悩みの1つを名指しして原因を言い切る
  - 数字型：具体的な悩みに関連する統計・数字を使う
  - 常識破壊型：この悩みに対する一般的な対処法を否定する切り口
  - 問いかけ型：具体的な悩みを名指しして問いかける
- 例えば「タレ胸」が悩みに含まれる商品なら「そのタレ胸、原因は歩き方です」のように、悩みの具体名を必ず文言に入れること

■ シリーズ全体としての統一感（必ず守ること）
- ブランドカラー（マゼンタピンク #e71773 をメインアクセントとして）を各スライドで一貫して使うこと
- 左下または右下にブランドロゴ用の余白スペースを毎回同じ位置に空けておくこと

■ このスライド固有のデザイン（後続スライドとは真逆の、サムネイル専用アプローチ）
- 情報を詰め込まないこと。伝えるメッセージは1つだけに絞ること
- 文字は画面の相当な面積を占めるくらい大きく、太く。小さいサムネイル表示でも一瞬で読めることを最優先にすること
- 背景か文字のどちらかに、ブランドカラーを大胆に効かせること
- 余白を活かした「説明」の構図ではなく、「衝撃・気づき」を与える構図にすること

■ 避けること
- 医療機器のような見た目・医療効果を想起させる表現
- 複数のメッセージを1枚に詰め込むこと
- スライド番号（例：${i+1}/${totalCount}等）・CTAボタン・チェックリスト等、装飾的な要素を追加すること`;
    }else{
      prompt=`【${i+1}枚目／全${totalCount}枚】
${needsProduct?"この文章と一緒に、HPの商品写真を添付してください。":`このスライドは商品写真の添付は必須ではありません（悩みへの共感を引き出す導入イラストのため）。ただし、関連する商品写真があれば添付して構いません。その場合は写真を活かしつつ悩みへの共感が伝わる構成にしてください。${isPainSlide&&painList?`扱う悩み：${painList}`:""}`}

Instagram投稿用の画像（縦長・アスペクト比4:5・推奨サイズ1080×1350px）を作成してください。

■ このスライドの役割
${slide.role}：${slide.desc}

■ 商品情報（このシリーズ全体で共通）
${productName}｜SPIRAL TURNのオーダーメイドインソール
訴求ポイント：${points}
${(needsProduct&&techDetail)?`\n■ この商品の具体的な技術情報（ラベル・キャッチコピーの参考にすること。想像で補わずこの内容を使うこと）\n${techDetail}`:""}

■ シリーズ全体としての統一感（必ず守ること）
- 背景は清潔感のある白〜薄いグレーで、${totalCount}枚を通して同じトーンにすること
- ブランドカラー（マゼンタピンク #e71773 をメインアクセントとして）を各スライドで一貫して使うこと。ロゴと同じ色を使うことで、ブランドとしての統一感を出すこと
- 左下または右下にブランドロゴ用の余白スペースを毎回同じ位置に空けておくこと
- フォント・文字の入れ方（太さ・配置ルール）を全スライドで統一すること

■ このスライド固有のデザイン
- ${isCompany?"ブランドの信頼感・高級感を重視（余白を活かした洗練されたレイアウト）":"施術者・店舗オーナーが「取り扱いたい」と感じる専門的な印象（機能の図解を重視）"}
${needsProduct?"- 商品の特徴・使用シーンを示す短いテキストラベルを2〜3個配置し、矢印・引き出し線で示すこと\n- 商品写真の形状・色は改変しないこと（実物と異なる見た目にしない）":isPainSlide&&painList?`- 商品写真は使わず、以下の具体的な悩みへの共感が伝わるシンプルなイラスト・アイコンで構成すること\n  【このスライドで扱う具体的な悩み】${painList}\n- 上記の悩みのうち1〜2個を選び、抽象的にせず「あるある」と感じられる具体的な場面（困っている表情の人物イラスト等）で表現すること`:"- 商品写真は使わず、悩みへの共感が伝わるシンプルなイラスト・アイコンで構成すること"}
- 文字は日本語で、読みやすく大きめに

■ 避けること
- 医療機器のような見た目・医療効果を想起させる表現
- ごちゃごちゃした情報過多のレイアウト
- スライド番号（例：${i+1}/${totalCount}等）・カテゴリラベル（例：「原因」「解決策」等の見出しバッジ）を追加しないこと
- 「無料カウンセリング」「今すぐ相談」等のCTAボタン・バナー・帯を追加しないこと（この指示で明示的に依頼していない限り、行動喚起ボタンは一切作らないこと）
- チェックマーク付きの特徴リスト、権威性を示すアイコン群（特許・資格・実績バッジ等）など、この指示にない装飾要素を追加しないこと
- このプロンプトで明示的に指定した文字・要素（タイトル・本文・ラベル・矢印）以外は、いかなる文字・図形・ボタンも追加しないこと。「広告として親切だろう」という判断で要素を足さないこと`;
    }

    allSlidePrompts.push(`◆${i+1}枚目：${slide.role}\n${prompt}`);

    const card=document.createElement("div");
    card.className="slide-card";
    if(isThumb){card.style.borderColor="#e71773";}
    card.innerHTML=`<div class="slide-head" ${isThumb?'style="background:#fde8f1;color:#e71773"':""}><span>${isThumb?"🎯 ":""}${i+1}枚目：${slide.role}</span><button class="copy-btn small" data-slide="${i}">コピー</button></div><pre>${prompt.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</pre>`;
    wrap.appendChild(card);
  });

  wrap.querySelectorAll("[data-slide]").forEach(b=>b.addEventListener("click",async()=>{
    const pre=b.closest(".slide-card").querySelector("pre");
    try{await navigator.clipboard.writeText(pre.textContent);}
    catch(e){
      const rg=document.createRange();rg.selectNodeContents(pre);
      const sel=getSelection();sel.removeAllRanges();sel.addRange(rg);
      document.execCommand("copy");sel.removeAllRanges();
    }
    b.textContent="コピーしました ✓";b.classList.add("ok");
    setTimeout(()=>{b.textContent="コピー";b.classList.remove("ok");},1800);
  }));

  /* ---- ② Claude Code用・写真選定の依頼文（自動組み立て） ---- */
  const FOLDER_MAP={prod01:"01_WALK",prod02:"02_BEAUTY",prod03:"03_GOLF",prod04:"04_BASEBALL",prod05:"05_SPORTS",prod06:"06_KIDS",prod07:"07_ROOM",prod08:"08_フットサポーター"};
  const folderName=FOLDER_MAP[prod.id]||(prod.id+"_"+productName.split("（")[0].trim());
  const photoPrompt=`SPIRAL_TURN_商品写真/${folderName}/ の中から、以下のプロンプトに合う写真をそれぞれ選んでください。

各プロンプトの中に「写真を添付してください」と明記されているスライドは、フォルダ内の写真から一番適したものを選び、ファイル名と理由を教えてください。「添付は必須ではありません」と書かれているスライドについても、関連しそうな写真がフォルダ内にあれば候補として1枚提案してください（悩み訴求に使えそうな構図があれば、という程度でOKです。無理に選ぶ必要はありません）。

${allSlidePrompts.join("\n\n---\n\n")}`;
  $("#out-photo").textContent=photoPrompt;
  $("#out-photo").classList.remove("empty");

  /* ---- ③ Claude用・キャプション生成プロンプト ---- */
  const capPrompt=`あなたはSNSマーケティングとSEOに強いコピーライターです。以下の商品について、Instagram投稿用キャプションを作成してください。

■ 投稿するアカウント
${accountName}${isCompany?`
- Googleで「spiral turn」と検索した際にこのアカウントが表示されるため、検索を意識した信頼感のある内容にすること`:`
- 対象は導入を検討する施術者・整骨院・整体院オーナー。専門性と取扱メリットを重視すること`}

■ 投稿形式
${totalCount}枚のスライド（カルーセル）投稿。構成：${structure.map(s=>s.role).join("→")}
※キャプションはこの${totalCount}枚を通して読む前提で書くこと（1枚目でスワイプを促す一文を意識すること）

■ 商品データ（この内容を事実の唯一の根拠とすること）
${prod.body}

## 会社概要（共通）
${COMPANY_INFO}

${PRODUCT_COMMON}
${(typeof TAKUMI_AUTHORITY!=="undefined")?"\n"+TAKUMI_AUTHORITY:""}
${(!isCompany&&typeof DEALER_COMMISSION_INFO!=="undefined")?"\n"+DEALER_COMMISSION_INFO:""}

${HALLUCINATION_RULES}

■ 訴求ポイント（この角度から書くこと）
${points}

■ キャプションのルール
- 文体は「です・ます」調の専門的かつ親しみやすいトーン
- 本文は150〜250字以内
- 冒頭1文は${isCompany?"対象の悩み・興味を引くフック":"施術者の「患者さんに何を提案できるか」という視点のフック"}にすること${totalCount>1?"（スライドをスワイプしたくなる引きを意識すること）":""}
- 伝えるベネフィット・特徴は3点以内に絞ること
- SEOキーワード（SPIRAL TURN／オーダーメイドインソール等、商品データ内のキーワード群から自然に）を本文に含めること${!isCompany?"\n- 取扱店向けの場合、「在庫リスクなし・ノルマなし」等の導入ハードルの低さを1点は含めること":""}
- ハッシュタグは末尾に5〜8個（ブランド名・商品カテゴリ・悩みキーワードをバランスよく）
- 絵文字は使用しないこと

${YAKKIHO_RULES}

【出力形式】
キャプション本文→空行→ハッシュタグの順で、2パターン（訴求の角度違い）出力してください。`;

  $("#out-caption").textContent=capPrompt;
  $("#out-caption").classList.remove("empty");
  $("#ci-caption").textContent="約"+capPrompt.length.toLocaleString()+"字";
});

/* ================= 秘書担当（投稿履歴） ================= */
const LS_LOGS="company-hub-logs-v1";
const LOG_ST=["下書き","投稿済み"];
let logs=[];
try{logs=JSON.parse(localStorage.getItem(LS_LOGS))||[];}catch(e){logs=[];}
function saveLogs(){try{localStorage.setItem(LS_LOGS,JSON.stringify(logs));}catch(e){}}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

$("#btn-add-log").addEventListener("click",()=>{
  const t=$("#lg-title").value.trim();
  if(!t){alert("商品・内容を入力してください");return;}
  logs.unshift({date:new Date().toLocaleDateString("ja-JP"),title:t,account:$("#lg-account").value,status:"下書き"});
  saveLogs();
  $("#lg-title").value="";
  renderLogs();
});
function renderLogs(){
  const tb=$("#log-table tbody");tb.innerHTML="";
  if(!logs.length){tb.innerHTML=`<tr><td colspan="5" class="empty-row">投稿記録がまだありません</td></tr>`;return;}
  logs.forEach((l,i)=>{
    const tr=document.createElement("tr");
    const stCls="s"+(LOG_ST.indexOf(l.status)+1);
    tr.innerHTML=`<td>${esc(l.date)}</td><td>${esc(l.title)}</td><td>${esc(l.account)}</td>
      <td><select data-i="${i}">${LOG_ST.map(s=>`<option ${s===l.status?"selected":""}>${s}</option>`).join("")}</select> <span class="pill ${stCls}">${esc(l.status)}</span></td>
      <td><button class="del-x" data-i="${i}" aria-label="削除">✕</button></td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll("select").forEach(el=>el.addEventListener("change",()=>{
    logs[Number(el.dataset.i)].status=el.value;saveLogs();renderLogs();
  }));
  tb.querySelectorAll(".del-x").forEach(b=>b.addEventListener("click",()=>{
    const i=Number(b.dataset.i);
    if(confirm(`「${logs[i].title}」を削除しますか？`)){logs.splice(i,1);saveLogs();renderLogs();}
  }));
}

/* ================= コピー共通 ================= */
$$(".copy-btn").forEach(b=>b.addEventListener("click",async()=>{
  const out=$("#"+b.dataset.out);
  if(!out||out.classList.contains("empty")||!out.textContent.trim()){alert("先に生成ボタンを押してください");return;}
  try{await navigator.clipboard.writeText(out.textContent);}
  catch(e){
    const rg=document.createRange();rg.selectNodeContents(out);
    const sel=getSelection();sel.removeAllRanges();sel.addRange(rg);
    document.execCommand("copy");sel.removeAllRanges();
  }
  b.textContent="コピーしました ✓";b.classList.add("ok");
  setTimeout(()=>{b.textContent="コピー";b.classList.remove("ok");},1800);
}));

/* ================= 初期化 ================= */
renderLogs();
