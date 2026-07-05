"use strict";
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

/* ================= 共通定数 ================= */
const YAKKIHO_RULES=`■ 薬機法・広告表現の制約（必ず守ること）
- 「治る」「治す」「治療」「改善する」など医療効果を断定する表現は使わないこと
- 「痛みが消える」「必ず良くなる」「誰でも」「◯◯%改善」等の効果保証・数値保証は使わないこと
- 誇大表現・過度な煽りは使わないこと
- 「〜と言われています」「〜というケースがあります」等、伝聞・傾向の表現に言い換えること`;

const HALLUCINATION_RULES=`■ 情報の正確性（絶対ルール）
- 専門知識ベースに書かれていない数値・データ・固有のエピソードを創作しないこと
- 知識ベースにない情報で補う場合は、断定せず一般論であると分かる表現にとどめること`;

/* JBMの軸（冨永さんのメッセージ・セミナー概要から確定した内容） */
const JBM_AXIS=`■ JBM（関節ブリージングメソッド）の軸
- 独自ポジショニング：「新幹線理論」＝在来線（理論から入る一般的な学び方）ではなく、まず治し方を身につけ理屈は後からついてくる学び方
- 主軸ペルソナ：技術コンプレックス型セラピスト（解剖学に自信がない、筋肉へのアプローチはできるが関節が苦手）
- 副次ペルソナ：ビジネス拡大型セラピスト（客層拡大・リピート増加を狙う。Aの悩みが解決した結果として自然に響く層）
- 講師の権威性：冨永琢也氏・理学療法士歴17年、オーストラリアでトップ選手を含む数多くのクライアントに対応してきた実績
- セミナー概要：2日間（座学2コマ・実技7コマ）、参加費10万円、知識はトップダウン（治し方が先、理屈は後）
- ゴール：「関節痛をバシバシ取り除けるセラピストになる」`;

const JBM_STYLE_GUIDE=`■ 文体スタイル（最重要・必ずこの型を踏襲すること）
過去に実際に使用し、効果が出ている投稿は以下の2本です。テロップは「説明文」ではなく、
このような短いフレーズを畳みかけるリズムで構成すること。

【実例1】
「痛みが取れない」その概念を覆す（フック）
国家資格がなくても　専門知識がなくても
勝てる方法を見つけられる
痛みの理屈と手技が分かれば
たった二日間で結果が出せる
「こうきたら、こうする」
答えを知れば誰でも再現できる
全身の主要な関節痛を片っ端から取り除く
関節ブリージングメゾットセミナー（CTA)

【実例2】
セラピスト人生を大きく変える2日間（フック）
ぼんやりした原因がはっきりした答えに変わる
その答えと手技を最短距離で知る
資格や知識がなくても関節痛は取り除ける
たった二日間で効果が出せる
難しい知識より先に答えを知る
関節ブリージングメゾットセミナー（CTA)

■ この実例から抽出すべき型のルール
- フックは「概念を覆す」「人生を変える」等の断言・宣言型にすること（疑問形は使わない）
- 展開部分は説明文にせず、体言止め・短いフレーズの連続で「畳みかける」リズムにすること
- 「資格がなくても」「知識がなくても」等、"〜なくても"の繰り返し構造を積極的に使うこと
- JBMの核心フレーズ「こうきたら、こうする」「答えを知れば誰でも再現できる」は、文脈に合えば積極的に使うこと
- CTAは装飾せず、シンプルに「関節ブリージングメソッドセミナー」のみで締めること`;

/* ================= 役割切り替え ================= */
$$(".role").forEach(b=>b.addEventListener("click",()=>{
  $$(".role").forEach(x=>x.classList.remove("on"));
  $$(".pane").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");
  $("#pane-"+b.dataset.r).classList.add("on");
}));

/* ================= JBMリール担当 ================= */
const JB_POINTS=["解剖学がわからなくても大丈夫","治し方が先、理屈は後（新幹線理論）","2日間で即戦力の技術が身につく","冨永氏17年・オーストラリアでの実績","家族の関節も守れるようになる","客層拡大・リピート増加につながる"];
const jbSelected=new Set();
JB_POINTS.forEach(pt=>{
  const b=document.createElement("button");
  b.className="chip";b.textContent=pt;b.type="button";
  b.addEventListener("click",()=>{
    b.classList.toggle("on");
    b.classList.contains("on")?jbSelected.add(pt):jbSelected.delete(pt);
  });
  $("#jb-points").appendChild(b);
});

