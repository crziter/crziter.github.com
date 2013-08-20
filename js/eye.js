var eye_canvas_bk;
var eye_canvas_ani;

var eye_ctx;
var eye_no_eye_image;
var eye_eye_image;
var eye_width_d2;
var eye_height_d2;
var eye_x1 = 181;
var eye_y1 = 36;
var eye_x2 = 207;
var eye_y2 = 37; 
var rex1;
var rey1;
var rex2;
var rey2;
var data;
var bod;

function eye_init() {
	bod = document.body;
	eye_canvas_bk = document.getElementById('crziter-bk');
	eye_canvas_ani = document.getElementById('crziter-anime');
	eye_ctx = eye_canvas_ani.getContext('2d');

	eye_no_eye_image = new Image();// document.getElementById('crziter-avatar');
	eye_no_eye_image.src = '/images/avatar_noeye.png';

	eye_eye_image = new Image();// document.getElementById('cat-eye');
	eye_eye_image.src = '/images/eye.png';

	eye_no_eye_image.onload = function() {
		eye_canvas_bk.getContext('2d').drawImage(eye_no_eye_image, 
			0, 0, 
			350, 350,
			0, 0, 
			350, 350
		);

		var pixels = eye_canvas_bk.getContext('2d').getImageData(0, 0, 350, 350);	
		data = pixels.data;
	}

	eye_eye_image.onload = function() {
		eye_ctx.drawImage(eye_eye_image, eye_x1, eye_y1);
		eye_ctx.drawImage(eye_eye_image, eye_x2, eye_y2);

		eye_width_d2 = eye_eye_image.width / 2;
		eye_height_d2 = eye_eye_image.height / 2;

		rex1 = eye_x1 + eye_width_d2;
		rey1 = eye_y1 + eye_height_d2;
		rex2 = eye_x2 + eye_width_d2;
		rey2 = eye_y2 + eye_height_d2;
	}


	 document.onmousemove = eye_move;
	 document.onmouseout = eye_out;
	 return true;
}

function eye_move(e) {
	/*
	161 - 16 | 237 - 67

	W: 76
	H: 51
	*/

	var mouseX = e.clientX + bod.scrollLeft;
	var mouseY = e.clientY + bod.scrollTop;


	eye_ctx.clearRect(161, 16, 76, 51);

	var bounding = eye_canvas_ani.getBoundingClientRect();
	var mx = mouseX - bounding.left;
	var my = mouseY - bounding.top;

	var abs = Math.abs;
	var max1 = abs(rex1-mx) > abs(rey1-my) ? abs(rex1-mx) : abs(rey1-my);
	var stepx1 = (mx - rex1) / max1;
	var stepy1 = (my - rey1) / max1;

	var max2 = abs(rex2-mx) > abs(rey2-my) ? abs(rex2-mx) : abs(rey2-my);
	var stepx2 = (mx - rex2) / max2;
	var stepy2 = (my - rey2) / max2;

	var x1 = rex1;
	var y1 = rey1;

	var x2 = rex2;
	var y2 = rey2;

	var t1 = false;
	var t2 = false;

	var round = Math.round;
	var i = 0;

	var rsx1 = stepx1 * 2;
	var rsx2 = stepx2 * 2;
	var rsy1 = stepy1 * 2;
	var rsy2 = stepy2 * 2;
	do {
		var element1 = (round(y1) * 350 + round(x1)) << 2; 
		var element2 = (round(y2) * 350 + round(x2)) << 2;
		if (t1 == false) {
			if (data[element1 + 3] > 100) {
				t1 = true;
				//console.log('t1 is true at i=' + i);
			} else {
				y1 = y1 + rsy1;
				x1 = x1 + rsx1;
			}
		}

		if (t2 == false) {
			if (data[element2 + 3] > 100) {
				t2 = true;
			} else {
				y2 = y2 + rsy2;
				x2 = x2 + rsx2;
			}
		}

		if (t1 && t2) break;
		i+=2;
	} while (i<25);

	eye_ctx.drawImage(eye_eye_image, x1 - stepx1 * eye_width_d2 - eye_width_d2, y1 - stepy1 * eye_height_d2 - eye_height_d2);
	eye_ctx.drawImage(eye_eye_image, x2 - stepx2 * eye_width_d2 - eye_width_d2, y2 - stepy2 * eye_height_d2 - eye_height_d2);

	return true;
}

function eye_out() {
	eye_ctx.clearRect(161, 16, 76, 51);
	eye_ctx.drawImage(eye_eye_image, eye_x1, eye_y1);
	eye_ctx.drawImage(eye_eye_image, eye_x2, eye_y2);
}