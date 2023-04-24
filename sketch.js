let frametime = 100;

// Edit this to change difficulty for hurdling
let startTime = 6000;
let endTime = 2000;
let totalStreak = 10;

let hMin = 1;
let hMax = 5;
let hOperator = "+";
let hVariableCount = 2;

// Edit this to change difficulty for spear throw
let countdowntimer = 60;

let sMin = 1;
let sMax = 5;
let sVariableCount = 2;

// Let variables from here on out be
let data;
let sheet;

let sheets = [];
let animations = [];

let runner;
let spearman;

let obs = [];
let spear;

let wd = window.innerWidth;
let hig = window.innerHeight;
let guess = "";
let correct = false;
let score = 0;
let sguess = "";
let scorrect = false;
let sscore = 0;

let hurdleBtn;
let spearBtn;

let streak = 0;

let gamemode = 0;

let spearStart = false;
let cdStamp = 0;
let seconds = 0;
let milliseconds = 0;
let timerS = 0;
let ans;

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

	runner = new Runner();
	runner.setScale(8);
	runner.setPos(width / 4 - runner.w / 2, (height / 3) * 2 - runner.h - 5);

	spearman = new Spearman();
	spearman.setScale(8);
	spearman.setPos(
		(width / 4) * 1 - spearman.w / 2,
		(height / 6) * 5 - spearman.h - 5
	);

	spear = new Spear(
		spearman.x + 10 * spearman.scale,
		spearman.y + 16 * spearman.scale
	);

	//obs = new Obstacle(frametime, 4000);

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
		runner.operate();

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
				runner.y = runner.startY;
				runner.frame = 0;
				runner.hangFrame = 0;
				runner.stamp = millis();
				if (correct) {
					runner.jump = true;
					correct = false;
					hurdleQuestion(hMin, hMax, hOperator, hVariableCount);
					if (streak < totalStreak) {
						streak++;
					}
					obs.push(
						new Obstacle(
							frametime,
							startTime - (startTime - endTime) * (streak / totalStreak),
							400 + (runner.totalHangFrames / 2) * 100
						)
					);
				} else {
					runner.die = true;
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
		spearAsk();
		spearScore();
		if (ans < 1) {
			spearQuestion(sMin, sMax, 1, sVariableCount);
		}
		milliseconds = millis() - cdStamp;
		seconds = Math.floor(milliseconds / 1000);
		if (spearStart) {
			timerS = countdowntimer - seconds;
			if (timerS < 1) {
				timerS = 0;
				spear.fly(100, frametime);
				spearman.move(frametime);
			}
		}

		push();
		textAlign(CENTER, CENTER);
		textSize(75);
		textStyle(BOLD);
		text(timerS, width / 2, 0, width / 2, height / 4);
		pop();

		spearman.display();
		spear.display();

		push();
		strokeWeight(10);
		line(0, (height / 6) * 5, width / 2 - 3, (height / 6) * 5);
		strokeWeight(4);
		line(width / 2, 0, width / 2, height);
		line(0, height / 4, width, height / 4);
		pop();

		if (timerS > 0 && correct === true) {
			guess = "";
			spearAsk();
			spearQuestion(sMin, sMax, 1, sVariableCount);
			correct = false;
		}

		if (timerS < 1) {
			dista = round(score ** 2.35, 2);
			console.log(dista);
			push();
			textStyle(BOLD);
			textSize(60);
			textAlign(LEFT, TOP);
			text("Længde: " + dista + "m", 0 + 10, hig / 4 + 10);
			pop();
		}
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
					400 + (runner.totalHangFrames / 2) * 100
				)
			);
			hurdleQuestion(hMin, hMax, hOperator, hVariableCount);
			runner.die = false;
			runner.addY = 0;
			streak = 0;
			score = 0;
		}
	} else if (gamemode == 2 && timerS == 0) {
		spearStart = true;
		cdStamp = millis();
		spearman.x = spearman.startX;
		spear.addY = 0;
		spear.rotation = spear.startRotation;
		spear.hangFrame = 0;
		guess = "";
		spearQuestion(sMin, sMax, 1, sVariableCount);
		score = 0;
		// Prevents negative numbers as results
	}
}
function keyPressed() {
	if (gamemode == 1) {
		if (!correct) {
			hurdleGuess();
		}
		//spearGuess();
	} else if (gamemode == 2) {
		if (!correct) {
			spearGuess();
		}
	}
}
function hurdleQuestion(max, min, operator, variables) {
	// Comp = component
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
		// Do not use for more than 3 variables as it is unequipped to deal with the order
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

	if (runner.die === false) {
		for (let i = 0; i < 11; i++) {
			if (key == i) {
				guess += key;
			}
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
			correct = true;
		} else {
			console.log("Wrong answer");
			console.log("ans", ans);
			console.log("guess", guess);
			guess = "";
		}
	}
	return guess, correct;
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
	pop();
}
function spearQuestion(max, min, difficulty, variables) {
	comp = [];
	operators = [];
	for (let i = 1; i < variables + 1; i++) {
		comp.push(round(random(max, min)));
	}
	console.log(comp);

	for (let i = 0; i < variables - 1; i++) {
		temp = round(random(1, 2));
		if (temp == 1) {
			operators.push("+");
		}
		if (temp == 2) {
			operators.push("-");
		}
	}
	console.log(operators);
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
	if (timerS > 0) {
		hurdleGuess();
	}
}
function spearScore() {
	// A copy of hurdle score made to work with spear throwing
	if (correct === true) {
		score += 01;
		console.log("Correct answers: ", score);
	}
	push();
	textAlign(CENTER, CENTER);
	textSize(75);
	textStyle(BOLD);
	text("Rigtige svar: " + score, wd / 4, hig / 8);
	pop();
}
// A copy of hurdleask() with different coordinates
function spearAsk() {
	push();
	textAlign(CENTER, CENTER);
	textSize(75);
	textStyle(BOLD);
	/*if (correct) {
		fill(0, 150, 0);
	} else {
		fill(0);
	}*/
	fill(0);
	text(txt + guess, (wd / 4) * 3, (hig / 8) * 5);
	pop();
}
