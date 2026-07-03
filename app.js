"use strict";
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ================= 定数（threads_takumi継承資産） ================= */
const DANGEN_TYPES=["警告型","逆説型","盲点型","驚き型","数字型","体験談型","問いかけ型","常識破壊型"];

const YAKKIHO_RULES=`■ 薬機法・広告表現の制約（必ず守ること）
- 「治る」「治す」「治療」「改善する」など医療効果を断定する表現は使わないこと
- 「痛みが消える」「必ず良くなる」「誰でも」「◯◯%改善」等の効果保証・数値保証は使わないこと
- 体験・感想を書くときは断定を避け、個人差がある前提の表現にすること
- 「〜と言われています」「〜と感じる方が多いです」「〜を意識する方が増えています」等、伝聞・傾向の表現に言い換えること
- 医療行為・診断と誤解される表現（診断します・処方します等）は使わないこと`;

const TONMANA_DEFAULT="専門家として信頼感を出す（押しつけがましくない）。難しい言葉は使わず、中学生でもわかる言葉で。共感から入り、解決策を示す構成。";

const OUTPUT_TAG_FORMAT=`---投稿{番号}（{一般向け or セラピスト向け}）---
{投稿本文（140〜300文字）}
[狙い：{認知 / 信頼 / 販売 のいずれか}]
[収益化への繋がり：{Note販売 / インソール相談 / セミナー集客 のどれか・理由30文字以内}]
[狙うエンゲージメント：{いいね / 保存 / コメント / リポスト・理由10文字以内}]
---`;

/* ================= 状態 ================= */
const LS={axis:"hub-axis-v1",tasks:"hub-tasks-v1",leads:"hub-leads-v1"};
let axis=null, tasks=[], leads=[];

function load(){
  try{
    axis=JSON.parse(localStorage.getItem(LS.axis))||null;
    tasks=JSON.parse(localStorage.getItem(LS.tasks))||[];
    leads=JSON.parse(localStorage.getItem(LS.leads))||[];
  }catch(e){axis=null;tasks=[];leads=[];}
}
function saveAxis(){try{localStorage.setItem(LS.axis,JSON.stringify(axis));}catch(e){}}
function saveTasks(){try{localStorage.setItem(LS.tasks,JSON.stringify(tasks));}catch(e){}}
function saveLeads(){try{localStorage.setItem(LS.leads,JSON.stringify(leads));}catch(e){}}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

/* ================= 役割切り替え ================= */
$$(".role").forEach(b=>b.addEventListener("click",()=>{
  $$(".role").forEach(x=>x.classList.remove("on"));
  $$(".pane").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  $("#pane-"+b.dataset.r).classList.add("on");
  renderAxisBanners();
}));

/* ================= 戦略責任者：軸の管理 ================= */
function axisFields(){
  return {
    goalShort:$("#ax-goal-short").value.trim()||"低単価Note販売（足・インソール関連の専門知識）",
    goalMid:$("#ax-goal-mid").value.trim()||"インソール取り扱い店へのバックエンド送客（コミッション獲得）",
    personaA:$("#ax-persona-a").value.trim()||"足の痛み・疲れを抱える30〜60代の一般ユーザー",
    personaB:$("#ax-persona-b").value.trim()||"個人経営の整骨院・整体院・鍼灸院のオーナー・セラピスト",
    ratio:$("#ax-ratio").value,
    tone:$("#ax-tone").value.trim()||TONMANA_DEFAULT
  };
}
function fillAxisForm(){
  if(!axis) return;
  $("#ax-goal-short").value=axis.goalShort||"";
  $("#ax-goal-mid").value=axis.goalMid||"";
  $("#ax-persona-a").value=axis.personaA||"";
  $("#ax-persona-b").value=axis.personaB||"";
  $("#ax-ratio").value=axis.ratio||"7:3";
  $("#ax-tone").value=axis.tone||"";
}
$("#btn-save-axis").addEventListener("click",()=>{
  axis=axisFields();
  saveAxis();
  const f=$("#axis-saved");
  f.classList.add("show");
  setTimeout(()=>f.classList.remove("show"),2000);
  renderAxisBanners();
});

