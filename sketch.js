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

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	livesCount = 3; // Start with 3 lives

	// list of collectables 
	collectables = [
		{ x_pos: 100, y_pos: floorPos_y, size: 20, isFound: false },
		{ x_pos: 300, y_pos: floorPos_y - 100, size: 20, isFound: false }
	];

	// list of canyons
	canyons = [
		{ x_pos: 0, width: 50 },
		{ x_pos: 120, width: 70 },
		{ x_pos: 350, width: 90 }
	];

	// list of mountains 
	mountains = [
		{ x: 750, baseY: floorPos_y, width: 270, height: 140 },
		{ x: 850, baseY: floorPos_y, width: 310, height: 220 } 
	];

	// list of clouds
	clouds = [
		{ x: 200, y: 100, size: 30 },
		{ x: 350, y: 80, size: 40 },
		{ x: 600, y: 120, size: 20 },
		{ x: 800, y: 90, size: 40 },
		{ x: 950, y: 60, size: 25 }
	];

	// list of trees 
	trees_x = [790, 200, 600];

	// list of birds
	birds = [
		{ x: 1024, y: 120, scale: 0.6, speed: 2.0 },
		{ x: 900, y: 160, scale: 0.5, speed: 1.6 },
		{ x: 1100, y: 200, scale: 0.4, speed: 1.2 },
		{ x: 1034, y: 130, scale: 0.3, speed: 0.8 },
		{ x: 1044, y: 170, scale: 0.2, speed: 0.5 },
		{ x: 1048, y: 210, scale: 0.1, speed: 0.3 }
	];
}

function draw()
{

	///////////DRAWING CODE//////////

	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

	// Game Over screen
	if(livesCount === 0) {
		fill(0, 0, 0, 180);
		rect(0, 0, width, height);
		textAlign(CENTER, CENTER);
		fill(255, 0, 0);
		textSize(48);
		text("GAME OVER", width / 2, height / 2 - 40);
		fill(255);
		textSize(24);
		text("Press ENTER to restart", width / 2, height / 2 + 10);
		return;
	}

	// draw clouds
	for(let i = 0; i < clouds.length; i++) {
		clouds[i].x -= 0.2 / 5; // clods movement speed
		// Reset cloud to right if it goes off screen
		if(clouds[i].x < -clouds[i].size) {
			clouds[i].x = width + clouds[i].size;
		}
		drawCloud(clouds[i]);
	}

	// draw birds
	for(let i = 0; i < birds.length; i++) {
		birds[i].x += birds[i].speed / 20; // move left to right
		drawBird(birds[i].x, birds[i].y, birds[i].scale); 
		// Reset bird to left if it goes off screen
		if(birds[i].x > width + 40) {
			birds[i].x = -40;
		}
	}

	// draw mountains
	for(let i = 0; i < mountains.length; i++) {
		drawMountain(mountains[i]);
	}

	// draw trees 
	for(let i = 0; i < trees_x.length; i++) {
		drawTree({ x: trees_x[i], y: floorPos_y - 70 });
	}

	// draw canyons
	for(let i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
	}

	// draw and check all collectables
	for(let i = 0; i < collectables.length; i++) {
		let collectable = collectables[i];
		if (!collectable.isFound && dist(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) < collectable.size) {
			collectable.isFound = true;
		}
		if (!collectable.isFound) {
			drawCollectable(collectable);
		}
	}

	// --- CANYON FALL LOGIC ---
	// detect if character is over any canyon and on the ground
	isPlummeting = false;
	for(let i = 0; i < canyons.length; i++) {
		if(isCharacterOverCanyon(gameChar_x, floorPos_y, canyons[i])) {
			isPlummeting = true;
			break;
		}
	}

	// if plummeting, fall faster
	if(isPlummeting) {
		gameChar_y += 8;
		// if fallen below the canvas, lose a life and reset position
		if(gameChar_y > height) {
			livesCount--;
			if(livesCount > 0) {
				// reset character to starting position
				gameChar_x = width/2;
				gameChar_y = floorPos_y;
				isPlummeting = false;
				isFalling = false;
				isLeft = false;
				isRight = false;
			} else {
				livesCount = 0;
			}
		}
	}

	//draw game character
	if(isLeft && isFalling && !isPlummeting)
	{
		drawJumpingLeftStickman(gameChar_x, gameChar_y);
	}
	else if(isRight && isFalling && !isPlummeting)
	{
		drawJumpingRightStickman(gameChar_x, gameChar_y);
	}
	else if(isLeft && !isPlummeting)
	{
		drawFacingLeftStickman(gameChar_x, gameChar_y);
	}
	else if(isRight && !isPlummeting)
	{
		drawFacingRightStickman(gameChar_x, gameChar_y);
	}
	else if((isFalling || isPlummeting) && !isPlummeting)
	{
		drawJumpingStickman(gameChar_x, gameChar_y);
	}
	else if(isPlummeting)
	{
		drawJumpingStickman(gameChar_x, gameChar_y);
	}
	else
	{
		drawStandingStickman(gameChar_x, gameChar_y);
	}

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here

	if(isLeft == true && !isPlummeting) {
		gameChar_x -= 5; // move left
	}
	if(isRight == true && !isPlummeting) {
		gameChar_x += 5; // move right
	}
 
	// Gravity logic
	if(gameChar_y < floorPos_y && !isPlummeting)
	{
		gameChar_y += 5; // fall speed
		isFalling = true;
	}
	else if(gameChar_y > floorPos_y && !isPlummeting)
	{
		gameChar_y = floorPos_y; 
		isFalling = false;
	}
	else if(!isPlummeting)
	{
		isFalling = false;
	}

	// HUD: Collectables (coin) and Lives (heart)
	drawHUD();
}


