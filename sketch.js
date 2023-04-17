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

	hurdleQuestion(1, 5, 3, 4, 5, 2);
}

function draw() {
	background(220);

	push();
	strokeWeight(10);
	line(0, (height / 3) * 2, width, (height / 3) * 2);
	sprite.animate(width / 4 - sprite.w / 2, (height / 3) * 2 - sprite.h - 5);
	pop();
}

function hurdleQuestion(
	max,
	min,
	addition,
	multipication,
	negatives,
	variables
) {
	comp = [];

	for (let i = 1; i < variables + 1; i++) {
		comp.push(round(random(max, min)));
	}

	// Finds the answer to the question
	ans = comp[0];
	for (let i = 1; i < comp.length; i++) {
		ans += comp[i];
	}
	// Debugging
	/*
print("how many number:",comp.length)
print("numbers are:",comp)
print("ans is:",ans)
*/
	// defines the question as a variable so that it can be displayed.
	//TBA
}
