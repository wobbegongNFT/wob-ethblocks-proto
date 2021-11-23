import fs from "./zemm-fs.js";
import base64 from '../resources/base64curated.js';
// import base64 from '../resources/base64test.js';

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
	/*
		{
			sat: 1.,
			min: 1.,//.2,
			max: 2.,
			step: .01,
			onChange: (val)=>{
				prog.uniforms.sat = val;
			}
		},
		{
			contrast: 1.,
			min: 1.,//.2,
			max: 2.,
			step: .01,
			onChange: (val)=>{
				prog.uniforms.cont = val;
			}
		},
		{
			hm: false,
			onChange: (b)=>{
				if(b){
					prog.gui.fields[0].ref.setValue(1.5);
					prog.gui.fields[1].ref.setValue(1.1);
				}else{
					prog.gui.fields[0].ref.setValue(1.);
					prog.gui.fields[1].ref.setValue(1.);
				}
			}
		}
	*/
	 /*
		{
			attr1 : false,
			onChange: (val)=>{
				prog.uniforms.tex_attr = (+val);
			}
		},
		{
			attr2 : false,
			onChange: (val)=>{
				prog.uniforms._oscmixm = (+val);
			}
		},
		{
			attr3 : false,
			onChange: (val)=>{
				prog.uniforms.sig_attr = (+val);
			}
		}
		*/	
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
	 	_invert: 1.,
	 	// sat: 1.12,
	 	sat:1,
	 	cont: 1

	 	// _oscmixm: .3
	 },
	 // rendercb : rendercb,
	  gui: gui,
	  // on: false
	 // clearcolor: [0.2, 0.8, 0.0, 1],
	 etc : tex_len
};

export default prog;