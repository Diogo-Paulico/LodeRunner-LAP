/*     Lode Runner

01234567890123456789012345678901234567890123456789012345678901234567890123456789
*/

// GLOBAL VARIABLES

// tente não definir mais nenhuma variável global

let empty, hero, control;


// ACTORS

class Actor {
    constructor(x, y, imageName) {
		this.x = x;
		this.y = y;
		this.imageName = imageName;
		this.show();
	}
	draw(x, y) {
		control.ctx.drawImage(GameImages[this.imageName],
				x * ACTOR_PIXELS_X, y* ACTOR_PIXELS_Y);
	}
    move(dx, dy) {
		this.hide();
		this.x += dx;
		this.y += dy;
		this.show();
	}
}

class PassiveActor extends Actor {
	show() {
		control.world[this.x][this.y] = this;
		this.draw(this.x, this.y);
	}
	hide() {
		control.world[this.x][this.y] = empty;
		empty.draw(this.x, this.y);
	}
}

class ActiveActor extends Actor {
    constructor(x, y, imageName) {
		super(x, y, imageName);
		this.time = 0;	// timestamp used in the control of the animations
	}
	show() {
		control.worldActive[this.x][this.y] = this;
		this.draw(this.x, this.y);
	}
	hide() {
		control.worldActive[this.x][this.y] = empty;
		control.world[this.x][this.y].draw(this.x, this.y);
	}
	animation() {
	}
	isFalling() { // grabs gold UwU
		if(control.world[this.x][this.y + 1] instanceof Rope || control.world[this.x][this.y + 1] instanceof Empty){
			if(!(control.world[this.x][this.y] instanceof Rope))
			return true;
			else return false;
		}
		else return false;
	}
	move(dx,dy){
		if(dx == -1){
			if(control.world[this.x - 1][this.y] instanceof Ladder || control.world[this.x - 1][this.y] instanceof Rope || control.world[this.x - 1][this.y] instanceof Empty || control.world[this.x - 1][this.y] instanceof Gold){
				if(( control.world[this.x - 1][this.y + 1] instanceof Empty) && this instanceof Robot){
					if(control.world[this.x - 1][this.y] instanceof Rope){
						this.x -= 1;
					}
				}
				else
				this.x -= 1;
				return;
			}
		}
		if(dx == 1){
			if(control.world[this.x + 1][this.y] instanceof Ladder || control.world[this.x + 1][this.y] instanceof Rope || control.world[this.x + 1][this.y] instanceof Empty || control.world[this.x + 1][this.y] instanceof Gold){
				if((control.world[this.x + 1][this.y + 1] instanceof Empty ) && this instanceof Robot){
					if(control.world[this.x + 1][this.y] instanceof Rope){
						this.x += 1;
					}
				}
				else
				this.x += 1;
				return;
			}
		}
		if(dy == -1){
			if(control.world[this.x][this.y] instanceof Ladder){
				this.y -= 1;
				return;
			}
		}
		if(dy == 1){
			if(control.world[this.x][this.y + 1] instanceof Ladder || (control.world[this.x][this.y] instanceof Rope && !(control.world[this.x][this.y + 1] instanceof Brick || control.world[this.x][this.y + 1] instanceof Stone))){
				this.y += 1;
				return;
			}
		}
	}
}

class Brick extends PassiveActor {
	constructor(x, y) { super(x, y, "brick"); }
}

class Chimney extends PassiveActor {
	constructor(x, y) { super(x, y, "chimney"); }
}

class Empty extends PassiveActor {
	constructor() { super(-1, -1, "empty"); }
	show() {}
	hide() {}
}

class Gold extends PassiveActor {
	constructor(x, y) { super(x, y, "gold"); }
}

class Invalid extends PassiveActor {
	constructor(x, y) { super(x, y, "invalid"); }
}

class Ladder extends PassiveActor {
	constructor(x, y) {
		super(x, y, "ladder");
		this.visible = false;
	}
	show() {
		if( this.visible )
			super.show();
	}
	hide() {
		if( this.visible )
			super.hide();
	}
	makeVisible() {
		this.visible = true;
		this.show();
	}
}

class Rope extends PassiveActor {
	constructor(x, y) { super(x, y, "rope"); }
}

class Stone extends PassiveActor {
	constructor(x, y) { super(x, y, "stone"); }
}

class Hero extends ActiveActor {
	constructor(x, y) {
		super(x, y, "hero_runs_left");
	}

