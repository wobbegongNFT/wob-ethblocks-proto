import React, { useEffect, useMemo, useRef } from 'react';
import { Glview } from "./modules/glview.js";
// import zemm from "./zemm.js";
import testprog from "./julia.js";
// import * as dat from "./modules/dat.gui.module.min.js";
import MT from 'mersenne-twister';

/*
<CustomStyle
  width={width}
  block={active ? liveBlocks[liveBlockNumber] : blocks[blockNumber]}
  height={height}
  canvasRef={canvasRef}
  gl={glRef}
  attributesRef={attributesRef}
  handleResize={_onCanvasResize}
  {...snap.options} //mods
/>
*/

// Required style metadata
const styleMetadata = {
  name: '',
  description: '',
  image: '',
  creator_name: '',
  options: {
    mod1: 0.399,
    mod2: 0.16,
    mod3: 0.4,
    mod4: 0.9,
    // color1: '#fff000',
    // background: '#000000',
  },
};

export { styleMetadata };


const glob = {
	glview : null,
	coord : [0,0]
};

const Display = ({canvasRef, block, width, height, animate, mod1, mod2, mod3, mod4, background, attributesRef, handleResize,...props}) =>{
	/*init*/
	useEffect(() => {
		glob.glview = new Glview(canvasRef.current, testprog);
		console.log('hi')
		return ()=>{
			//if(glob.glview){glob.glview.switchPogram(-1);}
			console.log('bye')
		}
	}, [canvasRef]);

	/*update*/
	useEffect(() =>{

	  testprog.uniforms.coord = [mod1, mod2];
	  testprog.uniforms.zoom = mod3;	
	  testprog.uniforms._t = mod4;	

	},[mod1, mod2, mod3, mod4]);

	// useEffect(() =>{
	// 	console.log('aref', attributesRef);
	// },[attributesRef /*, animate, handleResize*/]);

	useEffect(()=>{
  		const rng = new MT(parseInt(block.hash.slice(0, 16), 16));
		let h = rng.random();
		testprog.uniforms.hue = h;
		console.log('block: ', block);
	},[block]);

	return useMemo(() => {
		return(
			<canvas
				width={width}
				height={height}
				style={{ width: '90%', height: '67.5%' }}
				ref={canvasRef}
				{...props}
			/>
		);
	}, [canvasRef]);
};

export default Display;