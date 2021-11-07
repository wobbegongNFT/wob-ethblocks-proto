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
	name: 'rare-attributes',
	open: true,
	switch: false,
	fields: [
		{
			attr1 : false,
			onChange: (val)=>{
				prog.uniforms.rare_attribute1 = (+val);
			}
		},
		{
			attr2 : false,
			onChange: (val)=>{
				prog.uniforms.rare_attribute2 = (+val);
			}
		},
		{
			attr3 : false,
			onChange: (val)=>{
				prog.uniforms.rare_attribute3 = (+val);
			}
		},		
		{
			attr4 : false,
			onChange: (val)=>{
				prog.uniforms.rare_attribute4 = (+val);
			}
		},		
		{
			attr5 : false,
			onChange: (val)=>{
				prog.uniforms.rare_attribute5 = (+val);
			}
		},		
	]

};

const tex_len = {texlen_a: base64.mage.length, texlen_b: base64.toa.length };

const prog = {
	 // res: { width: 800, height: 600},
	 fs: fs,
	 textures: [{u_sampler : tex_options}, {u_sampler2 : tex_options2}],
	 uniforms: {
	 	// _rlev: .08,
	 	idx: 0,
	 	idx2: 0,
	 	texmix: 0.5,
	 	zoom: 0.09,
	 	offs: 0,
	 	_div: .8,
	 	_drift : .6,
	 	// _p05: .05,
	 	_invert: 1.,
	 	sat: 1.12,
	 	tex_len_a : tex_len.texlen_a,
	 	tex_len_b : tex_len.texlen_b,
	 	rare_attribute1: 0,
	 	rare_attribute2: 0,
	 	rare_attribute3: 0,
	 	rare_attribute4 : 0,
	 	rare_attribute5: 0
	 	// _oscmixm: .3
	 },
	 // rendercb : rendercb,
	  gui: gui,
	  // on: false
	 // clearcolor: [0.2, 0.8, 0.0, 1],
	 etc : tex_len
};

export default prog;