	animation() {
		var k = control.getKey();
		if(this.isFalling()){
			this.hide();
			this.y += 1;
			this.show();
		}
        if( k == ' ' ) { 
			if(this.imageName === "hero_runs_right"){
				if(control.world[this.x +1][this.y +1] instanceof Brick && !(control.world[this.x +1][this.y] instanceof Brick) && !(control.world[this.x +1][this.y] instanceof Stone)){
				control.world[this.x +1][this.y +1].hide();
				if(!(control.world[this.x - 1][this.y] instanceof Brick)&& !(control.world[this.x - 1][this.y] instanceof Stone)&& ((control.world[this.x - 1][this.y + 1] instanceof Brick) || (control.world[this.x - 1][this.y + 1] instanceof Stone) || (control.world[this.x - 1][this.y + 1] instanceof Ladder))){
					this.hide();
					this.x -= 1;
					this.show();
				}
				return;
			}
			}
			else{
				if(this.imageName === "hero_runs_left"){
					if(control.world[this.x -1][this.y +1] instanceof Brick && !(control.world[this.x -1][this.y] instanceof Brick) && !(control.world[this.x -1][this.y] instanceof Stone)){
					control.world[this.x  -1][this.y +1].hide();
					if(!(control.world[this.x + 1][this.y] instanceof Brick) && !(control.world[this.x + 1][this.y] instanceof Stone) && ((control.world[this.x + 1][this.y +1] instanceof Brick) || (control.world[this.x + 1][this.y +1] instanceof Stone) || (control.world[this.x + 1][this.y +1] instanceof Ladder))){
						this.hide();
						this.x += 1;
						this.show();
					}
					return;
					}
		}
	}
	
return;
}

		
        if( k == null ) return;
        let [dx, dy] = k;
		this.hide(); //esconde onde eesta
		if(dx == -1)
			this.imageName = "hero_runs_left";
		if(dx == 1)
			this.imageName = "hero_runs_right";
		this.move(dx,dy);
		this.show();
		return;
        this.x += dx; //move
        this.y += dy;
        this.show();//mostra new place
	}
}

class Robot extends ActiveActor {
	constructor(x, y) {
		super(x, y, "robot_runs_right");
		this.dx = 1;
		this.dy = 0;
	  }

	animation(){
	
		let dist = distance(this.x, this.y, hero.x, hero.y);
		if( dist > 0){
			if(distance(this.x + 1, this.y, hero.x, hero.y) < dist){
				this.hide();
				this.imageName = "robot_runs_right";
				this.move(1,0);
				this.show();
				
				return;
			}
			if(distance(this.x - 1, this.y, hero.x, hero.y) < dist){
				this.hide();
				this.imageName = "robot_runs_left";
				this.move(-1,0);
				this.show();
				return;
			}
			if(distance(this.x, this.y + 1, hero.x, hero.y) < dist){
				this.hide();
				this.move(0,1);
				this.show();
				return;
			}
			if(distance(this.x, this.y - 1, hero.x, hero.y) < dist){
				this.hide();
				this.move(0,-1);
				this.show();
				return;
			}
		}
	}
}



// GAME CONTROL

class GameControl {
	constructor() {
		control = this;
		this.key = 0;
		this.time = 0;
		this.ctx = document.getElementById("canvas1").getContext("2d");
		empty = new Empty();	// only one empty actor needed
		this.world = this.createMatrix();
		this.worldActive = this.createMatrix();
		this.loadLevel(1);
		this.setupEvents();
	}
	createMatrix() { // stored by columns
		let matrix = new Array(WORLD_WIDTH);
		for( let x = 0 ; x < WORLD_WIDTH ; x++ ) {
			let a = new Array(WORLD_HEIGHT);
			for( let y = 0 ; y < WORLD_HEIGHT ; y++ )
				a[y] = empty;
			matrix[x] = a;
		}
		return matrix;
	}
	loadLevel(level) {
		if( level < 1 || level > MAPS.length )
			fatalError("Invalid level " + level)
		let map = MAPS[level-1];  // -1 because levels start at 1
        for(let x=0 ; x < WORLD_WIDTH ; x++)
            for(let y=0 ; y < WORLD_HEIGHT ; y++) {
					// x/y reversed because map stored by lines
				GameFactory.actorFromCode(map[y][x], x, y);
			}
	}
	getKey() {
		let k = control.key;
		control.key = 0;
		switch( k ) {
			case 37: case 79: case 74: return [-1, 0]; //  LEFT, O, J
			case 38: case 81: case 73: return [0, -1]; //    UP, Q, I
			case 39: case 80: case 76: return [1, 0];  // RIGHT, P, L
			case 40: case 65: case 75: return [0, 1];  //  DOWN, A, K
			case 0: return null;
			default: return String.fromCharCode(k);
		// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		};	
	}
	setupEvents() {
		addEventListener("keydown", this.keyDownEvent, false);
		addEventListener("keyup", this.keyUpEvent, false);
		setInterval(this.animationEvent, 1000 / ANIMATION_EVENTS_PER_SECOND);
	}
	animationEvent() {
		control.time++;
		for(let x=0 ; x < WORLD_WIDTH ; x++)
			for(let y=0 ; y < WORLD_HEIGHT ; y++) {
				let a = control.worldActive[x][y];
				if( a.time < control.time ) {
					a.time = control.time;
					a.animation();
				}
            }
	}
	keyDownEvent(k) {
		control.key = k.keyCode;
	}
	keyUpEvent(k) {
	}
}


// HTML FORM

function onLoad() {
  // Asynchronously load the images an then run the game
	GameImages.loadAll(function() { new GameControl(); });
}

function b1() { mesg("button1") }
function b2() { mesg("button2") }



