/**
 * 	SEA3D for Three.JS
 * 	@author Sunag / http://www.sunag.com.br/
 */
import { SEA3D } from './SEA3DLZMA'
import * as THREE from 'three';

'use strict';

//
//	Polyfills
//

if ( THREE.Float32BufferAttribute === undefined ) {

	THREE.Float32BufferAttribute = THREE.Float32Attribute;

}

//
//
//	SEA3D
//

const SEA3DLoader = function ( config ) {

	this.config = {
		id: "",
		scripts: true,
		runScripts: true,
		autoPlay: false,
		dummys: true,
		multiplier: 1,
		bounding: true,
		audioRolloffFactor: 10,
		lights: true,
		useEnvironment: true,
		useVertexTexture: true,
		forceStatic: false,
		streaming: true,
		async: true,
		paths: {},
		timeLimit: 10
	};

	if ( config ) this.loadConfig( config );

};

//
//	Config
//

SEA3DLoader.MTXBUF = new THREE.Matrix4();
SEA3DLoader.VECBUF = new THREE.Vector3();
SEA3DLoader.QUABUF = new THREE.Quaternion();

SEA3DLoader.BACKGROUND_COLOR = 0x333333;
SEA3DLoader.HELPER_COLOR = 0x9AB9E5;
SEA3DLoader.RTT_SIZE = 512;

SEA3DLoader.prototype = Object.assign( Object.create( THREE.EventDispatcher.prototype ), {

	constructor: SEA3DLoader,

	setShadowMap: function ( light ) {

		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 1024;

		light.castShadow = true;

		light.shadow.camera.left = - 200;
		light.shadow.camera.right = 200;
		light.shadow.camera.top = 200;
		light.shadow.camera.bottom = - 200;

		light.shadow.camera.near = 1;
		light.shadow.camera.far = 3000;
		light.shadow.camera.fov = 45;

		light.shadow.bias = - 0.001;

	}

} );

Object.defineProperties( SEA3DLoader.prototype, {

	container: {

		set: function ( val ) {

			this.config.container = val;

		},

		get: function () {

			return this.config.container;

		}

	},

	elapsedTime: {

		get: function () {

			return this.file.timer.elapsedTime;

		}

	}

} );

//
//	Domain
//

SEA3DLoader.Domain = function ( id, objects, container ) {

	this.id = id;
	this.objects = objects;
	this.container = container;

	this.sources = [];
	this.global = {};

	this.scriptTargets = [];

	this.events = new THREE.EventDispatcher();

};

Object.assign( SEA3DLoader.Domain.prototype, {

	add: function ( src ) {

		this.sources.push( src );

	},

	remove: function ( src ) {

		this.sources.splice( this.sources.indexOf( src ), 1 );

	},

	contains: function ( src ) {

		return this.sources.indexOf( src ) != - 1;

	},

	addEventListener: function ( type, listener ) {

		this.events.addEventListener( type, listener );

	},

	hasEventListener: function ( type, listener ) {

		return this.events.hasEventListener( type, listener );

	},

	removeEventListener: function ( type, listener ) {

		this.events.removeEventListener( type, listener );

	},

	print: function () {

		console.log.apply( console, arguments );

	},

	watch: function () {

		console.log.apply( console, 'watch:', arguments );

	},

	runScripts: function () {

		for ( var i = 0; i < this.scriptTargets.length; i ++ ) {

			this.runJSMList( this.scriptTargets[ i ] );

		}

	},

	runJSMList: function ( target ) {

		var scripts = target.scripts;

		for ( var i = 0; i < scripts.length; i ++ ) {

			this.runJSM( target, scripts[ i ] );

		}

		return scripts;

	},

	runJSM: function ( target, script ) {

		if ( target.local == undefined ) target.local = {};

		var include = {
			print: this.print,
			watch: this.watch,
			sea3d: this,
			scene: this.container,
			source: new SEA3DLoader.ScriptDomain( this, target instanceof SEA3DLoader.Domain )
		};

		Object.freeze( include.source );

		SEA3DLoader.ScriptHandler.add( include.source );

		try {

			this.methods[ script.method ](
				include,
				this.getReference,
				this.global,
				target.local,
				target,
				script.params
			);

		} catch ( e ) {

			console.error( 'SEA3D JavaScript: Error running method "' + script.method + '".' );
			console.error( e );

		}

	},

	getReference: function ( ns ) {

		return eval( ns );

	},

	disposeList: function ( list ) {

		if ( ! list || ! list.length ) return;

		list = list.concat();

		var i = list.length;

		while ( i -- ) {

			list[ i ].dispose();

		}

	},

	dispatchEvent: function ( event ) {

		event.domain = this;

		var sources = this.sources.concat(),
			i = sources.length;

		while ( i -- ) {

			sources[ i ].dispatchEvent( event );

		}

		this.events.dispatchEvent( event );

	},

	dispose: function () {

		this.disposeList( this.sources );

		while ( this.container.children.length ) {

			this.container.remove( this.container.children[ 0 ] );

		}

		var i = SEA3DLoader.EXTENSIONS_DOMAIN.length;

		while ( i -- ) {

			var domain = SEA3DLoader.EXTENSIONS_DOMAIN[ i ];

			if ( domain.dispose ) domain.dispose.call( this );

		}

		this.disposeList( this.materials );
		this.disposeList( this.dummys );

		this.dispatchEvent( { type: "dispose" } );

	}
} );

//
//	Domain Manager
//

SEA3DLoader.DomainManager = function ( autoDisposeRootDomain ) {

	this.domains = [];
	this.autoDisposeRootDomain = autoDisposeRootDomain == undefined ? true : false;

};

Object.assign( SEA3DLoader.DomainManager.prototype, {

	onDisposeDomain: function ( e ) {

		this.remove( e.domain );

		if ( this.autoDisposeRootDomain && this.domains.length == 1 ) {

			this.dispose();

		}

	},

	add: function ( domain ) {

		this._onDisposeDomain = this._onDisposeDomain || this.onDisposeDomain.bind( this );

		domain.on( "dispose", this._onDisposeDomain );

		this.domains.push( domain );

		this.textures = this.textures || domain.textures;
		this.cubemaps = this.cubemaps || domain.cubemaps;
		this.geometries = this.geometries || domain.geometries;

	},

	remove: function ( domain ) {

		domain.removeEvent( "dispose", this._onDisposeDomain );

		this.domains.splice( this.domains.indexOf( domain ), 1 );

	},

	contains: function ( domain ) {

		return this.domains.indexOf( domain ) != - 1;

	},

	disposeList: function ( list ) {

		if ( ! list || ! list.length ) return;

		list = list.concat();

		var i = list.length;

		while ( i -- ) {

			list[ i ].dispose();

		}

	},

	dispose: function () {

		this.disposeList( this.domains );
		this.disposeList( this.textures );
		this.disposeList( this.cubemaps );
		this.disposeList( this.geometries );

	}

} );

//
//	Script ( closure for private functions )
//

SEA3DLoader.ScriptDomain = function ( domain, root ) {

	domain = domain || new SEA3DLoader.Domain();
	domain.add( this );

	var events = new THREE.EventDispatcher();

	this.getId = function () {

		return domain.id;

	};

	this.isRoot = function () {

		return root;

	};

	this.addEventListener = function ( type, listener ) {

		events.addEventListener( type, listener );

	};

	this.hasEventListener = function ( type, listener ) {

		return events.hasEventListener( type, listener );

	};

	this.removeEventListener = function ( type, listener ) {

		events.removeEventListener( type, listener );

	};

	this.dispatchEvent = function ( event ) {

		event.script = this;

		events.dispatchEvent( event );

	};

	this.dispose = function () {

		domain.remove( this );

		if ( root ) domain.dispose();

		this.dispatchEvent( { type: "dispose" } );

	};

};

//
//	Script Manager ( closure for private functions )
//

SEA3DLoader.ScriptManager = function () {

	this.scripts = [];

	var onDisposeScript = ( function ( e ) {

		this.remove( e.script );

	} ).bind( this );

	this.add = function ( src ) {

		src.addEventListener( "dispose", onDisposeScript );

		this.scripts.push( src );

	};

	this.remove = function ( src ) {

		src.removeEventListener( "dispose", onDisposeScript );

		this.scripts.splice( this.scripts.indexOf( src ), 1 );

	};

	this.contains = function ( src ) {

		return this.scripts.indexOf( src ) > - 1;

	};

	this.dispatchEvent = function ( event ) {

		var scripts = this.scripts.concat(),
			i = scripts.length;

		while ( i -- ) {

			scripts[ i ].dispatchEvent( event );

		}

	};

};

//
//	Script Handler
//

SEA3DLoader.ScriptHandler = new SEA3DLoader.ScriptManager();

SEA3DLoader.ScriptHandler.dispatchUpdate = function ( delta ) {

	this.dispatchEvent( {
		type: "update",
		delta: delta
	} );

};

//
//	Animation Clip
//

SEA3DLoader.AnimationClip = function ( name, duration, tracks, repeat ) {

	THREE.AnimationClip.call( this, name, duration, tracks );

	this.repeat = repeat !== undefined ? repeat : true;

};

SEA3DLoader.AnimationClip.fromClip = function ( clip, repeat ) {

	return new SEA3DLoader.AnimationClip( clip.name, clip.duration, clip.tracks, repeat );

};

SEA3DLoader.AnimationClip.prototype = Object.assign( Object.create( THREE.AnimationClip.prototype ), {

	constructor: SEA3DLoader.AnimationClip

} );

//
//	Animation
//

SEA3DLoader.Animation = function ( clip, timeScale ) {

	this.clip = clip;
	this.timeScale = timeScale !== undefined ? timeScale : 1;

};

SEA3DLoader.Animation.COMPLETE = "animationComplete";

SEA3DLoader.Animation.prototype = Object.assign( Object.create( THREE.EventDispatcher.prototype ), {

	constructor: SEA3DLoader.Animation,

	onComplete: function ( scope ) {

		this.dispatchEvent( { type: SEA3DLoader.Animation.COMPLETE, target: this } );


	}

} );

