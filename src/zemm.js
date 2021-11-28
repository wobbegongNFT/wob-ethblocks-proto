import fs from "./zemm-fs.js";
// import base64 from '../resources/base64curated.js';
import base64 from '../resources/base64test.js';

/*
const tex_options = {
	target: 'TEXTURE_2D_ARRAY',
	src: base64.mage,
    min: 'LINEAR',
    mag: 'NEAREST',
    width: 1024,
    height: 1024
};
*/

function make_tex_options(src){
	return {
		target: 'TEXTURE_2D',
		src: src,
	    min: 'LINEAR',
	    mag: 'NEAREST',
	    width: 1024,
	    height: 1024
	};
}

const tex_len = {texlen_a: base64.mage.length, texlen_b: base64.toa.length };

const prog = {
	 // res: { width: 800, height: 600},
	 fs: fs,
	 // textures: [{u_sampler : tex_options}, {u_sampler2 : tex_options2}, {u_sampler3 : tex_options3}],
	 uniforms: {
	 	// _rlev: .08,
	 	idx: 0,
	 	idx2: 0,
	 	idxr: 0,
	 	texmix: 0.5,
	 	zoom: 0.09,
	 	offs: 0,
	 	_div: .8,
	 	_drift : .6,
	 	_invert: 1.,
	 	sat:1,
	 	cont: 1
	 	// _oscmixm: .3
	 },
	 // rendercb : rendercb,
	  // gui: gui,
	  // on: false
	 clearcolor: [0.2, 0.8, 0.0, 1],
	 etc : tex_len
};

function getProg(u){
	return{
	 fs: fs,
	 textures: [{u_sampler : make_tex_options(base64.mage[u.idx])}, 
				 {u_sampler2 : make_tex_options(base64.toa[u.idx2])}, 
				 {u_sampler3 : make_tex_options(base64.mage[u.idxr])}],
	 uniforms: u,
	 etc : tex_len,
	 clearcolor: [0,0,0,1],
	};
}

export default prog;
export {getProg};