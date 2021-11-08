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

function monoid(v){
	let nbatch = (v > .5)? noun_batch_2 : noun_batch_1;
	return randElement(nbatch, v, 777);
}

function doublet(v){
	let n = 999;
	let nbatch = (v > .5)? noun_batch_2 : noun_batch_1;
	let adj = randElement(adjectives, v, n--);
	let noun = randElement(nbatch, v, n--);
	return adj + ' ' + noun;
}

function dry_doublet(v){
	let noun1 = randElement(noun_batch_1, v, 999);
	let noun2 = randElement(noun_batch_2, v, 888);	
	return noun1 + ' ' + noun2;
}

function triplet(v){
	let n = 999;
	let noun1 = randElement(noun_batch_1, v, n--);
	let noun2 = randElement(noun_batch_2, v, n--);
	let adj = randElement(adjectives, v, n--);
	return adj + ' ' + noun1 + ' ' + noun2;
}

function aa_triplet(v){
	let n = 777;
	let nbatch = (v > .5)? noun_batch_2 : noun_batch_1;
	let noun = randElement(nbatch, v, n++);
	let adj = randElement(adjectives, v, n++);
	let adj2;
	for(let i = 0; i < 1000; i++){
		adj2 = randElement(adjectives, v, n++);
		if(adj2 != adj) {return adj + ' ' + adj2 + ' ' + noun;}
	}
	return adj + noun;
}

function symbolic_integer(v){
	return round(1+v*11)+'th';
}

function posessive_enumerative_phrase(v){
	let n = 999;
	let adj = randElement(adjectives, v, n--);
	let noun1 = randElement(noun_batch_1, v, n--);
	let noun2 = randElement(noun_batch_2, v, n--);
	let na, nb;
	if(v >= .5){
		na = noun1; nb = noun2;
	}else{ na = noun2; nb = noun1;}

	return adj + ' '+ na+"'s " + symbolic_integer(v) + ' ' + nb;
}

let noun_batch_1 = ['troll', 'wind', 'consiousness', 'tree', 'pyrite', 'dream', 'stone', 'hologram', 'hill', 'gultch', 'bog', 'stream', 'river', 'machine',  'hand', 'rock', 'splitter', 'monolith'];
let noun_batch_2 = ['branch', 'kraken', 'haggler', 'squire', 'academy', 'pact', 'valley', 'pyramid', 'structure', 'building', 'procession', 'spire', 'portal', 'hovel', 'village',  'passage', 'temple', 'lizard'];
let adjectives = ['lunar','celestial', 'entombed', 'bismuth', 'spectral', 'folding', 'floating' ,'titan', 'hidden', 'frozen', 'silver', 'subterratian', 'ancient', 'jovian', 'old', 'barren', 'vedic', 'aquatic', 'solar', 'submerged',  'acoustic'];
let enumaritive_nouns = ['level', 'basin', 'beam', 'wing', 'basin', 'echo',  'durge', 'seed' ];
// let prefix_adjectives = ["Herm's", "Nurn's", 'forgotten', 'Venusian'] 

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
	let v = random();
	let p = '';
	p += monoid(v) + '\n'; 
	p += doublet(v) + '\n'; 
	p += dry_doublet(v) + '\n'; 
	p += triplet(v) + '\n'; 
	p += aa_triplet(v) + '\n'; 
	p += posessive_enumerative_phrase(v) + '\n'; 
	pre.innerHTML = p;
}