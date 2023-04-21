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

let obs = [];

let startTime = 6000;
let endTime = 2000;
let totalStreak = 10;
let streak = 0;

let hurdleBtn;
let spearBtn;

let gamemode = 0;

let min = 1;
let max = 5;
let operator = "+";
let variableCount = 3;

function preload() {
	sheets.push([
		loadXML("spritesheet/run/data.xml"),
		loadImage("spritesheet/run/sheet.png"),
	]);
	sheets.push([
		loadXML("spritesheet/jump/data.xml"),
		loadImage("spritesheet/jump/sheet.png"),
	]);
	sheets.push([
		loadXML("spritesheet/throw/data.xml"),
		loadImage("spritesheet/throw/sheet.png"),
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

	hurdleBtn = createButton("Hækkeløb");
	hurdleBtn.style("font-size", "75px");
	hurdleBtn.position(
		width / 2 - hurdleBtn.size().width / 2,
		(height / 3) * 1 - hurdleBtn.size().height / 2
	);
	hurdleBtn.mouseReleased(() => {
		gamemode = 1;
	});

	spearBtn = createButton("Spydkast");
	spearBtn.style("font-size", "75px");
	spearBtn.position(
		width / 2 - spearBtn.size().width / 2,
		(height / 3) * 2 - spearBtn.size().height / 2
	);
	spearBtn.mouseReleased(() => {
		gamemode = 2;
	});

	sprite = new Runner();
	sprite.setScale(8);
	sprite.setPos(width / 4 - sprite.w / 2, (height / 3) * 2 - sprite.h - 5);

	//obs = new Obstacle(frametime, 4000);

	//spearQuestion(1, 5, 1, 3);

	//sprite.jump = !sprite.jump;

	txt = "Klik for start";

	//sprite.jump = !sprite.jump;
}

let stamp;
let lever = false;
let timerCount = 0;
function draw() {
	background(220);

	if (0 < gamemode) {
		hurdleBtn.hide();
		spearBtn.hide();
	}
	if (gamemode == 1) {
		sprite.operate();

		push();
		strokeWeight(10);
		line(0, (height / 3) * 2, width, (height / 3) * 2);
		pop();

		obs.forEach((val, index) => {
			val.operate();
			if (
				(val.addTime / frametime) * val.spd + width / 4 - val.w / 2 >= val.x &&
				!val.jumped
			) {
				sprite.y = sprite.startY;
				sprite.frame = 0;
				sprite.hangFrame = 0;
				sprite.stamp = millis();
				if (correct) {
					sprite.jump = true;
					correct = false;
					hurdleQuestion(min, max, operator, variableCount);
					if (streak < totalStreak) {
						streak++;
					}
					obs.push(
						new Obstacle(
							frametime,
							startTime - (startTime - endTime) * (streak / totalStreak),
							400 + (sprite.totalHangFrames / 2) * 100
						)
					);
				} else {
					sprite.die = true;
					txt = "Game over";
				}
				guess = "";
				val.jumped = true;
			}

			if (!val.jumped && timerCount < 1 && val.timer > 0) {
				timerCount++;
				push();
				textAlign(RIGHT, TOP);
				textSize(75);
				textStyle(BOLD);
				fill(0);
				text((val.timer * 10 ** -3).toFixed(1), width, 0);
				pop();
			}

			if (val.x + val.w < 0) {
				obs.splice(index, 1);
			}
		});

		if (timerCount < 1) {
			push();
			textAlign(RIGHT, TOP);
			textSize(75);
			textStyle(BOLD);
			fill(0);
			text("0.0", width, 0);
			pop();
		}

		timerCount = 0;

		hurdleAsk();

		hurdleScore();
	} else if (gamemode == 2) {
	}

	/*push();
	strokeWeight(10);
	line(0, (height / 3) * 2, width, (height / 3) * 2);
	textAlign(RIGHT, TOP);
	fill(0);
	text("Timer: " + timer, width, 0);
	timerCount = 0;
	pop();*/

	/*if (5 * obs.spd + width / 3 >= obs.x && !obs.jumped) {
		sprite.frame = 0;
		sprite.stamp = millis();
		sprite.jump = !sprite.jump;
		obs.jumped = !obs.jumped;
	}*/

	//hurdleScore()

	//spearGuess();
}
function mousePressed() {
	if (gamemode == 1) {
		if (obs.length < 1) {
			obs.push(
				new Obstacle(
					frametime,
					startTime,
					400 + (sprite.totalHangFrames / 2) * 100
				)
			);
			hurdleQuestion(min, max, operator, variableCount);
			sprite.die = false;
			sprite.addY = 0;
			streak = 0;
			score = 0;
		}
	}
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
	push();
	textAlign(CENTER, CENTER);
	textSize(75);
	textStyle(BOLD);
	if (correct) {
		fill(0, 150, 0);
	} else {
		fill(0);
	}
	text(txt + guess, wd / 2, 0 + hig / 15);
	pop();
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
			//hurdleQuestion(1, 5, "+", 2);
			//guess = "";
			correct = true;
		} else {
			console.log("Wrong answer");
			guess = "";
		}
	}
	return guess, correct;
}

function keyPressed() {
	if (!correct) {
		hurdleGuess();
	}
	//spearGuess();
}

function hurdleScore() {
	if (correct === true) {
		//correct = false;
		score += 0.5;
		console.log("Score", score);
		//return score;
	}
	push();
	textAlign(LEFT, TOP);
	textSize(75);
	textStyle(BOLD);
	text("Score:" + Math.floor(score), 0, 0);
	//text("Score:" + score, wd / 12, 0 + hig / 15);
	/*textAlign(LEFT, CENTER);
	text(score, wd / 6.8, 0 + hig / 15);*/
	pop();
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
