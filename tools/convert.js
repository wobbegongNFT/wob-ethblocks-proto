const imageToBase64 = require('image-to-base64');
const fs = require('fs');

async function convert(sets, cb){

	let obj = {};

	for(let set of sets){

		obj[set.name] = [];
		if( set.path[set.path.length-1] != '/') set.path += '/';
		let files = fs.readdirSync(set.path).map(el=> set.path+el);

		for(let i = 0; i < files.length; i++){

			await imageToBase64(files[i]).then((res)=>{
				obj[set.name].push('data:image/jpeg;base64,'+res);
			}).catch((err)=>{ console.log(err); });

		}

	}

	 cb(obj);
} 

/*main*/
(() => {
  
	let args = process.argv.slice(2);
	let fname = args.shift();
	let sets =  [];

	args.forEach((a, i)=>{
		let n = Math.floor(i/2);
		if(i%2 == 0){
			sets.push({});
			sets[n].name = a;
		}
		else sets[n].path = a;
	});
	console.log(sets);

	convert(sets, (obj)=>{
		
		for(let key in obj){
			console.log(key, obj[key].length);
		}

		let str = JSON.stringify(obj, null, 4);
		str = 'export default '+str;
		fs.writeFile(fname, str, 'utf8', (err)=>{
			if(err) console.log(err);
			else console.log('wrote '+ fname);
		})
		
	});

})();