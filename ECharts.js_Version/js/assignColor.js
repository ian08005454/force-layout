var HSL = [];
export function SetLineColor (colorList, lineColors, groupColor){
    //運用array接值 sort 去修改color object 的值再重新上色
    colorList.sort();	
    let hslGroupColor = [];
    for(let group of groupColor){
        // hslGroupColor.push(hexToHsl(group));
		hslGroupColor.push(hexToRgb(group));
		console.log(hslGroupColor);
    }
//    var centerPoint = setColorRange(hslGroupColor);
	for(let color in lineColors){
		// lineColors[color].color = calculateColor(lineColors[color].group, centerPoint, hslGroupColor);
		lineColors[color].color = calculateColor1(lineColors[color].group, hslGroupColor);
	}
	return lineColors;
}
function calculateColor1(group, hslGroupColor){
	var count = 0;
	var RGB = [];
	group.forEach(element => {
		count += element
	});
	for(let h =0; h<3; h++){
		var temp = 0;
		for (let index = 0; index < hslGroupColor.length; index++) {
			temp += group[index] * hslGroupColor[index][h];
		}
		temp = Math.floor(temp /= count);
		RGB.push(temp);
	}
	return rgbToHex(RGB[0], RGB[1], RGB[2]);
}
function calculateColor(group, centerPoint, hslGroupColor){
	var hsl = centerPoint;
	var count = 0;
	for(let h =0; h<3; h++){
		var temp = 1
		for (let index = 0; index < hslGroupColor.length; index++) {
			temp += group[index] * hslGroupColor[index][h];
			count += group[index]
		}
		temp =Math.floor(temp /= count);
		hsl[h] += temp;
	}
	return hslToHex(hsl[0], hsl[1], hsl[2]);
}
function hexToRgb(x){
	var r = parseInt((cutHex(x)).substring(0,2),16);
    var g = parseInt((cutHex(x)).substring(2,4), 16);
    var b = parseInt((cutHex(x)).substring(4,6),16);
	return[r,g,b];
	function cutHex(h){
        return (h.charAt(0)=="#") ? h.substring(1,7):h
    } 
}
function rgbToHex(r, g, b) {
		  
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function hexToHsl(x){
    var r = parseInt((cutHex(x)).substring(0,2),16);
    var g = parseInt((cutHex(x)).substring(2,4), 16);
    var b = parseInt((cutHex(x)).substring(4,6),16);
     return rgbToHsl(r, g, b);

    function cutHex(h){
        return (h.charAt(0)=="#") ? h.substring(1,7):h
    }
}
/*
		 * Converts an RGB color value to HSL. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes r, g, and b are contained in the set [0, 255] and
		 * returns h, s, and l the same way as your browser DevTools color picker.
		 *
		 * @param   Number  r       The red color value
		 * @param   Number  g       The green color value
		 * @param   Number  b       The blue color value
		 * @return  Array           The HSL representation
		 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }
    h = Math.round(lerp(0,359,h));
    s = Math.round(s*100);
    l = Math.round(l*100);
    return [ h, s, l ];
	//https://gist.github.com/demonixis/4202528/5f0ce3c2622fba580e78189cfe3ff0f9dd8aefcc
	function lerp (value1, value2, amount) {
		amount = amount < 0 ? 0 : amount;
		amount = amount > 1 ? 1 : amount;
		return value1 + (value2 - value1) * amount;
	}
			
}

function setColorRange(hslGroupColor){
	var centerColor = []
    for (let index = 0; index < 3; index++) {
		var count = 0;
		for(let hsl of hslGroupColor){
			count += hsl[index];
		}
		count /= hslGroupColor.length;
		centerColor.push(count);
	}
	return centerColor;
}
export function getRandomColor() {
	var hslLength = HSL.length;
	var ret = [];
	ret[0] = Math.floor(Math.random() * 360);
	if (HSL.length > 36) {
		ret[1] = 80;
		ret[2] = 70;
	} else {
		ret[1] = 70;
		ret[2] = 50;
	}

	for (var i = 0; i < hslLength; i++) {
		// 色相差異調整
		if (i > 0 && Math.abs(ret[0] - HSL[i][0]) < 8) {
			ret[0] = Math.floor(Math.random() * 360);
			// ret[1]= Math.floor(Math.random() * 100);
			// ret[2]= Math.floor(Math.random() * 100);
			i = 0;
		}
	}
	// ret[1] = 70 + (ret[1] * 0.3); // [0.7 - 0.9] 排除过灰颜色
	// ret[2] = 40 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

	// 数据转化到小数点后两位
	ret = ret.map(function(item) {
		return parseFloat(item.toFixed(2));
	});

	HSL.push(ret[0]);
	// console.log(ret);
	var color = hslToHex(ret[0], ret[1], ret[2]);
	// console.log(color);
	return color;
}
//https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
//https://www.ginifab.com.tw/tools/colors/rgb_to_hsv_hsl.html
function hslToHex(h, s, l) {
	h /= 360;
	s /= 100;
	l /= 100;
	let r, g, b;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = (x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}