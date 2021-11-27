import React, { useEffect, useMemo, useRef } from 'react';
import { Glview } from "./modules/glview.js";
import prog, {getProg} from "./zemm.js";
import MT from './mersenne.js';
import{name_select, enumeration} from './namegen.js';
const {min, max, abs, round, floor} = Math;

// Required style metadata
const styleMetadata = {
  name: '',
  description: '',
  image: '',
  creator_name: 'Zemm/Shellder',
  options: {
    mod1: 0.,
    mod2: 0.3,
    mod3: 0.,
    mod4: 0.5,
  },
};
export { styleMetadata };

const glob = {
	init : 0,
	glview : null,
	prog: null,
	coord : [0,0]
};

function lerp(n, a, b){
	return n*(b-a)+a;
}

function fract(f){
	return f-floor(f);
}

// gist.github.com/gpiffault/10556503
function piecewise(x, xs, ys) {
    var lo = 0, hi = xs.length - 1;
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (x < xs[mid]) hi = mid;
      else lo = mid;
    }
    return ys[lo] + (ys[hi] - ys[lo]) / (xs[hi] - xs[lo]) * (x - xs[lo]);
};

function hash11(f){
    f = fract(f * .1031);
    f *= f + 33.33;
    f *= f + f;
    return fract(f);
}

function wbool(r, w){
	return abs(.5-r)*2. > w ? 0 : 1;
}

function genAttributes(prog, name, en){
	let attr = [];
	if(name){
		attr.push({trait_type: 'title',value: name});
	}
	if(prog.uniforms.tex_attr){
		attr.push({trait_type: 'crest',value: 'circular'});
	}
	if(prog.uniforms._oscmixm){
		attr.push({trait_type: 'transformation',value: 'expand'
		});
	}
	if(prog.uniforms.sig_attr){
		attr.push({trait_type: 'transformation',value: 'ripple'});
	}
	let radiance = (prog.uniforms.sat+prog.uniforms.cont)*20;
	radiance = Math.floor(radiance*1000)*.001;
	attr.push({trait_type: 'radiance',value: radiance});
	if(en){
		attr.push({trait_type: en.trait,value: en.value});		
	}
	return attr;
}

const r_const = 3;

function block_handler(prog, block, print){
	let s = block.hash.slice(0, 16);
	let num = parseInt(s, 16);
	let v1 = new MT(num+r_const).random();
	let v2 = new MT(num*3).random();

	let a = round(v1*(prog.etc.texlen_a-1));
	let b = round(v2*(prog.etc.texlen_b-1));
	let c = round(999*v1*v2%(prog.etc.texlen_a-1));

	prog.uniforms.idx = a;
	prog.uniforms.idx2 = b;
	prog.uniforms.idxr = c;
	prog.uniforms.offs = v1;
	let n = min(lerp(v2, .5, 1.1), 1);
 	prog.uniforms._div =  n;
 	prog.uniforms.sat = v1*.4;
 	prog.uniforms.cont = v2*.1;

    // doublemage, expand, ripple
    //99, 300, 40 per 1000
 	let weights = [.099, .3, .04];  
 	prog.rare = rare_handler(prog, v1, weights, (p)=>{
 		if(p.uniforms.idx == 8 && p.uniforms.idx2 == 7 ){
 			prog.uniforms._oscmixm = 1;
 		}
 	});
 	prog.name = name_select(v1);
 	let en = enumeration(v1);
 	glob.attributes = genAttributes(prog, name, en);
	return prog.uniforms;
}

function rare_handler(prog, r, weights, uniformrule){
	let rare = weights.map(w => wbool(r, w));
	prog.uniforms.tex_attr = rare[0];
	prog.uniforms._oscmixm = rare[1];
	prog.uniforms.sig_attr = rare[2];	
	if(uniformrule) uniformrule(prog);
	return (rare[0]||rare[1]||rare[2]) ? rare.join(', ') : '';
}

function mod_handler(prog, mod1, mod2, mod3, mod4, mod5, mod6){
	let t = lerp(mod1, .026, 1.);
	let a = piecewise(t, [0,.49,.6,.67,.718,.883,1],[1,.99,.9,.322,.144,.008,0]); 
	let b = piecewise(t, [0,.482,.606,.7,.846,.92,1],[.05,.79,.514,.3,.395,.554,.936]); 
	prog.uniforms.select_lev = a;
	prog.uniforms._mlev = b;
	prog.uniforms._rlev = lerp(t, .2, .6);
	prog.uniforms._oscmixr = mod2;
	prog.uniforms._sdf = mod3*.05;
	prog.uniforms.texmix = lerp(mod4, .32, .68);
	prog.uniforms.offs_fine = 0; 
}

function useAttributes(ref) {
	useEffect(() => {
		ref.current = () => {
			return {
				attributes : glob.attributes
		};
	};
	}, [ref]);
}

const Display = ({canvasRef, block, width, height, animate, mod1, mod2, mod3, mod4, attributesRef, handleResize, ...props}) =>{
	useAttributes(attributesRef);

	useEffect(() => {
		
		glob.prog = getProg(block_handler(prog, block));
		glob.glview = new Glview(canvasRef.current, glob.prog);
		window.sceneprog = glob.prog;
	 	console.log(prog.name, prog.rare);
 		console.log(glob.attributes);

		return ()=>{
			if(glob.glview){glob.glview.switchPogram(-1);}
		}

	}, [block]);

	useEffect(() =>{	
		mod_handler(glob.prog, mod1, mod2, mod3, mod4);
	},[mod1, mod2, mod3, mod4]);

	return useMemo(() => {
		return(
			<canvas
				width={width}
				height={height}
				style={{ width: '100%', height: '100%' }}
				// style={{ width: '78%', height: '68.25%' }}
				ref={canvasRef}
				{...props}
			/>
		);
	}, [canvasRef]);
};

export default Display;