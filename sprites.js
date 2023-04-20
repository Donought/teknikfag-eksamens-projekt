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

	display(frames, rotation) {
		push();
		let temp = frames[this.frame];
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

	hang(altitude, interval, reps) {
		if (this.stamp < millis() && this.jump) {
			this.stamp = millis() + interval;
			this.hangFrame++;
		}
		if (reps < this.hangFrame) {
			this.jump = false;
			this.hangFrame = 0;
		}

		push();
		angleMode(RADIANS);
		this.addY =
			altitude + altitude * cos(PI + ((2 * PI) / reps) * this.hangFrame);
		pop();

		this.display(animations[1], 0);
	}

	fall(altitude, interval, reps) {
		if (this.stamp < millis() && this.die && this.hangFrame < reps) {
			this.stamp = millis() + interval;
			this.hangFrame++;
		}
		if (reps < this.hangFrame) {
			/*this.die = false;
			this.hangFrame = 0;*/
		}

		push();
		angleMode(RADIANS);
		this.addY =
			altitude +
			altitude * cos(PI + ((2 * PI) / reps) * this.hangFrame) -
			(100 / reps) * this.hangFrame;
		pop();

		this.display(animations[1], (90 / reps) * this.hangFrame);
	}

	operate() {
		if (this.jump) {
			if (3 < sprite.frame) {
				sprite.hang(50, frametime, 10);
			} else {
				sprite.animate(animations[1], frametime);
			}
		} else if (this.die) {
			if (3 < sprite.frame) {
				sprite.fall(50, frametime, 10);
			} else {
				sprite.animate(animations[1], frametime);
			}
		} else {
			sprite.animate(animations[0], frametime);
		}
	}
}

class Obstacle {
	constructor(interval, time) {
		this.w = 50;
		this.h = 100;
		this.x = (width / 3) * 5 - this.w;
		this.y = (height / 3) * 2 - this.h;

		this.interval = interval;
		this.time = time;

		this.spd = (interval / time) * (this.x - width / 3);

		this.stamp = millis();

		this.jumped = false;
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
	}
}
