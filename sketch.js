/*

The Game Project

Week 3

Game interaction

*/


var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables; // Array of collectable objects
var canyons; // Array of canyon objects
var mountains; // Array of mountain objects
var clouds;    // Array of cloud objects
var trees;     // Array of tree objects

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

	// list of mountains (2)
	mountains = [
		{ x: 750, baseY: floorPos_y, width: 270, height: 140 },
		{ x: 850, baseY: floorPos_y, width: 310, height: 220 } // smaller and more to the right
	];

	// list of clouds (5)
	clouds = [
		{ x: 200, y: 100, size: 30 },
		{ x: 350, y: 80, size: 40 },
		{ x: 600, y: 120, size: 20 },
		{ x: 800, y: 90, size: 40 },
		{ x: 950, y: 60, size: 25 }
	];

	// list of trees (3)
	trees = [
		{ x: 790, y: floorPos_y - 70 },
		{ x: 200, y: floorPos_y - 90 },
		{ x: 600, y: floorPos_y - 60 }
	];
}

function draw()
{

	///////////DRAWING CODE//////////

	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

	// Draw all clouds
	for(let i = 0; i < clouds.length; i++) {
		let c = clouds[i];
		drawCloud(c);
	}

	// Draw all mountains
	for(let i = 0; i < mountains.length; i++) {
		let m = mountains[i];
		drawMountain(m);
	}

	// Draw all trees
	for(let i = 0; i < trees.length; i++) {
		let t = trees[i];
		drawTree(t);
	}

	// Draw all canyons
	for(let i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
	}

	// Draw and check all collectables
	for(let i = 0; i < collectables.length; i++) {
		let c = collectables[i];
		if (!c.isFound && dist(gameChar_x, gameChar_y, c.x_pos, c.y_pos) < c.size) {
			c.isFound = true;
		}
		if (!c.isFound) {
			drawCollectable(c);
		}
	}

	// --- CANYON FALL LOGIC ---
	// Detect if character is over any canyon and on the ground
	isPlummeting = false;
	for(let i = 0; i < canyons.length; i++) {
		if(isCharacterOverCanyon(gameChar_x, floorPos_y, canyons[i])) {
			isPlummeting = true;
			break;
		}
	}

	// If plummeting, fall faster
	if(isPlummeting) {
		gameChar_y += 8;
	}

	//the game character
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
}


function keyPressed()
{
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
	// shine 
	noStroke();
	fill(255, 255, 255, 180);
	ellipse(collectable.x_pos + collectable.size * 0.1,
		y - collectable.size * 0.1,
		collectable.size * 0.1,
		collectable.size * 0.25);
}

function drawCanyon(canyon) {
	//  canyon
	let canyonY = 432;
	let canyonH = 144;
	let canyonW = canyon.width;
	let canyonX = canyon.x_pos;

	// Top sky blue
	fill(100,155,255);
	rect(canyonX, canyonY, canyonW, canyonH/3);
	// Bottom darker blue
	fill(60,110,180);
	rect(canyonX, canyonY + canyonH/3, canyonW, canyonH * 2/3);
	
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
	triangle(
		mountain.x, mountain.baseY,
		mountain.x + mountain.width / 2, mountain.baseY - mountain.height,
		mountain.x + mountain.width, mountain.baseY
	);
	fill(150);

	// White peak for main mountain
	fill(255);
	triangle(
		mountain.x + mountain.width / 2, mountain.baseY - mountain.height, // peak
		mountain.x + mountain.width / 2 - 15, mountain.baseY - mountain.height + 30,
		mountain.x + mountain.width / 2 + 15, mountain.baseY - mountain.height + 30
	);

}

function drawTree(tree) {
	noStroke();
	fill(139, 69, 19);
	rect(tree.x, tree.y, 20, 70); //trunk
	fill(34, 139, 34);
	triangle(tree.x - 20, tree.y + 8, tree.x + 10, tree.y - 50, tree.x + 40, tree.y + 8); //lower foliage
	triangle(tree.x - 10, tree.y - 22, tree.x + 10, tree.y - 70, tree.x + 30, tree.y - 22); //upper foliage
}





