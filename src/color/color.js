// ############################################################################ //
// ############################################################################ //
// 									color										//
// ############################################################################ //
// ############################################################################ //

ixBand.color = {
    KEYWORDS: {
        black: '000000', silver: 'c0c0c0', gray: '808080', white: 'ffffff', maroon: '800000', red: 'ff0000', purple: '800080',
        fuchsia: 'ff00ff', green: '008000', lime: '00ff00', olive: '808000', yellow: 'ffff00', navy: '000080', blue: '0000ff',
        teal: '008080', aqua: '00ffff', aliceblue: 'f0f8ff', antiquewhite: 'faebd7', aquamarine: '7fffd4', azure: 'f0ffff', beige: 'f5f5dc',
        bisque: 'ffe4c4', blanchedalmond: 'ffebcd', blueviolet: '8a2be2', brown: 'a52a2a', burlywood: 'deb887', cadetblue: '5f9ea0',
        chartreuse: '7fff00', chocolate: 'd2691e', coral: 'ff7f50', cornflowerblue: '6495ed', cornsilk: 'fff8dc', crimson: 'dc143c',
        cyan: '00ffff', darkblue: '00008b', darkcyan: '008b8b', darkgoldenrod: 'b8860b', darkgray: 'a9a9a9', darkgreen: '006400',
        darkgrey: 'a9a9a9', darkkhaki: 'bdb76b', darkmagenta: '8b008b', darkolivegreen: '556b2f', darkorange: 'ff8c00', darkorchid: '9932cc',
        darkred: '8b0000', darksalmon: 'e9967a', darkseagreen: '8fbc8f', darkslateblue: '483d8b', darkslategray: '2f4f4f',
        darkslategrey: '2f4f4f', darkturquoise: '00ced1', darkviolet: '9400d3', deeppink: 'ff1493', deepskyblue: '00bfff', dimgray: '696969',
        dimgrey: '696969', dodgerblue: '1e90ff', firebrick: 'b22222', floralwhite: 'fffaf0', forestgreen: '228b22', gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff', gold: 'ffd700', goldenrod: 'daa520', greenyellow: 'adff2f', grey: '808080', honeydew: 'f0fff0',
        hotpink: 'ff69b4', indianred: 'cd5c5c', indigo: '4b0082', ivory: 'fffff0', khaki: 'f0e68c', lavender: 'e6e6fa', lavenderblush: 'fff0f5',
        lawngreen: '7cfc00', lemonchiffon: 'fffacd', lightblue: 'add8e6', lightcoral: 'f08080', lightcyan: 'e0ffff', lightgoldenrodyellow: 'fafad2',
        lightgray: 'd3d3d3', lightgreen: '90ee90', lightgrey: 'd3d3d3', lightpink: 'ffb6c1', lightsalmon: 'ffa07a', lightseagreen: '20b2aa',
        lightskyblue: '87cefa', lightslategray: '778899', lightslategrey: '778899', lightsteelblue: 'b0c4de', lightyellow: 'ffffe0',
        limegreen: '32cd32', linen: 'faf0e6', magenta: 'ff00ff', mediumaquamarine: '66cdaa', mediumblue: '0000cd', mediumorchid: 'ba55d3',
        mediumpurple: '9370db', mediumseagreen: '3cb371', mediumslateblue: '7b68ee', mediumspringgreen: '00fa9a', mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585', midnightblue: '191970', mintcream: 'f5fffa', mistyrose: 'ffe4e1', moccasin: 'ffe4b5', navajowhite: 'ffdead',
        oldlace: 'fdf5e6', olivedrab: '6b8e23', orange: 'ffa500', orangered: 'ff4500', orchid: 'da70d6', palegoldenrod: 'eee8aa', palegreen: '98fb98',
        paleturquoise: 'afeeee', palevioletred: 'db7093', papayawhip: 'ffefd5', peachpuff: 'ffdab9', peru: 'cd853f', pink: 'ffc0cb', plum: 'dda0dd',
        powderblue: 'b0e0e6', rosybrown: 'bc8f8f', royalblue: '4169e1', saddlebrown: '8b4513', salmon: 'fa8072', sandybrown: 'f4a460',
        seagreen: '2e8b57', seashell: 'fff5ee', sienna: 'a0522d', skyblue: '87ceeb', slateblue: '6a5acd', slategray: '708090', slategrey: '708090',
        snow: 'fffafa', springgreen: '00ff7f', steelblue: '4682b4', tan: 'd2b48c', thistle: 'd8bfd8', tomato: 'ff6347', turquoise: '40e0d0',
        violet: 'ee82ee', wheat: 'f5deb3', whitesmoke: 'f5f5f5', yellowgreen: '9acd32'
    },

    TYPES: { HEX: 'hex', RGB: 'rgb', RGBA: 'rgba', HSL: 'hsl', HSLA: 'hsla' },

    REG_HEX: /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})(\ufffe)?/,
    REG_HEX3: /^#([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})(\ufffe)?/,
    REG_RGB: /rgba?\(([\d]{1,3}), ?([\d]{1,3}), ?([\d]{1,3}),? ?([.\d]*)?\)/,
    REG_HSL: /hsla?\(([.\d]*), ?([.\d]*%), ?(.[\d]*%),? ?([.\d]*)?\)/,

    is: function ( color, errorMsg ) {
        var result = this.type(color) !== undefined;

        if ( errorMsg && !result ) {
            warning( errorMsg );
            return false;
        } else {
            return result;
        }
    },

    //~IE8 에서는 키워드를 그대로 반환하기때문에 16진수로 변환 해줘야 한다.
    keyword: function ( color, errorMsg ) {
        color = this.KEYWORDS[color.toLowerCase()];
        if ( color ) {
            return color;
        } else {
            if ( errorMsg ) warning( errorMsg );
            return undefined;
        }
    },

    /**
     * Color Type을 반환. 지원하는 칼라 타입이 아닐 경우 에러 발생.
     * @param	{String}	color
     * @param	{String}	errorMsg	해당 타입이 없을때 발생시킬 에러 메세지, 설정하지 않으면 undefined반환
     * @return	{String}	'hex', 'rgb', 'rgba', 'hsl', 'hsla'
     */
    type: function ( color, errorMsg ) {
        if ( this.REG_RGB.test(color) || this.REG_HSL.test(color) ) {
            var typeName = color.match( /([a-z]+)\(/ );
            return this.TYPES[typeName[1].toUpperCase()];
        } else if ( this.REG_HEX.test(color) || this.REG_HEX3.test(color) ) {
            return this.TYPES.HEX;
        } else if ( typeof color === 'string' && this.KEYWORDS[color.toLowerCase()] ) {
            return 'keyword'
        } else {
            if ( errorMsg ) warning( errorMsg );
            return undefined;
        }
    },

    /**
     * rgba(255, 0, 255, 0.5) -> Object{r, g, b, a} 로 반환
     * @param	{String}	color		rgb(255, 255, 255) 나 rgba(255, 255, 255, 0.5) 형식 Color
     * @return	{Object}	{r, g, b, a}
     */
    parseRgba: function ( color ) {
        var rgba = {};
        color.replace( this.REG_RGB, function ( str, r, g, b, a ) {
            rgba = {r: Number(r), g: Number(g), b: Number(b), a: 1};
            if ( a ) rgba.a = Number(a);
        });
        return rgba;
    },

    /**
     * hsla(255, 0, 255, 0.5) -> Object{h, s, l, a} 로 반환
     * @param	{String}	color		hsl(360, 90%, 10%) 나 hsla(360, 90%, 10%, 0.5) 형식 Color
     * @return	{Object}	{h, s, l, a}
     */
    parseHsla: function ( color ) {
        var hsla = {};
        color.replace( this.REG_HSL, function ( str, h, s, l, a ) {
            hsla = {h: parseFloat(h), s: parseFloat(s), l: parseFloat(l), a: 1};
            if ( a ) hsla.a = Number(a);
        });
        return hsla;
    },

    /**
     * Hex문자열을 RGB문자열로 반환.
     * @param	{String}	hex		"#ffffff" 16진수
     * @param	{Boolean}	parse	반환값을 Object{r, g, b, a}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	"rgb(255, 255, 255)" , Object{r, g, b}
     */
    hexToRgb: function ( hex, parse ) {
        var hex = hex.replace( '#', '' ),
            result = {};

        if ( hex.length < 5 ) hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);

        ( '#' + hex ).replace( this.REG_HEX, function ( str, va, vb, vc ) {
            var r = Number( '0x' + va ).toString( 10 ),
                g = Number( '0x' + vb ).toString( 10 ),
                b = Number( '0x' + vc ).toString( 10 );

            result = {r: Number(r), g: Number(g), b: Number(b), a: 1};
        });

        return parse? result : 'rgb(' + result.r + ', ' + result.g + ', ' + result.b + ')';
    },

    /**
     * RGB문자열을 Hex문자열로 반환.
     * @param	{String}	color		"rgb(255, 255, 255)" 표기법
     * @return	{String}	"#FFFFFF"
     */
    rgbToHex: function ( color ) {
        return color.replace( this.REG_RGB, function ( str, r, g, b, a ) {
            //RGBA문자열도 Hex문자열로 반환, "AARRGGBB"
            /*
             var a = (a)? Math.abs(255 * a - 255) : 0,
             uint = a << 24 | r << 16 | g << 8 | b;
             */
            var uint = r << 16 | g << 8 | b;
            return '#' + $B.string.format( uint.toString(16), 6 );
        });
    },

    /**
     * HSL문자열을 RGB문자열로 반환.
     * @param	{String}	color		"hsl(360, 20%, 10%)" 표기법
     * @param	{Boolean}	parse	반환값을 Object{r, g, b, a}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	"rgb(255, 255, 255)" , Object{r, g, b, a}
     */
    hslToRgb: (function () {
        function hue2rgb ( p, q, t ) {
            if ( t < 0 ) t += 1;
            if ( t > 1 ) t -= 1;
            if ( t < 1/6 ) return p + ( q - p ) * 6 * t;
            if ( t < 1/2 ) return q;
            if ( t < 2/3 ) return p + ( q - p ) * ( 2/3 - t ) * 6;
            return p;
        }

        return function ( color, parse ) {
            var hsla = this.parseHsla( color ),
                r, g, b;

            hsla.h /= 360;
            hsla.s /= 100;
            hsla.l /= 100;

            if ( hsla.s == 0 ) {
                r = g = b = hsla.l;
            } else {
                var q = hsla.l < 0.5 ? hsla.l * ( 1 + hsla.s ) : hsla.l + hsla.s - hsla.l * hsla.s,
                    p = 2 * hsla.l - q;
                r = hue2rgb( p, q, hsla.h + 1/3 );
                g = hue2rgb( p, q, hsla.h );
                b = hue2rgb( p, q, hsla.h - 1/3 );
            }

            r = Math.round( r * 255 );
            g = Math.round( g * 255 );
            b = Math.round( b * 255 );

            if ( parse ) {
                return {r: r, g: g, b: b, a: hsla.a};
            } else {
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            }
        }
    }()),

    /**
     * RGB문자열을 HSL문자열로 반환.
     * @param	{String}	color		"rgb(255, 255, 255)" 표기법
     * @param	{Boolean}	parse	반환값을 Object{h, s, l, a}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	"hsl(360, 20%, 10%)" , Object{h, s, l, a}
     */
    rgbToHsl: function ( color, parse ) {
        var rgba = this.parseRgba( color ),
            r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255,
            max = Math.max( r, g, b ), min = Math.min( r, g, b ),
            h, s, l = ( max + min ) / 2;

        if ( max == min ) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
            switch ( max ) {
                case r:
                    h = ( g - b ) / d;
                    break;
                case g:
                    h = 2 + ( (b - r) / d );
                    break;
                case b:
                    h = 4 + ( (r - g) / d );
                    break;
            }
            h *= 60;
            if ( h < 0 ) h += 360;
        }

        s *= 100;
        l *= 100;

        if ( parse ) {
            return {h: h, s: s, l: l, a: rgba.a};
        } else {
            return 'hsl(' + h + ',' + s + '%,' + l + '%)';
        }
    },

    /**
     * Color문자열 ("hex", "rgb", "rgba", "hsl", "hsla", "keyword")을 Hex문자열로 변환하여 반환.
     * @param	{String}	color		Color문자열
     * @return	{String}
     */
    toHex: function ( color ) {
        var type = this.type( color, 'color.toHex() : "' + color + '" ' + MSG_NOT_COLOR );

        switch ( type ) {
            case 'hex':
                return color;
                break;
            case 'rgb':
            case 'rgba':
                return this.rgbToHex( color );
                break;
            case 'hsl':
            case 'hsla':
                color = this.hslToRgb( color );
                return this.rgbToHex( color );
                break;
            case 'keyword':
                return this.keyword( color, 'color.toHex() : "' + color + '" ' + MSG_NOT_COLOR );
                break;
        }
    },

    /**
     * Color문자열 ("hex", "rgb", "rgba", "hsl", "hsla", "keyword")을 RGB문자열로 변환하여 반환.
     * @param	{String}	color		Color문자열
     * @param	{Boolean}	parse		반환값을 Object{r, g, b, a}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	RGB문자열 "rgb(255, 255, 255)", Object{r, g, b, a}
     */
    toRgb: function ( color, parse ) {
        var type = this.type( color, 'color.toRgb() : "' + color + '" ' + MSG_NOT_COLOR ),
            objColor;

        switch ( type ) {
            case 'rgb':
                return parse? this.parseRgba( color ) : color;
                break;
            case 'rgba':
                objColor = this.parseRgba( color );
                break;
            case 'hsl':
            case 'hsla':
                objColor = this.hslToRgb( color, true );
                break;
            case 'keyword':
                color = this.keyword( color, 'color.toRgb() : "' + color + '" ' + MSG_NOT_COLOR );
            case 'hex':
                objColor = this.hexToRgb( color, true );
                break;
        }

        return parse? objColor : 'rgb(' + objColor.r + ', ' + objColor.g + ', ' + objColor.b + ')';
    },

    /**
     * Color문자열 ("hex", "rgb", "rgba", "hsl", "hsla", "keyword")을 RGBA문자열로 변환하여 반환.
     * @param	{String}	color		Color문자열
     * @param	{Boolean}	parse		반환값을 Object{r, g, b, a}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	RGBA문자열 "rgba(255, 255, 255, 0.5)", Object{r, g, b, a}
     */
    toRgba: function ( color, parse ) {
        var type = this.type( color, 'color.toRgba() : "' + color + '" ' + MSG_NOT_COLOR ),
            objColor;

        switch ( type ) {
            case 'rgb':
                objColor = this.parseRgba( color );
                break;
            case 'rgba':
                return parse? this.parseRgba( color ) : color;
                break;
            case 'hsl':
            case 'hsla':
                objColor = this.hslToRgb( color, true );
                break;
            case 'keyword':
                color = this.keyword( color, 'color.toRgba() : "' + color + '" ' + MSG_NOT_COLOR );
            case 'hex':
                objColor = this.hexToRgb( color, true );
                break;
        }

        return parse? objColor : 'rgba(' + objColor.r + ', ' + objColor.g + ', ' + objColor.b + ', ' + objColor.a + ')';
    },

    /**
     * Color문자열 ("hex", "rgb", "rgba", "hsl", "hsla", "keyword")을 Hsl문자열로 변환하여 반환.
     * @param	{String}	color		Color문자열
     * @param	{Boolean}	parse		반환값을 Object{h, s, l}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	"hsl(360, 20%, 10%)" , Object{h, s, l}
     */
    toHsl: function ( color, parse ) {
        var type = this.type( color, 'color.toHsl() : "' + color + '" ' + MSG_NOT_COLOR ),
            objColor;

        switch ( type ) {
            case 'rgb':
            case 'rgba':
                objColor = this.rgbToHsl( color, true );
                break;
            case 'hsl':
                return parse? this.parseHsla( color ) : color;
                break;
            case 'hsla':
                objColor = this.parseHsla( color );
                break;
            case 'keyword':
                color = this.keyword( color, 'color.toHsl() : "' + color + '" ' + MSG_NOT_COLOR );
            case 'hex':
                color = this.hexToRgb( color );
                objColor = this.rgbToHsl( color, true );
                break;
        }

        return parse? objColor : 'hsl(' + objColor.h + ', ' + objColor.s + '%, ' + objColor.l + '%)';
    },

    /**
     * Color문자열 ("hex", "rgb", "rgba", "hsl", "hsla", "keyword")을 Hsla문자열로 변환하여 반환.
     * @param	{String}	color		Color문자열
     * @param	{Boolean}	parse		반환값을 Object{h, s, l, a}로 받을것인지 설정, 기본값 false;
     * @return	{String || Object}	"hsla(360, 20%, 10%, 1)" , Object{h, s, l, a}
     */
    toHsla: function ( color, parse ) {
        var type = this.type( color, 'color.toHsla() : "' + color + '" ' + MSG_NOT_COLOR ),
            objColor;

        switch ( type ) {
            case 'rgb':
            case 'rgba':
                objColor = this.rgbToHsl( color, true );
                break;
            case 'hsl':
                objColor = this.parseHsla( color );
                break;
            case 'hsla':
                return parse? this.parseHsla( color ) : color;
                break;
            case 'keyword':
                color = this.keyword( color, 'color.toHsla() : "' + color + '" ' + MSG_NOT_COLOR );
            case 'hex':
                color = this.hexToRgb( color );
                objColor = this.rgbToHsl( color, true );
                break;
        }

        return parse? objColor : 'hsla(' + objColor.h + ', ' + objColor.s + '%, ' + objColor.l + '%, ' + objColor.a +')';
    },

    /**
     * Color문자열 ("hex", "rgb", "rgba", "hsl", "hsla", "keyword")을 해당 Type Color문자열로 변환하여 반환.
     * @param	{String}	color		Color문자열
     * @param	{String}	type		변환할 Color Type, "hex", "rgb", "rgba", "hsl", "hsla"
     * @return	{String}	Color문자열 "hex", "rgb", "rgba", "hsl", "hsla"
     */
    convert: function ( color, type ) {
        switch ( type ) {
            case 'rgb':
                return this.toRgb( color );
                break;
            case 'rgba':
                return this.toRgba( color );
                break;
            case 'hsl':
                return this.toHsl( color );
                break;
            case 'hsla':
                return this.toHsla( color );
                break;
            default:
                return this.toHex( color );
                break;
        }
    },

    /**
     * 색상을 혼합하여 반환.
     * @param	{String}	fromColor	"hex", "rgb", "rgba" Color문자열 예) #ffffff, rgb(0, 0, 0), rgba(0, 0, 0, 0)
     * @param	{String}	toColor		"hex", "rgb", "rgba" Color문자열 예) #ffffff, rgb(0, 0, 0), rgba(0, 0, 0, 0)
     * @param	{Number}	progress	혼합비율 지점을 설정 0~1
     * @param	{String}	type		반환 받을 Color Type, "hex", "rgb", "rgba", "hsl", "hsla" 기본값은 "hex" (~IE8 에서는 rgba를 지원하지 않는다.)
     * @return	{String}	16진수 or 10진수 Color문자열
     */
    mix: function ( fromColor, toColor, progress, type ) {
        if (progress > 1) {
            progress = 1;
        } else if (progress < 0) {
            progress = 0;
        }

        var reType = (type || 'hex').toLowerCase(),
            fColor = this.toRgba( fromColor, true ),
            tColor = this.toRgba( toColor, true );

        var multi = 1 - progress,
            rMulti = fColor.r, gMulti = fColor.g, bMulti = fColor.b, aMulti = fColor.a,
            rOff = tColor.r, gOff = tColor.g, bOff = tColor.b, aOff = tColor.a,// Math.abs(255 * a - 255)
            a = aMulti * multi + aOff * progress,
            r = Math.floor( rMulti * multi + rOff * progress ),
            g = Math.floor( gMulti * multi + gOff * progress ),
            b = Math.floor( bMulti * multi + bOff * progress ),
            rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

        switch ( reType ) {
            case 'hex':
                return this.rgbToHex( rgba );
                break;
            case 'rgb':
                return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                break;
            case 'rgba':
                return rgba;
            case 'hsl':
                return this.rgbToHsl( rgba );
            case 'hsla':
                var hsla = this.rgbToHsl( rgba, true );
                return 'hsla(' + hsla.h + ', ' + hsla.s + '%, ' + hsla.l + '%, ' + hsla.a +')';
                break;
        }
    },

    /**
     * 여러가지 색상을 정비율로 혼합하여 반환.<br>
     * @param	{Array}		colors		칼라 Array
     * @param	{Number}	progress	뽑아낼 칼라 지점을 설정 0~1
     * @param	{String}	type		반환 받을 Color Type, "hex", "rgb", "rgba", "hsl", "hsla" 기본값은 "hex" (~IE8 에서는 rgba를 지원하지 않는다.)
     * @return	{Color}		예) #ffffff
     */
    multiMix: function ( colors, progress, type ) {
        if (progress > 1) {
            progress = 1;
        } else if (progress < 0) {
            progress = 0;
        }
        var colorNum = colors.length,
            sectionPer, section, sPercent;
        if (colorNum < 2) return colors[0];
        sectionPer = 1 / (colorNum - 1);
        section = Math.floor(progress / sectionPer);
        if (section < 0) return colors[0];
        if (section < colorNum - 1) {
            sPercent = (progress % sectionPer) / sectionPer;
            return this.mix( colors[section], colors[section + 1], sPercent, type );
        }
        return colors[colorNum - 1];
    },

    /**
     * 보색 반환.
     * @param	{String}	color	"hex", "rgb", "rgba" Color문자열 예) #ffffff, rgb(0, 0, 0), rgba(0, 0, 0, 0)
     * @param	{String}	type		반환 받을 Color Type, "hex", "rgb", "rgba", "hsl", "hsla" 기본값은 지정한 color값의 type (~IE8 에서는 rgba를 지원하지 않는다.)
     * @return	{Color}		예) #ffffff
     */
    complementary: function ( color, type ) {
        var rgbaObj = this.toRgba( color, true ),
            r = 255 - rgbaObj.r, g = 255 - rgbaObj.g, b = 255 - rgbaObj.b;
        return this.convert( 'rgba(' + r + ',' + g + ',' + b + ',' + rgbaObj.a + ')', type );
    },

    /**
     * 회색톤 반환.
     * @param	{String}	color	"hex", "rgb", "rgba" Color문자열 예) #ffffff, rgb(0, 0, 0), rgba(0, 0, 0, 0)
     * @param	{String}	type		반환 받을 Color Type, "hex", "rgb", "rgba", "hsl", "hsla", 기본값은 지정한 color값의 type (~IE8 에서는 rgba를 지원하지 않는다.)
     * @return	{Color}		예) #ffffff
     */
    grayscale: function ( color, type ) {
        var colorObj = this.toRgba( color, true ),
            grayscale = Math.round( (colorObj.r + colorObj.g + colorObj.b) / 3 );

        return this.convert( 'rgba(' + grayscale + ',' + grayscale + ','+ grayscale + ',' + colorObj.a + ')', type );
    },

    /**
     * 칼라의 밝기값 반환, 밝을수록 255에 가깝다.
     * @param	{String}	color	"hex", "rgb", "rgba" Color문자열 예) #ffffff, rgb(0, 0, 0), rgba(0, 0, 0, 0)
     * @return	{Number}		0 ~ 255
     */
    brighteness: function ( color ) {
        var colorObj = this.toRgb( color, true );
        return ( (colorObj.r * 299) + (colorObj.g * 587) + (colorObj.b * 114) ) / 1000;
    }
};