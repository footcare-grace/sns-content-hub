"use strict";
/* 共通ドット絵マスコット描画（音楽制作ツールと同系統のシンプル可愛い路線）
   既存の app.js 等とは完全に独立しており、id/class の衝突はありません。 */
(function(){
  function px(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}

  // 24x24 グリッドのドット絵。type ごとに小物・ポーズを変える。
  function frame(type,body){
    const skin="#ffd9b0", hair="#3a2e22", cheek="#ffb6b6", white="#ffffff", dark="#26271f";
    const base=[
      // 頭（丸め）
      {x:8,y:2,w:8,h:2,c:hair},
      {x:7,y:4,w:10,h:6,c:skin},
      {x:7,y:4,w:10,h:2,c:hair},
      {x:9,y:7,w:1,h:1,c:dark},{x:14,y:7,w:1,h:1,c:dark}, // 目
      {x:9,y:9,w:1,h:1,c:cheek},{x:14,y:9,w:1,h:1,c:cheek}, // ほっぺ
      // 体
      {x:7,y:10,w:10,h:7,c:body},
    ];
    const extras={
      typing:[ // パソコンを打つ：机+ノートPC、腕を前に
        {x:5,y:17,w:14,h:2,c:"#d8cbb0"},
        {x:6,y:14,w:12,h:3,c:"#e8ecef"},
        {x:6,y:13,w:12,h:1,c:"#c7cdd3"},
        {x:5,y:11,w:2,h:4,c:skin},{x:17,y:11,w:2,h:4,c:skin}
      ],
      writing:[ // ペンで書く：紙+ペン
        {x:6,y:15,w:10,h:4,c:"#ffffff"},
        {x:7,y:16,w:6,h:1,c:"#c7cdd3"},
        {x:7,y:18,w:8,h:1,c:"#c7cdd3"},
        {x:14,y:12,w:1,h:5,c:"#f2b134"},
        {x:5,y:11,w:2,h:5,c:skin}
      ],
      phone:[ // 電話中：受話器を耳に
        {x:16,y:6,w:3,h:2,c:"#3a3a3a"},
        {x:17,y:8,w:2,h:4,c:skin},
        {x:15,y:11,w:2,h:5,c:skin}
      ],
      camera:[ // カメラで撮影
        {x:6,y:13,w:10,h:6,c:"#2b2b2b"},
        {x:9,y:14,w:4,h:4,c:"#6fb7d9"},
        {x:5,y:11,w:2,h:4,c:skin},{x:17,y:11,w:2,h:4,c:skin}
      ],
      drawing:[ // タブレットでデザイン
        {x:6,y:14,w:12,h:5,c:"#20242b"},
        {x:7,y:15,w:10,h:3,c:"#eef1f5"},
        {x:5,y:11,w:2,h:4,c:skin}
      ]
    };
    return base.concat(extras[type]||[]);
  }

  window.drawMascot=function(canvasId,type,bodyColor){
    const cv=document.getElementById(canvasId);
    if(!cv) return;
    const ctx=cv.getContext("2d");
    const scale=cv.width/24;
    ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,cv.width,cv.height);
    frame(type,bodyColor||"#5b8def").forEach(r=>{
      px(ctx,r.x*scale,r.y*scale,r.w*scale,r.h*scale,r.c);
    });
  };
})();
