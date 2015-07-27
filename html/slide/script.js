var i, c,
	observeIds = [
		'rgb-rt', 'rgb-rs', 'rgb-gt', 'rgb-gs', 'rgb-bt', 'rgb-bs',
		'cmyk-ct', 'cmyk-cs', 'cmyk-mt', 'cmyk-ms', 'cmyk-yt', 'cmyk-ys', 'cmyk-kt', 'cmyk-ks',
		'rbgyc-rt', 'rbgyc-rs', 'rbgyc-bt', 'rbgyc-bs', 'rbgyc-gt', 'rbgyc-gs', 'rbgyc-yt', 'rbgyc-ys', 'rbgyc-ct', 'rbgyc-cs'
	],
	hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

function updateShow(id, rgb) {
	document.getElementById(id).style.backgroundColor = 'rgb(' + rgb[0].toString() + ',' + rgb[1].toString() + ',' + rgb[2].toString() + ')';
}

function RGBtoHEX(rgb) {
	var i,
		out = '#';
	for (i = 0; i <= 2; ++i) {
		out += hex[Math.floor(rgb[i]/16) % 16] + hex[rgb[i] % 16];
	}
	return out;
}

function RGBtoCMYK(rgb) {
	// ~http://www.rapidtables.com/convert/color/rgb-to-cmyk.htm
	var c, m, y, k,
		_r, _g, _b;

	_r = rgb[0] / 255;
	_g = rgb[1] / 255;
	_b = rgb[2] / 255;

	k = 1 - Math.max(_r, Math.max(_g, _b));

	// handle black, which will cause division by 0
	if (k === 1) {
		return [0, 0, 0, 1];
	}

	c = (1 - _r - k) / (1 - k);
	m = (1 - _g - k) / (1 - k);
	y = (1 - _b - k) / (1 - k);

	return [c, m, y, k];
}

function RGBtoCMY(rgb) {
	// ~http://www.rapidtables.com/convert/color/rgb-to-cmyk.htm
	var c, m, y,
		_r, _g, _b;

	_r = rgb[0] / 255;
	_g = rgb[1] / 255;
	_b = rgb[2] / 255;

	k = 1 - Math.max(_r, Math.max(_g, _b));

	// handle black, which will cause division by 0
	if (k === 1) {
		return [0, 0, 0, 1];
	}

	c = (1 - _r);
	m = (1 - _g);
	y = (1 - _b);

	return [c, m, y];
}

function CMYKtoRGB(_c, _m, _y, _k) {
	// RGB is just inverted RGB, with Key added (optionally, as we're in an ideal world: on a computer)
	var r, g, b;
	// ~http://www.rapidtables.com/convert/color/cmyk-to-rgb.htm
	r = Math.round(255 * (1 - _c) * (1 - _k));
	g = Math.round(255 * (1 - _m) * (1 - _k));
	b = Math.round(255 * (1 - _y) * (1 - _k));
	return [r, g, b];
}

function RBGYCtoRGB(_r, _b, _g, _y, _c) {
	var r, g, b;
	// r = Math.round((Math.max(_r - _g, 0) / 100) * 255).toString();
	// g = Math.round((Math.max(_g - _r, 0) / 100) * 255).toString();

	// init
	r = 0;
	g = 0;
	b = 0;

	// apply red, which is RGB(255,0,0)
	r += _r * (255 / 100);
	g += _g * (0 / 100);
	b += _b * (0 / 100);
	// apply blue, which is RGB(0,0,255)
	r += _r * (0 / 100);
	g += _g * (0 / 100);
	b += _b * (255 / 100);
	// apply green, which is RGB(0,255,0)
	r += _r * (0 / 100);
	g += _g * (255 / 100);
	b += _b * (0 / 100);
	// apply yellow, which is RGB(255,255,0)
	// r += _y * (255 / 100 / 2);
	// g += _y * (255 / 100 / 2);
	// b += _y * (0 / 100 / 2);
	r += _y * (255 / 100);
	g += _y * (255 / 100);
	var diff;
	if (r > 255) {
		diff = (r - 255) / 2;
		r -= diff;
		g -= diff;
	}
	if (g > 255) {
		diff = (g - 255) / 2;
		g -= diff;
		r -= diff;
	}
	// apply key, which is RGB(0,0,0)-RGB(255,255,255)
	r += _c * (255 / 100);
	g += _c * (255 / 100);
	b += _c * (255 / 100);

	return [Math.round(r), Math.round(g), Math.round(b)];
}

function updateInfo(id, rgb) {
	var i,
		out,
		cmyk, hsv, hsl, rbgyc;

	document.getElementById(id + '-hex').textContent = RGBtoHEX(rgb);

	out = 'rgb(';
	for (i = 0, c = rgb.length; i < c; ++i) {
		out += rgb[i].toString() + (i < c-1 ? ',' : '');
	}
	out += ')';
	document.getElementById(id + '-rgb').textContent = out;

	cmy = RGBtoCMY(rgb);
	out = 'CMY: ';
	for (i = 0, c = cmy.length; i < c; ++i) {
		out +=
			(Math.round(cmy[i] * 100 * 10) / 10).toString() + '%' +
			(i == c-1 ? '' : ' ');
	}
	document.getElementById(id + '-cmy').textContent = out;

	cmyk = RGBtoCMYK(rgb);
	out = 'CMYK: ';
	for (i = 0, c = cmyk.length; i < c; ++i) {
		out +=
			(Math.round(cmyk[i] * 100 * 10) / 10).toString() + '%' +
			(i == c-1 ? '' : ' ');
	}
	document.getElementById(id + '-cmyk').textContent = out;
}

function updateRGB() {
	var i, rgb;
	i = 0 - 2;
	rgb = [
		parseInt(document.getElementById(observeIds[i+=2]).value, 10),
		parseInt(document.getElementById(observeIds[i+=2]).value, 10),
		parseInt(document.getElementById(observeIds[i+=2]).value, 10)
	];
	updateShow('show-rgb', rgb);
	updateInfo('rgb', rgb);
}

function updateCMYK() {
	var i,
		c, m, y, k,
		rgb;

	i = 6 - 2;
	// go from 0-100 to 0-1
	c = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	m = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	y = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	k = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;

	rgb = CMYKtoRGB(c, m, y, k);

	updateShow('show-cmyk', rgb);
	updateInfo('cmyk', rgb);
}

function updateRBGYC() {
	var i,
		r, b, g, y, c,
		rgb;
		r, b, g, y, c;

	i = 14 - 2;
	r = parseFloat(document.getElementById(observeIds[i+=2]).value, 10);
	b = parseFloat(document.getElementById(observeIds[i+=2]).value, 10);
	g = parseFloat(document.getElementById(observeIds[i+=2]).value, 10);
	y = parseFloat(document.getElementById(observeIds[i+=2]).value, 10);
	c = parseFloat(document.getElementById(observeIds[i+=2]).value, 10);

	updateShow('show-rbgyc', RBGYCtoRGB(r, b, g, y, c));
	updateInfo('rbgyc', RBGYCtoRGB(r, b, g, y, c));
}

function update() {
	if (this !== window) {
		var thisId = this.id,
			complId = thisId.substr(0, thisId.length-1) + (thisId.substr(-1, 1) == 't' ? 's' : 't');

		document.getElementById(complId).value = this.value;
	}

	updateRGB();
	updateCMYK();
	updateRBGYC();
}

function init() {
	for (i = 0, c = observeIds.length; i < c; ++i) {
		document.getElementById(observeIds[i]).addEventListener('input', update, false);
	}
	update();
}
