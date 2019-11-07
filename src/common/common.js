var PX_RATIO = window.devicePixelRatio || 1,
    MS_POINTER = true,
    TOUCH_ACTION = 'msTouchAction';

//EventType의 크로스부라우징 처리
var CrossTouchEvent = {};

//WindowsPhone IE 11에서는 touchstart event를 지원하지만 touchend 시점에 touche pointer가 있는데도 e.touches.length가 0으로 나오는 문제가 있다.
if ( 'ontouchstart' in window && !$B.ua.MSIE ) {
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


// ============================================================== //
// =====================	trace		========================= //
// ============================================================== //

ixBand.trace = (function () {
    var _logfiled, _btn;

    var trace = {
        init: function () {
            setLog( arguments );
            return this;
        }
    };

    function setLog ( array, add ) {
        var num = array.length, i, result = '';
        for ( i = 0; i < num; ++i ) {
            result += array[i] + ' ';
        }
        _logfiled.value = ( add )? add + '\n' + result : '\n' + result;
        if ( $B.ua.DOC_MODE_IE8_LT  && $B.ua.IE_VERSION == 7 ) _logfiled.createTextRange().scrollIntoView( false );
        _logfiled.scrollTop = _logfiled.scrollHeight;
    }

    function createLog () {
        var doc = document,
            body = doc.body;

        _logfiled = doc.createElement( 'textarea' );
        _logfiled.readOnly = true;

        var tfBoxH = $B.ua.IE7_LT ? '150px' : '20%',
            width = $B.ua.DOC_MODE_IE8_LT ? '97%' : '100%',
            bgColor = $B.ua.DOC_MODE_IE9_LT ? '#ffffe1' : 'rgba(255,255,225,0.95)';

        _logfiled.style.cssText = 'box-sizing:border-box; left: 0px; bottom: 0px; position: fixed; width: ' + width + '; height: ' + tfBoxH + '; z-index: 100000; font-face: dotum; font-size: 11px; background-color:' + bgColor + '; border:#000 solid 1px;';
        body.appendChild( _logfiled );

        //Header
        _btn = doc.createElement( 'input' );
        _btn.type = 'button';
        _btn.value = 'trace X';

        var btnX = $B.ua.IE7_LT ? '150px' : '20%';
        _btn.style.cssText = 'left: 0px; width: 100px; bottom: ' + btnX + '; position: fixed; z-index: 100000; background-color: #000; color:#fff;';
        body.appendChild( _btn );

        _btn.style.cursor = 'pointer';
        _btn.onclick = function (e) {
            _btn.onclick = null;
            _logfiled.value = '';
            body.removeChild( _logfiled );
            body.removeChild( _btn );
            _logfiled = null;
            _btn = null;
        };
    }

    return function () {
        if ( !_logfiled ) createLog();
        setLog( arguments, _logfiled.value );
        return trace;
    };
}());


// ============================================================== //
// =====================		log		========================= //
// ============================================================== //

ixBand.log = function () {
    if ( window.console ) console.log( Array.prototype.slice.call(arguments) );
};


// ===============	Private Methods =============== //

function warning ( msg, absolute ) {
    if ( absolute || __debugMode ) {
        if ( window.console && console.warn ) {
            console.warn( '[ixBand] ' + msg );
        } else if ( window.console && console.log ) {
            console.log( '[ixBand] ' + msg );
        }
    }
}

//extend (object, array)
function extend ( fromObj, toObj ) {
    for ( var key in toObj ) {
        fromObj[key] = toObj[key];
    }

    return fromObj;
}

//deep clone (object, array)
function deepClone ( value ) {
    var result;

    if ( $B.isObject(value) || $B.isArray(value) ) {
        result = ( $B.isArray(value) )? [] : {};

        for ( var key in value ) {
            result[key] = deepClone( value[key] );
        }
    } else {
        result = value;
    }

    return result;
}

// ============================================================== //
// =====================	etc 			===================== //
// ============================================================== //

extend( $B, {
    /**
     * ixBand()의 Method로 상속해 사용할 수 있도록 등록.
     * @param	{Object}	methods		상속할 methods
     */
    extend: function ( obj ) {
        var n;
        for ( n in obj ) {
            if ( _dom[n] ) {
                throw new Error( '[ixBand] Extend Error : ixBand에 "' + n + '" Method가 이미 존재합니다.' );
            } else {
                _dom[n] = obj[n];
            }
        }
    },
    /**
     * ixBand에서 발생하는 각종 에로 로그를 콘솔에 표시하고 싶으면 true를 설정
     * @param	{Boolean}	state
     */
    debugMode: function ( state ) {
        __debugMode = state;
    },

    /**
     * 호출될 때 그 this 키워드를 제공된 값으로 설정하고 새로운 함수가 호출될 때 제공되는 주어진 순서의 선행 인수가 있는 새로운 함수를 생성.
     * @return	{Function}
     */
    bind: function ( fnc, oThis ) {
        if ( Function.prototype.bind ) {
            ixBand.bind = function ( fnc, oThis ) {
                return fnc.bind( oThis );
            };
        } else {
            ixBand.bind = function( fnc, oThis ) {
                var fToBind = fnc,
                    fNOP    = function () {},
                    fBound  = function () {
                        return fToBind.apply( fnc instanceof fNOP ? fnc : oThis, Array.prototype.slice.call(arguments) );
                    };

                if ( fnc.prototype ) {
                    fNOP.prototype = fnc.prototype;
                }
                fBound.prototype = new fNOP();
                return fBound;
            };
        }

        return ixBand.bind( fnc, oThis );
    },

    /**
     * Data Type 반환 (Object, Array, String, Number, NaN, Null, Function, Date, Boolean, RegExp, Error, Element, Undefined, Color)
     * @param value
     * @returns {String}
     */
    type: function ( value ) {
        var result = Object.prototype.toString.call( value );
        result = result.match( /^\[\W*object\W+([a-zA-Z]+)\W*\]$/ );

        if ( result && result.length > 1 ) {
            result = result[1];
        }

        if ( result === 'String' ) {
            if ( $B.color.is(value) ) {
                result = 'Color';
            }
        } else if ( result === 'Number' ) {
            if ( isNaN(value) ) {
                result = 'NaN';
            }
        } else if ( result === 'Object' ) {
            if ( this.isUndefined(value) ) {
                result = 'Undefined';
            } else if ( this.isNull(value) ) {
                result = 'Null';
            } else if ( this.isElement(value) ) {
                result = 'Element';
            }
        } else {
            if ( this.isElement(value) ) {
                result = 'Element';
            }
        }

        return result;
    },

    //Array check
    isArray: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object Array]';
    },

    //Boolean check
    isBoolean: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object Boolean]';
    },

    //Color check
    isColor: function ( value ) {
        return $B.color.is( value );
    },

    //Date check
    isDate: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object Date]';
    },

    //Element, HTMLElement, NodeElement check
    isElement: function ( value ) {
        if ( this.isObject(value) ) {
            //$('.touch_area').get(0).constructor.toString()
            return !!( value && value.nodeType === 1 && value.nodeName );
        } else {
            return /HTML(?:.*)Element/.test( Object.prototype.toString.call(value) );
        }
    },

    //Empty check (Object, Array, Null, Undefined, String)
    isEmpty: function ( value ) {
        var result = false;

        switch ( this.type(value) ) {
            case 'Object':
                result = true;
                for ( var key in value ) {
                    result = false;
                    break;
                }
                break;
            case 'Array':
                result = value.length === 0;
                break;
            case 'Null':
                result = true;
                break;
            case 'Undefined':
                result = true;
                break;
            case 'String':
                result = '' === value;
                break;
        }

        return result;
    },

    //Error check
    isError: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object Error]';
    },

    //data 비교, Object, Array는 깊은 비교 (type까지 같아야 true)
    isEqual: function ( val1, val2 ) {
        var result = false, isSame = true, val1Length, val2Length;

        if ( this.isArray(val1) && this.isArray(val2) ) {
            val1Length = val1.length;
            val2Length = val2.length;

            if ( val1Length === val2Length && val1Length ) {
                for ( var i = 0; i < val1Length; ++i ) {
                    if ( !this.isEqual(val1[i], val2[i]) ) {
                        isSame = false;
                        break;
                    }
                }
                result = isSame;
            } else if ( !val1Length && !val2Length ) {
                result = true;
            } else {
				result = ( val1 === val2 );
			}
        } else if ( this.isObject(val1) && this.isObject(val2) ) {
            val1Length = $B.object.length( val1 );
            val2Length = $B.object.length( val2 );

            if ( val1Length === val2Length && val1Length ) {
                for ( var key in val1 ) {
                    if ( !this.isEqual(val1[key], val2[key]) ) {
                        isSame = false;
                        break;
                    }
                }
                result = isSame;
			} else if ( !val1Length && !val2Length ) {
				result = true;
			} else {
                result = ( val1 === val2 );
            }
        } else {
            result = ( val1 === val2 );
        }

        return result;
    },

    //유한수인지 체크
    isFinite: function ( value ) {
        return this.isNumber( value ) && isFinite( value );
    },

    //Function check
    isFunction: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object Function]';
    },

    //Not-A-Number(숫자가 아님)을 체크
    isNaN: function ( value ) {
        return this.isNumber( value ) && isNaN( value );
    },

    //null check
    isNull: function ( value ) {
        return null === value;
    },

    //숫자 체크 (숫자 NaN, Infinity)
    isNumber: function ( value ) {
        return typeof value === 'number';
    },

    //Object check
    isObject: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object Object]';
    },

    //RegExp check
    isRegExp: function ( value ) {
        return Object.prototype.toString.call( value ) === '[object RegExp]';
    },

    //String check
    isString: function ( value ) {
        return ( typeof value === 'string' );
    },

    //Undefined check
    isUndefined: function ( value ) {
        return undefined === value;
	},
	
	//정수 check
	isInteger: function (value) {
		return Number.isInteger ? Number.isInteger(value) : typeof value === 'number' && this.isFinite(value) && Math.floor(value) === value;
	}
});