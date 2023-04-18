class Runner {
	constructor(scale, interval) {
		this.w = frames[0] * scale;
		this.h = frames[0] * scale;
		this.scale = scale;
		this.interval = interval;
		this.stamp = millis();
		this.frame = 0;
	}

	animate(x, y) {
		if (this.stamp + this.interval < millis()) {
			this.stamp = millis();
			this.frame++;
		}
		if (4 < this.frame) {
			this.frame = 0;
		}

		this.w = frames[this.frame].width * this.scale;
		this.h = frames[this.frame].height * this.scale;

		push();
		imageMode(CORNER);
		let temp = frames[this.frame];
		image(temp, x, y, temp.width * this.scale, temp.height * this.scale);
		pop();
	}
}

let data;
let sheet;
let frames = [];

let sprite;

let wd = window.innerWidth;
let hig = window.innerHeight;
let guess = "";

function preload() {
	data = loadXML("spritesheet/data.xml");
	sheet = loadImage("spritesheet/sheet.png");
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);

	let children = data.getChildren("sprite");
	for (let i = 0; i < children.length; i++) {
		let x = children[i].getNum("x");
		let y = children[i].getNum("y");
		let w = children[i].getNum("w");
		let h = children[i].getNum("h");

		frames.push(sheet.get(x, y, w, h));
	}

	sprite = new Runner(8, 100);
	hurdleQuestion(1, 5, "+", 2);
}

function draw() {
	background(220);

	push();
	strokeWeight(10);
	line(0, (height / 3) * 2, width, (height / 3) * 2);
	sprite.animate(width / 4 - sprite.w / 2, (height / 3) * 2 - sprite.h - 5);
	pop();
	hurdleAsk();
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
		}
	}
	return guess;
}

function keyPressed() {
	hurdleGuess();
}

// test