function axisBlock(){
  const a=axis||axisFields();
  return `■ アカウントの軸（戦略責任者が設定済み・必ず一貫させること）
- 短期ゴール：${a.goalShort}
- 中期ゴール：${a.goalMid}
- ペルソナA（一般ユーザー層）：${a.personaA}
- ペルソナB（セラピスト層）：${a.personaB}
- 投稿比率（一般：セラピスト）＝ ${a.ratio}
- トンマナ：${a.tone}`;
}
function renderAxisBanners(){
  $$("[data-axis-banner]").forEach(el=>{
    if(axis){
      el.className="axis-banner ok";
      el.textContent=`軸を参照中：一般${axis.ratio.split(":")[0]}：セラピスト${axis.ratio.split(":")[1]}／短期「${axis.goalShort.slice(0,20)}…」`;
    }else{
      el.className="axis-banner warn";
      el.textContent="⚠ 軸が未保存です。先に「戦略責任者」タブで軸を保存すると、全プロンプトに自動で組み込まれます（未保存でも標準値で動きます）。";
    }
  });
}

$("#btn-axis-prompt").addEventListener("click",()=>{
  const a=axisFields();
  const p=`あなたはSNSブランド戦略とペルソナ設計のプロです。以下のアカウントの軸をもとに、2つのペルソナをそれぞれ深掘りしてください。

${axisBlock()}

■ やってほしいこと
1. ペルソナA・Bそれぞれについて、以下を具体化する
   - 年齢・職業・生活パターンの具体像（1人の人物として描く）
   - 抱えている悩みトップ3（本人の言葉で）
   - Threadsを見ている時間帯・気分
   - どんな投稿なら足を止めるか／どんな投稿は素通りするか
   - 購入・問い合わせを決断する瞬間の心理
2. 2つのペルソナに共通して刺さる「橋渡しテーマ」を3つ提案する

■ 制約条件
- 想像で補う部分は「仮説」と明記すること
- 抽象論ではなく、投稿作成にそのまま使える具体度で書くこと

【出力形式】
ペルソナA→ペルソナB→橋渡しテーマの順で、見出し付きで出力してください。`;
  $("#out-strategy").textContent=p;
  $("#out-strategy-wrap").style.display="block";
});

