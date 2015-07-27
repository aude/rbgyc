var i, c,
	observeIds = [
		'rgb-rt', 'rgb-rs', 'rgb-gt', 'rgb-gs', 'rgb-bt', 'rgb-bs',
		'cmyk-ct', 'cmyk-cs', 'cmyk-mt', 'cmyk-ms', 'cmyk-yt', 'cmyk-ys', 'cmyk-kt', 'cmyk-ks',
		'rbgyc-rt', 'rbgyc-rs', 'rbgyc-bt', 'rbgyc-bs', 'rbgyc-gt', 'rbgyc-gs', 'rbgyc-yt', 'rbgyc-ys', 'rbgyc-ct', 'rbgyc-cs'
	],
	hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

function renderRGB(rgb) {
	var i, c,
		out = 'rgb(';
	for (i = 0, c = rgb.length; i < c; ++i) {
		out += Math.round(rgb[i] * 255).toString() +
				(i < c-1 ? ',' : '');
	}
	out += ')';
	return out;
}

function renderCMY(cmy) {
	var out = 'CMY: ';
	for (i = 0, c = cmy.length; i < c; ++i) {
		// precision: 0.1
		out +=
			(Math.round(cmy[i] * 100 * 10) / 10).toString() + '%' +
			(i == c-1 ? '' : ' ');
	}
	return out;
}

function renderCMYK(cmyk) {
	var out = 'CMYK: ';
	for (i = 0, c = cmyk.length; i < c; ++i) {
		// precision: 0.1
		out +=
			(Math.round(cmyk[i] * 100 * 10) / 10).toString() + '%' +
			(i == c-1 ? '' : ' ');
	}
	return out;
}

function updateShow(id, rgb) {
	document.getElementById(id).style.backgroundColor = renderRGB(rgb);
}

function RGBtoHEX(rgb) {
	var i,
		out = '#';
	for (i = 0; i <= 2; ++i) {
		out += hex[Math.floor(Math.round(rgb[i] * 255) / 16) % 16] +
				hex[Math.round(rgb[i] * 255) % 16];
	}
	return out;
}

function RGBtoCMYK(rgb) {
	// ~http://www.rapidtables.com/convert/color/rgb-to-cmyk.htm
	var c, m, y, k,
		_r, _g, _b;

	_r = rgb[0];
	_g = rgb[1];
	_b = rgb[2];

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

	_r = rgb[0];
	_g = rgb[1];
	_b = rgb[2];

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
	r = (1 - _c) * (1 - _k);
	g = (1 - _m) * (1 - _k);
	b = (1 - _y) * (1 - _k);
	return [r, g, b];
}

function RBGYCtoRGB(_r, _b, _g, _y, _c) {
	var r, g, b,
		diff;

	// init
	r = 0;
	g = 0;
	b = 0;

	// apply red, which is RGB(1,0,0)
	r += _r * 1;
	g += _g * 0;
	b += _b * 0;
	// apply blue, which is RGB(0,0,1)
	r += _r * 0;
	g += _g * 0;
	b += _b * 1;
	// apply green, which is RGB(0,1,0)
	r += _r * 0;
	g += _g * 1;
	b += _b * 0;
	// apply yellow, which is RGB(1,1,0)
	r += _y * 1;
	g += _y * 1;
	b += _y * 0;
	if (r > 1) {
		diff = r - 1;
		r -= diff;
		g -= diff / 2;
	}
	if (g > 1) {
		diff = g - 1;
		r -= diff / 2;
		g -= diff;
	}
	// apply key, which is RGB(0,0,0)-RGB(1,1,1)
	r += _c * r;
	g += _c * g;
	b += _c * b;
	if (r > 1) {
		diff = r - 1;
		r -= diff;
		g += diff * (1 - g);
		b += diff * (1 - b);
	}
	if (g > 1) {
		diff = g - 1;
		r += diff * (1 - r);
		g -= diff;
		b += diff * (1 - b);
	}
	if (b > 1) {
		diff = b - 1;
		r += diff * (1 - r);
		g += diff * (1 - g);
		b -= diff;
	}

	return [r, g, b];
}

function updateInfo(id, rgb) {
	var i,
		out,
		cmyk, hsv, hsl, rbgyc;

	document.getElementById(id + '-hex').textContent = RGBtoHEX(rgb);
	document.getElementById(id + '-rgb').textContent = renderRGB(rgb);
	document.getElementById(id + '-cmy').textContent = renderCMY(RGBtoCMY(rgb));
	document.getElementById(id + '-cmyk').textContent = renderCMYK(RGBtoCMYK(rgb));
}

function updateRGB() {
	var i, rgb;

	i = 0 - 2;
	// go from 0-100 to 0-1
	rgb = [
		parseInt(document.getElementById(observeIds[i+=2]).value, 10) / 255,
		parseInt(document.getElementById(observeIds[i+=2]).value, 10) / 255,
		parseInt(document.getElementById(observeIds[i+=2]).value, 10) / 255
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
	// go from 0-100 to 0-1
	r = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	b = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	g = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	y = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;
	c = parseFloat(document.getElementById(observeIds[i+=2]).value, 10) / 100;

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
