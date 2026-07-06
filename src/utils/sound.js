import {ls,lsSet} from '../data/quizData';

let ctx=null;
function getCtx(){
  if(!ctx){
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return null;
    ctx=new AC();
  }
  if(ctx.state==='suspended')ctx.resume();
  return ctx;
}

function note(c,freq,startTime,duration,type,peakGain){
  const osc=c.createOscillator();
  const g=c.createGain();
  osc.type=type;
  osc.frequency.value=freq;
  osc.connect(g);g.connect(c.destination);
  const t=c.currentTime+startTime;
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(peakGain,t+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001,t+duration);
  osc.start(t);
  osc.stop(t+duration+0.02);
}

export function isSoundOn(){return ls('kq_sound_on',true);}
export function setSoundOn(v){lsSet('kq_sound_on',v);}
export function toggleSound(){const v=!isSoundOn();setSoundOn(v);return v;}

function play(fn){
  if(!isSoundOn())return;
  const c=getCtx();
  if(!c)return;
  try{fn(c);}catch{}
}

export function playCorrect(){
  play(c=>{
    note(c,880,0,.11,'sine',.18);
    note(c,1318.5,.07,.16,'sine',.16);
  });
}

export function playWrong(){
  play(c=>{
    note(c,220,0,.22,'sawtooth',.12);
  });
}

export function playStreak(){
  play(c=>{
    note(c,659.25,0,.09,'triangle',.15);
    note(c,830.6,.08,.09,'triangle',.15);
    note(c,1046.5,.16,.16,'triangle',.17);
  });
}

export function playUnlock(){
  play(c=>{
    note(c,523.25,0,.12,'triangle',.16);
    note(c,659.25,.1,.12,'triangle',.16);
    note(c,783.99,.2,.12,'triangle',.16);
    note(c,1046.5,.3,.28,'triangle',.2);
  });
}
