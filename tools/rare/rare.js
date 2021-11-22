import blocks from "./blocks.js";
const tx = blocks[1].transactions;
import MersenneTwister from "./mersenne.js";

const div = document.createElement('div');
const button = document.createElement('button');
const pre = document.createElement('pre');
pre.style.margin = '12px';
div.style.display = 'inlineBlock';
pre.style.color = '#eeeeeeee';
pre.style.width = '100';
pre.style.height = '100';
pre.style.fontSize = '4ch';
button.innerHTML = 'num';
button.style.margin = '10px';
document.body.appendChild(div);
div.appendChild(button);
div.appendChild(pre);

const {abs, round, floor, ceil, pow, random, sin, cos, PI} = Math;
function fract(f){ return f-floor(f); }
function rand(n){ return fract(sin(n) * 43758.5453123); }

function rare(hash, weights){
	let num = parseInt(hash.slice(0, 16), 16);
	let m = new MersenneTwister(num);
	return genObj(m.random(), ...weights);
}

function wbool(r, w){
	return Math.abs(.5-r)*2. > w ? 0 : 1;
}

function genObj(f, w0, w1, w2){
	return {
		v: f,
		a0: f < w0 ? 1 : 0,
		a1: f < w1 ? 1 : 0,
		a2: f < w2 ? 1 : 0,
		// a0: wbool(f, w0),
		// a1: wbool(f, w1),
		// a2: wbool(f, w2),
	};
}

function stats(arr){
	let a0 = 0, a1 = 0, a2 = 0;
	for(let o of arr){
		if(o.a0) a0++;
		if(o.a1) a1++;
		if(o.a2) a2++;
	}
	return{
		a0: a0/arr.length,
		a1: a1/arr.length,
		a2: a2/arr.length
	};
}

function ok(){
	let arr = new Array(5000);
	for (var i = 0; i < arr.length; i++) {
		arr[i] = Math.random();
	}
	let weights = [.2,.3,.4];
	let w0 = 0, w1 = 0, w2 = 0;
	for(let r of arr){
		if(r < weights[0]) w0++;
		if(r < weights[1]) w1++;
		if(r < weights[2]) w2++;
	} 
	console.log(w0/arr.length, w1/arr.length, w2/arr.length);
}

button.onclick = (e)=>{
	let weights = [.2,.3,.4];
	let objs = tx.map((el)=>rare(el.hash, weights));
	console.log(stats(objs));
}
