/*

The Game Project 4 – Side scrolling

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectables; 
var canyons; 
var mountains; 
var clouds; 
var trees_x; 
var birds; 
var livesCount;
var heartCollectables; 
var cameraPosX;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	cameraPosX = 0;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	livesCount = 3; // start with 3 lives

	// list of colectables 
	collectables = [
		{ pos_x: 100, pos_y: floorPos_y, size: 20, isFound: false },
		{ pos_x: 300, pos_y: floorPos_y - 100, size: 20, isFound: false },
		{ pos_x: 1300, pos_y: floorPos_y - 100, size: 20, isFound: false }
	];
	// list of canions
	canyons = [
		{ pos_x: -1000, width: 1070 },
		{ pos_x: 120, width: 70 },
		{ pos_x: 350, width: 90 },
		{ pos_x: 1350, width: 1000 }
	];
	// list of mountains 
	mountains = [
		{ pos_x: 750, pos_y: floorPos_y, width: 270, height: 140 },
		{ pos_x: 850, pos_y: floorPos_y, width: 310, height: 220 },
		{ pos_x: 1000, pos_y: floorPos_y, width: 250, height: 110 }  
	];
	// list of clouds with diferent sizes
	clouds = [
		{ pos_x: 200, pos_y: 100, size: 30 },
		{ pos_x: 350, pos_y: 80, size: 40 },
		{ pos_x: 600, pos_y: 120, size: 20 },
		{ pos_x: 800, pos_y: 90, size: 40 },
		{ pos_x: 950, pos_y: 60, size: 25 }
	];
	// list of trees 
	trees_x = [790, 200, 600];
	// list of birds with different speeds and sizes
	birds = [
		{ pos_x: 1024, pos_y: 120, scale: 0.6, speed: 2.0 },
		{ pos_x: 900, pos_y: 160, scale: 0.5, speed: 1.6 },
		{ pos_x: 1100, pos_y: 200, scale: 0.4, speed: 1.2 },
		{ pos_x: 1034, pos_y: 130, scale: 0.3, speed: 0.8 },
		{ pos_x: 1044, pos_y: 170, scale: 0.2, speed: 0.5 },
		{ pos_x: 1048, pos_y: 210, scale: 0.1, speed: 0.3 }
	];
	// list of collectible hearts
	heartCollectables = [
		{ pos_x: 70, pos_y: floorPos_y, size: 20, isFound: false }
	];
}

function draw()
{
	///////////DRAWING CODE//////////
	//update camera position
	cameraPosX = gameChar_x - width / 2;

	background(100,155,255); //fill the sky blue
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

	push();
	translate(-cameraPosX, 0);

	// game over screen
	if (livesCount == 0) {
		push();
		translate(cameraPosX, 0); 
		textAlign(CENTER, CENTER);
		fill(255, 0, 0);
		textSize(48);
		text("GAME OVER", width / 2, height / 2 );
		fill(255);
		textSize(24);
		text("Press ENTER to restart", width / 2, height / 2 + 40);
		pop();
		return;
	}
	// draw clouds
	for (let i = 0; i < clouds.length; i++) {
		// clouds movement speed
		clouds[i].pos_x -= 0.1; 
		// reset cloud to right if it goes off screen
		if (clouds[i].pos_x < -clouds[i].size) {
			clouds[i].pos_x = width + clouds[i].size;
		}
		drawCloud(clouds[i]);
	}
	// draw birds
	for (let i = 0; i < birds.length; i++) {
		// move left to right
		birds[i].pos_x += birds[i].speed / 20; 
		drawBird(birds[i].pos_x, birds[i].pos_y, birds[i].scale); 
		// reset bird to left if it goes off screen
		if (birds[i].pos_x > width + 40) { //aprox. bird size 40
			birds[i].pos_x = -40;
		}
	}
	// draw mountains
	for (let i = 0; i < mountains.length; i++) {
		drawMountain(mountains[i]);
	}
	// draw trees 
	for (let i = 0; i < trees_x.length; i++) {
		drawTree({ pos_x: trees_x[i], pos_y: floorPos_y - 70 });
	}
	// draw canyons
	for (let i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
	}
	// draw and check all collectables
	for (let i = 0; i < collectables.length; i++) {
		let collectable = collectables[i];
		if (!collectable.isFound && dist(gameChar_x, gameChar_y, collectable.pos_x, collectable.pos_y) < collectable.size) {
			collectable.isFound = true;
		}
		if (!collectable.isFound) {
			drawCollectable(collectable);
		}
	}
	// draw and check all collectible hearts
	for (let i = 0; i < heartCollectables.length; i++) {
		let heart = heartCollectables[i];
		if (!heart.isFound && dist(gameChar_x, gameChar_y, heart.pos_x, heart.pos_y) < heart.size) {
			heart.isFound = true;
			livesCount++;
		}
		if (!heart.isFound) {
			drawHeart(heart);
		}
	}
	// --- CANYON FALL LOGIC ---
	// detect if character is over any canyon 
	isPlummeting = false;
	for (let i = 0; i < canyons.length; i++) {
		if (isCharacterOverCanyon(gameChar_x, floorPos_y, canyons[i])) {
			isPlummeting = true;
			break;
		}
	}
	// if plummeting, fall faster
	if (isPlummeting) {
		gameChar_y += 8;
		// lose a life and reset position
		if (gameChar_y > height) {
			livesCount--;
			if (livesCount > 0) {
				gameChar_x = width/2;
				gameChar_y = floorPos_y;
				isPlummeting = false;
				isFalling = false;
				isLeft = false;
				isRight = false;
			} 
		}
	}
	// HUD: number of collected coins and number of remaining lives
	drawHUD();
	//draw game character
	if (isLeft && isFalling && !isPlummeting)
	{
		drawJumpingLeftStickman(gameChar_x, gameChar_y);
	}
	else if (isRight && isFalling && !isPlummeting)
	{
		drawJumpingRightStickman(gameChar_x, gameChar_y);
	}
	else if (isLeft && !isPlummeting)
	{
		drawFacingLeftStickman(gameChar_x, gameChar_y);
	}
	else if (isRight && !isPlummeting)
	{
		drawFacingRightStickman(gameChar_x, gameChar_y);
	}
	else if ((isFalling || isPlummeting) && !isPlummeting)
	{
		drawJumpingStickman(gameChar_x, gameChar_y);
	}
	else if (isPlummeting)
	{
		drawJumpingStickman(gameChar_x, gameChar_y);
	}
	else
	{
		drawStandingStickman(gameChar_x, gameChar_y);
	}

	pop();

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
	if (isLeft == true && !isPlummeting) {
		gameChar_x -= 5; // move left
	}
	if (isRight == true && !isPlummeting) {
		gameChar_x += 5; // move right
	}
	// gravity logic
	if (gameChar_y < floorPos_y && !isPlummeting)
	{
		gameChar_y += 5; // fall speed
		isFalling = true;
	}
	else if (gameChar_y > floorPos_y && !isPlummeting)
	{
		gameChar_y = floorPos_y; 
		isFalling = false;
	}
	else if (!isPlummeting)
	{
		isFalling = false;
	}
}


function keyPressed()
{
	// restart game if game over and ENTER is pressed
	if (livesCount === 0 && (keyCode === 13 || key === 'Enter')) {
		livesCount = 3;
		gameChar_x = width/2;
		gameChar_y = floorPos_y;
		isLeft = false;
		isRight = false;
		isFalling = false;
		isPlummeting = false;
		// reset collectables
		for (let i = 0; i < collectables.length; i++) {
			collectables[i].isFound = false;
		}
		// reset heart collectables
		for (let i = 0; i < heartCollectables.length; i++) {
			heartCollectables[i].isFound = false;
		}
		return;
	}

	// if statements to control the animation of the character when
	// keys are pressed.

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);

	if (isPlummeting) return; // freeze controls if plummeting
	if (keyCode == 37) //left arrow
	{
		isLeft = true;
		console.log("Left arrow pressed");
	}
	else if (keyCode == 39) //right arrow
	{
		isRight = true;
		console.log("Right arrow pressed");
	}
	else if (keyCode == 32 && !isFalling) // space bar for jump, only if on ground
	{
		gameChar_y -= 100;
		console.log("Space bar pressed, jumping");
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
	if (keyCode == 37) //left arrow
	{
		isLeft = false;
		console.log("Left arrow released");
	}
	else if (keyCode == 39) //right arrow
	{
		isRight = false;
		console.log("Right arrow released");
	}
}


function drawStandingStickman(x, y){
	stroke(0);
	strokeWeight(2);
	line(x, y - 20, x - 8, y + 1); //left leg
	line(x, y - 20, x + 8, y + 1); //right leg
	// Feet
	fill(0);
	ellipse(x - 8, y + 1, 5, 3); 
	ellipse(x + 8, y + 1, 5, 3); // right foot
	fill(0);
	noStroke();
	rect(x - 3, y - 50, 6, 30); //body
	stroke(0);
	strokeWeight(2);
	line(x - 3, y - 45, x - 10, y - 30); //left arm
	line(x + 3, y - 45, x + 10, y - 30); //right arm
	// Hands
	fill(0);
	ellipse(x - 10, y - 30, 4, 4); // left hand
	ellipse(x + 10, y - 30, 4, 4); // right hand
	fill(0);
	ellipse(x, y - 57, 10, 10); //head
	strokeWeight(1);
}

function drawJumpingStickman(x, y){
	stroke(0);
	strokeWeight(2);
	line(x, y - 20, x - 8, y + 1); //left leg
	line(x, y - 20, x + 8, y + 1); //right leg
	// Feet
	fill(0);
	ellipse(x - 8, y + 1, 5, 3); 
	ellipse(x + 8, y + 1, 5, 3); // right foot
	fill(0);
	noStroke();
	rect(x - 3, y - 50, 6, 30); //body
	stroke(0);
	strokeWeight(2);
	line(x - 3, y - 45, x - 15, y - 60); //left arm
	line(x + 3, y - 45, x + 15, y - 60); //right arm
	// Hands
	fill(0);
	ellipse(x - 15, y - 60, 4, 4); // left hand
	ellipse(x + 15, y - 60, 4, 4); // right hand
	fill(0);
	ellipse(x, y - 57, 10, 10); //head
	strokeWeight(1);
}

function drawFacingLeftStickman(x, y){
	stroke(0);
	strokeWeight(2);
	// legs
	line(x, y - 20, x - 8, y + 1);
	line(x, y - 20, x + 8, y + 1);
	// feet
	fill(0);
	ellipse(x - 11, y + 1, 6, 3); 
	ellipse(x + 5, y + 1, 6, 3); 
	fill(0);
	noStroke();
	//body
	rect(x - 1.8, y - 50, 3.6, 30);  
	stroke(0);
	strokeWeight(2);
	// arms
	line(x - 3, y - 45, x - 10, y - 30);
	line(x + 3, y - 45, x + 10, y - 30); 
	// hands
	fill(0);
	ellipse(x - 10, y - 30, 4, 4); 
	ellipse(x + 10, y - 30, 4, 4);
	fill(0);
	 //head
	ellipse(x, y - 57, 10, 10);
	strokeWeight(1);
}

function drawFacingRightStickman(x, y){
	stroke(0);
	strokeWeight(2);
	// legs
	line(x, y - 20, x - 8, y + 1); 
	line(x, y - 20, x + 8, y + 1); 
	// feet 
	fill(0);
	ellipse(x - 5, y + 1, 6, 3);  
	ellipse(x + 11, y + 1, 6, 3); 
	fill(0);
	noStroke();
	//body 
	rect(x - 1.8, y - 50, 3.6, 30); 
	stroke(0);
	strokeWeight(2);
	//arms
	line(x - 3, y - 45, x - 10, y - 30); 
	line(x + 3, y - 45, x + 10, y - 30); 
	// hands
	fill(0);
	ellipse(x - 10, y - 30, 4, 4);
	ellipse(x + 10, y - 30, 4, 4); 
	fill(0);
	 //head
	ellipse(x, y - 57, 10, 10); 
	strokeWeight(1);
}

function drawJumpingRightStickman(x, y){
	stroke(0);
	strokeWeight(2);
	// legs
	line(x, y - 22, x - 6, y - 2); 
	line(x, y - 22, x + 10, y - 2);
	// feet 
	fill(0);
	ellipse(x - 4, y - 2, 6, 3);
	ellipse(x + 11, y - 2, 6, 3);  
	fill(0);
	noStroke();
	// body
	rect(x - 1.8, y - 50, 3.6, 30);
	stroke(0);
	strokeWeight(2);
	// arms 
	line(x - 3, y - 45, x + 2, y - 60); 
	line(x + 3, y - 45, x + 18, y - 55); 
	// hands
	fill(0);
	ellipse(x + 2, y - 60, 4, 4); 
	ellipse(x + 18, y - 55, 4, 4);
	fill(0);
	//head
	ellipse(x, y - 57, 10, 10); 
	strokeWeight(1);
}

function drawJumpingLeftStickman(x, y){
	stroke(0);
	strokeWeight(2);
	// legs
	line(x, y - 22, x - 10, y - 2);
	line(x, y - 22, x + 6, y - 2); 
	// feet
	fill(0);
	ellipse(x - 11, y - 2, 6, 3);
	ellipse(x + 4, y - 2, 6, 3);
	fill(0);
	noStroke();
	rect(x - 1.8, y - 50, 3.6, 30); 
	stroke(0);
	strokeWeight(2);
	// arms
	line(x - 3, y - 45, x - 18, y - 55); 
	line(x + 3, y - 45, x - 2, y - 60); 
	// hands
	fill(0);
	ellipse(x - 18, y - 55, 4, 4);
	ellipse(x - 2, y - 60, 4, 4);
	fill(0);
	//head
	ellipse(x, y - 57, 10, 10); 
	strokeWeight(1);
}

function drawCollectable(collectable) {
	stroke(180, 140, 30); 
	// coin edge
	strokeWeight(3);
	fill(255, 215, 0);
	// coin 
	ellipse(collectable.pos_x, collectable.pos_y - collectable.size / 2, collectable.size, collectable.size);
	// shine 
	noStroke();
	fill(255, 255, 255, 180);
	ellipse(collectable.pos_x, collectable.pos_y - collectable.size / 2, collectable.size * 0.25, collectable.size * 0.25);
}

function drawCanyon(canyon) {
	//  canyon
	canyon.pos_y = 432;
	canyon.h = 144;
	// top sky blue
	fill(100,155,255);
	rect(canyon.pos_x, canyon.pos_y, canyon.width, canyon.h * 4/5);
	// bottom  dark blue
	fill(60,110,180);
	rect(canyon.pos_x, canyon.pos_y + canyon.h * 4/5, canyon.width, canyon.h * 1/5);
	// left margin edge
	fill(80, 80, 80);
	let leftMargin_x = canyon.pos_x;
	triangle(leftMargin_x, 432, leftMargin_x, 462, leftMargin_x + 5, 440);
	triangle(leftMargin_x, 440, leftMargin_x, 510, leftMargin_x + 8, 495);
	triangle(leftMargin_x, 510, leftMargin_x, 576, leftMargin_x + 22, 555);
	// right margin edge
	let rightMargin_x = canyon.pos_x + canyon.width;
	triangle(rightMargin_x, 432, rightMargin_x, 482, rightMargin_x - 5, 445);
	triangle(rightMargin_x, 470, rightMargin_x, 560, rightMargin_x - 12, 492);
	triangle(rightMargin_x, 520, rightMargin_x, 596, rightMargin_x - 20, 560);
}

function isCharacterOverCanyon(gameChar_x, floorPos_y, canyon) {
	// returns true if the character is over the canyon
	let margin = 5; // not to fall to soon
	return (
		gameChar_x > canyon.pos_x + margin &&
		gameChar_x < canyon.pos_x + canyon.width - margin &&
		gameChar_y >= floorPos_y
	);
}

function drawCloud(cloud) {
	noStroke();
	fill(255, 255, 255);
	ellipse(cloud.pos_x, cloud.pos_y, cloud.size, cloud.size);
	ellipse(cloud.pos_x + cloud.size * 0.5, cloud.pos_y - cloud.size * 0.2, cloud.size * 1.1, cloud.size * 1.1);
	ellipse(cloud.pos_x + cloud.size, cloud.pos_y, cloud.size, cloud.size);
}

function drawMountain(mountain) {
	noStroke();
	fill(150);
	// mountain
	triangle(
		mountain.pos_x, mountain.pos_y,
		mountain.pos_x + mountain.width / 2, mountain.pos_y - mountain.height,
		mountain.pos_x + mountain.width, mountain.pos_y
	);
	// white peak 
	fill(255);
	triangle(
		mountain.pos_x + mountain.width / 2, mountain.pos_y - mountain.height, 
		mountain.pos_x + mountain.width / 2 - 22, mountain.pos_y - mountain.height + 35,
		mountain.pos_x + mountain.width / 2 + 22, mountain.pos_y - mountain.height + 30
	);
}

function drawTree(tree) {
	noStroke();
	//trunk
	fill(139, 69, 19);
	rect(tree.pos_x, tree.pos_y, 20, 70);

	fill(34, 139, 34);
	 //lower foliage
	triangle(tree.pos_x - 28, tree.pos_y + 18, tree.pos_x + 10, tree.pos_y - 40, tree.pos_x + 48, tree.pos_y + 18);
	//upper foliage
	triangle(tree.pos_x - 18, tree.pos_y - 12, tree.pos_x + 10, tree.pos_y - 80, tree.pos_x + 38, tree.pos_y - 12); 
}


function drawBird(x, y, scale) {
	stroke(60);
	strokeWeight(2 * scale);
	noFill();
	// left wing
	arc(x, y, 24 * scale, 12 * scale, PI, 0); 
	// right wing
	arc(x + 18 * scale, y, 24 * scale, 12 * scale, PI, 0); 
}

function drawHUD() {
	// fix HUD to screen position
	push();
	translate(cameraPosX, 0);

	// count collected coins
	let collected = 0;
	for (let i = 0; i < collectables.length; i++) {
		if (collectables[i].isFound) {
			collected++; 
		}
	}
	// show coins count
	let coinPos_x = 20, coinPos_y = 30;
	drawCollectable({pos_x: coinPos_x, pos_y: coinPos_y + 7, size: 14, isFound: false});
	fill(0);
	noStroke();
	textSize(18);
	textAlign(LEFT, CENTER);
	text("x " + collected, coinPos_x + 14, coinPos_y);

	//show numbre of lives/ hearts
	let heartPos_x = 20;
	let heartPos_y = 54;
	for (let i = 0; i < livesCount; i++) {
		drawHeart({ pos_x: heartPos_x + i * 28, pos_y: heartPos_y, size: 14 });
	}

	pop();
}

function drawHeart(heart) {
	fill(220, 40, 60);
	noStroke();
	let y = heart.pos_y - heart.size * 0.65;
	ellipse(heart.pos_x - heart.size / 4, y, heart.size / 2, heart.size / 2);
	ellipse(heart.pos_x + heart.size / 4, y, heart.size / 2, heart.size / 2);
	triangle(
		heart.pos_x - heart.size / 2, y,
		heart.pos_x + heart.size / 2, y,
		heart.pos_x, y + heart.size * 0.75
	);
}






