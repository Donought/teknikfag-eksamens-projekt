let frametime = 100;

let data;
let sheet;

let sheets = [];
let animations = [];

let sprite;

let wd = window.innerWidth;
let hig = window.innerHeight;
let guess = "";
let correct = false;
let score = 0;
let sguess = "";
let scorrect = false;
let sscore = 0;

let obs;

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

	obs = new Obstacle(frametime, 4000);

	spearQuestion(1, 5, 1, 3);

	//sprite.jump = !sprite.jump;
}
let lever = false;
function draw() {
	background(220);

	push();
	strokeWeight(10);
	line(0, (height / 3) * 2, width, (height / 3) * 2);
	pop();

	sprite.operate();

	obs.operate();

	if (5 * obs.spd + width / 3 >= obs.x && !obs.jumped) {
		sprite.jump = !sprite.jump;
		obs.jumped = !obs.jumped;
	}

	//hurdleAsk();
	//hurdleScore()

	spearGuess();
}
function mousePressed() {
	lever = !lever;
	sprite.frame = 0;
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
			correct = true;
		} else {
			console.log("Wrong answer");
			guess = "";
		}
	}
	return guess, correct;
}

function keyPressed() {
	//hurdleGuess()
	spearGuess();
}
function hurdleScore() {
	if (correct === true) {
		correct = false;
		score += 25;
		console.log("Score", score);
		return score;
	}
	text("Score:", wd / 12, 0 + hig / 15);
	textAlign(LEFT, CENTER);
	text(score, wd / 6.8, 0 + hig / 15);
}
function spearQuestion(max, min, difficulty, variables) {
	comp = [];
	operators = [];
	for (let i = 1; i < variables + 1; i++) {
		comp.push(round(random(max, min)));
	}
	for (let i = 0; i < variables - 1; i++) {
		temp = round(random(1, 2));
		if (temp == 1) {
			operators.push("+");
		}
		if (temp == 2) {
			operators.push("-");
		}
	}
	ans = comp[0];

	for (let i = 0; i < operators.length; i++) {
		if (operators[i] == "+") {
			ans += comp[i + 1];
		}
		if (operators[i] == "-") {
			ans -= comp[i + 1];
		}
		if (operators[i] == "*") {
			ans *= comp[i + 1];
		}
	}
	txt = [];
	for (let i = 0; i < variables; i++) {
		txt.push(comp[i]);
		txt.push(operators[i]);
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
	print(txt + ans);
	return txt, ans;
}
function spearGuess() {
	// This is a copy of the hurdle guess function edited to work for spearGuess()

	// Adds numbers pressed to a string
	for (let i = 0; i < 11; i++) {
		if (key == i) {
			sguess += key;
		}
	}
	// Removes last typed number if backspace is hit
	if (keyCode == 8) {
		if (sguess.length > 0) {
			sguess = sguess.substring(0, sguess.length - 1);
			//console.log("cut")
		}
	}
	// Submits the guess and checks it when enter or space is hit
	if (keyCode == 13 || keyCode == 32) {
		if (sguess == ans) {
			sQuestion(1, 5, 1, 3);
			sguess = "";
			scorrect = true;
		} else {
			console.log("Wrong answer");
			sguess = "";
		}
	}
	// Score handling
	if (scorrect === true) {
		scorrect = false;
		sscore += 1;
		console.log("Score", sscore);

		return sscore;
	}
	textAlign(CENTER, CENTER);
	textSize(75);
	textStyle(BOLD);
	text(txt + guess, wd / 2, 0 + hig / 15);
	return sguess, scorrect;
}