Object.defineProperties( SEA3DLoader.Animation.prototype, {

	name: {

		get: function () {

			return this.clip.name;

		}

	},

	repeat: {

		get: function () {

			return this.clip.repeat;

		}

	},

	mixer: {

		set: function ( val ) {

			if ( this.mx ) {

				this.mx.uncacheClip( this.clip );
				delete this.mx;

			}

			if ( val ) {

				this.mx = val;
				this.mx.clipAction( this.clip );

			}

		},

		get: function () {

			return this.mx;

		}

	}

} );

//
//	Animator
//

SEA3DLoader.Animator = function ( clips, mixer ) {

	this.updateAnimations( clips, mixer );

	this.clone = function ( scope ) {

		return new this.constructor( this.clips, new THREE.AnimationMixer( scope ) ).copyFrom( this );

	}.bind( this );

};

Object.assign( SEA3DLoader.Animator.prototype, {

	update: function ( dt ) {

		this.mixer.update( dt || 0 );

		if ( this.currentAnimationAction && this.currentAnimationAction.paused ) {

			this.pause();

			if ( this.currentAnimation ) {

				this.currentAnimation.onComplete( this );

			}

		}

		return this;

	},

	updateAnimations: function ( clips, mixer ) {

		if ( this.playing ) this.stop();

		if ( this.mixer ) SEA3DLoader.AnimationHandler.remove( this );

		this.mixer = mixer;

		this.relative = false;
		this.playing = false;
		this.paused = false;

		this.timeScale = 1;

		this.animations = [];
		this.animation = {};

		this.clips = [];

		if ( clips ) {

			for ( var i = 0; i < clips.length; i ++ ) {

				this.addAnimation( clips[ i ] );

			}

		}

		return this;

	},

	addAnimation: function ( animation ) {

		if ( animation instanceof THREE.AnimationClip ) {

			this.clips.push( animation );

			animation = new SEA3DLoader.Animation( animation );

		}

		this.animations.push( animation );
		this.animation[ animation.name ] = animation;

		animation.mixer = this.mixer;

		return animation;

	},

	removeAnimation: function ( animation ) {

		if ( animation instanceof THREE.AnimationClip ) {

			animation = this.getAnimationByClip( animation );

		}

		this.clips.splice( this.clips.indexOf( animation.clip ), 1 );

		delete this.animation[ animation.name ];
		this.animations.splice( this.animations.indexOf( animation ), 1 );

		animation.mixer = null;

		return animation;

	},

	getAnimationByClip: function ( clip ) {

		for ( var i = 0; i < this.animations.length; i ++ ) {

			if ( this.animations[ i ].clip === clip ) return clip;

		}

	},

	getAnimationByName: function ( name ) {

		return typeof name === "number" ? this.animations[ name ] : this.animation[ name ];

	},

	setAnimationWeight: function ( name, val ) {

		this.mixer.clipAction( this.getAnimationByName( name ).clip ).setEffectiveWeight( val );

	},

	getAnimationWeight: function ( name ) {

		return this.mixer.clipAction( this.getAnimationByName( name ).clip ).getEffectiveWeight();

	},

	pause: function () {

		if ( this.playing && this.currentAnimation ) {

			SEA3DLoader.AnimationHandler.remove( this );

			this.playing = false;

		}

		return this;

	},

	resume: function () {

		if ( ! this.playing && this.currentAnimation ) {

			SEA3DLoader.AnimationHandler.add( this );

			this.playing = true;

		}

		return this;

	},

	setTimeScale: function ( val ) {

		this.timeScale = val;

		if ( this.currentAnimationAction ) this.updateTimeScale();

		return this;

	},

	getTimeScale: function () {

		return this.timeScale;

	},

	updateTimeScale: function () {

		this.currentAnimationAction.setEffectiveTimeScale( this.timeScale * ( this.currentAnimation ? this.currentAnimation.timeScale : 1 ) );

		return this;

	},

	play: function ( name, crossfade, offset, weight ) {

		var animation = this.getAnimationByName( name );

		if ( ! animation ) throw new Error( 'Animation "' + name + '" not found.' );

		if ( animation == this.currentAnimation ) {

			if ( offset !== undefined || ! animation.repeat ) this.currentAnimationAction.time = offset !== undefined ? offset :
				( this.currentAnimationAction.timeScale >= 0 ? 0 : this.currentAnimation.duration );

			this.currentAnimationAction.setEffectiveWeight( weight !== undefined ? weight : 1 );
			this.currentAnimationAction.paused = false;

			return this.resume();

		} else {

			this.previousAnimation = this.currentAnimation;
			this.currentAnimation = animation;

			this.previousAnimationAction = this.currentAnimationAction;
			this.currentAnimationAction = this.mixer.clipAction( animation.clip ).setLoop( animation.repeat ? THREE.LoopRepeat : THREE.LoopOnce, Infinity ).reset();
			this.currentAnimationAction.clampWhenFinished = ! animation.repeat;
			this.currentAnimationAction.paused = false;

			this.updateTimeScale();

			if ( offset !== undefined || ! animation.repeat ) this.currentAnimationAction.time = offset !== undefined ? offset :
				( this.currentAnimationAction.timeScale >= 0 ? 0 : this.currentAnimation.duration );

			this.currentAnimationAction.setEffectiveWeight( weight !== undefined ? weight : 1 );

			this.currentAnimationAction.play();

			if ( ! this.playing ) this.mixer.update( 0 );

			this.playing = true;

			if ( this.previousAnimation ) this.previousAnimationAction.crossFadeTo( this.currentAnimationAction, crossfade || 0, false );

			SEA3DLoader.AnimationHandler.add( this );

		}

		return this;

	},

	stop: function () {

		if ( this.playing ) SEA3DLoader.AnimationHandler.remove( this );

		if ( this.currentAnimation ) {

			this.currentAnimationAction.stop();

			this.previousAnimation = this.currentAnimation;
			this.previousAnimationAction = this.currentAnimationAction;

			delete this.currentAnimationAction;
			delete this.currentAnimation;

			this.playing = false;

		}

		return this;

	},

	playw: function ( name, weight ) {

		if ( ! this.playing && ! this.paused ) SEA3DLoader.AnimationHandler.add( this );

		var animation = this.getAnimationByName( name );

		this.playing = true;

		var clip = this.mixer.clipAction( animation.clip );
		clip.setLoop( animation.repeat ? THREE.LoopRepeat : THREE.LoopOnce, Infinity ).reset();
		clip.clampWhenFinished = ! animation.repeat;
		clip.paused = false;

		clip.setEffectiveWeight( weight ).play();

		return clip;

	},

	crossFade: function ( fromAnimName, toAnimName, duration, wrap ) {

		this.mixer.stopAllAction();

		var fromAction = this.playw( fromAnimName, 1 );
		var toAction = this.playw( toAnimName, 1 );

		fromAction.crossFadeTo( toAction, duration, wrap !== undefined ? wrap : false );

		return this;

	},

	stopAll: function () {

		this.stop().mixer.stopAllAction();

		this.playing = false;

		return this;

	},

	unPauseAll: function () {

		this.mixer.timeScale = 1;

		this.playing = true;
		this.paused = false;

		return this;

	},

	pauseAll: function () {

		this.mixer.timeScale = 0;

		this.playing = false;
		this.paused = true;

		return this;

	},

	setRelative: function ( val ) {

		if ( this.relative == val ) return;

		this.stop();

		this.relative = val;

		return this;

	},

	getRelative: function () {

		return this.relative;

	},

	copyFrom: function ( scope ) {

		for ( var i = 0; i < this.animations.length; i ++ ) {

			this.animations[ i ].timeScale = scope.animations[ i ].timeScale;

		}

		return this;

	}

} );

//
//	Object3D Animator
//

SEA3DLoader.Object3DAnimator = function ( clips, object3d ) {

	this.object3d = object3d;

	SEA3DLoader.Animator.call( this, clips, new THREE.AnimationMixer( object3d ) );

	this.clone = function ( scope ) {

		return new this.constructor( this.clips, scope ).copyFrom( this );

	}.bind( this );

};

SEA3DLoader.Object3DAnimator.prototype = Object.assign( Object.create( SEA3DLoader.Animator.prototype ), {

	constructor: SEA3DLoader.Object3DAnimator,

	stop: function () {

		if ( this.currentAnimation ) {

			var animate = this.object3d.animate;

			if ( animate && this instanceof SEA3DLoader.Object3DAnimator ) {

				animate.position.set( 0, 0, 0 );
				animate.quaternion.set( 0, 0, 0, 1 );
				animate.scale.set( 1, 1, 1 );

			}

		}

		SEA3DLoader.Animator.prototype.stop.call( this );

	},

	setRelative: function ( val ) {

		SEA3DLoader.Animator.prototype.setRelative.call( this, val );

		this.object3d.setAnimator( this.relative );

		this.updateAnimations( this.clips, new THREE.AnimationMixer( this.relative ? this.object3d.animate : this.object3d ) );

	}

} );

//
//	Camera Animator
//

SEA3DLoader.CameraAnimator = function ( clips, object3d ) {

	SEA3DLoader.Object3DAnimator.call( this, clips, object3d );

};

SEA3DLoader.CameraAnimator.prototype = Object.assign( Object.create( SEA3DLoader.Object3DAnimator.prototype ), {

	constructor: SEA3DLoader.CameraAnimator

} );

//
//	Sound Animator
//

SEA3DLoader.SoundAnimator = function ( clips, object3d ) {

	SEA3DLoader.Object3DAnimator.call( this, clips, object3d );

};

SEA3DLoader.SoundAnimator.prototype = Object.assign( Object.create( SEA3DLoader.Object3DAnimator.prototype ), {

	constructor: SEA3DLoader.SoundAnimator

} );

//
//	Light Animator
//

