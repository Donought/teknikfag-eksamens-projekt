let frametime = 100;

let data;
let sheet;

let sheets = [];
let animations = [];

let sprite;

let wd = window.innerWidth;
let hig = window.innerHeight;
let guess = "";

let obs = [];

function preload() {
	sheets.push([
		loadXML("spritesheet/run/data.xml"),
		loadImage("spritesheet/run/sheet.png"),
	]);
	sheets.push([
		loadXML("spritesheet/jump/data.xml"),
		loadImage("spritesheet/jump/sheet.png"),
	]);
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);

	sheets.forEach((sheet, index) => {
		let children = sheet[0].getChildren("sprite");
		animations.push([]);
		for (let i = 0; i < children.length; i++) {
			let x = children[i].getNum("x");
			let y = children[i].getNum("y");
			let w = children[i].getNum("w");
			let h = children[i].getNum("h");
			animations[index].push(sheet[1].get(x, y, w, h));
		}
	});

	sprite = new Runner();
	sprite.setScale(8);
	sprite.setPos(width / 4 - sprite.w / 2, (height / 3) * 2 - sprite.h - 5);

	hurdleQuestion(1, 5, "+", 2);

	//sprite.jump = !sprite.jump;
}

let stamp;
let lever = false;
function draw() {
	background(220);

	push();
	strokeWeight(10);
	line(0, (height / 3) * 2, width, (height / 3) * 2);
	textAlign(RIGHT, TOP);
	fill(0);

	text("Timer: " + round((stamp - millis()) / 10 ** 3, 2), width, 0);
	pop();

	sprite.operate();

	obs.forEach((val) => {
		val.operate();
		if (5 * val.spd + width / 3 >= val.x && !val.jumped) {
			sprite.frame = 0;
			sprite.stamp = millis();
			sprite.jump = !sprite.jump;
			val.jumped = !val.jumped;
		}
	});

	/*if (5 * obs.spd + width / 3 >= obs.x && !obs.jumped) {
		sprite.frame = 0;
		sprite.stamp = millis();
		sprite.jump = !sprite.jump;
		obs.jumped = !obs.jumped;
	}*/

	hurdleAsk();
}

function mousePressed() {
	obs.push(new Obstacle(frametime, 4000));
	stamp = millis() + 4000;
}

function hurdleQuestion(max, min, operator, variables) {
	comp = [];
	for (let i = 1; i < variables + 1; i++) {
		comp.push(round(random(max, min)));
	}

	// Finds the answer to the question
	ans = comp[0];
	for (let i = 1; i < comp.length; i++) {
		if (operator == "+") {
			ans += comp[i];
		}
		if (operator == "-") {
			ans -= comp[i];
		}
		if (operator == "*") {
			ans *= comp[i];
		}
	}
	// Debugging
	/*
print("how many numbers:",comp.length)
print("numbers are:",comp)
print("ans is:",ans)
*/

	// Defines the question as a variable so that it can be displayed.
	// it does this by creating an array with the variables and the the operator
	// and then turning it into a string to be displayed

	txt = [];
	for (let i = 0; i < variables; i++) {
		txt.push(comp[i]);
		txt.push(operator);
	}
	// Variable to hold the string
	strr = "";
	// Removes unnecessary operator
	txt.splice(txt.length - 1, 1, "=");

	// Places content of txt into string
	for (let i = 0; i < txt.length; i++) {
		strr += txt[i];
	}
	// Updates txt for clarity
	txt = strr;
	//print(txt + ans);
	return txt, ans;
}

function hurdleAsk() {
	textAlign(CENTER, CENTER);
	textSize(75);
	textStyle(BOLD);
	text(txt + guess, wd / 2, 0 + hig / 15);
	// console.log(ans)
}
function hurdleGuess() {
	// Adds numbers pressed to a string
	for (let i = 0; i < 11; i++) {
		if (key == i) {
			guess += key;
		}
	}
	// Removes last typed number if backspace is hit
	if (keyCode == 8) {
		if (guess.length > 0) {
			guess = guess.substring(0, guess.length - 1);
			//console.log("cut")
		}
	}
	// Submits the guess and checks it when enter or space is hit
	if (keyCode == 13 || keyCode == 32) {
		if (guess == ans) {
			hurdleQuestion(1, 5, "+", 2);
			guess = "";
		} else {
			console.log("Wrong answer");
			guess = "";
		}
	}
	return guess;
}

function keyPressed() {
	hurdleGuess();
}
// test
