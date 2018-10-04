var MSG_NOT_STRING = '의 대상이 문자열이 아닙니다.',
    MSG_NOT_ARRAY = '의 대상이 배열이 아닙니다.',
    MSG_NOT_COLOR = '는 Color Type이 아니거나 지원하지 않는 형식입니다.',
    MSG_OVERLAP_VARIABLE = '는 이미 선언 되어있어 다시 선언할 수 없습니다.';

var SUPPORT_MODULE = ( typeof module === 'object' && typeof module.exports === 'object' ),
	SUPPORT_WINDOW = ( typeof window === 'object' );

var window = SUPPORT_WINDOW ? window : {},
	document = SUPPORT_WINDOW ? window.document : {},
	navigator = SUPPORT_WINDOW ? window.navigator : {};

if ( SUPPORT_MODULE ) {
	var ixBand = function ( target ) {
		_dom.target = ( target )? target : null;
		return _dom;
	};

	var $B = ixBand;
	module.exports = ixBand;
} else {
	if ( window.ixBand ) {
		warning( '"ixBand"' + MSG_OVERLAP_VARIABLE, true );
		return;
	}

	var $B = ixBand = window.ixBand = function ( target ) {
		_dom.target = ( target )? target : null;
		return _dom;
	};

	//ixBand 이외의 변수를 사용할때
	//<script src="js/ixBand.js?ixBand=$B"></script>
	(function () {
		var jsTags = document.getElementsByTagName( 'script' ),
			jsTag = jsTags[jsTags.length-1];

		if ( jsTag && /[\?&]ixBand=([^&]+)/.test(jsTag.src) ) {
			if ( window[RegExp.$1] ) {
				warning( '"' + RegExp.$1 + '"' + MSG_OVERLAP_VARIABLE, true );
			} else {
				window[RegExp.$1] = ixBand;
			}
		} else {
			if ( window.$B ) {
				warning( '"$B"' + MSG_OVERLAP_VARIABLE, true );
			} else {
				window.$B = ixBand;
			}
		}
	}());
}

var __swfCount = 0,
    __classCount = 0,
    __keyCount = 0,
    __debugMode = false;

// ===============	Public Properties =============== //
$B.VERSION = '';
