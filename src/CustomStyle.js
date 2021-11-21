import React, { useEffect, useMemo, useRef } from 'react';
import { Glview } from "./modules/glview.js";
import prog from "./zemm.js";
// import testprog from "./julia.js";
import * as dat from "./modules/dat.gui.module.min.js";
// import MT from 'mersenne-twister';
import MT from './mersenne.js';
const {min, max, abs, round, floor} = Math;
/*
<CustomStyle
  width={width}
  block={active ? liveBlocks[liveBlockNumber] : blocks[blockNumber]}
  height={height}
  canvasRef={canvasRef}
  gl={glRef}
  attributesRef={attributesRef}
  handleResize={_onCanvasResize}
  {...snap.options} //mods
/>
*/

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
    // mod5: 0,
    // mod6: 0.,
    // color1: '#fff000',
    // background: '#000000',
  },
};

export { styleMetadata };


const glob = {
	glview : null,
	coord : [0,0]
};

function lerp(n, a, b){
	return n*(b-a)+a;
}

function fract(f){
	return f-floor(f);
}

// https://gist.github.com/gpiffault/10556503
function piecewise(x, xs, ys) {
    var lo = 0, hi = xs.length - 1;
    while (hi - lo > 1) {
      var mid = (lo + hi) >> 1;
      if (x < xs[mid]) hi = mid;
      else lo = mid;
    }
    return ys[lo] + (ys[hi] - ys[lo]) / (xs[hi] - xs[lo]) * (x - xs[lo]);
};

// https://www.shadertoy.com/view/4djSRW
function hash11(f){
    f = fract(f * .1031);
    f *= f + 33.33;
    f *= f + f;
    return fract(f);
}

const rand = new MT(33);

function block_handler(prog, block){
	let s = block.hash.slice(0, 16);
	let num = parseInt(s, 16);
	let v1 = new MT(num+3).random();
	let v2 = new MT(num*3).random();

	let a = Math.round(v1*(prog.etc.texlen_a-1));
	let b = Math.round(v2*(prog.etc.texlen_b-1));
	let c = Math.round(999*v1*v2%(prog.etc.texlen_a-1));
	// let c = floor(hash11(6.*(3.3+a+b))*11.);

	prog.uniforms.idx = a;
	prog.uniforms.idx2 = b;
	prog.uniforms.idxr = c;
	prog.uniforms.offs = v1;
	// console.log(num, a, b, c);

	let n = min(lerp(rand.random(), .45, 1.1), 1);
 	prog.uniforms._div =  n;
}

function mod_handler(prog, mod1, mod2, mod3, mod4, mod5, mod6){
	let t = lerp(mod1, .0, 1.);
	let a = piecewise(t, [0,.49,.6,.67,.718,.883,1],[1,.99,.9,.322,.144,.008,0]); 
	let b = piecewise(t, [0,.482,.606,.7,.846,.92,1],[.05,.79,.514,.3,.395,.554,.936]); 
	prog.uniforms.select_lev = a;
	prog.uniforms._mlev = b;
	prog.uniforms._rlev = lerp(t, .2, .6);

	prog.uniforms._oscmixr = mod2;
	prog.uniforms._sdf = mod3*.05;

	prog.uniforms.texmix = min(max(.2, mod4), .8);
	prog.uniforms.offs_fine = 0; //(mod5-.5)*.77;	
	// prog.uniforms._oscmixm = mod5;
/*
	let rare_attr = round(mod5*5);
	prog.uniforms.rare_attribute1 = (rare_attr == 1 ? 1 : 0);
	prog.uniforms.rare_attribute2 = (rare_attr == 2 ? 1 : 0)
	prog.uniforms.rare_attribute3 = (rare_attr == 3 ? 1 : 0)
	prog.uniforms.rare_attribute4 = (rare_attr == 4 ? 1 : 0)
	prog.uniforms.rare_attribute5 = (rare_attr == 5 ? 1 : 0)
	console.log(rare_attr);
*/
}

function addGUI(glview, parentel){
	const gui = new dat.GUI({ autoPlace: false });
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.display = 'inlineBlock'
	gui.domElement.float = 'right'
	gui.domElement.style.top = '2px'
	// gui.domElement.style.left = '2px'
	gui.domElement.style.marginLeft = '68%'
	parentel.appendChild(gui.domElement);
	gui.__closeButton.style.visibility = "hidden";
	glview.initGui(gui);
}

const Display = ({canvasRef, block, width, height, animate, mod1, mod2, mod3, mod4, /*mod5, mod6,*/ attributesRef, handleResize,...props}) =>{
	/*init*/
	useEffect(() => {
		glob.glview = new Glview(canvasRef.current, prog);
		addGUI(glob.glview, document.querySelector('#root'));
		window.sceneref = glob.glview.programs[0];
		return ()=>{
			if(glob.glview){glob.glview.switchPogram(-1);}
		}
	}, [canvasRef]);

	/*block update*/
	useEffect(() =>{

		block_handler(prog, block);

	},[block]);

	/*mod update*/
	useEffect(() =>{	

		mod_handler(prog, mod1, mod2, mod3, mod4);

	},[mod1, mod2, mod3, mod4]);

	useEffect(() =>{
		console.log('aref', attributesRef);
	},[attributesRef /*, animate, handleResize*/]);

	return useMemo(() => {
		return(
			<canvas
				width={width}
				height={height}
				// style={{ width: '75%', height: '65.625%' }}
				style={{ width: '78%', height: '68.25%' }}
				// style={{ width: '80%', height: '70%' }}
				ref={canvasRef}
				{...props}
			/>
		);
	}, [canvasRef]);
};

export default Display;