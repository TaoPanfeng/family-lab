'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
let domLibrary;

/** Real DOM parsing/selectors/events, with a deterministic clock.
 * No rendering/layout assertions are made; those require a real browser.
 */
async function createApp({route='home',mode='kids',storage={},offline=false,scripts=null}={}){
  domLibrary=domLibrary||await import('./vendor/linkedom-worker.mjs');
  const DOM=domLibrary;
  const html=fs.readFileSync(path.join(root,offline?'chemistry-explorer.html':'dist/index.html'),'utf8');
  const parsed=DOM.parseHTML(html);
  const document=parsed.document;
  // LinkeDOM intentionally exposes select.value as read-only; this adapts the
  // standard browser setter without changing application behavior.
  const sd=Object.getOwnPropertyDescriptor(DOM.HTMLSelectElement.prototype,'value');
  if(!sd?.set)Object.defineProperty(DOM.HTMLSelectElement.prototype,'value',{configurable:true,get(){const opts=Array.from(this.querySelectorAll('option'));return (opts.find(o=>o.hasAttribute('selected'))||opts[0])?.value||'';},set(value){this.querySelectorAll('option').forEach(o=>{if(o.value===String(value))o.setAttribute('selected','');else o.removeAttribute('selected');});}});
  if(!DOM.HTMLElement.prototype.scrollIntoView)DOM.HTMLElement.prototype.scrollIntoView=function(){};
  const local=new Map(Object.entries(storage));
  if(!local.has('wanwu-chemistry-v1'))local.set('wanwu-chemistry-v1',JSON.stringify({mode,notes:[],completed:[]}));
  const eventTarget=new DOM.EventTarget();
  let now=0,nextTimer=1;
  const timers=new Map(),errors=[],downloads=[],scrolls=[];
  const setTimer=(fn,ms,interval)=>{const id=nextTimer++;timers.set(id,{fn,at:now+Math.max(Number(ms)||0,1),interval:interval?Math.max(Number(ms)||0,1):0});return id;};
  let hash='#'+route;
  const location={get hash(){return hash;},set hash(value){hash=String(value);setTimer(()=>eventTarget.dispatchEvent(new DOM.Event('hashchange')),1,false);},href:'https://chemistry.test/'+hash,origin:'https://chemistry.test/'};
  const URLClass=class extends URL{};
  URLClass.createObjectURL=blob=>{downloads.push(blob);return'blob:local-test/'+downloads.length;};URLClass.revokeObjectURL=()=>{};
  const context={document,console:{log(){},warn(){},error(...a){errors.push(a.map(x=>x?.stack||String(x)).join(' '));}},location,URL:URLClass,URLSearchParams,Blob,Date,Math,JSON,Number,String,Array,Object,Set,Map,WeakMap,RegExp,Error,TypeError,RangeError,parseInt,parseFloat,isNaN,Intl,Promise,structuredClone,
    performance:{now:()=>now},navigator:{language:'zh-CN',userAgent:'DOM-automated-test'},innerWidth:1280,innerHeight:900,
    localStorage:{getItem:key=>local.get(key)??null,setItem:(key,value)=>local.set(key,String(value)),removeItem:key=>local.delete(key),clear:()=>local.clear()},
    addEventListener:eventTarget.addEventListener.bind(eventTarget),removeEventListener:eventTarget.removeEventListener.bind(eventTarget),dispatchEvent:eventTarget.dispatchEvent.bind(eventTarget),
    setTimeout:(fn,ms)=>setTimer(fn,ms,false),clearTimeout:id=>timers.delete(id),setInterval:(fn,ms)=>setTimer(fn,ms,true),clearInterval:id=>timers.delete(id),
    requestAnimationFrame:fn=>setTimer(()=>fn(now),16,false),cancelAnimationFrame:id=>timers.delete(id),
    matchMedia:query=>({matches:false,media:query,addEventListener(){},removeEventListener(){}}),scrollTo:options=>scrolls.push(options),
    Event:DOM.Event,CustomEvent:DOM.CustomEvent,HTMLElement:DOM.HTMLElement,SVGElement:DOM.SVGElement,Element:DOM.Element,Node:DOM.Node,Document:DOM.Document,
    ResizeObserver:class{observe(){}disconnect(){}},getComputedStyle:()=>({getPropertyValue:()=>''})
  };
  context.window=context;context.globalThis=context;
  vm.createContext(context);
  for(const script of document.querySelectorAll('script')){
    const file=script.getAttribute('src');if(scripts&&file&&!scripts.includes(file))continue;const source=file?fs.readFileSync(path.join(root,'dist',file),'utf8'):script.textContent;
    if(source.trim())new vm.Script(source,{filename:file||'offline-inline.js'}).runInContext(context);
  }
  function tick(ms=20){const end=now+ms;let guard=0;while(true){let chosen=null,id=null;for(const [key,t]of timers){if(t.at<=end&&(!chosen||t.at<chosen.at)){chosen=t;id=key;}}if(!chosen)break;if(++guard>200000)throw Error('Timer loop exceeded');now=chosen.at;if(chosen.interval)chosen.at+=chosen.interval;else timers.delete(id);chosen.fn();}now=end;}
  function el(selector){const node=document.querySelector(selector);if(!node)throw Error('Missing DOM selector: '+selector+' on '+hash);return node;}
  function click(selector){const node=typeof selector==='string'?el(selector):selector;if(node.disabled)throw Error('Cannot click disabled control: '+(typeof selector==='string'?selector:node.outerHTML));node.dispatchEvent(new DOM.Event('click',{bubbles:true,cancelable:true}));tick(2);return node;}
  function input(selector,value,event='input'){const node=el(selector);node.value=String(value);node.dispatchEvent(new DOM.Event(event,{bubbles:true,cancelable:true}));tick(2);return node;}
  function check(selector,value=true){const node=el(selector);node.checked=value;node.dispatchEvent(new DOM.Event('input',{bubbles:true}));node.dispatchEvent(new DOM.Event('change',{bubbles:true}));tick(2);return node;}
  function go(route){location.hash='#'+route;tick(2);}
  function close(){timers.clear();}
  return {window:context,document,el,click,input,check,go,tick,close,errors,downloads,storage:local,text:()=>document.querySelector('#main-content')?.textContent||'',all:selector=>Array.from(document.querySelectorAll(selector))};
}
module.exports={createApp};
