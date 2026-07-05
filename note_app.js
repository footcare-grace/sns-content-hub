"use strict";
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ================= 共通定数 ================= */
const YAKKIHO_RULES=`■ 薬機法・広告表現の制約（必ず守ること）
- 「治る」「治す」「治療」「改善する」など医療効果を断定する表現は使わないこと
- 「痛みが消える」「必ず良くなる」「誰でも」「◯◯%改善」等の効果保証・数値保証は使わないこと
- 体験・感想を書くときは断定を避け、個人差がある前提の表現にすること
- 「〜と言われています」「〜と感じる方が多いです」等、伝聞・傾向の表現に言い換えること
- 医療行為・診断と誤解される表現（診断します・処方します等）は使わないこと`;

const HALLUCINATION_RULES=`■ 情報の正確性（絶対ルール）
- 上記の専門知識ベースに書かれていない数値・データ・固有のエピソード・人物の発言を創作しないこと
- 知識ベースにない一般知識で補足する場合は、断定せず一般論であると分かる表現にとどめること
- 知識ベースの内容と矛盾する情報は書かないこと
- 知識ベース内の数値・比喩・エピソードを使う場合は、原文の意味を変えずに使うこと`;

/* ================= 役割切り替え ================= */
$$(".role").forEach(b=>b.addEventListener("click",()=>{
  $$(".role").forEach(x=>x.classList.remove("on"));
  $$(".pane").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  $("#pane-"+b.dataset.r).classList.add("on");
}));

/* ================= ナレッジ選択肢の構築（構成・執筆の2箇所） ================= */
function buildKbSelect(sel){
  const gT=document.createElement("optgroup");
  gT.label="セミナー知識（14テーマ）";
  KNOWLEDGE_THEMES.forEach(t=>{
    const o=document.createElement("option");
    o.value="t:"+t.id;o.textContent=t.title;
    gT.appendChild(o);
  });
  const gP=document.createElement("optgroup");
  gP.label="商品データ（SPIRAL TURN）";
  PRODUCT_ITEMS.forEach(p=>{
    const o=document.createElement("option");
    o.value="p:"+p.id;o.textContent=p.title;
    gP.appendChild(o);
  });
  sel.appendChild(gT);sel.appendChild(gP);
}
function kbBody(v){
  if(!v)return null;
  const[kind,id]=v.split(":");
  if(kind==="t"){const t=KNOWLEDGE_THEMES.find(x=>x.id===id);return t?t.body:null;}
  const p=PRODUCT_ITEMS.find(x=>x.id===id);
  if(!p)return null;
  return p.body+"\n\n## 会社概要（共通）\n"+COMPANY_INFO+"\n\n"+PRODUCT_COMMON;
}
function kbTitle(v){
  if(!v)return null;
  const[kind,id]=v.split(":");
  const arr=kind==="t"?KNOWLEDGE_THEMES:PRODUCT_ITEMS;
  const item=arr.find(x=>x.id===id);
  return item?item.title:null;
}

