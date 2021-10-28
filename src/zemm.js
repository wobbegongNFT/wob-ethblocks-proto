import {fs} from "./zemm-fs.js";
import base64 from '../resources/base64curated.js';

const tex_options = {
	target: 'TEXTURE_2D_ARRAY',
	src: base64.mage,
    min: 'LINEAR',
    mag: 'NEAREST',
    width: 1024,
    height: 1024
};

const tex_options2 = {
	target: 'TEXTURE_2D_ARRAY',
	src: base64.toa,
    min: 'LINEAR',
    mag: 'NEAREST',
    width: 1024,
    height: 1024
};

const gui = {
	name: 'zemm',
	open: true,
	switch: false,
	fields: [

		{
			idx : 0,
			min: 0,
			max: tex_options.src.length-1,
			step: 1,
			onChange: (val)=>{
				prog.uniforms.idx = val;
			}
		},
		{
			idx2 : 0,
			min: 0,
			max: tex_options2.src.length-1,
			step: 1,
			onChange: (val)=>{
				prog.uniforms.idx2 = val;
			}
		},
		{
			texmix : 0,
			min: 0,
			max: 1,
			step: .01,
			onChange: (val)=>{
				prog.uniforms.texmix = val;
			}
		},
		{
			zoom : 0,
			min: 0,
			max: 1,
			step: .01,
			onChange: (val)=>{
				prog.uniforms.zoom = val;
			}
		},
		{
			offs : 0,
			min: 0,
			max: 1,
			step: .001,
			onChange: (val)=>{
				prog.uniforms.offs = val;
			}
		},
		{
			col_select : 0,
			min: 0,
			max: 1,
			step: .01,
			onChange: (val)=>{
				prog.uniforms.select_lev = val;
			}
		},
		{
			div : .8,
			min: .4,
			max: 1,
			step: 0.01,
			onChange: (val)=>{
				prog.uniforms._div = val;
			}
		},
		{
			lev : 0,
			min: 0,
			max: 1,
			step: 0.01,
			onChange: (val)=>{
				prog.uniforms._mlev = val;
			}
		},
		/*
		{
			m_oscmix : 0,
			min: 0,
			max: 1,
			step: 0.01,
			onChange: (val)=>{
				prog.uniforms._oscmixm = val;
			}
		},
		*/
		// {
		// 	r_lev : .08,
		// 	min: .08,
		// 	max: .4,
		// 	step: 0.01,
		// 	onChange: (val)=>{
		// 		prog.uniforms._rlev = val;
		// 	}
		// },
		{
			oscmix : 0,
			min: 0,
			max: 1,
			step: 0.01,
			onChange: (val)=>{
				prog.uniforms._oscmixr = val;
			}
		},
		// {
		// 	drift : .6,
		// 	min: 0,
		// 	max: 1,
		// 	step: 0.01,
		// 	onChange: (val)=>{
		// 		prog.uniforms._drift = val;
		// 	}
		// },
		{
			fract : 0,
			min: 0,
			max: .5,
			step: 0.01,
			onChange: (val)=>{
				prog.uniforms._sdf = val*.1;
			}
		},
		{
			sat : 1,
			min: 0,
			max: 3,
			step: 0.01,
			onChange: (val)=>{
				prog.uniforms.sat = val;
		}
		// {
		// 	post_invert: true,
		// 	onChange: (val)=>{
		// 		prog.uniforms._invert = val ? 1 : 0;
		// 	}
		},
	]

};

const prog = {
	 // res: { width: 800, height: 600},
	 fs: fs,
	 textures: [{u_sampler : tex_options}, {u_sampler2 : tex_options2}],
	 uniforms: {
	 	// _rlev: .08,
	 	idx: 0,
	 	idx2: 0,
	 	texmix: 0.5,
	 	zoom: 0.08,
	 	offs: 0,
	 	_div: .8,
	 	_drift : .6,
	 	// _p05: .05,
	 	_invert: 1.,
	 	sat: 1.
	 },
	 // rendercb : rendercb,
	  // gui: gui,
	  // on: false
	 // clearcolor: [0.2, 0.8, 0.0, 1],
	 etc : {texlen_a: base64.mage.length, texlen_b: base64.toa.length }
};

export default prog;