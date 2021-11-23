const fs = /*glsl*/ `#version 300 es

	precision mediump float;

	#define rot(a)  mat2(cos(a), -sin(a), sin(a), cos(a))
	#define tri(t) (4.*abs(fract(t)-.5)-.25)
	#define lerp(n, a, b) (n*(b-a)+a)

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

	uniform float idx;
	uniform float idx2;
	uniform float idxr;
	uniform float texmix;
	uniform float zoom;
	uniform float offs;
	uniform float offs_fine;
	uniform float select_lev;

	uniform float _mlev;
	uniform float _rlev;

	uniform float sat;
	uniform float cont;

	uniform float tex_attr;
	uniform float sig_attr;
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

	float ssig(vec2 uv, vec2 v, float _t, float a){
	    float t = _t+dot(uv-v,uv-v)*a;
	    float f = sin(t)+sin(t*1.2)+sin(t*1.4)*.8+sin(t*1.6)*.5;
	    // f = (f*.5+.5)*.1;
	    f = max(f*.2, 0.2)*.5;
	    return f;		
	}

	vec2 offset(float offs, vec2 coef){
		return vec2(cos(offs*coef.x), sin(offs*coef.y));
	}

	void main(){
		vec2 uv = vec2(1.,-1.)*gl_FragCoord.xy/u_resolution.xy;

		float rotsig = tri(u_time*.04)*.25;

		// float _rlev = lerp(_mlev, .08, .4);
		float rot_r = mix(_rlev, rotsig, _oscmixr);
		float mlev = mix(_mlev, rotsig, _oscmixr*_oscmixm*5.);

		vec2 tuv = v_texcoord;
		tuv *=(1.-zoom);
		tuv +=.5*zoom;

		vec2 v = fold(uv, 150., _div, rot_r, _drift, _sdf); 

		vec2 offs1 = offset(offs+offs_fine, vec2(9., 14.));
		vec2 offs2 = offset(offs+offs_fine, vec2(12., 7.));

		vec3 cta = texture(u_sampler, vec3(tuv, idx)+vec3(offs1,0.) ).xyz;
		vec3 ctb = texture(u_sampler2, vec3(tuv, idx2)+vec3(offs2,0.) ).xyz;
		vec3 cc = mix(cta, ctb, texmix);

		float chr = max(max(abs(cc.r-cc.b), abs(cc.r-cc.g)), abs(cc.b-cc.g));

		vec2 uv_shift = mix(tuv,v, mlev*mix(1.,chr,select_lev));

		float s_sig = step(0.01,sig_attr)*(.9+.1*ssig(tuv, vec2(.28,.8), u_time*_oscmixr*7., 44.))+(1.-sig_attr);

		vec3 ct1 = texture(u_sampler, vec3(uv_shift, idx)+vec3(offs1,0.) ).xyz;
		vec3 ct2 = texture(u_sampler2, vec3(s_sig*uv_shift, idx2)+vec3(offs2,0.) ).xyz;

		vec3 ct1_r = texture(u_sampler, vec3(uv_shift, idxr)+vec3(offset(offs+offs_fine, vec2(10., 7.)),0.)).xyz;
		vec3 c_a = mix(ct1, ct1_r*(ct1*.5+.5), tex_attr*.6);

		vec3 c = 1.-mix(/*ct1*/c_a, ct2, texmix);
		c *= satMat(1.+sat);

		fragColor = contrastMat(1.+cont)*vec4(c, 1.0);
	}`;

	export default fs;
