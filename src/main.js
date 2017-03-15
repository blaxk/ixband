var MSG_NOT_STRING = '의 대상이 문자열이 아닙니다.',
    MSG_NOT_ARRAY = '의 대상이 배열이 아닙니다.',
    MSG_NOT_COLOR = '는 Color Type이 아니거나 지원하지 않는 형식입니다.',
    MSG_OVERLAP_VARIABLE = '는 이미 선언 되어있어 다시 선언할 수 없습니다.';

if ( window.ixBand ) {
    warning( '"ixBand"' + MSG_OVERLAP_VARIABLE, true );
    return;
}

var $B = window.ixBand = function ( target ) {
    _dom.target = ( target )? target : null;
    return _dom;
};

var document = window.document;
var __swfCount = 0,
    __classCount = 0,
    __keyCount = 0,
    __debugMode = false;

// ===============	Public Properties =============== //
$B.VERSION = '';


//ixBand 이외의 변수를 사용할때
//<script src="js/ixBand_0.6.js?ixBand=$B"></script>
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


var PX_RATIO = window.devicePixelRatio || 1,
    MS_POINTER = true,
    TOUCH_ACTION = 'msTouchAction';

//EventType의 크로스부라우징 처리
var CrossTouchEvent = {};

if ( 'ontouchstart' in window ) {
    CrossTouchEvent = {touchstart: 'touchstart', touchmove: 'touchmove', touchend: 'touchend', touchcancel: 'touchcancel'};
    MS_POINTER = false;
    TOUCH_ACTION = 'touchAction';
    //IE11~
} else if ( navigator.pointerEnabled ) {
    CrossTouchEvent = {touchstart: 'pointerdown', touchmove: 'pointermove', touchend: 'pointerup', touchcancel: 'pointercancel'};
    TOUCH_ACTION = 'touchAction';
    //IE10
} else if ( navigator.msPointerEnabled ) {
    CrossTouchEvent = {touchstart: 'MSPointerDown', touchmove: 'MSPointerMove', touchend: 'MSPointerUp', touchcancel: 'MSPointerCancel'};
}
//e.pointerType = (mouse==4, pen==3, touch==2)


var TRANSITION_NAME = 'transition:';

//Android2.* 버젼에서 크로스브라우징을 위해서 -webkit-transition 이외의 transition Style 속성을 같이 작성하면 동작하지 않는다.
if ( $B.ua.WEBKIT ) {
    TRANSITION_NAME = '-webkit-transition:';
} else if ( $B.ua.MSIE ) {
    if ( $B.ua.DOC_MODE_IE11_LT ) TRANSITION_NAME = '-ms-transition:';
} else if ( $B.ua.MOZILLA ) {
    TRANSITION_NAME = '-moz-transition:';
} else if ( $B.ua.OPERA ) {
    TRANSITION_NAME = '-o-transition:';
}