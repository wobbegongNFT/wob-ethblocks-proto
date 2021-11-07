const div = document.createElement('div');
const button = document.createElement('button');
const pre = document.createElement('pre');
pre.style.margin = '12px';
div.style.display = 'inlineBlock';
pre.style.color = '#eeeeeeee';
pre.style.width = '100';
pre.style.height = '100';
pre.style.fontSize = '4ch';
button.innerHTML = 'name';
button.style.margin = '10px';
document.body.appendChild(div);
div.appendChild(button);
div.appendChild(pre);

const {abs, round, floor, ceil, pow, random, sin, cos, PI} = Math;
function fract(f){ return f-floor(f); }
function rand(n){ return fract(sin(n) * 43758.5453123); }

let noun_batch_1 = ['troll', 'wind', 'consiousness', 'tree', 'hill', 'gultch', 'splitter', 'monolith'];
let noun_batch_2 = ['branch', 'kraken', 'haggler', 'squire', 'hovel', 'village', 'stream', 'lizard'];
let adjectives = ['lunar', 'old', 'barren', 'vedic', 'weary', 'aquatic', 'solar', 'submerged', 'machine', 'acoustic'];
let enumaritive_nouns = ['level', 'basin', 'beam','wing', 'basin', 'echo', 'valley', 'durge', 'spire'];

function randElement(arr, v, n){
	let index = round((v+rand(n))*n%(arr.length-1));
	return  arr[index];
}

function name(val){
	let v = val || random();
	let n = 999;
	let noun1 = randElement(noun_batch_1, v, n--);
	let noun2 = randElement(noun_batch_2, v, n--);
	let adj = randElement(adjectives, v, n--);
	let en_noun =randElement(enumaritive_nouns, v, n--);

	let phrase = adj + ' ' + noun1 + ' ' + noun2 + ' ' + en_noun + ' ' + v.toFixed(4);
	return phrase;
}

button.onclick = (e)=>{
	pre.innerHTML = name();
}