function keyPressed()
{
	// Restart game if game over and ENTER is pressed
	if(livesCount === 0 && (keyCode === 13 || key === 'Enter')) {
		livesCount = 3;
		gameChar_x = width/2;
		gameChar_y = floorPos_y;
		isLeft = false;
		isRight = false;
		isFalling = false;
		isPlummeting = false;
		// Reset collectables
		for(let i = 0; i < collectables.length; i++) {
			collectables[i].isFound = false;
		}
		return;
	}

	// if statements to control the animation of the character when
	// keys are pressed.

	//open up the console to see how these work
	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);

	if(isPlummeting) return; // freeze controls if plummeting
	if(keyCode == 37) //left arrow
	{
		isLeft = true;
		console.log("Left arrow pressed");
	}
	else if(keyCode == 39) //right arrow
	{
		isRight = true;
		console.log("Right arrow pressed");
	}
	else if(keyCode == 32 && !isFalling) // space bar for jump, only if on ground
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

	if(keyCode == 37) //left arrow
	{
		isLeft = false;
		console.log("Left arrow released");
	}
	else if(keyCode == 39) //right arrow
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
	ellipse(x - 8, y + 1, 5, 3); // left foot
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
	ellipse(x - 8, y + 1, 5, 3); // left foot
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
	line(x, y - 20, x - 8, y + 1); //left leg
	line(x, y - 20, x + 8, y + 1); //right leg
	// Feet
	fill(0);
	ellipse(x - 11, y + 1, 6, 3); // left foot
	ellipse(x + 5, y + 1, 6, 3); // right foot
	fill(0);
	noStroke();
	rect(x - 1.8, y - 50, 3.6, 30); //body 
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

