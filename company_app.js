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
$$(".role").forEach(b=>b.addEventListener("click",()=>{
  $$(".role").forEach(x=>x.classList.remove("on"));
  $$(".pane").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  $("#pane-"+b.dataset.r).classList.add("on");
}));

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

/* 生成 */
$("#btn-gen-post").addEventListener("click",()=>{
  if(!psSelected.size){alert("訴求ポイントを1つ以上選んでください");return;}
  const prod=PRODUCT_ITEMS.find(p=>p.id===$("#ps-product").value);
  if(!prod){alert("商品を選んでください");return;}
  const points=[...psSelected].join("／");
  const isCompany=account==="company";
  const accountName=isCompany?"会社アカウント（SPIRAL TURN公式）":"取扱店専用アカウント";

  /* ---- ① ChatGPT用・画像生成プロンプト ---- */
  const imgPrompt=`【この文章と一緒に、HPの商品写真を添付してください】

添付した商品写真をもとに、Instagram投稿用の商品紹介画像（正方形・1080×1080）を作成してください。

■ 商品情報
${prod.title.replace(/^[①-⑧]\s*/,"")}｜SPIRAL TURNのオーダーメイドインソール

■ デザインの方向性
- 清潔感のある白〜薄いグレーの背景で、商品が主役になる構図
- ${isCompany?"ブランドの信頼感・高級感を重視（余白を活かした洗練されたレイアウト）":"施術者・店舗オーナーが「取り扱いたい」と感じる専門的な印象（機能の図解を重視）"}
- 商品の特徴を示す短いテキストラベルを2〜3個配置（例：業界最薄0.99mm／水洗いOK など）
- 矢印・引き出し線で特徴の場所を視覚的に示す
- 左下にブランドロゴ用のスペースを空けておく
- 文字は日本語で、読みやすく大きめに

■ 避けること
- 医療機器のような見た目・医療効果を想起させる表現
- ごちゃごちゃした情報過多のレイアウト
- 商品写真の形状・色の改変（実物と異なる見た目にしない）`;

  /* ---- ② Claude用・キャプション生成プロンプト ---- */
  const capPrompt=`あなたはSNSマーケティングとSEOに強いコピーライターです。以下の商品について、Instagram投稿用キャプションを作成してください。

■ 投稿するアカウント
${accountName}${isCompany?`
- Googleで「spiral turn」と検索した際にこのアカウントが表示されるため、検索を意識した信頼感のある内容にすること`:`
- 対象は導入を検討する施術者・整骨院・整体院オーナー。専門性と取扱メリットを重視すること`}

■ 商品データ（この内容を事実の唯一の根拠とすること）
${prod.body}

## 会社概要（共通）
${COMPANY_INFO}

${PRODUCT_COMMON}

${HALLUCINATION_RULES}

■ 訴求ポイント（この角度から書くこと）
${points}

■ キャプションのルール
- 文体は「です・ます」調の専門的かつ親しみやすいトーン
- 本文は150〜250字以内
- 冒頭1文は${isCompany?"対象の悩み・興味を引くフック":"施術者の「患者さんに何を提案できるか」という視点のフック"}にすること
- 伝えるベネフィット・特徴は3点以内に絞ること
- SEOキーワード（SPIRAL TURN／オーダーメイドインソール等、商品データ内のキーワード群から自然に）を本文に含めること
- ハッシュタグは末尾に5〜8個（ブランド名・商品カテゴリ・悩みキーワードをバランスよく）
- 絵文字は使用しないこと

${YAKKIHO_RULES}

【出力形式】
キャプション本文→空行→ハッシュタグの順で、2パターン（訴求の角度違い）出力してください。`;

  $("#out-image").textContent=imgPrompt;
  $("#out-image").classList.remove("empty");
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
