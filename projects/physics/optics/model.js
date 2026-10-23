/* SI-unit models. No animation coordinate enters the numerical solver. */
(function(root){'use strict';const C=299792458;
 const finite=(v,name)=>{if(!Number.isFinite(v))throw Error('Invalid '+name);return v;};
 function sinc(x){return Math.abs(x)<1e-8?1-x*x/6:Math.sin(x)/x;}
 function parameters(p){const lambda=finite(p.wavelength,'wavelength')*1e-9,d=finite(p.separation,'separation')*1e-3,a=finite(p.width,'width')*1e-3,L=finite(p.distance,'distance');if(lambda<=0||a<=0||d<=a||L<=0)throw Error('Require λ > 0, 0 < slit width < separation, L > 0');return{lambda,d,a,L};}
 function doubleSlit(p,yMillimeters){const {lambda,d,a,L}=parameters(p),y=finite(yMillimeters,'screen y')/1000,sinTheta=y/Math.hypot(L,y),delta=d*sinTheta,beta=Math.PI*a*sinTheta/lambda,envelope=sinc(beta)**2,interference=Math.cos(Math.PI*delta/lambda)**2;
  const mode=p.mode||'double';if(!['double','single','incoherent'].includes(mode))throw Error('Unknown coherence mode');
  return{intensity:envelope*(mode==='double'?interference:1),envelope,interference,delta,phase:2*Math.PI*delta/lambda,fringeMillimeters:lambda*L/d*1000,firstEnvelopeMin:Math.asin(Math.min(1,lambda/a)),farFieldNumber:((d+a)/2)**2/(lambda*L)};
 }
 function fizeau(p,t=1){const teeth=finite(Number(p.teeth),'teeth'),length=finite(p.length,'mirror distance')*1000,f=finite(p.frequency,'frequency');if(teeth<1||!Number.isInteger(teeth)||length<=0||f<0||!Number.isFinite(t)||t<0||t>1)throw Error('Invalid wheel experiment');
  const roundTrip=2*length/C,firstDark=C/(4*length*teeth),pitchShift=f*roundTrip*teeth,phase=((pitchShift%1)+1)%1;
  const transmission=Math.abs(2*phase-1),angle=2*Math.PI*f*roundTrip*t;
  return{teeth,length,f,roundTrip,firstDark,pitchShift,transmission,elapsed:roundTrip*t,angle,angleDegrees:angle*180/Math.PI,
   pulseReturned:t===1,pulseBlocked:phase>.25&&phase<.75,inferredC:4*length*teeth*f,firstMinimum:Math.abs(f/firstDark-1)<.015};
 }
 const api={C,sinc,parameters,doubleSlit,fizeau};root.OpticsModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