$("#btn-gen-jbm").addEventListener("click",()=>{
  if(!jbSelected.size){alert("訴求ポイントを1つ以上選んでください");return;}
  const material=$("#jb-material").value;
  const goal=$("#jb-goal").value;
  const points=[...jbSelected].join("／");

  let goalRule="";
  if(goal.includes("新規フォロー")){
    goalRule=`- ゴール：新規フォロー獲得。専門知識のない人にも刺さる「常識破壊」「意外性」を重視すること
- 最後の一文（CTAの直前）は、フォローしたくなる余韻を残すトーンにすること`;
  }else if(goal.includes("興味喚起")){
    goalRule=`- ゴール：フォロー中の人にセミナーへの興味を持たせること
- 中盤で「もっと知りたい」と思わせる情報の出し方（核心は見せすぎない）にすること`;
  }else{
    goalRule=`- ゴール：セミナー申込への後押し（既存フォロワー向け）
- 「たった二日間で結果が出せる」等、期間の短さと成果を結びつけるフレーズを必ず含めること`;
  }

  const p=`あなたはショート動画のディレクター兼コピーライターです。以下の条件で、セミナー風景＋テロップ型のリール台本（30秒・CTA込み）を作成してください。

${JBM_AXIS}

${JBM_STYLE_GUIDE}

■ 今回の素材
${material}

■ 訴求ポイント（この中から中心となる1つを選び、他は補強として使うこと）
${points}

■ 台本のルール
- 尺は30秒固定。0〜2秒（フック）／2〜22秒（展開）／22〜30秒（CTA）の3パート構成にすること
- 1本につき伝えるメッセージは1つに絞ること（詰め込みすぎない）
- フックは実例のスタイル（概念を覆す・断言・宣言型）を踏襲すること。8つの型のうち、どれに近いかも参考として明記すること
${goalRule}
- 実際の映像（${material}）とテロップが連動するよう、「どの瞬間にどのテロップを出すか」を具体的に指示すること
- テロップの文言は、実例と同じ「体言止め・短いフレーズの連続」で書くこと。説明的な一文にしないこと

${YAKKIHO_RULES}

【出力形式】
まず0〜2秒のフックを5パターン（実例のような断言・宣言型で、参考にした型も添える）提示し、その中から最も強いと思うものを1つ選んだ上で、選定理由とともに続き（2〜22秒・22〜30秒）まで含めた完成台本を1本、実例と同じフレーズ畳みかけ形式で出力してください。

---
0-2秒（フック）
テロップ：「◯◯」
映像指示：◯◯

2-22秒（展開・体言止め/短文の連続）
テロップ：「◯◯」「◯◯」「◯◯」…（実例のように複数の短いフレーズを並べる）
映像指示：◯◯

22-30秒（CTA）
テロップ：「関節ブリージングメソッドセミナー」
映像指示：◯◯
---`;

  $("#out-jbm").textContent=p;
  $("#out-jbm").classList.remove("empty");
  $("#ci-jbm").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= フック診断担当 ================= */
$("#btn-gen-diag").addEventListener("click",()=>{
  const hook=$("#dg-hook").value.trim();
  if(!hook){alert("診断したいフックを貼り付けてください");return;}
  const target=$("#dg-target").value;

  const p=`あなたはショート動画のフック診断のプロです。以下のフックを評価し、改善案を出してください。

${JBM_AXIS}

${JBM_STYLE_GUIDE}

■ このフックの対象
${target}

■ 診断対象のフック
${hook}

■ 評価基準（それぞれA/B/Cで評価し、理由を添えること）
1. 最初の2秒で「え？」「気になる」と思わせられているか
2. 対象ペルソナの悩みに直接刺さっているか（抽象的すぎないか）
3. 実例（「概念を覆す」「人生を変える」等）と同じ、断言・宣言型になっているか（疑問形は基本的に避ける）
4. 実例のフレーズ畳みかけスタイルと調子が合っているか（説明的になっていないか）
5. 具体性があるか（誰にでも言えるような一般論になっていないか）

■ 弱いと判定した場合
- なぜ弱いのかを一言で言語化すること
- 実例のスタイル（断言・宣言型）に沿った改善案を3パターン提示すること

${YAKKIHO_RULES}

【出力形式】
診断結果（5項目の評価）→総評→改善案3パターン、の順で出力してください。`;

  $("#out-diag").textContent=p;
  $("#out-diag").classList.remove("empty");
  $("#ci-diag").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 月一セミナー担当 ================= */
function buildKbSelect(){
  const sel=$("#mo-kb");
  const gT=document.createElement("optgroup");
  gT.label="セミナー知識（14テーマ）";
  KNOWLEDGE_THEMES.forEach(t=>{
    const o=document.createElement("option");
    o.value=t.id;o.textContent=t.title;
    gT.appendChild(o);
  });
  sel.appendChild(gT);
}
function calcDays(){
  const s=$("#mo-start").value,e=$("#mo-event").value;
  const box=$("#mo-calc");
  if(!s||!e){box.classList.remove("show");return null;}
  const start=new Date(s),event=new Date(e);
  const diff=Math.round((event-start)/86400000)+1;
  if(diff<1){box.classList.add("show");box.innerHTML="⚠ 開催日が開始日より前になっています";return null;}
  const perday=parseInt($("#mo-perday").value);
  box.classList.add("show");
  box.innerHTML=`投稿期間：<b>${diff}日間</b>（開催日当日を含む）× 1日${perday}枚 = 合計 <b>${diff*perday}枚</b>`;
  return diff;
}
["mo-start","mo-event","mo-perday"].forEach(id=>$("#"+id).addEventListener("change",calcDays));

$("#btn-gen-monthly").addEventListener("click",()=>{
  const announce=$("#mo-announce").value.trim();
  if(!announce){alert("冨永さんからの案内文を貼り付けてください");return;}
  const kv=$("#mo-kb").value;
  const kb=kv?KNOWLEDGE_THEMES.find(t=>t.id===kv):null;
  const days=calcDays();
  const perday=$("#mo-perday").value;
  const startD=$("#mo-start").value.replace(/-/g,"/");
  const eventD=$("#mo-event").value.replace(/-/g,"/");
  const period=days?`${startD}（開始）〜${eventD}（開催日）の${days}日間`:"[開始日]〜[開催日]の[◯]日間";

  const parts=[`あなたはInstagramストーリーズの構成とセミナー集客のプロです。以下の案内文をもとに、開催日までのストーリーズ投稿スケジュールを作成してください。`,
"",`■ 案内文（この5つの切り口・フック・開催情報を抽出して使うこと）
${announce}`];

  if(kb)parts.push("",`■ 関連する専門知識ベース（厚みとして活用。事実の根拠とすること）
${kb.body}`,"",HALLUCINATION_RULES);

  parts.push("",`■ 対象読者
一般層のみを対象にすること（取扱店・セラピストへの告知は専用LINEで別途行われているため、ここでは考慮不要）`,
"",`■ 投稿期間
${period}
1日あたり${perday}投稿（期間合計${days?days*parseInt(perday)+"枚":"[合計枚数]"}）`,
"",`■ 構成ルール
- 案内文にある複数の切り口を、開催日までの日程に自然に振り分けること（1日1〜2切り口を目安に）
- 序盤：フック（新規性・驚き）を強めに
- 中盤：案内文の切り口を使った価値提示
- 終盤：セミナー申込への誘導。「取扱店になれば無料になる」という一言もどこかで自然に触れること（セラピスト層への副次的な興味喚起として）
- 各日の1枚目は次をタップしたくなるフックにすること
- 1枚あたりのテキストは50字以内
- 開催日が近づくほど申込の緊急性を高めること（誠実な範囲で。虚偽の限定表現は使わないこと）`,
"",YAKKIHO_RULES,
"",`【出力形式】
日ごとに以下の形式で出力してください。
---
◯日目（[日付]）テーマ：[その日のテーマ・使う切り口]
1枚目
テキスト：[画面に載せる文字]
演出：[背景・素材の指示]
2枚目
…
---`);

  const p=parts.join("\n");
  $("#out-monthly").textContent=p;
  $("#out-monthly").classList.remove("empty");
  $("#ci-monthly").textContent="約"+p.length.toLocaleString()+"字";
});

/* ================= 秘書担当 ================= */
const LS_TASKS="seminar-hub-tasks-v1";
const TASK_ST=["未着手","進行中","完了"];
let tasks=[];
try{tasks=JSON.parse(localStorage.getItem(LS_TASKS))||[];}catch(e){tasks=[];}
function saveTasks(){try{localStorage.setItem(LS_TASKS,JSON.stringify(tasks));}catch(e){}}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

$("#btn-add-task").addEventListener("click",()=>{
  const t=$("#tk-title").value.trim();
  if(!t){alert("制作物名を入力してください");return;}
  tasks.push({title:t,type:$("#tk-type").value,status:"未着手"});
  saveTasks();
  $("#tk-title").value="";
  renderTasks();
});
function renderTasks(){
  const tb=$("#task-table tbody");tb.innerHTML="";
  if(!tasks.length){tb.innerHTML=`<tr><td colspan="4" class="empty-row">制作物がまだ登録されていません</td></tr>`;return;}
  tasks.forEach((t,i)=>{
    const tr=document.createElement("tr");
    const stCls="s"+TASK_ST.indexOf(t.status);
    tr.innerHTML=`<td>${esc(t.title)}</td><td>${esc(t.type)}</td>
      <td><select data-i="${i}">${TASK_ST.map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select> <span class="pill ${stCls}">${esc(t.status)}</span></td>
      <td><button class="del-x" data-i="${i}" aria-label="削除">✕</button></td>`;
    tb.appendChild(tr);
  });
  tb.querySelectorAll("select").forEach(el=>el.addEventListener("change",()=>{
    tasks[Number(el.dataset.i)].status=el.value;saveTasks();renderTasks();
  }));
  tb.querySelectorAll(".del-x").forEach(b=>b.addEventListener("click",()=>{
    const i=Number(b.dataset.i);
    if(confirm(`「${tasks[i].title}」を削除しますか？`)){tasks.splice(i,1);saveTasks();renderTasks();}
  }));
}

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
buildKbSelect();
renderTasks();
