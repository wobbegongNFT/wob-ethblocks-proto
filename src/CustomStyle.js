import React, { useEffect, useMemo, useRef } from 'react';
import { Glview } from "./modules/glview.js";
import prog from "./zemm.js";
// import * as dat from "./modules/dat.gui.module.min.js";
import MT from './mersenne.js';
import name_select from './namegen.js';
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

function genAttributes(prog, name){
	let attr = [];
	if(name){
		attr.push({
			 trait_type: 'title',
			 value: name
		});
	}
	if(prog.uniforms.tex_attr){
		attr.push({
			 trait_type: 'crest',
			 value: 'circular'
		});
	}
	if(prog.uniforms._oscmixm){
		attr.push({
			 trait_type: 'transformation',
			 value: 'expand'
		});
	}
	if(prog.uniforms.sig_attr){
		attr.push({
			 trait_type: 'transformation',
			 value: 'ripple'
		});
	}
	return attr;
}


const glob = {
	glview : null,
	attributes : []
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

// shadertoy.com/view/4djSRW
function hash11(f){
    f = fract(f * .1031);
    f *= f + 33.33;
    f *= f + f;
    return fract(f);
}

function wbool(r, w){
	return abs(.5-r)*2. > w ? 0 : 1;
}

function block_handler(prog, block){
	let s = block.hash.slice(0, 16);
	let num = parseInt(s, 16);
	let v1 = new MT(num+3).random();
	let v2 = new MT(num*3).random();

	let a = round(v1*(prog.etc.texlen_a-1));
	let b = round(v2*(prog.etc.texlen_b-1));
	let c = round(999*v1*v2%(prog.etc.texlen_a-1));
	// let c = floor(hash11(6.*(3.3+a+b))*11.);

	prog.uniforms.idx = a;
	prog.uniforms.idx2 = b;
	prog.uniforms.idxr = c;
	prog.uniforms.offs = v1;

	let n = min(lerp(v1, .45, 1.1), 1);
 	prog.uniforms._div =  n;

    // doublemage, expand, ripple
 	let weights = [.1, .22, .05];  
 	let rare = rare_handler(prog, v1, weights, (p)=>{
 		if(p.uniforms.idx == 8 && p.uniforms.idx2 == 7 ){
 			prog.uniforms._oscmixm = 1;
 		}
 	});
 	let name = name_select(v1);
 	glob.attributes = genAttributes(prog, name);
 	let _i = window.blabel ? window.blabel.innerHTML : '';
 	console.log(_i, name, rare);
 	if(glob.attributes.length > 1)
 		console.log(glob.attributes);
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
	let t = lerp(mod1, .02, 1.);
	let a = piecewise(t, [0,.49,.6,.67,.718,.883,1],[1,.99,.9,.322,.144,.008,0]); 
	let b = piecewise(t, [0,.482,.606,.7,.846,.92,1],[.05,.79,.514,.3,.395,.554,.936]); 
	prog.uniforms.select_lev = a;
	prog.uniforms._mlev = b;
	prog.uniforms._rlev = lerp(t, .2, .6);

	prog.uniforms._oscmixr = mod2;
	prog.uniforms._sdf = mod3*.05;

	prog.uniforms.texmix = min(max(.3, mod4), .7);
	prog.uniforms.offs_fine = 0; 
}

function addGUI(glview, parentel){
	const gui = new dat.GUI({ autoPlace: false });
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.display = 'inlineBlock'
	gui.domElement.float = 'right'
	gui.domElement.style.top = '2px'
	gui.domElement.style.marginLeft = '68%'
	parentel.appendChild(gui.domElement);
	gui.__closeButton.style.visibility = "hidden";
	glview.initGui(gui);
}

function useAttributes(ref) {
  // Update custom attributes related to style when the modifiers change
  useEffect(() => {
    ref.current = () => {
      return {
        // This is called when the final image is generated, when creator opens the Mint NFT modal.
        // should return an object structured following opensea/enjin metadata spec for attributes/properties
        // https://docs.opensea.io/docs/metadata-standards
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema
        attributes : glob.attributes
      };
    };
  }, [ref]);
}

const Display = ({canvasRef, block, width, height, animate, mod1, mod2, mod3, mod4, attributesRef, handleResize, ...props}) =>{

	useAttributes(attributesRef);

	//init
	useEffect(() => {
		glob.glview = new Glview(canvasRef.current, prog);
		// addGUI(glob.glview, document.querySelector('#root'));
		window.sceneref = glob.glview.programs[0];
		window.blabel = document.querySelector('.value-label');
		return ()=>{
			if(glob.glview){glob.glview.switchPogram(-1);}
		}

	}, [canvasRef]);

	//block update
	useEffect(() =>{

		block_handler(prog, block);

	},[block]);

	//mod update
	useEffect(() =>{	

		mod_handler(prog, mod1, mod2, mod3, mod4);

	},[mod1, mod2, mod3, mod4]);

	return useMemo(() => {
		return(
			<canvas
				width={width}
				height={height}
				style={{ width: '78%', height: '68.25%' }}
				ref={canvasRef}
				{...props}
			/>
		);
	}, [canvasRef]);
};

export default Display;