let scene,camera,renderer,mesh,light,grid,model,mixer,actions,clock,arcade;
let walking = false;
clock = new THREE.Clock()
let keyboard = new THREEx.KeyboardState();

let init = ()=>{
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x1d0c29 );
	scene.fog = new THREE.Fog( 0x3f0e40, 20, 100 );

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

	light = new THREE.AmbientLight( 0xf27dd9 );
	light.position.set( 0, 20, 10 );
	scene.add( light );

	// ground

	mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x3c113d, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	scene.add( mesh );

	grid = new THREE.GridHelper( 200, 40, 0x39ff14, 0x39ff14 );
	grid.material.opacity = 0.2;
	grid.material.transparent = false;
	scene.add( grid );

	renderer = new THREE.WebGLRenderer({antialias: true} );
	renderer.setClearColor( 0x3f0e40, 0.5 )
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera.position.z = 20;
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
		audioLoader.load( '../sounds/vapor.ogg', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 1 );
			sound.play();
		});
});
let updateMovement = () =>{
	let moveDistance = 50 * clock.getDelta();

	if ( keyboard.pressed("W")) {
		model.rotation.y = (Math.PI) 
		model.translateZ( moveDistance );
		mixer.clipAction(model.animations[10]).play()
	}	
	if ( keyboard.pressed("S")) {
		model.rotation.y = Math.PI + Math.PI
		model.translateZ( moveDistance );
		mixer.clipAction(model.animations[10]).play()
	}

	if ( keyboard.pressed("A")) {
		model.rotation.y = -Math.PI / 2;
		model.translateZ( moveDistance );
		mixer.clipAction(model.animations[10]).play()
	}
		
	if ( keyboard.pressed("D")){
		model.rotation.y = Math.PI / 2;
		model.translateZ(  moveDistance );
		mixer.clipAction(model.animations[10]).play()
	}	
}
//  Roe Roe




// Loaders for
const objLoader = new THREE.OBJLoader();
objLoader.setPath('../blender-files/')
const mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('../blender-files/')
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.setPath('../blender-files/')

//Arcade Machine
gltfLoader.load('arcade.glb', function (glb){
arcade = glb.scene
scene.add(arcade)
arcade.scale.set(3.5,3.5,3.5)
		arcade.position.z = -5
		arcade.position.x = -1
})

//model added

gltfLoader.load('RobotExpressive.glb', function (glb){
	model = glb.scene
	model.animations = glb.animations
	scene.add(model)
	mixer = new THREE.AnimationMixer( model );
	idle = mixer.clipAction(glb.animations[2])
	idle.play()
})
function getDistance(mesh1, mesh2) { 
  let dx = mesh1.position.x - mesh2.position.x; 
  let dy = mesh1.position.y - mesh2.position.y; 
  let dz = mesh1.position.z - mesh2.position.z; 
  return Math.sqrt(dx*dx+dy*dy+dz*dz);
}
function interactable(mesh1,mesh2){
   if( getDistance(mesh1,mesh2) <= 5){
   	  console.log('can interact');
   }
}

let render = () => {
	let mixerUpdateDelta = clock.getDelta()
	requestAnimationFrame( render );
	mixer.update(mixerUpdateDelta)
	renderer.render( scene, camera );
	interactable(model,arcade);
	updateMovement()
}
render();