/* ================= リサーチ担当 ================= */
let rsMode="buzz";
const RS_META={
  buzz:{label:"バズった投稿を貼り付け（2〜5件・「---」で区切る）",hint:"なぜ伸びたかの構造（フック・構成・感情の動かし方）を抽出するプロンプトになります",ph:"投稿1の本文…\n---\n投稿2の本文…"},
  competitor:{label:"競合Noteのタイトル・冒頭・価格などを貼り付け",hint:"売れている理由と差別化ポイントを分析するプロンプトになります",ph:"タイトル：◯◯\n価格：1,980円\n無料部分の内容：…"},
  own:{label:"自分の投稿と数値を貼り付け（投稿本文＋いいね数・閲覧数など）",hint:"伸びたパターン・伸びなかったパターンを分析し、次週の方針を出すプロンプトになります",ph:"投稿：◯◯…\nいいね12・閲覧1,400\n---\n投稿：…"}
};
$("#rs-mode").addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b) return;
  $$("#rs-mode button").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  rsMode=b.dataset.v;
  $("#rs-label").textContent=RS_META[rsMode].label;
  $("#rs-hint").textContent=RS_META[rsMode].hint;
  $("#rs-input").placeholder=RS_META[rsMode].ph;
});
$("#btn-gen-research").addEventListener("click",()=>{
  const input=$("#rs-input").value.trim();
  if(!input){alert("素材を貼り付けてください");return;}
  let p="";
  if(rsMode==="buzz"){
    p=`あなたはThreadsのバズ投稿分析のプロです。以下の投稿群を分析し、再現可能な「型」を抽出してください。

${axisBlock()}

■ 分析対象の投稿
${input}

■ やってほしいこと
1. 各投稿の冒頭パターン（フックの種類）を分類する
2. 構成パターン（何をどの順で書いているか）を抽出する
3. 感情の動かし方（共感→驚き→納得 など）を言語化する
4. 頻出キーワード・言い回しを列挙する
5. 上記を踏まえ、このアカウントの軸（足・歩行・インソール）に転用できる「型」を3〜5個、テンプレート形式で提案する

■ 制約条件
- 内容のコピーではなく「構造の抽出」に徹すること
- 転用テンプレートは、ペルソナA・Bのどちらに向くかを明記すること

【出力形式】
分析→転用テンプレートの順で、見出し付きで出力してください。`;
  }else if(rsMode==="competitor"){
    p=`あなたはNoteの販売戦略と競合分析のプロです。以下の競合Note情報を分析してください。

${axisBlock()}

■ 競合情報
${input}

■ やってほしいこと
1. 売れている（または売れそうな）理由を、タイトル・価格・無料部分の設計から分析する
2. このアカウントが同テーマで出す場合の差別化ポイントを3つ提案する
3. 競合が拾えていない読者の悩み（穴）を推測する

■ 制約条件
- 推測は「仮説」と明記すること
- 差別化ポイントは、軸のペルソナ・ゴールに沿ったものにすること

【出力形式】
分析→差別化提案→穴の指摘の順で出力してください。`;
  }else{
    p=`あなたはSNS運用のデータ分析のプロです。以下は自分のThreads投稿と実績です。分析して次週の方針を出してください。

${axisBlock()}

■ 投稿と実績
${input}

■ やってほしいこと
1. 伸びた投稿の共通点（テーマ・フック・構成・対象読者）を抽出する
2. 伸びなかった投稿の共通点を抽出する
3. 「勝ちパターン」を言語化する
4. 次週の投稿方針を、続けること／やめること／新しく試すことの3つに分けて提案する

■ 制約条件
- データが少ない場合は断定せず「傾向」として扱うこと
- 方針はペルソナ比率（${(axis||axisFields()).ratio}）を守ること

【出力形式】
分析→勝ちパターン→次週方針の順で出力してください。`;
  }
  $("#out-research").textContent=p;
  $("#out-research").classList.remove("empty");
  $("#ci-research").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 企画担当 ================= */
const plSelected=new Set();
DANGEN_TYPES.forEach(t=>{
  const b=document.createElement("button");
  b.className="chip";b.textContent=t;b.type="button";
  b.addEventListener("click",()=>{
    b.classList.toggle("on");
    b.classList.contains("on")?plSelected.add(t):plSelected.delete(t);
  });
  $("#pl-types").appendChild(b);
});
$("#btn-gen-plan").addEventListener("click",()=>{
  const theme=$("#pl-theme").value.trim();
  if(!theme){alert("テーマを入力してください");return;}
  const types=plSelected.size?[...plSelected].join("・"):"8つの型（"+DANGEN_TYPES.join("・")+"）から自動で最適配分";
  const week=$("#pl-week").value;
  const stage=$("#pl-stage").value;
  const p=`あなたはThreadsのコンテンツ企画のプロです。以下のテーマで1週間分（7日）の投稿企画を設計してください。

${axisBlock()}

■ 今週のテーマ
${theme}

■ 企画の条件
- 週の構成：${week}
- 今週の重点段階：${stage}
- 使う断言型：${types}
- ファネル（網をかける→見極め→売り込み）を意識し、日を追うごとに関係を深める流れにすること

■ 制約条件
- 各日の企画は「タイトル案・断言型・対象読者（一般/セラピスト）・狙い」をセットで出すこと
- 投稿本文はまだ書かない（企画のみ）。本文は編集担当が作成する
- 一般：セラピストの比率は軸の ${(axis||axisFields()).ratio} を守ること
- リプライ（会話）が生まれる余白のある企画を優先すること

【出力形式】
月曜〜日曜の表形式で出力してください。
| 曜日 | タイトル案 | 断言型 | 対象 | 狙い |`;
  $("#out-plan").textContent=p;
  $("#out-plan").classList.remove("empty");
  $("#ci-plan").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= ナレッジライブラリ ================= */
const HALLUCINATION_RULES=`■ 情報の正確性（絶対ルール）
- 上記の専門知識ベースに書かれていない数値・データ・固有のエピソード・人物の発言を創作しないこと
- 知識ベースにない一般知識で補足する場合は、断定せず一般論であると分かる表現にとどめること
- 知識ベースの内容と矛盾する情報は書かないこと
- 知識ベース内の数値・比喩・エピソードを使う場合は、原文の意味を変えずに使うこと`;

function buildKbSelect(){
  const sel=$("#ed-kb");
  const gT=document.createElement("optgroup");
  gT.label="セミナー知識（14テーマ）";
  KNOWLEDGE_THEMES.forEach(t=>{
    const o=document.createElement("option");
    o.value="t:"+t.id; o.textContent=t.title;
    gT.appendChild(o);
  });
  const gP=document.createElement("optgroup");
  gP.label="商品データ（SPIRAL TURN）";
  PRODUCT_ITEMS.forEach(p=>{
    const o=document.createElement("option");
    o.value="p:"+p.id; o.textContent=p.title;
    gP.appendChild(o);
  });
  sel.appendChild(gT); sel.appendChild(gP);
}
function getKbBlock(){
  const v=$("#ed-kb").value;
  if(!v) return null;
  const [kind,id]=v.split(":");
  if(kind==="t"){
    const t=KNOWLEDGE_THEMES.find(x=>x.id===id);
    return t ? t.body : null;
  }
  const p=PRODUCT_ITEMS.find(x=>x.id===id);
  if(!p) return null;
  // 商品選択時は会社概要・共通要素も自動付与
  return p.body+"\n\n## 会社概要（共通）\n"+COMPANY_INFO+"\n\n"+PRODUCT_COMMON;
}

/* ================= 編集担当 ================= */
function updateEditToggles(){
  const isSell=$("#ed-stage").value.includes("売り込み");
  const isGeneralOnly=$("#ed-target").value.includes("一般ユーザー向けのみ");
  $("#ed-goal-field").style.display=isSell?"block":"none";
  $("#ed-seminar-line").style.display=(isSell&&!isGeneralOnly)?"flex":"none";
  if(!(isSell&&!isGeneralOnly))$("#ed-seminar").checked=false;
}
$("#ed-stage").addEventListener("change",updateEditToggles);
$("#ed-target").addEventListener("change",updateEditToggles);
$("#btn-gen-edit").addEventListener("click",()=>{
  const knowledge=$("#ed-knowledge").value.trim();
  const useRef=$("#ed-ref").checked;
  const kbBlock=getKbBlock();
  if(!knowledge&&!useRef&&!kbBlock){alert("ナレッジライブラリを選ぶか、ネタ・専門知識を入力するか、資料添付にチェックを入れてください");return;}
  const target=$("#ed-target").value;
  const count=$("#ed-count").value;
  const stage=$("#ed-stage").value;
  const buzz=$("#ed-buzz").value.trim();
  const pair=$("#ed-pair").checked;
  const a=axis||axisFields();

  let targetRule="";
  if(target.includes("自動配分")){
    const[g,s]=a.ratio.split(":").map(Number);
    const n=parseInt(count);
    const gN=Math.round(n*g/(g+s)),sN=n-gN;
    targetRule=`- 一般ユーザー向け${gN}本＋セラピスト向け${sN}本の配分で作成すること（軸の比率 ${a.ratio}）`;
  }else if(target.includes("一般")){
    targetRule="- 全投稿を一般ユーザー向け（ペルソナA）に作成すること";
  }else{
    targetRule="- 全投稿をセラピスト向け（ペルソナB）に作成すること";
  }

  let stageRule="";
  if(stage.includes("網")){
    stageRule=`- 段階：網をかける（認知）。売り込み要素は一切入れないこと
- できるだけ多くの人に届き、保存される「役立ち・驚き」を優先すること`;
  }else if(stage.includes("見極め")){
    stageRule=`- 段階：見極め（ファン化）。各投稿の最後に自然な問いかけを入れ、リプライ（会話）を誘発すること
- 「リプライのリプライ」まで会話が続く余白を作ること`;
  }else{
    const goal=$("#ed-goal").value;
    stageRule=`- 段階：売り込み（転換）。ゴール＝${goal}
- 誘導する場合も、本文だけで価値が伝わる要約を必ず入れること（リンク先を見なくても学びがある状態）
- 煽り・過度な限定表現は使わないこと`;
  }

  const parts=[`あなたは足・インソール専門のSNSコンテンツライターです。以下の条件でThreads投稿を${count}作成してください。`,
"",axisBlock()];

  if(kbBlock)parts.push("",`■ 専門知識ベース（この内容を事実の唯一の根拠とすること）
${kbBlock}`,"",HALLUCINATION_RULES);

  if(knowledge||!kbBlock)parts.push("",`■ ネタ・専門知識${kbBlock?"（追加の補足）":"（この内容を核にすること）"}
${knowledge||"[添付資料から抽出すること]"}`);

  if(useRef)parts.push("",`■ 添付資料について
- このメッセージに添付した資料（文字起こし・PDF）の内容をよく確認し、そこから具体的なエピソード・データを引用すること
- 資料と矛盾する内容は書かないこと`);

  if(buzz)parts.push("",`■ 参考にするバズ投稿の型
${buzz}

- 上記は「構成・フックの型」の参考にとどめ、内容は必ず自分の知識・添付資料から書くこと
- 文章のコピー・軽微な言い換えは禁止`);

  parts.push("",`■ 投稿の構成ルール（必ず守る）
1. 冒頭（1〜2行）：共感 / 驚き / 問いかけ のいずれかで始める
2. 中盤（2〜4行）：専門知識を使った簡潔な解説
3. 末尾（1〜2行）：自然な行動誘導（段階に応じて）
- 1投稿は140〜300文字
- 他の発信者には書けない一次情報（実体験・現場のエピソード・具体的な数字）を最低1つ含めること
- ハッシュタグは使わないこと
${targetRule}
${stageRule}`);

  if(pair)parts.push("",`■ 2投稿セット構造
- 各テーマを「1本目：断言のみ100文字以内」＋「2本目：理由展開200文字以内」の2投稿セットで作ること`);

  if($("#ed-seminar").checked)parts.push("",`■ 無料説明会への案内（セラピスト向け投稿のみ）
- セラピスト向け投稿の末尾にのみ、無料説明会（Zoom・約40分・無料）への案内を自然に入れること
- 必ず対象を明示すること（例：「院での取り扱いを検討したい方向けに」「同業のセラピストさん向けに」）
- 一般ユーザー向け投稿には説明会の案内を入れないこと
- 「気になる方は」のような対象が曖昧な表現は使わないこと`);

  parts.push("",YAKKIHO_RULES,"",`【出力形式】
以下の形式で出力してください。
${OUTPUT_TAG_FORMAT}`);

  const p=parts.join("\n");
  $("#out-edit").textContent=p;
  $("#out-edit").classList.remove("empty");
  $("#ci-edit").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= マーケ担当 ================= */
let mkMode="note";
$("#mk-mode").addEventListener("click",e=>{
  const b=e.target.closest("button"); if(!b)return;
  $$("#mk-mode button").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  mkMode=b.dataset.v;
  $("#mk-note-fields").style.display=mkMode==="note"?"block":"none";
  $("#mk-th-fields").style.display=mkMode==="therapist"?"block":"none";
});
$("#btn-gen-marketing").addEventListener("click",()=>{
  let p="";
  if(mkMode==="note"){
    const theme=$("#mk-theme").value.trim();
    if(!theme){alert("Note記事のテーマを入力してください");return;}
    const price=$("#mk-price").value;
    const what=$("#mk-note-what").value;
    p=`あなたはNote販売のセールスライティングのプロです。以下の条件で「${what}」を設計してください。

${axisBlock()}

■ Note記事の情報
- テーマ：${theme}
- 価格：${price}
- 主な読者：セラピスト層（ペルソナB）。一般読者も一部購入する想定

■ 設計ルール（threads_takumiで実証済みの型）
- PASONA構造（問題→煽らない共感→解決策提示→絞り込み→行動）をベースにすること
- 無料部分と有料部分の境界＝「答えの直前」（問題の深刻さを伝えた後、解決策の直前で切る）
- 有料部分の中身：具体的な手順・患者説明スクリプト・チェックリスト
- 「6,000円のセミナーで教えている内容を${price.replace(/（.*）/,"")}でまとめました」の訴求を自然に入れること
- 過度な煽り・誇大表現は使わないこと

${YAKKIHO_RULES}

【出力形式】
提案は複数案（2〜3案）出し、それぞれの狙いを一言添えてください。`;
  }else{
    const what=$("#mk-th-what").value;
    const ctx=$("#mk-th-context").value.trim();
    const merit=$("#mk-th-merit").value.trim();
    p=`あなたは専門家同士の信頼構築とセミナー集客のプロです。以下の条件で「${what}」を作成してください。

${axisBlock()}

■ 案内する説明会の情報
- 形式：Zoomオンライン・約40分・無料
- 対象：自分の院・店舗でインソールの取り扱いを検討したいセラピスト（整骨院・整体院・鍼灸院など）
- 現在は不特定多数に広く案内している拡大フェーズ${merit?`
- 実績・メリット：${merit}`:""}

■ 相手の状況
${ctx||"[相手の状況を記載。空欄の場合は複数パターンを想定して作成]"}

■ 設計ルール
- 必ず対象を明示すること（「院での取り扱いを検討したい方向けに」等）。「気になる方は」のような曖昧な表現は使わないこと
- 参加ハードルの低さを数字で示すこと（Zoom・40分・無料）
- 参加者にとっての具体的なメリットを1つ以上入れること（患者への価値→院の収益の順）
- 売り込み感を出さず、専門家同士の対等な情報提供のトーンで書くこと
- 後押しは誠実な範囲にとどめること（虚偽の限定・煽りは禁止）
- 返信・行動しやすい短さにすること（DMなら200字以内目安）

${YAKKIHO_RULES}

【出力形式】
文面案を3〜5パターン（トーン・切り口違い）で出し、それぞれの使いどころを一言添えてください。`;
  }
  $("#out-marketing").textContent=p;
  $("#out-marketing").classList.remove("empty");
  $("#ci-marketing").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 秘書担当 ================= */
const TASK_ST=["未着手","進行中","承認待ち","完了"];
const LEAD_ST=["観察中","アプローチ済","商談中","成約"];

$("#btn-add-task").addEventListener("click",()=>{
  const t=$("#tk-title").value.trim();
  if(!t){alert("タスク名を入力してください");return;}
  tasks.push({title:t,status:"未着手",due:$("#tk-due").value||""});
  saveTasks();
  $("#tk-title").value="";$("#tk-due").value="";
  renderTasks();
});
function renderTasks(){
  const tb=$("#task-table tbody");tb.innerHTML="";
  if(!tasks.length){tb.innerHTML=`<tr><td colspan="4" class="empty-row">タスクがありません</td></tr>`;return;}
  tasks.forEach((t,i)=>{
    const tr=document.createElement("tr");
    const stCls="s"+TASK_ST.indexOf(t.status);
    tr.innerHTML=`<td>${esc(t.title)}</td>
      <td><select data-i="${i}" data-k="task">${TASK_ST.map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select> <span class="pill ${stCls}">${esc(t.status)}</span></td>
      <td>${esc(t.due)||"—"}</td>
      <td><button class="del-x" data-i="${i}" data-k="task" aria-label="削除">✕</button></td>`;
    tb.appendChild(tr);
  });
  bindRowEvents(tb,"task");
}

$("#btn-add-lead").addEventListener("click",()=>{
  const n=$("#ld-name").value.trim();
  if(!n){alert("アカウント名を入力してください");return;}
  leads.push({name:n,type:$("#ld-type").value,signal:$("#ld-signal").value.trim(),status:"観察中"});
  saveLeads();
  $("#ld-name").value="";$("#ld-signal").value="";
  renderLeads();
});
function renderLeads(){
  const tb=$("#lead-table tbody");tb.innerHTML="";
  if(!leads.length){tb.innerHTML=`<tr><td colspan="5" class="empty-row">まだ登録がありません。リプライ・DM等で興味を示した人をここに記録してください</td></tr>`;return;}
  leads.forEach((l,i)=>{
    const tr=document.createElement("tr");
    const stCls="s"+LEAD_ST.indexOf(l.status);
    tr.innerHTML=`<td>${esc(l.name)}</td>
      <td>${esc(l.type)}</td>
      <td>${esc(l.signal)||"—"}</td>
      <td><select data-i="${i}" data-k="lead">${LEAD_ST.map(s=>`<option ${s===l.status?"selected":""}>${s}</option>`).join("")}</select> <span class="pill ${stCls}">${esc(l.status)}</span></td>
      <td><button class="del-x" data-i="${i}" data-k="lead" aria-label="削除">✕</button></td>`;
    tb.appendChild(tr);
  });
  bindRowEvents(tb,"lead");
}
function bindRowEvents(tb,kind){
  tb.querySelectorAll("select").forEach(el=>el.addEventListener("change",()=>{
    const i=Number(el.dataset.i);
    if(kind==="task"){tasks[i].status=el.value;saveTasks();renderTasks();}
    else{leads[i].status=el.value;saveLeads();renderLeads();}
  }));
  tb.querySelectorAll(".del-x").forEach(b=>b.addEventListener("click",()=>{
    const i=Number(b.dataset.i);
    if(kind==="task"){if(confirm(`「${tasks[i].title}」を削除しますか？`)){tasks.splice(i,1);saveTasks();renderTasks();}}
    else{if(confirm(`「${leads[i].name}」を削除しますか？`)){leads.splice(i,1);saveLeads();renderLeads();}}
  }));
}

/* ================= Threads API連携 ================= */
const LS_API_TOKEN="hub-api-token-v1", LS_API_USERID="hub-api-userid-v1";
const LS_INSIGHTS="hub-insights-v1";
let apiToken=null, apiUserId=null, insightLog=[];

function loadApi(){
  apiToken=localStorage.getItem(LS_API_TOKEN)||null;
  apiUserId=localStorage.getItem(LS_API_USERID)||null;
  try{insightLog=JSON.parse(localStorage.getItem(LS_INSIGHTS))||[];}catch(e){insightLog=[];}
}
function saveInsights(){try{localStorage.setItem(LS_INSIGHTS,JSON.stringify(insightLog));}catch(e){}}

function renderApiPanel(){
  const connected=!!(apiToken&&apiUserId);
  $("#api-panel").style.display=connected?"block":"none";
  if(connected){
    $("#api-token").value="••••••••（保存済み）";
    $("#api-userid").value=apiUserId;
  }
}

$("#btn-save-token").addEventListener("click",async()=>{
  const t=$("#api-token").value.trim();
  const uid=$("#api-userid").value.trim();
  if(!t||t.includes("•")||!uid){alert("アクセストークンとユーザーIDの両方を入力してください");return;}
  const status=$("#api-status");
  status.textContent="接続確認中…";
  try{
    // Threads Graph APIへの疎通確認（自分のアカウント情報を取得）
    const res=await fetch(`https://graph.threads.net/v1.0/${uid}?fields=id,username&access_token=${encodeURIComponent(t)}`);
    const data=await res.json();
    if(data.error){
      status.textContent="⚠ 接続に失敗しました："+(data.error.message||"トークンまたはユーザーIDを確認してください");
      return;
    }
    apiToken=t;apiUserId=uid;
    localStorage.setItem(LS_API_TOKEN,t);
    localStorage.setItem(LS_API_USERID,uid);
    status.textContent="✓ 接続成功："+(data.username?"@"+data.username:"アカウント確認済み");
    renderApiPanel();
  }catch(e){
    status.textContent="⚠ 通信エラーが発生しました。ネットワーク環境やトークンをご確認ください。";
  }
});
$("#btn-clear-token").addEventListener("click",()=>{
  if(!confirm("保存されたアクセストークンを削除しますか？"))return;
  apiToken=null;apiUserId=null;
  localStorage.removeItem(LS_API_TOKEN);
  localStorage.removeItem(LS_API_USERID);
  $("#api-token").value="";$("#api-userid").value="";
  $("#api-status").textContent="削除しました";
  renderApiPanel();
});

$("#btn-publish").addEventListener("click",async()=>{
  const text=$("#api-post-text").value.trim();
  if(!text){alert("投稿本文を入力してください");return;}
  if(!apiToken||!apiUserId){alert("先にアクセストークンを接続してください");return;}
  if(!confirm("この内容を実際にThreadsへ投稿します。よろしいですか？\n\n"+text.slice(0,80)+(text.length>80?"…":"")))return;
  try{
    // ステップ1：投稿コンテナ作成
    const createRes=await fetch(`https://graph.threads.net/v1.0/${apiUserId}/threads`,{
      method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:new URLSearchParams({media_type:"TEXT",text,access_token:apiToken})
    });
    const createData=await createRes.json();
    if(createData.error){alert("投稿の作成に失敗しました："+createData.error.message);return;}
    // ステップ2：公開
    const pubRes=await fetch(`https://graph.threads.net/v1.0/${apiUserId}/threads_publish`,{
      method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:new URLSearchParams({creation_id:createData.id,access_token:apiToken})
    });
    const pubData=await pubRes.json();
    if(pubData.error){alert("投稿の公開に失敗しました："+pubData.error.message);return;}
    alert("投稿が完了しました ✓");
    insightLog.unshift({date:new Date().toLocaleString("ja-JP"),summary:text.slice(0,40),likes:"—",replies:"—",source:"API投稿"});
    saveInsights();renderInsights();
    $("#api-post-text").value="";
  }catch(e){
    alert("通信エラーが発生しました。時間をおいて再度お試しください。");
  }
});

$("#btn-fetch-insights").addEventListener("click",async()=>{
  if(!apiToken||!apiUserId){alert("先にアクセストークンを接続してください");return;}
  const box=$("#insight-result");
  box.textContent="取得中…";
  try{
    // 直近の投稿一覧を取得
    const listRes=await fetch(`https://graph.threads.net/v1.0/${apiUserId}/threads?fields=id,text,timestamp&limit=5&access_token=${encodeURIComponent(apiToken)}`);
    const listData=await listRes.json();
    if(listData.error){box.textContent="⚠ 取得失敗："+listData.error.message;return;}
    const posts=listData.data||[];
    if(!posts.length){box.textContent="投稿が見つかりませんでした";return;}
    let added=0;
    for(const post of posts){
      const insRes=await fetch(`https://graph.threads.net/v1.0/${post.id}/insights?metric=likes,replies,views&access_token=${encodeURIComponent(apiToken)}`);
      const insData=await insRes.json();
      const metrics={};
      (insData.data||[]).forEach(m=>{metrics[m.name]=m.values?.[0]?.value ?? m.total_value?.value ?? "—";});
      insightLog.unshift({
        date:new Date(post.timestamp).toLocaleString("ja-JP"),
        summary:(post.text||"（本文なし）").slice(0,40),
        likes:metrics.likes ?? "—",
        replies:metrics.replies ?? "—",
        source:"API取得"
      });
      added++;
    }
    saveInsights();renderInsights();
    box.textContent=`✓ ${added}件の実績を取得しました`;
  }catch(e){
    box.textContent="⚠ 通信エラーが発生しました";
  }
});

$("#btn-add-insight").addEventListener("click",()=>{
  const summary=$("#ins-summary").value.trim();
  const nums=$("#ins-numbers").value.trim();
  if(!summary){alert("投稿の概要を入力してください");return;}
  const[likes,replies]=nums.split("/").map(s=>s?.trim()||"—");
  insightLog.unshift({date:new Date().toLocaleString("ja-JP"),summary,likes:likes||"—",replies:replies||"—",source:"手入力"});
  saveInsights();renderInsights();
  $("#ins-summary").value="";$("#ins-numbers").value="";
});

function renderInsights(){
  const tb=$("#insight-table tbody");tb.innerHTML="";
  if(!insightLog.length){tb.innerHTML=`<tr><td colspan="6" class="empty-row">実績がまだ記録されていません</td></tr>`;return;}
  insightLog.slice(0,30).forEach((r,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${esc(r.date)}</td><td>${esc(r.summary)}</td><td>${esc(r.likes)}</td><td>${esc(r.replies)}</td><td>${esc(r.source)}</td>
      <td><button class="del-x" data-i="${i}" aria-label="削除">✕</button></td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll(".del-x").forEach(b=>b.addEventListener("click",()=>{
    insightLog.splice(Number(b.dataset.i),1);saveInsights();renderInsights();
  }));
}

/* ================= バックアップ・復元 ================= */
$("#btn-export").addEventListener("click",()=>{
  const data={axis,tasks,leads,insightLog,exported:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="threads-hub-backup_"+new Date().toISOString().slice(0,10)+".json";
  a.click();URL.revokeObjectURL(a.href);
});
$("#import-file").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      if(d.axis)axis=d.axis;
      if(Array.isArray(d.tasks))tasks=d.tasks;
      if(Array.isArray(d.leads))leads=d.leads;
      if(Array.isArray(d.insightLog))insightLog=d.insightLog;
      saveAxis();saveTasks();saveLeads();saveInsights();
      fillAxisForm();renderTasks();renderLeads();renderAxisBanners();renderInsights();
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
load();
loadApi();
buildKbSelect();
fillAxisForm();
renderAxisBanners();
renderTasks();
renderLeads();
renderApiPanel();
renderInsights();
