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

	vec2 fold(vec2 inp, float n, float m, float sig, float drift){
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

	void main(){
		vec2 uv = vec2(1.,-1.)*gl_FragCoord.xy/u_resolution.xy;

		float rotsig = (abs((fract(u_time*.04)-.5))-.25);

		// float _rlev = lerp(_mlev, .08, .4);
		float rot_r = mix(_rlev, rotsig, _oscmixr);

		float mlev = mix(_mlev, rotsig, _oscmixm);

		vec2 tuv = v_texcoord;
		tuv *=(1.-zoom);
		tuv +=.5*zoom;

		vec2 v = fold(uv, 150., _div, rot_r, _drift); //-n

		float offset = (offs+offs_fine);
		vec2 offs1 = vec2(cos(offset*9.), sin(offset*14.));
		vec2 offs2 = vec2(cos(offset*12.), sin(offset*7.));

		vec3 cta = texture(u_sampler, vec3(tuv, idx)+vec3(offs1,0.) ).xyz;
		vec3 ctb = texture(u_sampler2, vec3(tuv, idx2)+vec3(offs2,0.) ).xyz;
		vec3 cc = mix(cta, ctb, texmix);

		float chr = max(max(abs(cc.r-cc.b), abs(cc.r-cc.g)), abs(cc.b-cc.g));

		vec2 uv_shift = mix(tuv,v, mlev*mix(1.,chr,select_lev));

		vec3 ct1 = texture(u_sampler, vec3(uv_shift, idx)+vec3(offs1,0.) ).xyz;
		vec3 ct2 = texture(u_sampler2, vec3(uv_shift, idx2)+vec3(offs2,0.) ).xyz;
		vec3 c = 1.-mix(ct1, ct2, texmix);
		c *= satMat(1.5);

		fragColor = contrastMat(1.1)*vec4(c, 1.0);
		// fragColor = vec4(c, 1.0);
	}`;

	export {fs};