/* ================= 構成担当 ================= */
$("#btn-gen-plan").addEventListener("click",()=>{
  const kv=$("#pl-kb").value;
  const theme=$("#pl-theme").value.trim();
  if(!kv&&!theme){alert("ナレッジを選ぶか、記事テーマを入力してください");return;}
  const target=$("#pl-target").value;
  const pattern=$("#pl-pattern").value;
  const price=$("#pl-price").value;
  const length=$("#pl-length").value;
  const kb=kbBody(kv);
  const isFree=price.includes("無料");
  const isSplit=pattern.includes("無料部分");

  const parts=[`あなたはNote記事の構成設計のプロの編集者です。以下の条件で、Note記事（${target}・${price}）の章立て・目次案を設計してください。`];

  if(kb){
    parts.push("",`■ 専門知識ベース（この内容を事実の唯一の根拠とすること）
${kb}`,"",HALLUCINATION_RULES,"",`■ 展開順序の再現（最重要）
- 上記の知識ベースには「### 展開順序」として、実際のセミナーで話された順番が記録されている
- 章立ては、この展開順序をベースに設計すること（話の流れ・つかみ・結論への持っていき方を記事でも再現する）
- ただしセミナー特有の実演・Q&A部分は、記事に適した形（チェックリスト・図解の説明等）に変換してよい`);
  }
  if(theme)parts.push("",`■ 記事テーマ${kb?"（補足）":""}
${theme}`);

  parts.push("",`■ 設計の条件
- 記事の長さ：${length}
- 対象読者：${target}${target.includes("セラピスト")?"（施術の現場で明日から使える実用性を重視）":"（専門用語は必ず言い換え・説明を添える）"}`);

  if(isSplit&&!isFree)parts.push("",`■ 無料/有料ラインの設計（必ず提案に含めること）
- 無料部分と有料部分の境界＝「答えの直前」で切ること（問題の深刻さ・原因の核心まで無料で見せ、具体的な解決手順の直前で有料に切り替える）
- どの章とどの章の間で切るべきか、理由付きで提案すること
- 無料部分の最後は「続きを読みたくなる引き」で終わる設計にすること`);
  if(!isSplit&&!isFree)parts.push("",`■ 全文有料の設計
- 購入前に読める「記事説明文（リード文）」の構成案も併せて提案すること`);

  parts.push("",YAKKIHO_RULES,"",`【出力形式】
1. 記事タイトル案（3つ）
2. 章立て（各章のタイトル＋その章で扱う内容の要点2〜3行）
${isSplit&&!isFree?"3. 無料/有料の境界線の提案（理由付き）":""}
の順で出力してください。`);

  const p=parts.join("\n");
  $("#out-plan").textContent=p;
  $("#out-plan").classList.remove("empty");
  $("#ci-plan").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 執筆担当 ================= */
$("#btn-gen-write").addEventListener("click",()=>{
  const outline=$("#wr-outline").value.trim();
  if(!outline){alert("章立てを貼り付けてください");return;}
  const kv=$("#wr-kb").value;
  const kb=kbBody(kv);
  const range=$("#wr-range").value;
  const chapter=$("#wr-chapter").value.trim();
  const target=$("#wr-target").value;
  const isPart=range.includes("指定");
  if(isPart&&!chapter){alert("執筆する章番号を入力してください");return;}

  const parts=[`あなたはNote記事の執筆のプロです。以下の章立てに沿って、${isPart?`「${chapter}」のみ`:"全章"}の本文を執筆してください。`];

  if(kb)parts.push("",`■ 専門知識ベース（この内容を事実の唯一の根拠とすること）
${kb}`,"",HALLUCINATION_RULES);

  parts.push("",`■ 確定した章立て
${outline}`,"",`■ 執筆ルール
- 対象読者：${target}${target.includes("セラピスト")?"（現場で使える具体性・患者説明にそのまま使える言い回しを重視）":"（中学生でもわかる言葉で。専門用語には必ず短い説明を添える）"}
- 導入は読者の悩みへの共感から始めること
- 知識ベースの比喩・エピソード（例：トマトケチャップ現象、円柱形理論など）は積極的に活用し、原文の意味を保つこと
- 1つの見出しあたり400〜600字を目安にすること
- 箇条書き・小見出しを適度に使い、スマホでも読みやすいリズムにすること
- 各章の終わりに、次の章へ読み進めたくなる一文を入れること`,"",YAKKIHO_RULES,"",`【出力形式】
Markdown形式で、見出し（##）付きで出力してください。`);

  const p=parts.join("\n");
  $("#out-write").textContent=p;
  $("#out-write").classList.remove("empty");
  $("#ci-write").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= セールス担当 ================= */
$("#btn-gen-sales").addEventListener("click",()=>{
  const theme=$("#sl-theme").value.trim();
  if(!theme){alert("記事テーマを入力してください");return;}
  const what=$("#sl-what").value;
  const price=$("#sl-price").value;
  const useSeminar=$("#sl-seminar").checked;

  let specific="";
  if(what.includes("タイトル")){
    specific=`■ タイトル設計のルール
- クリックしたくなるが釣りすぎない（読後に「タイトル詐欺」と感じさせない）
- 数字・具体性・ベネフィットのいずれかを含めること
- 30字以内を基本とし、長短のバリエーションを混ぜること
- セラピスト向けは「現場で使える」「患者説明」等の実務ワードが有効`;
  }else if(what.includes("引き")){
    specific=`■ 「引き」の設計ルール
- 無料部分の最後＝「答えの直前」で切る前提
- 問題の深刻さと原因の核心までは無料で開示済みという状態から書くこと
- 「この続きに具体的な手順がある」ことが明確に伝わる終わり方にすること
- 煽らない。「知りたい人だけどうぞ」という余裕のあるトーンで`;
  }else if(what.includes("一押し")){
    specific=`■ 購入ボタン前の一押しルール
- 価格の妥当性を示すこと${useSeminar?"（セミナー価格との比較を使う）":""}
- 「読んだ後どうなれるか」を1〜2行で描写すること
- 返金保証等がない前提なので、過度な約束はしないこと`;
  }else{
    specific=`■ Threads誘導投稿のルール
- 投稿本文だけで価値が伝わる要約を必ず入れること（リンクを見なくても学びがある状態）
- 記事の核心の一歩手前まで見せて、「詳しい手順はNoteにまとめました」と自然につなぐこと
- 500字以内・ハッシュタグなし
- 末尾に軽い問いかけを入れてリプライを誘発すること`;
  }

  const parts=[`あなたはNote販売のセールスライティングのプロです。以下の記事について「${what}」を作成してください。`,"",`■ 記事情報
- テーマ：${theme}
- 価格：${price}
- 主な読者：セラピスト層（一般読者も一部購入する想定）`,"",`■ 設計の土台（PASONA構造）
- Problem（問題提起）→ Affinity（共感）→ Solution（解決策の提示）→ Narrowing（絞り込み）→ Action（行動）の流れを意識すること
- 煽る表現ではなく、専門家としての信頼感を保つこと`,"",specific];

  if(useSeminar)parts.push("",`■ 価格訴求
- 「6,000円の月1セミナーで扱っている内容を、${price}でまとめました」という価格アンカーを自然に使うこと
- 値引き感より「なぜあなたに必要か」の文脈を優先すること`);

  parts.push("",YAKKIHO_RULES,"",`【出力形式】
案を${what.includes("タイトル")?"5":"2〜3"}パターン出し、それぞれの狙いを一言添えてください。`);

  const p=parts.join("\n");
  $("#out-sales").textContent=p;
  $("#out-sales").classList.remove("empty");
  $("#ci-sales").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 校正担当 ================= */
$("#btn-gen-proof").addEventListener("click",()=>{
  const draft=$("#pf-draft").value.trim();
  if(!draft){alert("原稿を貼り付けてください");return;}
  const mode=$("#pf-mode").value;

  let task="";
  if(mode.includes("総合")){
    task=`■ チェック項目（すべて実施）
1. 誤字脱字・表記ゆれの指摘と修正
2. 読みにくい文（一文が長い・主語が不明瞭）の改善提案
3. 話し言葉が残っている箇所の書き言葉への変換
4. 薬機法・広告表現に抵触しうる箇所の指摘と言い換え案
5. 全体の流れで論理が飛んでいる箇所の指摘`;
  }else if(mode.includes("話し言葉")){
    task=`■ チェック項目
- 「えっと」「なんか」等のフィラーの除去
- 話し言葉（〜なんですよね、〜じゃないですか等）の書き言葉への変換
- 冗長な繰り返しの整理
- ただし、著者の語り口の温かみ・人柄は残すこと（無機質な文章にしない）`;
  }else if(mode.includes("薬機法")){
    task=`■ チェック項目
- 医療効果の断定表現（治る・改善する等）の検出と言い換え案
- 効果保証・数値保証表現の検出
- 医療行為と誤解される表現の検出
- 問題箇所を一覧化し、それぞれに修正案を併記すること`;
  }else{
    task=`■ チェック項目
- 無料部分の最後が「続きを読みたくなる引き」として機能しているかの診断
- 答えを出しすぎていないか／逆に無料部分の価値が薄すぎないかの評価
- 引きを強化する修正案の提示（2〜3パターン）`;
  }

  const p=`あなたはNote記事の校正・編集のプロです。以下の原稿を「${mode}」の観点でチェックしてください。

${task}

${YAKKIHO_RULES}

■ 原稿
${draft}

【出力形式】
指摘事項を一覧化し、それぞれに「修正前→修正後」の形で具体的な修正案を示してください。最後に修正を全て反映した完成版を出力してください。`;

  $("#out-proof").textContent=p;
  $("#out-proof").classList.remove("empty");
  $("#ci-proof").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 秘書担当（記事管理） ================= */
const LS_ARTICLES="note-articles-v1";
const AR_ST=["構成中","執筆中","校正中","公開済み"];
let articles=[];
try{articles=JSON.parse(localStorage.getItem(LS_ARTICLES))||[];}catch(e){articles=[];}
function saveArticles(){try{localStorage.setItem(LS_ARTICLES,JSON.stringify(articles));}catch(e){}}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

$("#btn-add-article").addEventListener("click",()=>{
  const t=$("#ar-title").value.trim();
  if(!t){alert("記事タイトルを入力してください");return;}
  articles.push({title:t,meta:$("#ar-meta").value.trim(),status:"構成中",sales:""});
  saveArticles();
  $("#ar-title").value="";$("#ar-meta").value="";
  renderArticles();
});
function renderArticles(){
  const tb=$("#article-table tbody");tb.innerHTML="";
  if(!articles.length){tb.innerHTML=`<tr><td colspan="5" class="empty-row">記事がまだ登録されていません</td></tr>`;return;}
  articles.forEach((a,i)=>{
    const tr=document.createElement("tr");
    const stCls="s"+AR_ST.indexOf(a.status);
    tr.innerHTML=`<td>${esc(a.title)}</td><td>${esc(a.meta)||"—"}</td>
      <td><select data-i="${i}">${AR_ST.map(s=>`<option ${s===a.status?"selected":""}>${s}</option>`).join("")}</select> <span class="pill ${stCls}">${esc(a.status)}</span></td>
      <td><input data-i="${i}" data-k="sales" value="${esc(a.sales)}" placeholder="例：5部・9,900円" style="padding:4px 6px;font-size:12px"></td>
      <td><button class="del-x" data-i="${i}" aria-label="削除">✕</button></td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll("select").forEach(el=>el.addEventListener("change",()=>{
    articles[Number(el.dataset.i)].status=el.value;saveArticles();renderArticles();
  }));
  tb.querySelectorAll("input[data-k='sales']").forEach(el=>el.addEventListener("change",()=>{
    articles[Number(el.dataset.i)].sales=el.value;saveArticles();
  }));
  tb.querySelectorAll(".del-x").forEach(b=>b.addEventListener("click",()=>{
    const i=Number(b.dataset.i);
    if(confirm(`「${articles[i].title}」を削除しますか？`)){articles.splice(i,1);saveArticles();renderArticles();}
  }));
}

/* ================= バックアップ ================= */
$("#btn-export").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify({articles,exported:new Date().toISOString()},null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="note-hub-backup_"+new Date().toISOString().slice(0,10)+".json";
  a.click();URL.revokeObjectURL(a.href);
});
$("#import-file").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      if(Array.isArray(d.articles))articles=d.articles;
      saveArticles();renderArticles();
      alert("復元しました");
    }catch(err){alert("ファイルの形式が正しくありません");}
    e.target.value="";
  };
  r.readAsText(f);
});

/* ================= コピー共通 ================= */
$$(".copy-btn").forEach(b=>b.addEventListener("click",async()=>{
  const out=$("#"+b.dataset.out);
  if(!out||out.classList.contains("empty")||!out.textContent.trim()){alert("先にプロンプトを生成してください");return;}
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
buildKbSelect($("#pl-kb"));
buildKbSelect($("#wr-kb"));
renderArticles();
