let scene,camera,renderer,mesh,light,grid,model,mixer,actions,clock;
clock = new THREE.Clock()

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

	mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x210378, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	scene.add( mesh );

	grid = new THREE.GridHelper( 200, 40, 0x39ff14, 0x39ff14 );
	grid.material.opacity = 0.2;
	grid.material.transparent = false;
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
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.setPath('../blender-files/')
//When materials are received 


//model added
gltfLoader.load('RobotExpressive.glb', function (glb){
	model = glb.scene
	scene.add(model)
	mixer = new THREE.AnimationMixer( model );
	console.log(glb.animations)
	idle = mixer.clipAction(glb.animations[6])
	idle.play()
})
// movement - please calibrate these values
let xSpeed = 0.01;
let ySpeed = 0.01;

document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
    let keyCode = event.which;
    if (keyCode == 87) {
        model.position.y += ySpeed;
    } else if (keyCode == 83) {
        model.position.y -= ySpeed;
    } else if (keyCode == 65) {
        model.position.x -= xSpeed;
    } else if (keyCode == 68) {
        model.position.x += xSpeed;
    } else if (keyCode == 32) {
        model.position.set(0, 0, 0);
    }
    render();
};


let render = () => {
	let mixerUpdateDelta = clock.getDelta()
	requestAnimationFrame( render );
	mixer.update(mixerUpdateDelta)
	renderer.render( scene, camera );
}
render();