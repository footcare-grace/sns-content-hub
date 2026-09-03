"use strict";
/* ================================================================
   research_data.js
   週次Threads需要リサーチ（02_SNS運用トレンド/配下）から抽出した
   「転用可能な型」を蓄積するファイル（上書きせず、増えていく方式）。

   設計方針（2026-09-01改訂）：
   ・過去に採用した型は削除しない。status で「現役」か「過去」かを区別する
   ・新しい週で選んだ型は status:"active" として追加
   ・前週まで active だった型は自動では消さない。
     使わなくなったと判断したら、手動で status を "past" に変更する
     （="前の方が良かった"となった時、いつでも active に戻せる）
   ・実績（threads.html の insightLog）と type.id を突き合わせることで、
     型ごとの効果を後から振り返られる

   更新方法：
   新しいレポートが出たら、このチャットで「今週の候補見せて」と伝え、
   選んだ型を TYPE_LIBRARY の配列に「追加」する（既存の要素は消さない）。
   ================================================================ */

const RESEARCH_SOURCE_LOG = [
  {
    updated: "2026-08-12",
    reportPath: "threads-research-vault/02_SNS運用トレンド/2026-08-12-threads-trend-research.md",
    adoptedTypeIds: ["checklist", "myth_break", "number_warning", "case_study", "testimonial"]
  },
  {
    updated: "2026-08-27",
    reportPath: "weekly-research-public/02_SNS運用トレンド/2026-08-27-threads-trend-research.md",
    adoptedTypeIds: ["attribute_empathy", "myth_reversal"]
  },
  {
    updated: "2026-09-01",
    reportPath: "weekly-research-public/02_SNS運用トレンド/2026-09-01-threads-trend-research.md",
    adoptedTypeIds: ["mechanism_bullet"]
  }
];

const TYPE_LIBRARY = [
  {
    id: "checklist",
    name: "チェックリスト自己診断型",
    summary: "具体的な身体症状を☑形式で並べ、自己診断させてから解決策へつなげる",
    example: "「☑重い☑張っている☑なんとなく違和感」→そのサイン、不安ではないですか？",
    fit: "一般層（立ち仕事・むくみ・浮き指などタクミの主要客層）",
    firstAdopted: "2026-08-12",
    status: "past"
  },
  {
    id: "myth_break",
    name: "通説否定・反省型",
    summary: "一般に信じられている俗説を示してから、専門知識でそれを覆すフック",
    example: "「土踏まずが高い＝良い足」は間違いです、のような形",
    fit: "インソール・足のアーチ・浮き指などタクミの専門領域と相性が良い",
    firstAdopted: "2026-08-12",
    status: "past"
  },
  {
    id: "number_warning",
    name: "数字・データ示唆×警告型",
    summary: "具体的な数字や意外な事実を先に示し、放置した場合の悪影響→ナンバリングで具体策",
    example: "「今、子どもの3人に1人が浮き指」→放置すると◯◯に→❶❷❸の対策",
    fit: "一般層・セラピスト層どちらにも刺さる万能フック。タクミの統計データがあれば即転用可",
    firstAdopted: "2026-08-12",
    status: "past"
  },
  {
    id: "case_study",
    name: "症例解説型",
    summary: "実際の症例・臨床データを専門用語込みで淡々と提示する構成",
    example: "「浮き指、開張足、ハイアーチ、左右の踵内反/外反」のような専門的な足型診断の提示",
    fit: "セラピスト層向け（月1〜2回程度の頻度で専門アカウントとしての信頼性を確保）",
    firstAdopted: "2026-08-12",
    status: "past"
  },
  {
    id: "testimonial",
    name: "体験談×商品/セルフケア紹介型",
    summary: "一人称の率直な体験談として商品・セルフケアを紹介。口語表現で広告色を薄める",
    example: "「装着して歩いたら、足の安定感が全然違った」のような口コミ調の一人称体験談",
    fit: "「試してみないとわからない」インソールという商材の性質上、レビュー投稿に有効",
    firstAdopted: "2026-08-12",
    status: "past"
  },
  {
    id: "attribute_empathy",
    name: "属性呼びかけ＋あるある共感型",
    summary: "「〇〇の仕事をしているみなさんへ」「〇〇したことない人いますか？」と属性・行動を特定してから、あるある共感を誘う。リプライ・保存を狙いやすい",
    example: "「立ち仕事のみなさん、夕方になると靴がきつくなりませんか？」「子供の靴、かかとがすり減ってから買い替えてる人いますか？」",
    fit: "一般層（立ち仕事の人・子育て中の親など、タクミの主要客層に直接語りかけられる）",
    firstAdopted: "2026-08-27",
    status: "active",
    note: "2026-09-01の調査でも継続して有効性を確認（2週連続で最優先度）"
  },
  {
    id: "myth_reversal",
    name: "常識否定・逆張り型",
    summary: "「実は〇〇は誤解」「湿布よりこれ」のように、読者が信じている常識を一度否定してから正しい知識を提示する",
    example: "「インソールは“痛いところ”に厚みを入れるものだと思っていませんか？実は逆で、痛くない場所の機能を取り戻すためのものです」",
    fit: "一般層・セラピスト層の両方（専門性のアピールと意外性による拡散力を両立できる）",
    firstAdopted: "2026-08-27",
    status: "active"
  },
  {
    id: "mechanism_bullet",
    name: "メカニズム箇条書き型",
    summary: "身体の連動を「〇〇すると→△△になる→□□が高まる」のように矢印でつなぐ箇条書きで、テンポよく提示する。専門性訴求と読みやすさを両立できる",
    example: "「踵荷重で起きる変化：踵で踏めると大臀筋・ハムストリングが働きやすい→股関節主導の動きになる→骨盤の安定性が高まる」\n転用例：「インソールで起きる変化：接地の順番が変わる→足裏のセンサーが働きやすくなる→歩行が安定する→膝・腰への負担が減る」",
    fit: "セラピスト層向け（専門性訴求）。knowledge_data.js内の各テーマの「展開順序」ロジックとそのまま組み合わせやすい",
    firstAdopted: "2026-09-01",
    status: "active"
  }
];

/* ================= 互換用（既存app.jsが参照する変数名をそのまま維持） =================
   ハブ側のapp.jsは RESEARCH_TYPES（配列）を参照しているため、
   「現在active な型」だけを抽出したものをこの名前でも公開しておく。
   過去の型も含めて全部見せたい場合は TYPE_LIBRARY を直接参照すること。
================================================================================= */
const RESEARCH_TYPES = TYPE_LIBRARY.filter(t => t.status === "active");
const RESEARCH_SOURCE = RESEARCH_SOURCE_LOG[RESEARCH_SOURCE_LOG.length - 1];