function drawFacingRightStickman(x, y){
	stroke(0);
	strokeWeight(2);
	line(x, y - 20, x - 8, y + 1); //left leg
	line(x, y - 20, x + 8, y + 1); //right leg
	// Feet 
	fill(0);
	ellipse(x - 5, y + 1, 6, 3); // left foot 
	ellipse(x + 11, y + 1, 6, 3); // right foot 
	fill(0);
	noStroke();
	rect(x - 1.8, y - 50, 3.6, 30); //body 
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

function drawJumpingRightStickman(x, y){
	stroke(0);
	strokeWeight(2);
	// Legs
	line(x, y - 22, x - 6, y - 2); // left leg 
	line(x, y - 22, x + 10, y - 2); // right leg 
	// Feet 
	fill(0);
	ellipse(x - 4, y - 2, 6, 3); // left foot 
	ellipse(x + 11, y - 2, 6, 3); // right foot 
	fill(0);
	noStroke();
	rect(x - 1.8, y - 50, 3.6, 30); //body 
	stroke(0);
	strokeWeight(2);
	// Arms angled to the right 
	line(x - 3, y - 45, x + 2, y - 60); //left arm 
	line(x + 3, y - 45, x + 18, y - 55); //right arm 
	// Hands
	fill(0);
	ellipse(x + 2, y - 60, 4, 4); // left hand
	ellipse(x + 18, y - 55, 4, 4); // right hand
	fill(0);
	ellipse(x, y - 57, 10, 10); //head
	strokeWeight(1);
}

function drawJumpingLeftStickman(x, y){
	stroke(0);
	strokeWeight(2);
	// Legs
	line(x, y - 22, x - 10, y - 2); // left leg
	line(x, y - 22, x + 6, y - 2); // right leg 
	// Feet
	fill(0);
	ellipse(x - 11, y - 2, 6, 3); // left foot 
	ellipse(x + 4, y - 2, 6, 3); // right foot
	fill(0);
	noStroke();
	rect(x - 1.8, y - 50, 3.6, 30); //body 
	stroke(0);
	strokeWeight(2);
	// Arms
	line(x - 3, y - 45, x - 18, y - 55); //left arm 
	line(x + 3, y - 45, x - 2, y - 60); //right arm
	// Hands
	fill(0);
	ellipse(x - 18, y - 55, 4, 4); // left hand
	ellipse(x - 2, y - 60, 4, 4); // right hand
	fill(0);
	ellipse(x, y - 57, 10, 10); //head
	strokeWeight(1);
}

function drawCollectable(collectable) {
	stroke(180, 140, 30); // edge
	strokeWeight(3);
	fill(255, 215, 0);
	// coin anchored to land (bottom of coin sits on ground)
	let y = collectable.y_pos - collectable.size / 2;
	ellipse(collectable.x_pos,
		y,
		collectable.size,
		collectable.size);
	// shine in the center
	noStroke();
	fill(255, 255, 255, 180);
	ellipse(collectable.x_pos,
		y,
		collectable.size * 0.25,
		collectable.size * 0.25);
}

function drawCanyon(canyon) {
	//  canyon
	let canyonY = 432;
	let canyonH = 144;
	let canyonW = canyon.width;
	let canyonX = canyon.x_pos;

	// Top 4/5: sky blue
	fill(100,155,255);
	rect(canyonX, canyonY, canyonW, canyonH * 4/5);

	// Bottom 1/5: dark blue
	fill(60,110,180);
	rect(canyonX, canyonY + canyonH * 4/5, canyonW, canyonH * 1/5);

	// Left margin edge
	fill(80, 80, 80);
	let leftX = canyon.x_pos;
	triangle(leftX, 432, leftX, 462, leftX + 5, 440);
	triangle(leftX, 440, leftX, 510, leftX + 8, 495);
	triangle(leftX, 510, leftX, 576, leftX + 22, 555);

	// Right margin edge
	let rightX = canyon.x_pos + canyon.width;
	triangle(rightX, 432, rightX, 482, rightX - 5, 445);
	triangle(rightX, 470, rightX, 560, rightX - 12, 492);
	triangle(rightX, 520, rightX, 596, rightX - 20, 560);
}

function isCharacterOverCanyon(gameChar_x, floorPos_y, canyon) {
	// Returns true if the character is over the canyon
	let margin = 5; // not to fall to soon
	return (
		gameChar_x > canyon.x_pos + margin &&
		gameChar_x < canyon.x_pos + canyon.width - margin &&
		gameChar_y >= floorPos_y
	);
}

function drawCloud(cloud) {
	noStroke();
	fill(255, 255, 255);
	ellipse(cloud.x, cloud.y, cloud.size, cloud.size);
	ellipse(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 1.1, cloud.size * 1.1);
	ellipse(cloud.x + cloud.size, cloud.y, cloud.size, cloud.size);
}

function drawMountain(mountain) {
	noStroke();
	fill(150);
	// mountain
	triangle(
		mountain.x, mountain.baseY,
		mountain.x + mountain.width / 2, mountain.baseY - mountain.height,
		mountain.x + mountain.width, mountain.baseY
	);

	// White peak 
	fill(255);
	triangle(
		mountain.x + mountain.width / 2, mountain.baseY - mountain.height, 
		mountain.x + mountain.width / 2 - 22, mountain.baseY - mountain.height + 35,
		mountain.x + mountain.width / 2 + 22, mountain.baseY - mountain.height + 30
	);

}

function drawTree(tree) {
	noStroke();
	//trunk
	fill(139, 69, 19);
	rect(tree.x, tree.y, 20, 70);
	//folliage 
	fill(34, 139, 34);
	triangle(tree.x - 28, tree.y + 18, tree.x + 10, tree.y - 40, tree.x + 48, tree.y + 18); //lower foliage
	triangle(tree.x - 18, tree.y - 12, tree.x + 10, tree.y - 80, tree.x + 38, tree.y - 12); //upper foliage
}


function drawBird(x, y, scale) {
	stroke(60);
	strokeWeight(2 * scale);
	noFill();
	arc(x, y, 24 * scale, 12 * scale, PI, 0); // left wing
	arc(x + 18 * scale, y, 24 * scale, 12 * scale, PI, 0); // right wing
}

function drawHUD() {
	// count collected coins
	let collected = 0;
	for(let i = 0; i < collectables.length; i++) {
		if(collectables[i].isFound) collected++;
	}
	// coin symbol
	let coin_x = 20, coin_y = 30;
	stroke(180, 140, 30);
	strokeWeight(2);
	fill(255, 215, 0);
	ellipse(coin_x, coin_y, 14, 14); 
	noStroke();
	fill(255, 255, 255, 180);
	ellipse(coin_x, coin_y, 4, 4); 
	//coin count
	fill(0);
	noStroke();
	textSize(18);
	textAlign(LEFT, CENTER);
	text("x " + collected, coin_x + 14, coin_y);

	//hearts for lives
	let heart_x = 20;
	let heart_y = 54;
	for(let i = 0; i < livesCount; i++) {
		drawHeart(heart_x + i * 28, heart_y, 14);
	}

}

function drawHeart(x, y, size) {
	fill(220, 40, 60);
	noStroke();
	let d = size / 2;
	ellipse(x - d / 2, y, d, d);
	ellipse(x + d / 2, y, d, d);
	triangle(x - d, y, x + d, y, x, y + d * 1.5);
}






