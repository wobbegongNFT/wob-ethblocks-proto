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
	let a = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th'];
	return a[round(v*10)];
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

let noun_batch_1 = ['troll', 'wind', 'consciousness', 'tree', 'pyrite', 'dream', 'stone', 'hologram', 'hill', 'gultch', 'bog', 'stream', 'river', 'machine',  'hand', 'rock', 'splitter', 'monolith', 'bone', 'buddah', 'moon', 'fire', 'cloud', 'tether','fog', 'willow', 'fairie', 'frog' /*,beacon*/];
let noun_batch_2 = ['branch', 'kraken', 'haggler', 'squire', 'academy', 'pact', 'valley', 'pyramid', 'structure', 'building', 'procession', 'spire', 'portal', 'hovel', 'village', 'passage', 'temple', 'lizard', 'box', 'star', 'protocol',  'house', 'seed', 'ruin', 'net', 'network', 'mask', 'grid', 'circle', 'storm', 'body', 'self', 'pillar', 'trench' ];
let adjectives = ['lunar','celestial', 'entombed', 'bismuth', 'spectral', 'folding', 'floating' ,'titan', 'hidden', 'frozen', 'silver', 'subterranean', 'ancient', 'jovian', 'old', 'barren', 'vedic', 'aquatic', 'solar', 'submerged',  'acoustic', 'humble', 'dancing', 'metal', 'elder', /*'transformed',*/ 'solitary', 'verdant', 'forgotten', 'crystal', 'broken', 'giant', 'underwater', 'singing', 'living', 'burning'];
let enumaritive_nouns = ['level', 'basin', 'beam', 'wing', 'basin', 'echo', 'durge', 'seed' ];
// let prefix_adjectives = ["Herm's", "Nurn's", 'forgotten', 'Venusian'] 

function randElement(arr, v, n){
	let index = round((v+rand(n))*n%(arr.length-1));
	return  arr[index];
}

function shuffle(a, v) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(rand(v+i) * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function name_select(v){
	let arr =
	[[monoid(v), .1],
	[doublet(v), .5],
	[dry_doublet(v), .4],
	[triplet(v), .7],
	[aa_triplet(v), .6] ,
	[posessive_enumerative_phrase(v), .09]];
	arr = shuffle(arr, v);
	let sum = 0;
	for(var i = 0; i < arr.length; i++){
		sum += arr[i][1];
	}
	let t = v*sum;
	sum = 0;
	for(var i = 0; i < arr.length; i++){
		sum += arr[i][1];
		if(sum > t){
			return arr[i][0];
		}
	}
	//miss
	return triplet(v);
}

function enumeration(v){
	return {
		trait: randElement(enumaritive_nouns, v, 777),
		value: Math.floor(v*1000)*.01
	}
}

function display(v, el){
	v = v || random();
	let arr = 
	[monoid(v),
	doublet(v),
	dry_doublet(v),
	triplet(v),
	aa_triplet(v),
	posessive_enumerative_phrase(v)];
	let sel =  select(v);
	for(let i = 0; i < arr.length; i++){
		if(arr[i] == sel){
			arr[i] += ' -'
		}
	}
	el.innerHTML = arr.join('\n');
	console.log(sel);
}

export {name_select, enumeration};