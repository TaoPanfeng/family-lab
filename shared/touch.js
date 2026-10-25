/* Local model gestures only. Never cancel document/body scrolling or page zoom.
 * Pointer IDs survive a second finger; cancellation is never interpreted as a tap. */
(function(root){'use strict';
 function bind(el,options={}){
  const points=new Map();let origin=null,moved=false,multiple=false,suppressUntil=0;
  const oldAction=el.style.touchAction;el.style.touchAction='none';
  const enabled=()=>!el.closest('[data-touch-mode="scroll"]')&&(!options.enabled||options.enabled());
  const xy=e=>({x:e.clientX,y:e.clientY});
  const distance=()=>{const p=[...points.values()];return p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0;};
  function down(e){
   if(!enabled()||(e.pointerType==='mouse'&&e.button!==0))return;
   if(!points.size){origin=xy(e);moved=false;multiple=false;}
   points.set(e.pointerId,xy(e));if(points.size>1)multiple=true;
   try{el.setPointerCapture(e.pointerId);}catch(_){}
  }
  function move(e){
   const previous=points.get(e.pointerId);if(!previous)return;
   if(!enabled()){cancel();return;}
   const before=distance();points.set(e.pointerId,xy(e));
   if(points.size===2){const after=distance();if(before>2&&after>2)options.zoom?.(before/after);moved=true;}
   else if(points.size===1){
    if(origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>6)moved=true;
    options.pan?.(e.clientX-previous.x,e.clientY-previous.y);
   }
  }
  function finish(e){
   if(!points.has(e.pointerId))return;
   const tap=e.type==='pointerup'&&points.size===1&&!moved&&!multiple&&enabled()&&origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)<=6;
   points.delete(e.pointerId);
   if(moved||multiple||e.type!=='pointerup')suppressUntil=Date.now()+500;
   try{if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);}catch(_){}
   if(!points.size)origin=null;
   if(tap)options.tap?.(e);
  }
  function cancel(){const ids=[...points.keys()];points.clear();origin=null;for(const id of ids)try{if(el.hasPointerCapture(id))el.releasePointerCapture(id);}catch(_){} }
  // Scoped compatibility guard for touch browsers; it never runs on reading areas.
  function touchMove(e){if(enabled()&&points.size&&e.cancelable)e.preventDefault();}
  function click(e){if(e.detail&&Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}}
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);
  for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,finish);
  el.addEventListener('touchmove',touchMove,{passive:false});el.addEventListener('click',click,true);
  return{cancel,active:()=>points.size,dispose(){cancel();el.style.touchAction=oldAction;el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);for(const type of ['pointerup','pointercancel','lostpointercapture'])el.removeEventListener(type,finish);el.removeEventListener('touchmove',touchMove);el.removeEventListener('click',click,true);}};
 }
 root.LabTouch={bind};
})(window);
