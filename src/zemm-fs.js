const fs = /*glsl*/ `#version 300 es

	precision mediump float;

	#define rot(a)  mat2(cos(a), -sin(a), sin(a), cos(a))
	#define lerp(n,a,b) (n*(b-a)+a)

	in vec2 v_texcoord;

	uniform mediump sampler2DArray u_sampler;
	uniform mediump sampler2DArray u_sampler2;

	uniform float u_time;
	uniform vec2 u_resolution;
	uniform vec2 u_mouse;

	uniform float _div;
	uniform float _drift;
	uniform float _invert;
	uniform float _sdf;
	uniform float _rlev;

	uniform float rare_attribute;
	uniform float rare_attribute2;
	uniform float rare_attribute3;
	uniform float rare_attribute4;
	uniform float rare_attribute5;

	uniform float tex_len_a;	
	uniform float tex_len_b;	

	uniform float idx;
	uniform float idx2;
	uniform float texmix;
	uniform float zoom;
	uniform float offs;
	uniform float offs_fine;
	uniform float select_lev;

	uniform float time_factor;
	uniform float time_offset;

	uniform float _mlev;
	// uniform float _rlev;

	uniform float _oscmixm;
	uniform float _oscmixr;
	out vec4 fragColor;

	// https://stackoverflow.com/a/46396141
	mat3 satMat(float s){
	    return mat3( 
	        0.213+0.787*s,  0.715-0.715*s,  0.072-0.072*s,
			0.213-0.213*s,  0.715+0.285*s,  0.072-0.072*s,
			0.213-0.213*s,  0.715-0.715*s,  0.072+0.928*s
	    );
	}
	// https://www.shadertoy.com/view/XdcXzn
	mat4 contrastMat(float c){
		float t = (1. - c) / 2.;   
	    return mat4( c, 0, 0, 0,
	                 0, c, 0, 0,
	                 0, 0, c, 0,
	                 t, t, t, 1 );
	}
	// https://www.shadertoy.com/view/4djSRW
	float hash11(float p){
	    p = fract(p * .1031);
	    p *= p + 33.33;
	    p *= p + p;
	    return fract(p);
	}

	vec2 fold(vec2 inp, float n, float m, float sig, float drift, float _sdf){
	    vec2 v = inp;
	    for(float i = 0.; i < n; i++){
	        float b=(i/n)*(1.); //-comp
	        v-=b; //comp
	        v = mod(v*(1.+b*.05),m); //-mod
	        v = (v-.5)*rot(.25*sig)+drift; //-drift
	       // v=mix(v*v,v,.95); //-w
	        v=mix(inp*.01,v,.999-_sdf); //-w
	    }
	    return v;
	}
	// tex_cell(uv, iTime, texture(iChannel0, uv),  texture(iChannel1, uv), 8);
	vec3 tex_cell(vec2 uv, float t, vec3 ta, vec3 tb, int _n){
	  vec3 c;
	  float d = .9;
	    for(int i = 0; i < _n; i++){
	        float a = float(i+2);
	        vec2 v = vec2(cos(a+t)*sin(4.*a),1.2*cos(.4*a+.2*t)*sin(a+t*.8))*.5+.5;
	        float _d = distance(uv,v);
	        if(_d < d){
	            d = _d;
	            vec3 cl = i%2==0 ? ta : tb;
	            c = vec3(1.-d*1.2)*cl;
	        }     
	    }
	    return c;
	}

	vec2 bnc(float t, vec2 v){
		return vec2(sin(v.x*t), sin(v.y*t))*.5+.5;
	}

	float tri(float t){
		return (abs(fract(t)-0.5)*2.0);
	}

	vec2 animv(float t, vec2 v, float amp){
		float a = tri(t*v.x)-0.5;
		float b = tri(t*v.y)-0.5;
		return vec2(a, b)*amp;
	}

	float wobble(vec2 uv, float t, float mm){
	    float d = cos(5.*t+length(uv-(bnc(t,vec2(1.1,1.64))))*mm);
	    d *= cos(5.*t+length(uv-(bnc(t,vec2(1.92,.74))))*mm);
	    d *= cos(2.*t+length(uv-(bnc(t,vec2(.88,1.87))))*mm);
	    return d;
	}

	float ssig(vec2 uv, vec2 v, float _t, float a){
	    float t = _t+dot(uv-v,uv-v)*a;
	    float f = sin(t)+sin(t*1.2)+sin(t*1.4)*.8+sin(t*1.6)*.5;
	    return (f*.5+.5)*.1;		
	}

	vec2 offset(float offs, vec2 coef){
		return vec2(cos(offs*coef.x), sin(offs*coef.y));
	}

	void main(){
		vec2 uv = vec2(1.,-1.)*gl_FragCoord.xy/u_resolution.xy;

		float rotsig = (abs((fract(u_time*.04)-.5))-.25);

		// float _rlev = lerp(_mlev, .08, .4);
		float rot_r = mix(_rlev, rotsig, _oscmixr);

		float mlev = mix(_mlev, rotsig, _oscmixm);

		vec2 tuv = v_texcoord;
		tuv *=(1.-zoom);
		tuv +=.5*zoom;

		float wob = (rare_attribute3 > 0.) ? wobble(tuv, u_time*min(_oscmixr*1.,.4), 8.) : 1.;
		vec2 v = fold(uv, 150., _div, mix(1.,wob,.0)*rot_r, _drift/*-mix(1.,wob,.01)*/, _sdf*mix(1.,wob,.4)); //-n

		vec2 offs1 = offset(offs+offs_fine, vec2(9., 14.));
		vec2 offs2 = offset(offs+offs_fine, vec2(12., 7.));

		vec2 b_anim = (rare_attribute5 > 0.) ? animv(u_time*.03, vec2(4.,3.), .1) : vec2(0.);

		vec3 cta = texture(u_sampler, vec3(tuv, idx)+vec3(offs1,0.)).xyz;
		vec3 ctb = texture(u_sampler2, vec3(tuv-b_anim, idx2)+vec3(offs2,0.)).xyz;

		float idxa_r = floor(hash11(7.*(3.3+idx+idx2))*(tex_len_a-1.));
		float idxb_r = floor(hash11(6.*(3.3+idx+idx2))*(tex_len_b-1.));
		vec2 offsr = offset(offs+offs_fine, vec2(10., 7.));
		vec3 cta_r = texture(u_sampler, vec3(tuv, idxa_r)+vec3(offsr,0.)).xyz;
		vec3 ctb_r = texture(u_sampler2, vec3(tuv-b_anim, idxb_r)+vec3(offsr,0.)).xyz;
		vec3 cta_r2 = tex_cell(tuv, u_time*_oscmixr*.26, cta, ctb_r, 16);

		// ctb = (rare_attribute4 > 0.) ? vec3(0.,1.,0.) : ctb;

		// vec3 cc = mix(mix(cta, cta_r, mixr), ctb, texmix);
		vec3 cc = mix(mix(mix(cta, cta_r*(cta*.5+.5), rare_attribute*.6), cta_r2, rare_attribute2), ctb, texmix);

		float chr = max(max(abs(cc.r-cc.b), abs(cc.r-cc.g)), abs(cc.b-cc.g));

		vec2 uv_shift = mix(tuv,v, mix(1.,wob,.0)*mlev*mix(1.,chr,select_lev));

		float s_sig = (rare_attribute4 > 0.) ? (.9+.1*ssig(tuv, vec2(.28,.8), u_time*5., 44.)) : 1.;

		vec3 ct1 = texture(u_sampler, vec3(uv_shift, idx)+vec3(offs1,0.)).xyz;
		vec3 ct2 = texture(u_sampler2, vec3(s_sig*uv_shift-b_anim, idx2)+vec3(offs2,0.)).xyz;

		vec3 ct1_r = texture(u_sampler, vec3(uv_shift, idxa_r)+vec3(offsr,0.)).xyz;
		vec3 ct2_r = texture(u_sampler2, vec3(uv_shift-b_anim, idxb_r)+vec3(offsr,0.)).xyz;

		vec3 ct1_r2 = tex_cell(tuv, u_time*_oscmixr*.26, ct1, ct2_r, 16);

		// ct2 = (rare_attribute4 > 0.) ? vec3(0.,1.,0.) : ct2;


		// vec3 c = 1.-mix(mix(ct1,ctr, mixr), ct2, texmix);
		vec3 c = 1.-mix(mix(mix(ct1, ct1_r*(ct1*.5+.5), rare_attribute*.6), ct1_r2, rare_attribute2), ct2, texmix);
		c *= satMat(1.5);

		fragColor = contrastMat(1.1)*vec4(c, 1.0);
		// fragColor = vec4(c, 1.0);
	}`;

	export {fs};
