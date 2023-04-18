class Runner {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.addY = 0;
		this.w = 32;
		this.h = 32;
		this.scale = 1;

		this.stamp = millis();
		this.frame = 0;
		this.hangFrame = 0;
	}

	setScale(scale) {
		this.w *= scale;
		this.h *= scale;
		this.scale = scale;
	}

	setPos(x, y) {
		this.x = x;
		this.y = y;
	}

	animate(frames, interval) {
		if (this.stamp + interval < millis()) {
			this.stamp = millis();
			this.frame++;
		}
		if (frames.length - 1 < this.frame) {
			this.frame = 0;
		}

		this.display(frames);
	}

	display(frames) {
		push();
		imageMode(CORNER);
		let temp = frames[this.frame];
		image(
			temp,
			this.x,
			this.y - this.addY,
			temp.width * this.scale,
			temp.height * this.scale
		);
		pop();
	}

	hang(altitude, interval, reps) {
		if (this.stamp < millis()) {
			this.stamp = millis() + interval;
			this.hangFrame++;
		}

		this.addY =
			altitude + altitude * cos(PI + ((2 * PI) / reps) * this.hangFrame);

		this.display(animations[1]);
	}
}

let data;
let sheet;

let sheets = [];

let animations = [];

let sprite;

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

	hurdleQuestion(1, 5, "+", 3);
}

let lever = false;
function draw() {
	background(220);

	push();
	strokeWeight(10);
	line(0, (height / 3) * 2, width, (height / 3) * 2);
	if (lever) {
		if (3 < sprite.frame) {
			let frames = 10;
			if (frames > sprite.hangFrame) {
				sprite.hang(50, 100, frames);
			} else {
				sprite.hangFrame = 0;
				lever = !lever;
			}
		} else {
			sprite.animate(animations[1], 100);
		}
	} else {
		sprite.animate(animations[0], 100);
	}
	pop();
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
	txt.splice(txt.length + 2, 1, "=");

	// Places content of txt into string
	for (let i = 0; i < txt.length; i++) {
		strr += txt[i];
	}
	// Updates txt for clarity
	txt = strr;
	print(txt + ans);
	return txt, ans;
}

// test