SEA3DLoader.LightAnimator = function ( clips, object3d ) {

	SEA3DLoader.Object3DAnimator.call( this, clips, object3d );

};

SEA3DLoader.LightAnimator.prototype = Object.assign( Object.create( SEA3DLoader.Object3DAnimator.prototype ), {

	constructor: SEA3DLoader.LightAnimator

} );

//
//	Container
//

SEA3DLoader.Object3D = function ( ) {

	THREE.Object3D.call( this );

};

SEA3DLoader.Object3D.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: SEA3DLoader.Object3D,

	// Relative Animation Extension ( Only used if relative animation is enabled )
	// TODO: It can be done with shader

	updateAnimateMatrix: function ( force ) {

		if ( this.matrixAutoUpdate === true ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate === true || force === true ) {

			if ( this.parent === null ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.animate.updateMatrix();

			this.matrixWorld.multiplyMatrices( this.matrixWorld, this.animate.matrix );

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	},

	setAnimator: function ( val ) {

		if ( this.getAnimator() == val )
			return;

		if ( val ) {

			this.animate = new THREE.Object3D();

			this.updateMatrixWorld = SEA3DLoader.Object3D.prototype.updateAnimateMatrix;

		} else {

			delete this.animate;

			this.updateMatrixWorld = THREE.Object3D.prototype.updateMatrixWorld;

		}

		this.matrixWorldNeedsUpdate = true;

	},

	getAnimator: function () {

		return this.animate != undefined;

	},

	copy: function ( source ) {

		THREE.Object3D.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Dummy
//

SEA3DLoader.Dummy = function ( width, height, depth ) {

	this.width = width != undefined ? width : 100;
	this.height = height != undefined ? height : 100;
	this.depth = depth != undefined ? depth : 100;

	var geo = new THREE.BoxGeometry( this.width, this.height, this.depth, 1, 1, 1 );

	geo.computeBoundingBox();
	geo.computeBoundingSphere();

	THREE.Mesh.call( this, geo, SEA3DLoader.Dummy.MATERIAL );

};

SEA3DLoader.Dummy.MATERIAL = new THREE.MeshBasicMaterial( { wireframe: true, color: SEA3DLoader.HELPER_COLOR } );

SEA3DLoader.Dummy.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), SEA3DLoader.Object3D.prototype, {

	constructor: SEA3DLoader.Dummy,

	copy: function ( source ) {

		THREE.Mesh.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	},

	dispose: function () {

		this.geometry.dispose();

	}

} );

//
//	Mesh
//

SEA3DLoader.Mesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

};

