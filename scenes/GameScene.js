var gameConf = {
	key: "Game",
	physics:{
		default:'arcade',
		arcade:{debug:true}
	}
}

var boid;
var debug;

var GameScene = new Phaser.Scene(gameConf);

//called before the scene is loaded
GameScene.preload = function() {}

//called as soon as the scene is created
GameScene.create = function() {
	debug = this.add.graphics();
	boid = this.physics.add.image(centerX,centerY,"img_boid");
}

//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
GameScene.update = function(time, delta) {
	var pointer = this.input.activePointer;
	var target = new Phaser.Math.Vector2(pointer.x, pointer.y);
	debug.clear().lineStyle(1, 0x00ff00);
	debug.lineBetween(0, target.y, 800, target.y);
	debug.lineBetween(target.x, 0, target.x, 600);

	if (target.distance(boid.body) > 50)
		arrival(boid.body, target, 150, 0.5,100);
	else
		launch(boid.body, target, 150,1);
}


function launch(pVehicle, pTarget, MAX_SPEED, MAX_STEER) {
	var vecDesired;
	vecDesired = pTarget.subtract(pVehicle.center);
	vecDesired.normalize();
	vecDesired.scale(MAX_SPEED);
	var vecSteer = vecDesired.subtract(pVehicle.velocity);
	if (vecSteer.length() > MAX_STEER) {
	vecSteer = vecSteer.normalize();
	vecSteer.scale(MAX_STEER);
	}
	//Give escape speed
	pVehicle.velocity.subtract(vecSteer);
	//Set maximum escape speed
    pVehicle.setMaxSpeed(3 * MAX_SPEED);
	pVehicle.gameObject.angle = Phaser.Math.RadToDeg(pVehicle.velocity.angle());
}



function arrival(pVehicle, pTarget, MAX_SPEED, MAX_STEER, STOPPING_DISTANCE){
	//this variable will store information about our desired velocity vector
    var vecDesired = new Phaser.Math.Vector2();
    // 1. vector(desired velocity) = (target position) - (vehicle position) 
    vecDesired = pTarget.subtract(pVehicle.center);
    //cache distance
    var distance = vecDesired.length();
    // 2. normalize vector(desired velocity)
    vecDesired.normalize();
    // 3. scale vector(desired velocity) to maximum speed
    vecDesired.scale(MAX_SPEED);
    // 4. vector(steering force) = vector(desired velocity) - vector(current velocity)
    var vecSteer = vecDesired.subtract(pVehicle.velocity);
    // 5. limit the magnitude of vector(steering force) to maximum force
    if (vecSteer.length() > MAX_STEER){
      vecSteer = vecSteer.normalize();
      vecSteer.scale(MAX_STEER);
    }
    // 6. vector(new velocity) = vector(current velocity) + vector(steering force)
    pVehicle.velocity.add(vecSteer);
    // 7. limit the magnitude of vector(new velocity) to maximum speed
    //check if we should slow down
    if (distance < STOPPING_DISTANCE)
    {
        pVehicle.setMaxSpeed((distance / STOPPING_DISTANCE) * MAX_SPEED);
    }
	else{
		pVehicle.setMaxSpeed(MAX_SPEED);
	}
    // 8. update vehicle rotation according to the angle of the vehicle velocity
    //we use RadToDeg as the angle of the vector is returned in Radians instead of Degrees
    pVehicle.gameObject.angle = Phaser.Math.RadToDeg(pVehicle.velocity.angle());
}
