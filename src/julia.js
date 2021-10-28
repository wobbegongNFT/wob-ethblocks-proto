


const fs = /*glsl*/`#version 300 es

	precision mediump float;

	uniform float u_time;
	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform vec2 coord;
	uniform float zoom;
	uniform float hue;
	uniform float _t;
	out vec4 fragColor;

	#define res u_resolution
	#define thresh 20.
	#define stop 200

	vec3 rgb(float a){
	    a *=8.;
	    return(cos(4.+a+vec3(0.,2.,4.)*.7)*.5+.5);
	}

	vec2 cmul(vec2 a, vec2 b){
	    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
	}

	vec2 cdiv(vec2 v1, vec2 v2){
	    float a = (v1.x*v2.x+v1.y*v2.y)/(v2.x*v2.x+v2.y*v2.y);
	    float b = (v1.y*v2.x-v1.x*v2.y)/(v2.x*v2.x+v2.y*v2.y);
	    return vec2(a,b);
	}

	vec2 cexp(vec2 z){
	    return exp(z.x)*vec2(cos(z.y),sin(z.y));
	}

	vec2 clog(vec2 z){
	    return vec2(log(length(z)),atan(z.y,z.x));
	}

	vec2 cpow(vec2 z, float c){
	    return cexp(c*clog(z));
	}


	vec2 clerp(vec2 a, vec2 b, float m){
	    m = clamp(m,0.,1.);
	    return cmul(vec2(1.-m),a)+cmul(vec2(m),b);
	}


	vec2 rot(vec2 v, float t){
	    float a = (1.*atan(v.x,v.y))+t;
	    return vec2(cos(a),sin(a))*length(v);
	}

	void main(){

		vec2 z = zoom*(2.*gl_FragCoord.xy-res.xy)/res.y;
	    z = clerp(.3*clog(vec2(2)+z), (cdiv(vec2(.5),z)), .1);
	    // z = cexp(cmul(z,vec2(.4)));
	    z=rot(z, u_time*.3*_t);
	    int i = 0;
	    for(i; i < stop; i++){
	        z = cmul(z,z)+coord;
	        if(length(z) > thresh)
	            break;
	    }
	    vec3 col = rgb(hue+log(.9+float(i)/380.)*2.);
	    fragColor = vec4(col, 1.0 );

	}
`;

const coord = [0,0];

const gui = {
	name: 'julia',
	open: true,
	switch: false,
	fields: [
		{
			x : 0,
			min: -1,
			max: 1,
			step: .001,
			onChange: (val)=>{
				coord[0] = val;
				prog.uniforms.coord = coord;
			}
		},
		{
			y : 0,
			min: -1,
			max: 1,
			step: .001,
			onChange: (val)=>{
				coord[1] = val;
				prog.uniforms.coord = coord;
			}
		},
		{
			zoom : .8,
			min: .001,
			max: .99,
			step: .001,
			onChange: (val)=>{
				prog.uniforms.zoom = 1-val;
			}
		}
	]
}

const prog = {
	 res: { width: 800, height: 600},
	 fs: fs,
	 uniforms: {
	 	coord: coord,
	 	zoom: .8,
	 	_t: 1
	 },
	 // rendercb : rendercb,
	  gui: gui,
	  // on: false
	 // clearcolor: [0.2, 0.8, 0.0, 1],
};

export default prog;