SEA3DLoader.Mesh.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), SEA3DLoader.Object3D.prototype, {

	constructor: SEA3DLoader.Mesh,

	setWeight: function ( name, val ) {

		var index = typeof name === "number" ? name : this.morphTargetDictionary[ name ];

		this.morphTargetInfluences[ index ] = val;

	},

	getWeight: function ( name ) {

		var index = typeof name === "number" ? name : this.morphTargetDictionary[ name ];

		return this.morphTargetInfluences[ index ];

	},

	copy: function ( source ) {

		THREE.Mesh.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Skinning
//

SEA3DLoader.SkinnedMesh = function ( geometry, material, useVertexTexture ) {

	THREE.SkinnedMesh.call( this, geometry, material, useVertexTexture );

	this.updateAnimations( geometry.animations, new THREE.AnimationMixer( this ) );

};

SEA3DLoader.SkinnedMesh.prototype = Object.assign( Object.create( THREE.SkinnedMesh.prototype ), SEA3DLoader.Mesh.prototype, SEA3DLoader.Animator.prototype, {

	constructor: SEA3DLoader.SkinnedMesh,

	boneByName: function ( name ) {

		var bones = this.skeleton.bones;

		for ( var i = 0, bl = bones.length; i < bl; i ++ ) {

			if ( name == bones[ i ].name )
				return bones[ i ];

		}

	},

	copy: function ( source ) {

		THREE.SkinnedMesh.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Vertex Animation
//

SEA3DLoader.VertexAnimationMesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'MorphAnimMesh';

	this.updateAnimations( geometry.animations, new THREE.AnimationMixer( this ) );

};

SEA3DLoader.VertexAnimationMesh.prototype = Object.assign( Object.create( THREE.Mesh.prototype ), SEA3DLoader.Mesh.prototype, SEA3DLoader.Animator.prototype, {

	constructor: SEA3DLoader.VertexAnimationMesh,

	copy: function ( source ) {

		THREE.Mesh.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Camera
//

SEA3DLoader.Camera = function ( fov, aspect, near, far ) {

	THREE.PerspectiveCamera.call( this, fov, aspect, near, far );

};

SEA3DLoader.Camera.prototype = Object.assign( Object.create( THREE.PerspectiveCamera.prototype ), SEA3DLoader.Object3D.prototype, {

	constructor: SEA3DLoader.Camera,

	copy: function ( source ) {

		THREE.PerspectiveCamera.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Orthographic Camera
//

SEA3DLoader.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.OrthographicCamera.call( this, left, right, top, bottom, near, far );

};

SEA3DLoader.OrthographicCamera.prototype = Object.assign( Object.create( THREE.OrthographicCamera.prototype ), SEA3DLoader.Object3D.prototype, {

	constructor: SEA3DLoader.OrthographicCamera,

	copy: function ( source ) {

		THREE.OrthographicCamera.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	PointLight
//

SEA3DLoader.PointLight = function ( hex, intensity, distance, decay ) {

	THREE.PointLight.call( this, hex, intensity, distance, decay );

};

SEA3DLoader.PointLight.prototype = Object.assign( Object.create( THREE.PointLight.prototype ), SEA3DLoader.Object3D.prototype, {

	constructor: SEA3DLoader.PointLight,

	copy: function ( source ) {

		THREE.PointLight.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Point Sound
//

SEA3DLoader.PointSound = function ( listener ) {

	THREE.PositionalAudio.call( this, listener );

};

SEA3DLoader.PointSound.prototype = Object.assign( Object.create( THREE.PositionalAudio.prototype ), SEA3DLoader.Object3D.prototype, {

	constructor: SEA3DLoader.PointSound,

	copy: function ( source ) {

		THREE.PositionalAudio.prototype.copy.call( this, source );

		this.attribs = source.attribs;
		this.scripts = source.scripts;

		if ( source.animator ) this.animator = source.animator.clone( this );

		return this;

	}

} );

//
//	Animation Handler
//

SEA3DLoader.AnimationHandler = {

	animators: [],

	update: function ( dt ) {

		var i = 0;

		while ( i < this.animators.length ) {

			this.animators[ i ++ ].update( dt );

		}

	},

	add: function ( animator ) {

		var index = this.animators.indexOf( animator );

		if ( index === - 1 ) this.animators.push( animator );

	},

	remove: function ( animator ) {

		var index = this.animators.indexOf( animator );

		if ( index !== - 1 ) this.animators.splice( index, 1 );

	}

};

//
//	Output
//

SEA3DLoader.Domain.prototype.getMesh = SEA3DLoader.prototype.getMesh = function ( name ) {

	return this.objects[ "m3d/" + name ];

};

SEA3DLoader.Domain.prototype.getDummy = SEA3DLoader.prototype.getDummy = function ( name ) {

	return this.objects[ "dmy/" + name ];

};

SEA3DLoader.Domain.prototype.getLine = SEA3DLoader.prototype.getLine = function ( name ) {

	return this.objects[ "line/" + name ];

};

SEA3DLoader.Domain.prototype.getSound3D = SEA3DLoader.prototype.getSound3D = function ( name ) {

	return this.objects[ "sn3d/" + name ];

};

SEA3DLoader.Domain.prototype.getMaterial = SEA3DLoader.prototype.getMaterial = function ( name ) {

	return this.objects[ "mat/" + name ];

};

SEA3DLoader.Domain.prototype.getLight = SEA3DLoader.prototype.getLight = function ( name ) {

	return this.objects[ "lht/" + name ];

};

SEA3DLoader.Domain.prototype.getGLSL = SEA3DLoader.prototype.getGLSL = function ( name ) {

	return this.objects[ "glsl/" + name ];

};

SEA3DLoader.Domain.prototype.getCamera = SEA3DLoader.prototype.getCamera = function ( name ) {

	return this.objects[ "cam/" + name ];

};

SEA3DLoader.Domain.prototype.getTexture = SEA3DLoader.prototype.getTexture = function ( name ) {

	return this.objects[ "tex/" + name ];

};

SEA3DLoader.Domain.prototype.getCubeMap = SEA3DLoader.prototype.getCubeMap = function ( name ) {

	return this.objects[ "cmap/" + name ];

};

SEA3DLoader.Domain.prototype.getJointObject = SEA3DLoader.prototype.getJointObject = function ( name ) {

	return this.objects[ "jnt/" + name ];

};

SEA3DLoader.Domain.prototype.getContainer3D = SEA3DLoader.prototype.getContainer3D = function ( name ) {

	return this.objects[ "c3d/" + name ];

};

SEA3DLoader.Domain.prototype.getSprite = SEA3DLoader.prototype.getSprite = function ( name ) {

	return this.objects[ "m2d/" + name ];

};

SEA3DLoader.Domain.prototype.getProperties = SEA3DLoader.prototype.getProperties = function ( name ) {

	return this.objects[ "prop/" + name ];

};

//
//	Utils
//

SEA3DLoader.prototype.isPowerOfTwo = function ( num ) {

	return num ? ( ( num & - num ) == num ) : false;

};

SEA3DLoader.prototype.nearestPowerOfTwo = function ( num ) {

	return Math.pow( 2, Math.round( Math.log( num ) / Math.LN2 ) );

};

SEA3DLoader.prototype.updateTransform = function ( obj3d, sea ) {

	var mtx = SEA3DLoader.MTXBUF, vec = SEA3DLoader.VECBUF;

	if ( sea.transform ) mtx.fromArray( sea.transform );
	else mtx.makeTranslation( sea.position.x, sea.position.y, sea.position.z );

	// matrix

	obj3d.position.setFromMatrixPosition( mtx );
	obj3d.scale.setFromMatrixScale( mtx );

	// ignore rotation scale

	mtx.scale( vec.set( 1 / obj3d.scale.x, 1 / obj3d.scale.y, 1 / obj3d.scale.z ) );
	obj3d.rotation.setFromRotationMatrix( mtx );

	// optimize if is static

	if ( this.config.forceStatic || sea.isStatic ) {

		obj3d.updateMatrix();
		obj3d.matrixAutoUpdate = false;

	}

};

SEA3DLoader.prototype.toVector3 = function ( data ) {

	return new THREE.Vector3( data.x, data.y, data.z );

};

SEA3DLoader.prototype.toFaces = function ( faces ) {

	// xyz(- / +) to xyz(+ / -) sequence
	var f = [];

	f[ 0 ] = faces[ 1 ];
	f[ 1 ] = faces[ 0 ];
	f[ 2 ] = faces[ 3 ];
	f[ 3 ] = faces[ 2 ];
	f[ 4 ] = faces[ 5 ];
	f[ 5 ] = faces[ 4 ];

	return f;

};

SEA3DLoader.prototype.updateScene = function () {

	if ( this.materials != undefined ) {

		for ( var i = 0, l = this.materials.length; i < l; ++ i ) {

			this.materials[ i ].needsUpdate = true;

		}

	}

};

SEA3DLoader.prototype.addSceneObject = function ( sea, obj3d ) {

	obj3d = obj3d || sea.tag;

	obj3d.visible = sea.visible;

	if ( sea.parent ) sea.parent.tag.add( obj3d );
	else if ( this.config.container ) this.config.container.add( obj3d );

	if ( sea.attributes ) obj3d.attribs = sea.attributes.tag;

	if ( sea.scripts ) {

		obj3d.scripts = this.getJSMList( obj3d, sea.scripts );

		if ( this.config.runScripts ) this.domain.runJSMList( obj3d );

	}

};

SEA3DLoader.prototype.createObjectURL = function ( raw, mime ) {

	return ( window.URL || window.webkitURL ).createObjectURL( new Blob( [ raw ], { type: mime } ) );

};

SEA3DLoader.prototype.bufferToTexture = function ( raw ) {

	return this.createObjectURL( raw, "image" );

};

SEA3DLoader.prototype.bufferToSound = function ( raw ) {

	return this.createObjectURL( raw, "audio" );

};

SEA3DLoader.prototype.parsePath = function ( url ) {

	var paths = this.config.paths;

	for ( var name in paths ) {

		url = url.replace( new RegExp( "%" + name + "%", "g" ), paths[ name ] );

	}

	return url;

};

SEA3DLoader.prototype.addDefaultAnimation = function ( sea, animatorClass ) {

	var scope = sea.tag;

	for ( var i = 0, count = sea.animations ? sea.animations.length : 0; i < count; i ++ ) {

		var anm = sea.animations[ i ];

		switch ( anm.tag.type ) {

			case SEA3D.Animation.prototype.type:

				var animation = anm.tag.tag || this.getAnimationType( {
					sea: anm.tag,
					scope: scope,
					relative: anm.relative
				} );

				scope.animator = new animatorClass( animation, scope );
				scope.animator.setRelative( anm.relative );

				if ( this.config.autoPlay ) {

					scope.animator.play( 0 );

				}

				return scope.animator;

				break;

		}

	}

};

//
//	Geometry
//

SEA3DLoader.prototype.readGeometryBuffer = function ( sea ) {

	var geo = new THREE.BufferGeometry();

	for ( var i = 0; i < sea.groups.length; i ++ ) {

		var g = sea.groups[ i ];

		geo.addGroup( g.start, g.count, i );

	}

	geo.setIndex( new THREE.BufferAttribute( sea.indexes, 1 ) );
	geo.addAttribute( 'position', new THREE.BufferAttribute( sea.vertex, 3 ) );

	if ( sea.uv ) {

		geo.addAttribute( 'uv', new THREE.BufferAttribute( sea.uv[ 0 ], 2 ) );
		if ( sea.uv.length > 1 ) geo.addAttribute( 'uv2', new THREE.BufferAttribute( sea.uv[ 1 ], 2 ) );

	}

	if ( sea.normal ) geo.addAttribute( 'normal', new THREE.BufferAttribute( sea.normal, 3 ) );
	else geo.computeVertexNormals();

	if ( sea.tangent4 ) geo.addAttribute( 'tangent', new THREE.BufferAttribute( sea.tangent4, 4 ) );

	if ( sea.color ) geo.addAttribute( 'color', new THREE.BufferAttribute( sea.color[ 0 ], sea.numColor ) );

	if ( sea.joint ) {

		geo.addAttribute( 'skinIndex', new THREE.Float32BufferAttribute( sea.joint, sea.jointPerVertex ) );
		geo.addAttribute( 'skinWeight', new THREE.Float32BufferAttribute( sea.weight, sea.jointPerVertex ) );

	}

	if ( this.config.bounding ) {

		geo.computeBoundingBox();
		geo.computeBoundingSphere();

	}

	geo.name = sea.name;

	this.domain.geometries = this.geometries = this.geometries || [];
	this.geometries.push( this.objects[ "geo/" + sea.name ] = sea.tag = geo );

};

//
//	Dummy
//

SEA3DLoader.prototype.readDummy = function ( sea ) {

	var dummy = new SEA3DLoader.Dummy( sea.width, sea.height, sea.depth );
	dummy.name = sea.name;

	this.domain.dummys = this.dummys = this.dummys || [];
	this.dummys.push( this.objects[ "dmy/" + sea.name ] = sea.tag = dummy );

	this.addSceneObject( sea );
	this.updateTransform( dummy, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.Object3DAnimator );

};

//
//	Line
//

SEA3DLoader.prototype.readLine = function ( sea ) {

	var	geo = new THREE.BufferGeometry();

	if ( sea.closed )
		sea.vertex.push( sea.vertex[ 0 ], sea.vertex[ 1 ], sea.vertex[ 2 ] );

	geo.addAttribute( 'position', new THREE.Float32BufferAttribute( sea.vertex, 3 ) );

	var line = new THREE.Line( geo, new THREE.LineBasicMaterial( { color: SEA3DLoader.HELPER_COLOR, linewidth: 3 } ) );
	line.name = sea.name;

	this.lines = this.lines || [];
	this.lines.push( this.objects[ "line/" + sea.name ] = sea.tag = line );

	this.addSceneObject( sea );
	this.updateTransform( line, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.Object3DAnimator );

};

//
//	Container3D
//

SEA3DLoader.prototype.readContainer3D = function ( sea ) {

	var container = new SEA3DLoader.Object3D();

	this.domain.containers = this.containers = this.containers || [];
	this.containers.push( this.objects[ "c3d/" + sea.name ] = sea.tag = container );

	this.addSceneObject( sea );
	this.updateTransform( container, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.Object3DAnimator );

};

//
//	Sprite
//

SEA3DLoader.prototype.readSprite = function ( sea ) {

	var mat;

	if ( sea.material ) {

		if ( ! sea.material.tag.sprite ) {

			mat = sea.material.tag.sprite = new THREE.SpriteMaterial();

			this.setBlending( mat, sea.blendMode );

			mat.map = sea.material.tag.map;
			mat.map.flipY = true;

			mat.color.set( sea.material.tag.color );
			mat.opacity = sea.material.tag.opacity;
			mat.fog = sea.material.receiveFog;

		} else mat = sea.material.tag.sprite;

	}

	var sprite = new THREE.Sprite( mat );
	sprite.name = sea.name;

	this.domain.sprites = this.sprites = this.sprites || [];
	this.sprites.push( this.objects[ "m2d/" + sea.name ] = sea.tag = sprite );

	this.addSceneObject( sea );
	this.updateTransform( sprite, sea );

	sprite.scale.set( sea.width, sea.height, 1 );

};

//
//	Mesh
//

SEA3DLoader.prototype.readMesh = function ( sea ) {

	var i, count, geo = sea.geometry.tag, mesh, mat, skeleton, skeletonAnimation, vertexAnimation, morpher;

	for ( i = 0, count = sea.modifiers ? sea.modifiers.length : 0; i < count; i ++ ) {

		var mod = sea.modifiers[ i ];

		switch ( mod.type ) {

			case SEA3D.Skeleton.prototype.type:
			case SEA3D.SkeletonLocal.prototype.type:

				skeleton = mod;

				geo.bones = skeleton.tag;

				break;

			case SEA3D.Morph.prototype.type:

				morpher = mod;

				geo.morphAttributes = morpher.tag.attribs;
				geo.morphTargets = morpher.tag.targets;

				break;

		}

	}

	for ( i = 0, count = sea.animations ? sea.animations.length : 0; i < count; i ++ ) {

		var anm = sea.animations[ i ];

		switch ( anm.tag.type ) {

			case SEA3D.SkeletonAnimation.prototype.type:

				skeletonAnimation = anm.tag;

				geo.animations = skeletonAnimation.tag || this.getAnimationType( {
					sea: skeletonAnimation,
					skeleton: skeleton,
					relative: true
				} );

				break;

			case SEA3D.VertexAnimation.prototype.type:

				vertexAnimation = anm.tag;

				geo.morphAttributes = vertexAnimation.tag.attribs;
				geo.morphTargets = vertexAnimation.tag.targets;
				geo.animations = vertexAnimation.tag.animations;

				break;

		}

	}

	var uMorph = morpher != undefined || vertexAnimation != undefined,
		uMorphNormal =
					( morpher && morpher.tag.attribs.normal != undefined ) ||
					( vertexAnimation && vertexAnimation.tag.attribs.normal != undefined );

	if ( sea.material ) {

		if ( sea.material.length > 1 ) {

			var mats = [];

			for ( i = 0; i < sea.material.length; i ++ ) {

				mats[ i ] = sea.material[ i ].tag;

				mats[ i ].skinning = skeleton != undefined;
				mats[ i ].morphTargets = uMorph;
				mats[ i ].morphNormals = uMorphNormal;
				mats[ i ].vertexColors = sea.geometry.color ? THREE.VertexColors : THREE.NoColors;

			}

//			mat = new THREE.MultiMaterial( mats );
			mat = mats;

		} else {

			mat = sea.material[ 0 ].tag;

			mat.skinning = skeleton != undefined;
			mat.morphTargets = uMorph;
			mat.morphNormals = uMorphNormal;
			mat.vertexColors = sea.geometry.color ? THREE.VertexColors : THREE.NoColors;

		}

	}

	if ( skeleton ) {

		mesh = new SEA3DLoader.SkinnedMesh( geo, mat, this.config.useVertexTexture );

		if ( this.config.autoPlay && skeletonAnimation ) {

			mesh.play( 0 );

		}

	} else if ( vertexAnimation ) {

		mesh = new SEA3DLoader.VertexAnimationMesh( geo, mat, vertexAnimation.frameRate );

		if ( this.config.autoPlay ) {

			mesh.play( 0 );

		}

	} else {

		mesh = new SEA3DLoader.Mesh( geo, mat );

	}


	mesh.name = sea.name;

	mesh.castShadow = sea.castShadows;
	mesh.receiveShadow = sea.material ? sea.material[ 0 ].receiveShadows : true;

	this.domain.meshes = this.meshes = this.meshes || [];
	this.meshes.push( this.objects[ "m3d/" + sea.name ] = sea.tag = mesh );

	this.addSceneObject( sea );
	this.updateTransform( mesh, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.Object3DAnimator );

};

//
//	Sound Point
//

SEA3DLoader.prototype.readSoundPoint = function ( sea ) {

	if ( ! this.audioListener ) {

		 this.audioListener = new THREE.AudioListener();

		 if ( this.config.container ) {

			this.config.container.add( this.audioListener );

		}

	}

	var sound3d = new SEA3DLoader.PointSound( this.audioListener );

	new THREE.AudioLoader().load( sea.sound.tag, function ( buffer ) {

		sound3d.setBuffer( buffer );

	} );

	sound3d.autoplay = sea.autoPlay;
	sound3d.setLoop( sea.autoPlay );
	sound3d.setVolume( sea.volume );
	sound3d.setRefDistance( sea.distance );
	sound3d.setRolloffFactor( this.config.audioRolloffFactor );

	sound3d.name = sea.name;

	this.domain.sounds3d = this.sounds3d = this.sounds3d || [];
	this.sounds3d.push( this.objects[ "sn3d/" + sea.name ] = sea.tag = sound3d );

	this.addSceneObject( sea );
	this.updateTransform( sound3d, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.SoundAnimator );

};

//
//	Cube Render
//

SEA3DLoader.prototype.readCubeRender = function ( sea ) {

	var cube = new THREE.CubeCamera( 0.1, 5000, SEA3DLoader.RTT_SIZE );
	cube.renderTarget.cubeCamera = cube;

	sea.tag = cube.renderTarget;

	this.domain.cubeRenderers = this.cubeRenderers = this.cubeRenderers || [];
	this.cubeRenderers.push( this.objects[ "rttc/" + sea.name ] = cube );

	this.addSceneObject( sea, cube );
	this.updateTransform( cube, sea );

};

//
//	Images (WDP, JPEG, PNG and GIF)
//

SEA3DLoader.prototype.readTexture = function ( sea ) {

	var image = new Image(),
		texture = new THREE.Texture();

	texture.name = sea.name;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.flipY = false;
	texture.image = image;

	if ( this.config.anisotropy !== undefined ) texture.anisotropy = this.config.anisotropy;

	image.onload = function () {

		texture.needsUpdate = true;

	};

	image.src = this.bufferToTexture( sea.data.buffer );

	this.domain.textures = this.textures = this.textures || [];
	this.textures.push( this.objects[ "tex/" + sea.name ] = sea.tag = texture );

};

//
//	Cube Map
//

SEA3DLoader.prototype.readCubeMap = function ( sea ) {

	var faces = this.toFaces( sea.faces ), texture = new THREE.CubeTexture( [] );

	var loaded = 0;

	texture.name = sea.name;
	texture.flipY = false;
	texture.format = THREE.RGBFormat;

	var onLoaded = function () {

		if ( ++ loaded == 6 ) {

			texture.needsUpdate = true;

			if ( ! this.config.async ) this.file.resume = true;

		}

	}.bind( this );

	for ( var i = 0; i < faces.length; ++ i ) {

		var cubeImage = new Image();
		cubeImage.onload = onLoaded;
		cubeImage.src = this.bufferToTexture( faces[ i ].buffer );

		texture.images[ i ] = cubeImage;

	}

	if ( ! this.config.async ) this.file.resume = false;

	this.domain.cubemaps = this.cubemaps = this.cubemaps || [];
	this.cubemaps.push( this.objects[ "cmap/" + sea.name ] = sea.tag = texture );

};

//
//	Sound (MP3, OGG)
//

SEA3DLoader.prototype.readSound = function ( sea ) {

	var sound = this.bufferToSound( sea.data.buffer );

	this.domain.sounds = this.sounds = this.sounds || [];
	this.sounds.push( this.objects[ "snd/" + sea.name ] = sea.tag = sound );

};

//
//	Script URL
//

SEA3DLoader.prototype.readScriptURL = function ( sea ) {

	this.file.resume = false;

	var loader = new THREE.FileLoader();

	loader.setResponseType( "text" ).load( sea.url, function ( src ) {

		this.file.resume = true;

		this.domain.scripts = this.scripts = this.scripts || [];
		this.scripts.push( this.objects[ "src/" + sea.name ] = sea.tag = src );

	}.bind( this ) );

};

//
//	Texture URL
//

SEA3DLoader.prototype.readTextureURL = function ( sea ) {

	var texture = new THREE.TextureLoader().load( this.parsePath( sea.url ) );

	texture.name = sea.name;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.flipY = false;

	if ( this.config.anisotropy !== undefined ) texture.anisotropy = this.config.anisotropy;

	this.domain.textures = this.textures = this.textures || [];
	this.textures.push( this.objects[ "tex/" + sea.name ] = sea.tag = texture );

};

//
//	CubeMap URL
//

SEA3DLoader.prototype.readCubeMapURL = function ( sea ) {

	var faces = this.toFaces( sea.faces );

	for ( var i = 0; i < faces.length; i ++ ) {

		faces[ i ] = this.parsePath( faces[ i ] );

	}

	var texture, format = faces[ 0 ].substr( - 3 );

	if ( format == "hdr" ) {

		var usePMREM = THREE.PMREMGenerator != null;

		this.file.resume = ! usePMREM;

		texture = new THREE.HDRCubeTextureLoader().load( THREE.UnsignedByteType, faces, function ( texture ) {

			if ( usePMREM ) {

				var pmremGenerator = new THREE.PMREMGenerator( texture );
				pmremGenerator.update( this.config.renderer );

				var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
				pmremCubeUVPacker.update( this.config.renderer );

				texture.dispose();

				this.objects[ "cmap/" + sea.name ] = sea.tag = pmremCubeUVPacker.CubeUVRenderTarget.texture;

				this.file.resume = true;

			}

		}.bind( this ) );

	} else {

		texture = new THREE.CubeTextureLoader().load( faces );

	}

	texture.name = sea.name;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.flipY = false;

	if ( this.config.anisotropy !== undefined ) texture.anisotropy = this.config.anisotropy;

	this.domain.cubemaps = this.cubemaps = this.cubemaps || [];
	this.cubemaps.push( this.objects[ "cmap/" + sea.name ] = sea.tag = texture );

};

//
//	Runtime
//

SEA3DLoader.prototype.getJSMList = function ( target, scripts ) {

	var scriptTarget = [];

	for ( var i = 0; i < scripts.length; i ++ ) {

		var script = scripts[ i ];

		if ( script.tag.type == SEA3D.JavaScriptMethod.prototype.type ) {

			scriptTarget.push( script );

		}

	}

	this.domain.scriptTargets = this.scriptTargets = this.scriptTargets || [];
	this.scriptTargets.push( target );

	return scriptTarget;

};

SEA3DLoader.prototype.readJavaScriptMethod = function ( sea ) {

	try {

		var src =
			'(function() {\n' +
			'var $METHOD = {}\n';

		var declare =
			'function($INC, $REF, global, local, $his, $PARAM) {\n' +
			'var watch = $INC["watch"],\n' +
			'scene = $INC["scene"],\n' +
			'sea3d = $INC["sea3d"],\n' +
			'print = $INC["print"];\n';

		declare +=
			'var $SRC = $INC["source"],\n' +
			'addEventListener = $SRC.addEventListener.bind( $SRC ),\n' +
			'hasEventListener = $SRC.hasEventListener.bind( $SRC ),\n' +
			'removeEventListener = $SRC.removeEventListener.bind( $SRC ),\n' +
			'dispatchEvent = $SRC.dispatchEvent.bind( $SRC ),\n' +
			'dispose = $SRC.dispose.bind( $SRC );\n';

		for ( var name in sea.methods ) {

			src += '$METHOD["' + name + '"] = ' + declare + sea.methods[ name ].src + '}\n';

		}

		src += 'return $METHOD; })';

		this.domain.methods = eval( src )();

	} catch ( e ) {

		console.error( 'SEA3D JavaScriptMethod: Error running "' + sea.name + '".' );
		console.error( e );

	}

};

//
//	GLSL
//

SEA3DLoader.prototype.readGLSL = function ( sea ) {

	this.domain.glsl = this.glsl = this.glsl || [];
	this.glsl.push( this.objects[ "glsl/" + sea.name ] = sea.tag = sea.src );

};

//
//	Material
//

SEA3DLoader.prototype.materialTechnique =
( function () {

	var techniques = {};

	// FINAL
	techniques.onComplete = function ( mat, sea ) {

		if ( sea.alpha < 1 || mat.blending > THREE.NormalBlending ) {

			mat.opacity = sea.alpha;
			mat.transparent = true;

		}

	};

	// PHYSICAL
	techniques[ SEA3D.Material.PHYSICAL ] =
	function ( mat, tech ) {

		mat.color.setHex( tech.color );
		mat.roughness = tech.roughness;
		mat.metalness = tech.metalness;

	};

	// REFLECTIVITY
	techniques[ SEA3D.Material.REFLECTIVITY ] =
	function ( mat, tech ) {

		mat.reflectivity = tech.strength;

	};

	// CLEAR_COAT
	techniques[ SEA3D.Material.CLEAR_COAT ] =
	function ( mat, tech ) {

		mat.clearCoat = tech.strength;
		mat.clearCoatRoughness = tech.roughness;

	};

	// PHONG
	techniques[ SEA3D.Material.PHONG ] =
	function ( mat, tech ) {

		mat.color.setHex( tech.diffuseColor );
		mat.specular.setHex( tech.specularColor ).multiplyScalar( tech.specular );
		mat.shininess = tech.gloss;

	};

	// DIFFUSE_MAP
	techniques[ SEA3D.Material.DIFFUSE_MAP ] =
	function ( mat, tech, sea ) {

		mat.map = tech.texture.tag;
		mat.color.setHex( 0xFFFFFF );

		mat.map.wrapS = mat.map.wrapT = sea.repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

		if ( tech.texture.transparent ) {

			mat.transparent = true;

		}

	};

	// ROUGHNESS_MAP
	techniques[ SEA3D.Material.ROUGHNESS_MAP ] =
	function ( mat, tech ) {

		mat.roughnessMap = tech.texture.tag;

	};

	// METALNESS_MAP
	techniques[ SEA3D.Material.METALNESS_MAP ] =
	function ( mat, tech ) {

		mat.metalnessMap = tech.texture.tag;

	};

	// SPECULAR_MAP
	techniques[ SEA3D.Material.SPECULAR_MAP ] =
	function ( mat, tech ) {

		if ( mat.specular ) {

			mat.specularMap = tech.texture.tag;
			mat.specular.setHex( 0xFFFFFF );

		}

	};

	// NORMAL_MAP
	techniques[ SEA3D.Material.NORMAL_MAP ] =
	function ( mat, tech ) {

		mat.normalMap = tech.texture.tag;

	};

	// REFLECTION
	techniques[ SEA3D.Material.REFLECTION ] =
	techniques[ SEA3D.Material.FRESNEL_REFLECTION ] =
	function ( mat, tech ) {

		mat.envMap = tech.texture.tag;
		mat.envMap.mapping = THREE.CubeReflectionMapping;
		mat.combine = THREE.MixOperation;

		mat.reflectivity = tech.alpha;

	};

	// REFLECTION_SPHERICAL
	techniques[ SEA3D.Material.REFLECTION_SPHERICAL ] =
	function ( mat, tech ) {

		mat.envMap = tech.texture.tag;
		mat.envMap.mapping = THREE.SphericalReflectionMapping;
		mat.combine = THREE.MixOperation;

		mat.reflectivity = tech.alpha;

	};

	// REFRACTION
	techniques[ SEA3D.Material.REFRACTION_MAP ] =
	function ( mat, tech ) {

		mat.envMap = tech.texture.tag;
		mat.envMap.mapping = THREE.CubeRefractionMapping;

		mat.refractionRatio = tech.ior;
		mat.reflectivity = tech.alpha;

	};

	// LIGHT_MAP
	techniques[ SEA3D.Material.LIGHT_MAP ] =
	function ( mat, tech ) {

		if ( tech.blendMode == "multiply" ) mat.aoMap = tech.texture.tag;
		else mat.lightMap = tech.texture.tag;

	};

	// EMISSIVE
	techniques[ SEA3D.Material.EMISSIVE ] =
	function ( mat, tech ) {

		mat.emissive.setHex( tech.color );

	};

	// EMISSIVE_MAP
	techniques[ SEA3D.Material.EMISSIVE_MAP ] =
	function ( mat, tech ) {

		mat.emissiveMap = tech.texture.tag;

	};

	// ALPHA_MAP
	techniques[ SEA3D.Material.ALPHA_MAP ] =
	function ( mat, tech, sea ) {

		mat.alphaMap = tech.texture.tag;
		mat.transparent = true;

		mat.alphaMap.wrapS = mat.alphaMap.wrapT = sea.repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

	};

	return techniques;

} )();

SEA3DLoader.prototype.createMaterial = function ( sea ) {

	if ( sea.tecniquesDict[ SEA3D.Material.REFLECTIVITY ] || sea.tecniquesDict[ SEA3D.Material.CLEAR_COAT ] ) {

		return new THREE.MeshPhysicalMaterial();

	} else if ( sea.tecniquesDict[ SEA3D.Material.PHYSICAL ] ) {

		return new THREE.MeshStandardMaterial();

	}

	return new THREE.MeshPhongMaterial();

};

SEA3DLoader.prototype.setBlending = function ( mat, blendMode ) {

	if ( blendMode === "normal" ) return;

	switch ( blendMode ) {

		case "add":

			mat.blending = THREE.AdditiveBlending;

			break;

		case "subtract":

			mat.blending = THREE.SubtractiveBlending;

			break;

		case "multiply":

			mat.blending = THREE.MultiplyBlending;

			break;

		case "screen":

			mat.blending = THREE.CustomBlending;
			mat.blendSrc = THREE.OneFactor;
			mat.blendDst = THREE.OneMinusSrcColorFactor;
			mat.blendEquation = THREE.AddEquation;

			break;

	}

	mat.transparent = true;

};

SEA3DLoader.prototype.readMaterial = function ( sea ) {

	var mat = this.createMaterial( sea );
	mat.name = sea.name;

	mat.depthWrite = sea.depthWrite;
	mat.depthTest = sea.depthTest;

	mat.premultipliedAlpha = sea.premultipliedAlpha;

	mat.side = sea.bothSides ? THREE.DoubleSide : THREE.FrontSide;

	this.setBlending( mat, sea.blendMode );

	for ( var i = 0; i < sea.technique.length; i ++ ) {

		var tech = sea.technique[ i ];

		if ( this.materialTechnique[ tech.kind ] ) {

			this.materialTechnique[ tech.kind ].call( this, mat, tech, sea );

		}

	}

	if ( this.materialTechnique.onComplete ) {

		this.materialTechnique.onComplete.call( this, mat, sea );

	}

	this.domain.materials = this.materials = this.materials || [];
	this.materials.push( this.objects[ "mat/" + sea.name ] = sea.tag = mat );

};

//
//	Point Light
//

SEA3DLoader.prototype.readPointLight = function ( sea ) {

	var light = new SEA3DLoader.PointLight( sea.color, sea.multiplier * this.config.multiplier );
	light.name = sea.name;

	if ( sea.attenuation ) {

		light.distance = sea.attenuation.end;

	}

	if ( sea.shadow ) this.setShadowMap( light );

	this.domain.lights = this.lights = this.lights || [];
	this.lights.push( this.objects[ "lht/" + sea.name ] = sea.tag = light );

	this.addSceneObject( sea );

	this.updateTransform( light, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.LightAnimator );

	this.updateScene();

};

//
//	Hemisphere Light
//

SEA3DLoader.prototype.readHemisphereLight = function ( sea ) {

	var light = new THREE.HemisphereLight( sea.color, sea.secondColor, sea.multiplier * this.config.multiplier );
	light.position.set( 0, 500, 0 );
	light.name = sea.name;

	this.domain.lights = this.lights = this.lights || [];
	this.lights.push( this.objects[ "lht/" + sea.name ] = sea.tag = light );

	this.addSceneObject( sea );

	this.addDefaultAnimation( sea, SEA3DLoader.LightAnimator );

	this.updateScene();

};

//
//	Ambient Light
//

SEA3DLoader.prototype.readAmbientLight = function ( sea ) {

	var light = new THREE.AmbientLight( sea.color, sea.multiplier * this.config.multiplier );
	light.name = sea.name;

	this.domain.lights = this.lights = this.lights || [];
	this.lights.push( this.objects[ "lht/" + sea.name ] = sea.tag = light );

	this.addSceneObject( sea );

	this.addDefaultAnimation( sea, SEA3DLoader.LightAnimator );

	this.updateScene();

};

//
//	Directional Light
//

SEA3DLoader.prototype.readDirectionalLight = function ( sea ) {

	var light = new THREE.DirectionalLight( sea.color, sea.multiplier * this.config.multiplier );
	light.name = sea.name;

	if ( sea.shadow ) {

		this.setShadowMap( light );

	}

	this.domain.lights = this.lights = this.lights || [];
	this.lights.push( this.objects[ "lht/" + sea.name ] = sea.tag = light );

	this.addSceneObject( sea );

	this.updateTransform( light, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.LightAnimator );

	this.updateScene();

};

//
//	Camera
//

SEA3DLoader.prototype.readCamera = function ( sea ) {

	var camera = new SEA3DLoader.Camera( sea.fov );
	camera.name = sea.name;

	this.domain.cameras = this.cameras = this.cameras || [];
	this.cameras.push( this.objects[ "cam/" + sea.name ] = sea.tag = camera );

	this.addSceneObject( sea );
	this.updateTransform( camera, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.CameraAnimator );

};

//
//	Orthographic Camera
//

SEA3DLoader.prototype.readOrthographicCamera = function ( sea ) {

	var aspect, width, height;

	var stageWidth = this.config.stageWidth !== undefined ? this.config.stageWidth : ( window ? window.innerWidth : 1024 );
	var stageHeight = this.config.stageHeight !== undefined ? this.config.stageHeight : ( window ? window.innerHeight : 1024 );

	if ( stageWidth > stageHeight ) {

		aspect = stageWidth / stageHeight;

		width = sea.height * aspect;
		height = sea.height;

	} else {

		aspect = stageHeight / stageWidth;

		width = sea.height;
		height = sea.height * aspect;

	}

	var camera = new SEA3DLoader.OrthographicCamera( - width, width, height, - height );
	camera.name = sea.name;

	this.domain.cameras = this.cameras = this.cameras || [];
	this.cameras.push( this.objects[ "cam/" + sea.name ] = sea.tag = camera );

	this.addSceneObject( sea );
	this.updateTransform( camera, sea );

	this.addDefaultAnimation( sea, SEA3DLoader.CameraAnimator );

};

//
//	Skeleton
//

SEA3DLoader.prototype.readSkeletonLocal = function ( sea ) {

	var bones = [];

	for ( var i = 0; i < sea.joint.length; i ++ ) {

		var bone = sea.joint[ i ];

		bones[ i ] = {
			name: bone.name,
			pos: [ bone.x, bone.y, bone.z ],
			rotq: [ bone.qx, bone.qy, bone.qz, bone.qw ],
			parent: bone.parentIndex
		};

	}

	sea.tag = bones;

};

//
//	Joint Object
//

SEA3DLoader.prototype.readJointObject = function ( sea ) {

	var mesh = sea.target.tag,
		bone = mesh.skeleton.bones[ sea.joint ];

	this.domain.joints = this.joints = this.joints || [];
	this.joints.push( this.objects[ "jnt/" + sea.name ] = sea.tag = bone );

};

//
//	Morpher
//

SEA3DLoader.prototype.readMorpher = function ( sea ) {

	var attribs = { position: [] }, targets = [];

	for ( var i = 0; i < sea.node.length; i ++ ) {

		var node = sea.node[ i ];

		attribs.position[ i ] = new THREE.Float32BufferAttribute( node.vertex, 3 );

		if ( node.normal ) {

			attribs.normal = attribs.normal || [];
			attribs.normal[ i ] = new THREE.Float32BufferAttribute( node.normal, 3 );

		}

		targets[ i ] = { name: node.name };

	}

	sea.tag = {
		attribs: attribs,
		targets: targets
	};

};

//
//	Animation
//

SEA3DLoader.prototype.readAnimation = function ( sea ) {

	var animations = [], delta = ( 1000 / sea.frameRate ) / 1000;

	for ( var i = 0; i < sea.sequence.length; i ++ ) {

		var seq = sea.sequence[ i ];

		var tracks = [];

		for ( var j = 0; j < sea.dataList.length; j ++ ) {

			var anm = sea.dataList[ j ],
				t, k, times, values,
				data = anm.data,
				start = seq.start * anm.blockSize,
				end = start + ( seq.count * anm.blockSize ),
				intrpl = seq.intrpl ? THREE.InterpolateLinear : false,
				name = null;

			switch ( anm.kind ) {

				case SEA3D.Animation.POSITION:

					name = '.position';

					break;

				case SEA3D.Animation.ROTATION:

					name = '.quaternion';

					break;

				case SEA3D.Animation.SCALE:

					name = '.scale';

					break;

				case SEA3D.Animation.COLOR:

					name = '.color';

					break;

				case SEA3D.Animation.MULTIPLIER:

					name = '.intensity';

					break;

				case SEA3D.Animation.FOV:

					name = '.fov';

					break;

			}

			if ( ! name ) continue;

			switch ( anm.type ) {

				case SEA3D.Stream.BYTE:
				case SEA3D.Stream.UBYTE:
				case SEA3D.Stream.INT:
				case SEA3D.Stream.UINT:
				case SEA3D.Stream.FLOAT:
				case SEA3D.Stream.DOUBLE:
				case SEA3D.Stream.DECIMAL:

					values = data.subarray( start, end );
					times = new Float32Array( values.length );
					t = 0;

					for ( k = 0; k < times.length; k ++ ) {

						times[ k ] = t;
						t += delta;

					}

					tracks.push( new THREE.VectorKeyframeTrack( name, times, values, intrpl ) );

					break;

				case SEA3D.Stream.VECTOR3D:

					values = data.subarray( start, end );
					times = new Float32Array( values.length / anm.blockSize );
					t = 0;

					for ( k = 0; k < times.length; k ++ ) {

						times[ k ] = t;
						t += delta;

					}

					tracks.push( new THREE.VectorKeyframeTrack( name, times, values, intrpl ) );

					break;

				case SEA3D.Stream.VECTOR4D:

					values = data.subarray( start, end );
					times = new Float32Array( values.length / anm.blockSize );
					t = 0;

					for ( k = 0; k < times.length; k ++ ) {

						times[ k ] = t;
						t += delta;

					}

					tracks.push( new THREE.QuaternionKeyframeTrack( name, times, values, intrpl ) );

					break;

				case SEA3D.Stream.INT24:
				case SEA3D.Stream.UINT24:

					values = new Float32Array( ( end - start ) * 3 );
					times = new Float32Array( values.length / 3 );
					t = 0;

					for ( k = 0; k < times.length; k ++ ) {

						values[ ( k * 3 ) ] = ( ( data[ k ] >> 16 ) & 0xFF ) / 255;
						values[ ( k * 3 ) + 1 ] = ( ( data[ k ] >> 8 ) & 0xFF ) / 255;
						values[ ( k * 3 ) + 2 ] = ( data[ k ] & 0xFF ) / 255;
						times[ k ] = t;
						t += delta;

					}

					tracks.push( new THREE.VectorKeyframeTrack( name, times, values, intrpl ) );//ColorKeyframeTrack

					break;

			}

		}

		animations.push( new SEA3DLoader.AnimationClip( seq.name, - 1, tracks, seq.repeat ) );

	}

	this.domain.clips = this.clips = this.clips || [];
	this.clips.push( this.objects[ sea.name + '.anm' ] = sea.tag = animations );

};

//
//	Skeleton Animation
//

SEA3DLoader.prototype.readSkeletonAnimation = function ( sea, skl ) {

	var animations = [], delta = ( 1000 / sea.frameRate ) / 1000;

	for ( var i = 0; i < sea.sequence.length; i ++ ) {

		var seq = sea.sequence[ i ];

		var start = seq.start;
		var end = start + seq.count;

		var animation = {
			name: seq.name,
			fps: sea.frameRate,
			length: delta * seq.count,
			hierarchy: []
		};

		var numJoints = sea.numJoints,
			raw = sea.raw;

		for ( var j = 0; j < numJoints; j ++ ) {

			var bone = skl.joint[ j ],
				node = { parent: bone.parentIndex, keys: [] },
				keys = node.keys,
				time = 0;

			for ( var frame = start; frame < end; frame ++ ) {

				var idx = ( frame * numJoints * 7 ) + ( j * 7 );

				keys.push( {
					time: time,
					pos: [ raw[ idx ], raw[ idx + 1 ], raw[ idx + 2 ] ],
					rot: [ raw[ idx + 3 ], raw[ idx + 4 ], raw[ idx + 5 ], raw[ idx + 6 ] ],
					scl: [ 1, 1, 1 ]
				} );

				time += delta;

			}

			animation.hierarchy[ j ] = node;

		}

		animations.push( SEA3DLoader.AnimationClip.fromClip( THREE.AnimationClip.parseAnimation( animation, skl.tag ), seq.repeat ) );

	}

	this.domain.clips = this.clips = this.clips || [];
	this.clips.push( this.objects[ sea.name + '.skla' ] = sea.tag = animations );

};

//
//	Vertex Animation
//

SEA3DLoader.prototype.readVertexAnimation = function ( sea ) {

	var attribs = { position: [] }, targets = [], animations = [], i, j, l;

	for ( i = 0, l = sea.frame.length; i < l; i ++ ) {

		var frame = sea.frame[ i ];

		attribs.position[ i ] = new THREE.Float32BufferAttribute( frame.vertex, 3 );

		if ( frame.normal ) {

			attribs.normal = attribs.normal || [];
			attribs.normal[ i ] = new THREE.Float32BufferAttribute( frame.normal, 3 );

		}

		targets[ i ] = { name: i };

	}

	for ( i = 0; i < sea.sequence.length; i ++ ) {

		var seq = sea.sequence[ i ];
		var seqTargets = [];

		for ( j = 0; j < seq.count; j ++ ) {

			seqTargets[ j ] = targets[ seq.start + j ];

		}

		animations.push( SEA3DLoader.AnimationClip.fromClip( THREE.AnimationClip.CreateFromMorphTargetSequence( seq.name, seqTargets, sea.frameRate ), seq.repeat ) );

	}

	sea.tag = {
		attribs: attribs,
		targets: targets,
		animations: animations
	};

	this.domain.clips = this.clips = this.clips || [];
	this.clips.push( this.objects[ sea.name + '.vtxa' ] = sea.tag );

};

//
//	Animation Selector
//

SEA3DLoader.prototype.getAnimationType = function ( req ) {

	var sea = req.sea;

	switch ( sea.type ) {

		case SEA3D.SkeletonAnimation.prototype.type:

			this.readSkeletonAnimation( sea, req.skeleton );

			break;

	}

	return sea.tag;

};

//
//	Actions
//

SEA3DLoader.prototype.applyEnvironment = function ( envMap ) {

	for ( var j = 0, l = this.materials.length; j < l; ++ j ) {

		var mat = this.materials[ j ];

		if ( mat instanceof THREE.MeshStandardMaterial ) {

			if ( mat.envMap ) continue;

			mat.envMap = envMap;
			mat.envMap.mapping = THREE.CubeReflectionMapping;

			mat.needsUpdate = true;

		}

	}

};

SEA3DLoader.prototype.readActions = function ( sea ) {

	for ( var i = 0; i < sea.actions.length; i ++ ) {

		var act = sea.actions[ i ];

		switch ( act.kind ) {

			case SEA3D.Actions.ATTRIBUTES:

				this.attribs = this.domain.attribs = act.attributes.tag;

				break;

			case SEA3D.Actions.SCRIPTS:

				this.domain.scripts = this.getJSMList( this.domain, act.scripts );

				if ( this.config.runScripts ) this.domain.runJSMList( this.domain );

				break;

			case SEA3D.Actions.ENVIRONMENT_COLOR:

				this.domain.background = this.background = this.background || {};

				this.background.color = new THREE.Color( act.color );

				break;

			case SEA3D.Actions.ENVIRONMENT:

				this.domain.background = this.background = this.background || {};

				this.background.texture = act.texture.tag;

				if ( this.config.useEnvironment && this.materials != undefined ) {

					this.applyEnvironment( act.texture.tag );

				}

				break;

		}

	}

};

//
//	Events
//

SEA3DLoader.Event = {
	PROGRESS: "sea3d_progress",
	LOAD_PROGRESS: "sea3d_load",
	DOWNLOAD_PROGRESS: "sea3d_download",
	COMPLETE: "sea3d_complete",
	OBJECT_COMPLETE: "sea3d_object",
	PARSE_PROGRESS: "parse_progress",
	PARSE_COMPLETE: "parse_complete",
	ERROR: "sea3d_error"
};

SEA3DLoader.prototype.onProgress = function ( e ) {

	e.status = e.type;
	e.progress = e.loaded / e.total;
	e.type = SEA3DLoader.Event.PROGRESS;

	this.dispatchEvent( e );

};

SEA3DLoader.prototype.onLoadProgress = function ( e ) {

	e.type = SEA3DLoader.Event.LOAD_PROGRESS;
	this.dispatchEvent( e );

	this.onProgress( e );

};

SEA3DLoader.prototype.onDownloadProgress = function ( e ) {

	e.type = SEA3DLoader.Event.DOWNLOAD_PROGRESS;
	this.dispatchEvent( e );

	this.onProgress( e );

};

SEA3DLoader.prototype.onComplete = function ( e ) {

	e.type = SEA3DLoader.Event.COMPLETE;
	this.dispatchEvent( e );

};

SEA3DLoader.prototype.onCompleteObject = function ( e ) {

	e.type = SEA3DLoader.Event.OBJECT_COMPLETE;
	this.dispatchEvent( e );

};

SEA3DLoader.prototype.onParseProgress = function ( e ) {

	e.type = SEA3DLoader.Event.PARSE_PROGRESS;
	this.dispatchEvent( e );

};

SEA3DLoader.prototype.onParseComplete = function ( e ) {

	e.type = SEA3DLoader.Event.PARSE_COMPLETE;
	this.dispatchEvent( e );

};

SEA3DLoader.prototype.onError = function ( e ) {

	e.type = SEA3DLoader.Event.ERROR;
	this.dispatchEvent( e );

};

//
//	Loader
//

SEA3DLoader.prototype.createDomain = function () {

	return this.domain = new SEA3DLoader.Domain(
		this.config.id,
		this.objects = {},
		this.config.container
	);

};

SEA3DLoader.prototype.clone = function ( config, onParseComplete, onParseProgress ) {

	if ( ! this.file.isDone() ) throw new Error( "Previous parse is not completed." );

	this.config.container = config && config.container !== undefined ? config.container : new THREE.Object3D();

	if ( config ) this.loadConfig( config );

	var timeLimit = this.config.timeLimit;

	this.config.timeLimit = config && config.timeLimit !== undefined ? config.timeLimit : Infinity;

	this.parse( onParseComplete, onParseProgress );

	this.config.timeLimit = timeLimit;

	return this.domain;

};

SEA3DLoader.prototype.loadConfig = function ( config ) {

	for ( var name in config ) {

		this.config[ name ] = config[ name ];

	}

};

SEA3DLoader.prototype.parse = function ( onParseComplete, onParseProgress ) {

	delete this.cameras;
	delete this.containers;
	delete this.lights;
	delete this.joints;
	delete this.meshes;
	delete this.materials;
	delete this.animationSets;
	delete this.sprites;
	delete this.sounds3d;
	delete this.cubeRenderers;
	delete this.sounds;
	delete this.glsl;
	delete this.dummy;
	delete this.background;

	delete this.domain;

	this.createDomain();

	this.setTypeRead();

	this.file.onParseComplete = ( function ( e ) {

		if ( this.config.manager ) this.config.manager.add( this.domain );

		( onParseComplete || this.onParseComplete ).call( this, e );

	} ).bind( this );

	this.file.onParseProgress = onParseProgress || this.onParseProgress;

	// EXTENSIONS

	var i = SEA3DLoader.EXTENSIONS_LOADER.length;

	while ( i -- ) {

		var loader = SEA3DLoader.EXTENSIONS_LOADER[ i ];

		if ( loader.parse ) loader.parse.call( this );

	}

	this.file.parse();

	return this.domain;

};

SEA3DLoader.prototype.onHead = function ( args ) {

	if ( args.sign != 'TJS' ) {

		throw new Error( "Sign '" + args.sign + "' not supported! Use SEA3D Studio to publish or SEA3DLegacy.js" );

	}

};

SEA3DLoader.EXTENSIONS_LOADER = [];
SEA3DLoader.EXTENSIONS_DOMAIN = [];

SEA3DLoader.prototype.setTypeRead = function () {

	this.file.typeRead = {};

	this.file.typeRead[ SEA3D.Geometry.prototype.type ] = this.readGeometryBuffer;
	this.file.typeRead[ SEA3D.Mesh.prototype.type ] = this.readMesh;
	this.file.typeRead[ SEA3D.Sprite.prototype.type ] = this.readSprite;
	this.file.typeRead[ SEA3D.Container3D.prototype.type ] = this.readContainer3D;
	this.file.typeRead[ SEA3D.Line.prototype.type ] = this.readLine;
	this.file.typeRead[ SEA3D.Material.prototype.type ] = this.readMaterial;
	this.file.typeRead[ SEA3D.Camera.prototype.type ] = this.readCamera;
	this.file.typeRead[ SEA3D.OrthographicCamera.prototype.type ] = this.readOrthographicCamera;
	this.file.typeRead[ SEA3D.SkeletonLocal.prototype.type ] = this.readSkeletonLocal;
	this.file.typeRead[ SEA3D.JointObject.prototype.type ] = this.readJointObject;
	this.file.typeRead[ SEA3D.CubeMap.prototype.type ] = this.readCubeMap;
	this.file.typeRead[ SEA3D.CubeRender.prototype.type ] = this.readCubeRender;
	this.file.typeRead[ SEA3D.Animation.prototype.type ] = this.readAnimation;
	this.file.typeRead[ SEA3D.SoundPoint.prototype.type ] = this.readSoundPoint;
	this.file.typeRead[ SEA3D.TextureURL.prototype.type ] = this.readTextureURL;
	this.file.typeRead[ SEA3D.CubeMapURL.prototype.type ] = this.readCubeMapURL;
	this.file.typeRead[ SEA3D.Morph.prototype.type ] = this.readMorpher;
	this.file.typeRead[ SEA3D.VertexAnimation.prototype.type ] = this.readVertexAnimation;
	this.file.typeRead[ SEA3D.Actions.prototype.type ] = this.readActions;

	if ( this.config.dummys ) {

		this.file.typeRead[ SEA3D.Dummy.prototype.type ] = this.readDummy;

	}

	if ( this.config.scripts ) {

		this.file.typeRead[ SEA3D.ScriptURL.prototype.type ] = this.readScriptURL;
		this.file.typeRead[ SEA3D.JavaScriptMethod.prototype.type ] = this.readJavaScriptMethod;

	}

	if ( this.config.lights ) {

		this.file.typeRead[ SEA3D.PointLight.prototype.type ] = this.readPointLight;
		this.file.typeRead[ SEA3D.DirectionalLight.prototype.type ] = this.readDirectionalLight;
		this.file.typeRead[ SEA3D.HemisphereLight.prototype.type ] = this.readHemisphereLight;
		this.file.typeRead[ SEA3D.AmbientLight.prototype.type ] = this.readAmbientLight;

	}

	// UNIVERSAL

	this.file.typeRead[ SEA3D.JPEG.prototype.type ] =
	this.file.typeRead[ SEA3D.JPEG_XR.prototype.type ] =
	this.file.typeRead[ SEA3D.PNG.prototype.type ] =
	this.file.typeRead[ SEA3D.GIF.prototype.type ] = this.readTexture;
	this.file.typeRead[ SEA3D.MP3.prototype.type ] = this.readSound;
	this.file.typeRead[ SEA3D.GLSL.prototype.type ] = this.readGLSL;

	// EXTENSIONS

	var i = SEA3DLoader.EXTENSIONS_LOADER.length;

	while ( i -- ) {

		var loader = SEA3DLoader.EXTENSIONS_LOADER[ i ];

		if ( loader.setTypeRead ) loader.setTypeRead.call( this );

	}

};

SEA3DLoader.prototype.load = function ( data ) {

	this.file = new SEA3D.File();
	this.file.scope = this;
	this.file.config = this.config;
	this.file.onProgress = this.onLoadProgress.bind( this );
	this.file.onCompleteObject = this.onCompleteObject.bind( this );
	this.file.onDownloadProgress = this.onDownloadProgress.bind( this );
	this.file.onParseProgress = this.onParseProgress.bind( this );
	this.file.onParseComplete = this.onParseComplete.bind( this );
	this.file.onError = this.onError.bind( this );
	this.file.onHead = this.onHead.bind( this );

	this.file.onComplete = ( function ( e ) {

		if ( this.config.manager ) this.config.manager.add( this.domain );

		this.onComplete.call( this, e );

	} ).bind( this );

	// SEA3D

	this.createDomain();

	this.setTypeRead();

	if ( data === undefined ) return;

	if ( typeof data === "string" ) this.file.load( data );
	else this.file.read( data );

};

export { SEA3DLoader }