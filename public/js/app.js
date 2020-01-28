let scene,camera,renderer,mesh,light,grid;


let init = ()=>{
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xe0e0e0 );
	scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

	//camera 

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
	camera.position.set( - 5, 3, 10 );
	camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );


	// lights
	light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	light.position.set( 0, 20, 0 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 20, 10 );
	scene.add( light );

	// ground

	mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	scene.add( mesh );

	grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
	grid.material.opacity = 0.2;
	grid.material.transparent = true;
	scene.add( grid );





	renderer = new THREE.WebGLRenderer({antialias: true} );
	renderer.setClearColor( 0xffffff, 0 )
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );


	camera.position.z = 7;
}

init();
document.querySelector('button').addEventListener('click', function() {
		// create an AudioListener and add it to the camera
		let listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		let sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		let audioLoader = new THREE.AudioLoader();
		audioLoader.load( '../sounds/chill.ogg', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 1 );
			sound.play();
		});
});
// instantiate the loader
const objLoader = new THREE.OBJLoader();
objLoader.setPath('../blender-files/')
const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('../blender-files/')
//When materials are received 

let robot = {};

new Promise((resolve) =>{
	mtlLoader.load('Robot.mtl',(materials) => {
		resolve(materials);
	})
})
.then((materials) =>{
	materials.preload();
	objLoader.setMaterials(materials);
	objLoader.load('Robot.obj', (object) => {
		robot = object
		scene.add(object)
	})
})



let render = () => {
	requestAnimationFrame( render );
	robot.rotation.y += 0.01;
	renderer.render( scene, camera );
}
render();