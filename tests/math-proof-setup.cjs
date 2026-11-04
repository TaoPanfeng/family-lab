'use strict';
const P=require('../projects/math/proofs.js'),V=require('../projects/math/proof-engine.js');
for(const name of ['elementary','geometry','advanced','foundations'])require('../projects/math/proof-'+name+'.js')(P,V);
module.exports={P,V};
