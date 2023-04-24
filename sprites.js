class Runner {
	constructor() {
		this.x = 0;
		this.startY = 0;
		this.y = 0;
		this.addY = 0;
		this.w = 32;
		this.h = 32;
		this.scale = 1; // Can be changed

		this.stamp = millis();
		this.frame = 0;
		this.hangFrame = 0;
		this.totalHangFrames = 10; // Can be changed
		this.jump = false;
		this.die = false;
	}

	setScale(scale) {
		this.w *= scale;
		this.h *= scale;
		this.scale = scale;
	}

	setPos(x, y) {
		this.x = x;
		this.startY = y;
		this.y = this.startY;
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

	display(frames, rotation) {
		let temp = frames[this.frame];
		push();
		translate(
			this.x + (temp.width * this.scale) / 2,
			this.y - this.addY + (temp.height * this.scale) / 2
		);
		angleMode(DEGREES);
		rotate(rotation);
		imageMode(CENTER);
		image(temp, 0, 0, temp.width * this.scale, temp.height * this.scale);
		pop();
	}

	hang(altitude, interval) {
		if (this.stamp < millis() && this.jump) {
			this.stamp = millis() + interval;
			this.hangFrame++;
		}
		if (this.totalHangFrames < this.hangFrame) {
			this.jump = false;
			this.hangFrame = 0;
		}

		push();
		angleMode(RADIANS);
		this.addY =
			altitude +
			altitude * cos(PI + ((2 * PI) / this.totalHangFrames) * this.hangFrame);
		pop();

		this.display(animations[1], 0);
	}

	fall(altitude, interval) {
		if (
			this.stamp < millis() &&
			this.die &&
			this.hangFrame < this.totalHangFrames
		) {
			this.stamp = millis() + interval;
			this.hangFrame++;
		}
		if (this.totalHangFrames < this.hangFrame) {
			/*this.die = false;
			this.hangFrame = 0;*/
		}

		push();
		angleMode(RADIANS);
		this.addY =
			altitude +
			altitude * cos(PI + ((2 * PI) / this.totalHangFrames) * this.hangFrame) -
			(100 / this.totalHangFrames) * this.hangFrame;
		pop();

		this.display(animations[1], (90 / this.totalHangFrames) * this.hangFrame);
	}

	operate() {
		if (this.jump) {
			if (3 < runner.frame) {
				runner.hang(50, frametime);
			} else {
				runner.animate(animations[1], frametime);
			}
		} else if (this.die) {
			if (3 < runner.frame) {
				runner.fall(50, frametime);
			} else {
				runner.animate(animations[1], frametime);
			}
		} else {
			runner.animate(animations[0], frametime);
		}
	}
}

class Obstacle {
	constructor(interval, time, addTime) {
		this.w = 50;
		this.h = 100;
		this.x = (width / 3) * 5 - this.w;
		this.startX = this.x;
		this.y = (height / 3) * 2 - this.h;

		this.interval = interval;
		this.addTime = addTime;
		this.time = time + addTime;

		this.spd = (interval / this.time) * (this.x - width / 4);
		//this.spd = this.x - width / 4;

		this.stamp = millis();
		this.startStamp = millis();

		this.jumped = false;

		this.timer = time;
	}

	move() {
		if (this.stamp + this.interval < millis()) {
			this.stamp = millis();
			this.x -= this.spd;
		}
	}

	display() {
		push();
		rectMode(CORNER);
		fill(0);
		noStroke();
		rect(this.x, this.y, this.w, this.h);
		pop();
	}

	operate() {
		this.move();
		this.display();
		this.timer =
			this.time * ((this.x - width / 4) / (this.startX - width / 4)) -
			this.addTime;
	}
}

class Spearman {
	constructor() {
		this.startX = 0;
		this.x = 0;
		this.y = 0;
		this.w = 32;
		this.h = 32;
		this.scale = 1;

		this.stamp = 0;
		this.spd = 50;
	}

	setScale(scale) {
		this.w *= scale;
		this.h *= scale;
		this.scale = scale;
	}

	setPos(x, y) {
		this.startX = x;
		this.x = this.startX;
		this.y = y;
	}

	display() {
		let temp = animations[2][0];
		push();
		imageMode(CORNER);
		image(temp, this.x, this.y, this.w, this.h);
		pop();
	}

	move(interval) {
		if (this.stamp < millis()) {
			this.stamp = millis() + interval;
			this.x -= this.spd;
		}
	}
}

class Spear {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.addY = 0;
		this.w = 300;
		this.h = 10;
		this.startRotation = -20;
		this.rotation = this.startRotation;

		this.stamp = 0;
		this.hangFrame = 0;
		this.totalHangFrames = 20; // Can be changed
	}

	display() {
		push();
		translate(this.x, this.y - this.addY);
		angleMode(DEGREES);
		rotate(this.rotation);
		rectMode(CENTER);
		noStroke();
		fill(200, 0, 0);
		rect(0, 0, this.w, this.h);
		pop();
	}

	fly(altitude, interval) {
		if (this.stamp < millis() && this.hangFrame < this.totalHangFrames) {
			this.stamp = millis() + interval;
			this.hangFrame++;
		}
		if (this.totalHangFrames < this.hangFrame) {
			/*this.die = false;
			this.hangFrame = 0;*/
		}

		push();
		angleMode(RADIANS);
		this.addY =
			altitude +
			altitude * cos(PI + ((2 * PI) / this.totalHangFrames) * this.hangFrame) -
			(90 / this.totalHangFrames) * this.hangFrame;
		pop();

		this.rotation =
			this.startRotation + (45 / this.totalHangFrames) * this.hangFrame;
		this.display();
	}
}
