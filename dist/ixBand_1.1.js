/**
 * ixBand - Javascript Library
 * @version v1.1.2 (1803231425)
 * The MIT License (MIT), http://ixband.com
 */
;(function () {
    'use strict';

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
    $B.VERSION = '1.1.2';
    
    
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


    // ############################################################################ //
    // ############################################################################ //
    // 								ua (userAgent)									//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.ua = (function () {
        var nua = navigator.userAgent.toLowerCase(),
            docMode = document.documentMode,
            isWindows = nua.indexOf('windows') > -1,
            isLinuxPlatform = ( '' + navigator.platform ).toLowerCase().indexOf( 'linux' ) > -1,
            //IE11부터는 appName이 Netscape로 나오기때문에 docMode도 체크
            isIE = navigator.appName == 'Microsoft Internet Explorer' || docMode > 10;
    
        /**
         * 브라우져, OS 체크
         * @type	{ua}
         */
        var ua = {
            IE_VERSION: 0,
            DOC_MODE: docMode || 0,
            MSIE: isIE,
            EDGE: nua.indexOf( 'edge' ) > -1,
            IE7_LT: false,//ie7미만 (~6)
            IE8_LT: false,//ie8미만 (~7)
            IE9_LT: false,//ie9미만 (~8)
            IE10_LT: false,//ie10미만 (~9)
            IE11_LT: false,//ie10미만 (~10)
            DOC_MODE_IE8_LT: false,//문서모드 8미만
            DOC_MODE_IE9_LT: false,//문서모드 9미만
            DOC_MODE_IE10_LT: false,//문서모드 10미만
            DOC_MODE_IE11_LT: false,//문서모드 11미만
            DOC_MODE_IE12_LT: false,//문서모드 12미만
            IE_COMPATIBLE: false,//호환성모드
            SAFARI: nua.indexOf( 'safari' ) > -1 && nua.indexOf( 'chrome' ) == -1 && !isLinuxPlatform && !isIE,
            FIREFOX: nua.indexOf( 'firefox' ) > -1 && !/compatible|webkit/.test( nua ),
            OPERA: /\b(opera|opr)/.test( nua ),
            OPERA_MINI: /\b(opera mini)/.test( nua ),//이슈가 너무 많아 구분만 한다.
            CHROME: nua.indexOf( 'chrome' ) > -1,
            MOBILE_IOS: /ipod|iphone|ipad/.test( nua ) && !isWindows && !isLinuxPlatform,
            IPHONE: nua.indexOf( 'iphone' ) > -1 && !isWindows && !isLinuxPlatform,
            IPAD: nua.indexOf( 'ipad' ) > -1 && !isWindows && !isLinuxPlatform,
            ANDROID: nua.indexOf( 'android' ) > -1 && !isWindows,
            MAC: nua.indexOf( 'mac' ) > -1 && !isWindows && !isLinuxPlatform,
            WINDOWS: isWindows,
            WINDOWS_PHONE: nua.indexOf( 'windows phone' ) > -1 && isWindows,
            LINUX: nua.indexOf( 'linux' ) > -1,
            WEBKIT: nua.indexOf( 'webkit' ) > -1,
            MOZILLA: nua.indexOf( 'mozilla' ) > -1,
            TOUCH_DEVICE: ( 'ontouchstart' in window ) || nua.indexOf( 'touch' ) > -1,
            MOBILE: nua.indexOf( 'mobile' ) > -1,
            ANDROID_TABLET: false,
            WINDOWS_TABLET: false,
            TABLET: false,
            SMART_PHONE: false,
            SAMSUNG: nua.indexOf( 'samsung' ) > -1,
            SAMSUNG_VERSION: 0,
            VERSION: 0,//브리우저 버전 (IE의 경우 8~는 DOC_MODE를 참조한다.)
            OS_VERSION: 0,
            WEBKIT_VERSION: 0,
            CHROME_VERSION: 0 //크롬엔진 버전
        };
    
        ua.CHROME = ua.CHROME && !ua.SAFARI && !ua.OPERA && !ua.EDGE;
        ua.MAC = ua.MOBILE_IOS? false : ua.MAC;
    
        if ( ua.MSIE ) {
            var re = new RegExp( 'msie ([0-9]{1,}[\.0-9]{0,})' );
            if ( re.exec(nua) ) {
                ua.IE_VERSION = parseFloat(RegExp.$1);
                if ( ua.IE_VERSION < 7 ) ua.IE7_LT = true;
                if ( ua.IE_VERSION < 8 ) ua.IE8_LT = true;
                if ( ua.IE_VERSION < 9 ) ua.IE9_LT = true;
                if ( ua.IE_VERSION < 10 ) ua.IE10_LT = true;
                if ( ua.IE_VERSION < 11 ) ua.IE11_LT = true;
            }
    
            if ( docMode ) {
                if ( docMode < 8 ) ua.DOC_MODE_IE8_LT = true;
                if ( docMode < 9 ) ua.DOC_MODE_IE9_LT = true;
                if ( docMode < 10 ) ua.DOC_MODE_IE10_LT = true;
                if ( docMode < 11 ) ua.DOC_MODE_IE11_LT = true;
                if ( docMode < 12 ) ua.DOC_MODE_IE12_LT = true;
            } else {
                ua.DOC_MODE_IE8_LT = true;
                ua.DOC_MODE_IE9_LT = true;
                ua.DOC_MODE_IE10_LT = true;
                ua.DOC_MODE_IE11_LT = true;
                ua.DOC_MODE_IE12_LT = true;
            }
    
            ua.IE_COMPATIBLE = /msie 7.*trident/.test(nua);
        }
    
        if ( ua.EDGE ) {
            ua.TOUCH_DEVICE = ( navigator.pointerEnabled || navigator.msPointerEnabled ) && navigator.maxTouchPoints > 0;
        }
    
        ua.ANDROID_TABLET = ua.ANDROID && !ua.MOBILE;
        ua.WINDOWS_TABLET = ua.WINDOWS && /tablet/.test(nua) && !ua.IE_COMPATIBLE;
        ua.TABLET = ua.IPAD || ua.ANDROID_TABLET || ua.WINDOWS_TABLET;
        ua.SMART_PHONE = ( ua.MOBILE && !ua.TABLET ) || ua.WINDOWS_PHONE;
    
        var osMatch = nua.match( /(mac os x|os|windows phone|windows nt|android)\s([0-9\._]+)/i );
        if ( osMatch && osMatch.length > 2 ) ua.OS_VERSION = String( osMatch[2] ).replace( '_', '.' );
    
        if ( ua.WEBKIT ) ua.WEBKIT_VERSION = getVersion( 'webkit' );
    
        if ( ua.MSIE ) {
            ua.VERSION = ua.DOC_MODE || ua.IE_VERSION;
        } else if ( ua.CHROME ) {
            ua.VERSION = getVersion( 'chrome' );
        } else if ( ua.FIREFOX ) {
            ua.VERSION = getVersion( 'firefox' );
        } else if ( ua.SAFARI ) {
            ua.VERSION = getVersion();
        } else if ( ua.OPERA ) {
            if ( ua.OPERA_MINI ) {
                ua.VERSION = getVersion( 'opera mini' );
            } else {
                ua.VERSION = getVersion( 'opr' ) || getVersion();
            }
        } else if ( ua.EDGE ) {
            ua.VERSION = getVersion( 'edge' );
        } else {
            ua.VERSION = getVersion();
        }
    
        if ( ua.SAMSUNG ) {
            ua.SAMSUNG_VERSION = getVersion( 'samsungbrowser' ) || getVersion();
        }
    
        if ( ua.SAMSUNG_VERSION ) ua.SAMSUNG_VERSION += '';
        if ( ua.VERSION ) ua.VERSION += '';
    
        ua.CHROME_VERSION = getVersion( 'chrome' );
    
        //ios firefox (FxiOS)
        if ( ua.MOBILE_IOS && /fxios/.test(nua) ) {
            ua.FIREFOX = true;
            ua.VERSION = getVersion( 'fxios' );
            ua.SAFARI = false;
        }
    
        //android opera mini
        if ( !ua.OPERA_MINI && ua.ANDROID && ua.OPERA && /wv\)/.test(nua) ) {
            ua.OPERA_MINI = true;
        }
    
        // 버전이 없으면 '0'을 반환
        function getVersion ( browserName ) {
            var matchs = nua.match( /version\/([\d.]*)/ );
    
            if ( browserName ) {
                var reg = new RegExp( browserName + '/([\\d.]*)' );
                matchs = nua.match( reg );
            }
    
            if ( matchs && matchs.length > 1 ) {
                return matchs[1];
            } else {
                return 0;
            }
        }
    
        return ua;
    }());


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
        }
    });


    // ===============	Public Methods =============== //
    
    var _dom = {
        ixband: true,
        target: null,
        length: 0,
        // ========================== < Object > ========================== //
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 내장함수 querySelector 일부 기능들을 구현, 단일객체 선택
         * 지원형식: .className, .className.className, #id, node.className, node.className.className, node#id, ">" 직계 하위객체,  Space 방계 하위객체 모두, 다중 객체선택 구분자 ","
         * (","를 사용하여 다중 selector를 입력하면 나중에 작성된 selector를 기준으로 단일 element를 검출한다.)<br>
         * <b>주의:</b><br>
         * <li>최신 querySelector를 지원하는 브라우저에서는 내장 함수를 활용해서 구현되었고, IE6~7에서는 별도로 작성한 로직으로 동작한다.</li>
         * <li>IE6~7에서는 id난 className으로 검출할때 nodeName을 넣지않으면 타겟 문서 전체를 검색하기때문에 퍼포먼스가 떨어진다. 되도록이면 타겟과 nodeName을 넣고 검색을 해야한다.</li>
         * <li>*:first-child와 같은 Filter형식의 Selector는 지원하지 않는다.</li>
         * @param	{String}	str
         * @return	{Element}
         */
        selector: function ( str ) {
            if ( document.querySelector ) {
                this.selector = function ( str ) {
                    var el = this.target? this.element() : document,
                        strAry = str.split( ',' );
                    return el.querySelector( strAry[strAry.length - 1] );
                };
            } else {
                this.selector = function ( str ) {
                    var el = this.target? this.element() : document,
                        strAry = str.split( ',' );//여러객체 선택자 분리
                    return $B.selector.one( el, strAry[strAry.length - 1] );
                };
            }
            return this.selector( str );
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 내장함수 querySelectorAll 일부 기능들을 구현
         * 지원형식: .className, .className.className, #id, node.className, node.className.className, node#id, ">" 직계 하위객체,  Space 방계 하위객체 모두, 다중 객체선택 구분자 ","<br>
         * <b>주의:</b><br>
         * <li>최신 querySelectorAll를 지원하는 브라우저에서는 내장 함수를 활용해서 구현되었고, IE6~7에서는 별도로 작성한 로직으로 동작한다.</li>
         * <li>IE6~7에서는 id난 className으로 검출할때 nodeName을 넣지않으면 타겟 문서 전체를 검색하기때문에 퍼포먼스가 떨어진다. 되도록이면 타겟과 nodeName을 넣고 검색을 해야한다.</li>
         * <li>여기서 ID는 유일값이 아니다, 동일한 ID를 가지는 객체 모두 검출된다.</li>
         * <li>*:first-child와 같은 Filter형식의 Selector는 지원하지 않는다.</li>
         * @param	{String}	str
         * @return	{Array}
         */
        selectorAll: function ( str ) {
            if ( document.querySelectorAll ) {
                this.selectorAll = function ( str ) {
                    var el = this.target? this.element() : document,
                        strAry = str.split( ',' ), num = strAry.length, result = [], i, els;
    
                    for ( i = 0; i < num; ++i ) {
                        els = el.querySelectorAll( strAry[i] );
                        result = result.concat( $B(els).toArray() );
                    }
                    return result;
                };
            } else {
                this.selectorAll = function ( str ) {
                    var el = this.target? this.element() : document,
                        strAry = str.split( ',' ), num = strAry.length, result = [], i, els;
    
                    for ( i = 0; i < num; ++i ) {
                        els = $B.selector.all( el, strAry[i] );
                        result = result.concat( els );
                    }
                    return result;
                };
            }
            return this.selectorAll( str );
        },
    
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element, jQuery)
         * 단일 Element 반환, 찾는 대상이 없으면 "ixError" 발생
         * @param   {Boolean}   silent  설정시 Error처리를 하지 않는다.
         * @return	{Element}
         */
        element: function ( silent ) {
            var target = this.target, el;
    
            if ( typeof target === 'string' ) {
                el = $B( document ).selector( target );
            } else {
                if ( target ) {
                    //jQuery Object
                    if ( typeof target.get === 'function' ) {
                        el = target.get(0);
                    } else {
                        el = target;
                    }
                }
            }
    
            if ( el ) {
                this.target = el;
            } else {
                //warning( '"' + target + '" 와 일치하는 대상이 없습니다.' );
                if ( !silent ) throw new Error( '[ixBand] "' + target + '" 와 일치하는 대상이 없습니다.' );
            }
            return el;
        },
    
        /**
         * 타겟타입:(Selector, Element)
         * target의 appendChild(child);
         * @param	{Node}		child
         * @param	{Int}		index	배치할 index 0~ (선택사항) 수치가 자식수보다 크거나 작으면 맨뒤나 맨앞에 알아서 넣어준다.
         */
        addChild: function ( child, index ) {
            var el = this.element();
            if ( typeof index === 'number' ) {
                var children = el.children,
                    childNum = children.length;
    
                if ( childNum > 0 && index < childNum ) {
                    el.insertBefore( child, children[index] );
                    return;
                }
            }
            el.appendChild( child );
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * target의 해당자식 노드 삭제
         * @param	{Selector, Element, Int}		child	node나 index:0~ 수치가 자식수보다 크거나 작으면 에러발생
         */
        removeChild: function ( child ) {
            var el = this.element();
    
            if ( typeof child === 'number' ) {
                var children = el.children,
                    childNum = children.length;
    
                if ( childNum > 0 && childNum > child  ) {
                    child = children[child];
                } else {
                    warning('.removeChild()에 지정한 수치가 자식수보다 크거나 작습니다!');
                    return;
                }
            } else {
                child = $B( child ).element( true );
            }
    
            el.removeChild( child );
        },
    
        /**
         * 대상 삭제
         */
        remove: function () {
            var el = this.element();
            if ( el && el.parentNode ) el.parentNode.removeChild( el );
        },
    
        /**
         * 대상을 교체
         * @param	{Selector, Element}   selector
         * @return  {Element}
         */
        replaceWith: function ( selector ) {
            var el = this.element(),
                node = $B( selector ).element( true );
    
            if ( el && el.parentNode ) el.parentNode.replaceChild( el, node );
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 노드 복사<br>
         * ie6~8에서 addEvent로 등록된 이벤트를 제거하고 복사하기 위해서 사용한다.
         * @param	{Boolean}	childCopy	자식요소까지 복사할지 설정, 기본 false
         * @return	{Element}
         */
        clone: function ( childCopy ) {
            if ( $B.ua.DOC_MODE_IE9_LT ) {
                this.clone = function ( childCopy ) {
                    var clone = this.element().cloneNode( childCopy );
                    //이벤트삭제
                    $B( clone ).removeAllEvent( childCopy, true );
                    return clone;
                };
            } else {
                this.clone = function ( childCopy ) {
                    return this.element().cloneNode( childCopy );
                };
            }
            return this.clone( childCopy );
        },
    
        /**
         * 타겟타입:(HTMLCollection)<br>
         * HTMLCollection을 배열로 바꿔서 반환한다.<br>
         * HTMLCollection을 자주 사용할때 배열로 반환하여 사용하는것이 속도향상에 도움이 된다.<br>
         * @return	{Array}
         */
        toArray: function () {
            //return Array.prototype.slice.call( this.target );
            var coll = this.target,
                num = coll.length,
                i, result = [];
    
            for ( i = 0; i < num; ++i ) {
                result[i] = coll[i];
            }
            return result;
        },
    
        /**
         * 타겟타입:(Selector, Element)
         * Element 속성을 설정하거나 반환한다.
         * @param	{String}	attr	IE6,7에서도 공통으로 'class'로 표기해서 사용할 수 있다.
         * @param	{String}	value
         */
        attr: function ( attr, value ) {
            var el = this.element();
            if ( attr == 'class' && $B.ua.DOC_MODE_IE8_LT ) attr = 'className';
    
            //setter
            if ( value || value == 0 ) {
                value = $B.string.trim( String(value) );
                el.setAttribute( attr, value );
                //getter
            } else {
                return el.getAttribute( attr );
            }
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * Element 속성 삭제<br>
         * @param	{String}	attribute	IE6,7에서도 공통으로 'class'로 표기해서 사용할 수 있다.
         */
        removeAttr: function ( attr ) {
            var el = this.element();
            if ( attr == 'class' && $B.ua.DOC_MODE_IE8_LT ) attr = 'className';
            el.removeAttribute( attr );
        },
    
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * target의 자식노드들;
         * @return	{Array}
         */
        children: function ( selector ) {
            var el = this.element(),
                children = el.children;
    
            if ( typeof selector === 'string' ) {
                var elNum = children.length, result = [], i;
    
                for ( i = 0; i < elNum; ++i ) {
                    var child = children[i],
                        match = $B.selector.match( child, selector );
    
                    if ( match ) result.push( child );
                }
                return result;
            } else {
                //this.element().childNodes;
                return $B( children ).toArray();
            }
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 대상노드의 다음 노드를 반환 (대상노드와 같은 레벨), 빈 TextNode나 CommentNode는 무시.
         * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
         * @return	{Element}
         */
        next: function ( selector ) {
            var node = this.element().nextSibling;
            if ( !node ) return;
    
            //comment, text
            if ( node.nodeType == 8 || node.nodeType == 3 && !$B.string.trim(node.data) ) {
                return $B( node ).next( selector );
            } else {
                if ( typeof selector === 'string' ) node = $B.selector.match( node, selector )? node : undefined;
                return node;
            }
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 대상노드의 이전 노드를 반환 (대상노드와 같은 레벨), 빈 TextNode나 CommentNode는 무시.
         * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
         * @return	{Element}
         */
        prev: function ( selector ) {
            var node = this.element().previousSibling;
            if ( !node ) return;
    
            //comment, text
            if ( node.nodeType == 8 || node.nodeType == 3 && !$B.string.trim(node.data) ) {
                return $B( node ).prev( selector );
            } else {
                if ( typeof selector === 'string' ) node = $B.selector.match( node, selector )? node : undefined;
                return node;
            }
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 해당 Selector조건과 일치하는 대상객체의 가장 가까운 조상 개체 반환.
         * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
         * @return	{Element}
         */
        closest: function ( selector ) {
            var el = this.element();
            return $B.selector.closest( el, selector );
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 대상개체의 부모 노드를 반환.
         * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
         * @return	{Element}
         */
        parent: function ( selector ) {
            var el = this.element();
            return $B.selector.parent( el, selector );
        },
    
        /**
         * 타겟타입:(Selector, Element)<br>
         * 대상객체가 해당 selector조건과 일치하면 true반환.
         * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다.
         * @return	{Boolean}
         */
        match: function ( selector ) {
            var el = this.element();
            return $B.selector.match( el, selector );
        },
    
        /**
         * 타겟타입:(Selector, Array, jQuery)<br>
         * 대상객체들의 갯수만큼 callback 반복 호출 후 결과 반환, 반복문보다 느리다.
         * @param	{Function}	callback	function callback(el:Element, index:Int, array:Array):void
         * @return	{Boolean}	return된 값들의 배열
         */
        each: function ( callback ) {
            if ( typeof callback !== 'function' ) return;
    
            var target = this.target,
                els, elNum, i, result = [];
    
            if ( typeof target.get === 'function' ) {
                els = target.get();
            } else if ( $B.array.is(target) ) {
                els = target.concat( [] );
            } else if ( typeof target === 'string' ) {
                els = $B.selector.all( document, target );
            } else {
                els = [target];
            }
    
            elNum = els.length;
    
            for ( i = 0; i < elNum; ++i ) {
                var el = els[i], data;
                //this.target = el;
                data = callback.call( el, el, i, els );
    
                if ( data ) result.push( data );
            }
    
            return result;
        },
    
    
        // ========================== < Style > ========================== //
    
        /**
         * 타겟타입:(Selector, Element), 대상노드의 className 추가<br>
         * 여러개의 className을 추가할 수 있다. 예) addClass( 'a', 'b' );
         * 해당 classNam이 이미 설정되어 있으면 다시 설정하지 않는다.
         * @param	{String...}	className
         */
        addClass: function () {
            var el = this.element(),
                cName = $B( el ).attr( 'class' ),
                args = arguments;
    
            if ( cName ) {
                var argNum = args.length, selector = '', i;
    
                for ( i = 0; i < argNum; ++i ) {
                    var arg = args[i];
                    if ( !$B.string.isWholeWord( cName, arg ) ) selector += ( ' ' + arg );
                }
    
                $B( el ).attr( 'class', cName + selector );
            } else {
                $B( el ).attr( 'class', Array.prototype.slice.call(args).join(' ') );
            }
        },
    
        /**
         * 타겟타입:(Selector, Element), 대상노드의 해당 className 삭제<br>
         * 해당 classNam이 없으면 삭제하지 않는다.
         * @param	{String...}	className
         */
        removeClass: function () {
            var el = this.element(),
                cName = $B( el ).attr( 'class' );
    
            if ( cName ) {
                var args = arguments,
                    argNum = args.length, i;
    
                for ( i = 0; i < argNum; ++i ) {
                    cName = cName.replace( args[i], '' );
                }
    
                $B( el ).attr( 'class', cName );
            }
        },
    
        /**
         * 타겟타입:(Selector, Element), 대상노드의 해당 className의 존재여부 반환<br>
         * 여러개의 className을 비교할 수 있다. 예) hasClass( 'a', 'b' ); 이럴경우 두개의 className이 모두 일치해야 true를 반환.
         * @param	{String... || Array}	className	여러개의 className을 비교할 수 있다.
         * @return	{Boolean}	해당 className이 존재하면 true반환
         */
        hasClass: function ( className ) {
            var el = this.element(),
                cName = $B( el ).attr( 'class' ),
                find = $B.array.is(className)? className : Array.prototype.slice.call(arguments);
    
            return cName? $B.string.isWholeWord( cName, find ) : false;
        },
    
        /**
         * 타겟타입:(Selector, Element)
         * Inline Style설정, ComputedStyle을 반환
         * @param	{String}	propStr		"width:100px; z-index:2" 표기법, 입력하지 않으면 all (property를 입력하여 값을 구하는것이 정확하다)
         * @return	{String}
         */
        css: function ( propStr ) {
            if ( window.getComputedStyle ) {
                this.css = function ( propStr ) {
                    var el = this.element();
    
                    //setter
                    if ( propStr && propStr.indexOf(':') > -1 ) {
                        $B.style.inline( el, propStr );
                        //getter
                    } else {
                        return $B.style.current( el, propStr );
                    }
                };
    
                //IE6~8
            } else if ( document.documentElement.currentStyle ) {
                this.css = function ( propStr ) {
                    var el = this.element();
    
                    //setter
                    if ( propStr && propStr.indexOf(':') > -1 ) {
                        //opacity
                        if ( propStr.indexOf('opacity') > -1 ) {
                            $B.style.opacity( el, $B.style.parse( propStr ).opacity.value );
                        } else {
                            $B.style.inline( el, propStr );
                        }
    
                        //getter
                    } else {
                        return ( propStr && propStr.indexOf('opacity') > -1 )? $B.style.opacity( el ) : $B.style.computed( el, propStr );
                    }
                };
            }
    
            return this.css( propStr );
        },
    
        /**
         * 타겟타입:(Style, cssRule.style등등..)
         * Style Property를 설정하거나 반환.
         * @param	{String}	property	'z-index'표기방법
         * @return	{Property Value}
         */
        prop: function ( property, value ) {
            var el = this.element();
            //setter
            if ( value || value == 0 ) {
                el.setProperty( property, String(value), null );
                //getter
            } else {
                return el.getPropertyValue( property );
            }
        },
    
        /**
         * 타겟타입:(Style, cssRule.style등등..)<br>
         * Style Property 삭제
         * @param	{String}	property	'z-index'표기방법
         */
        removeProp: function ( property ) {
            this.element().removeProperty( property );
        },
    
        // ========================== < Measure > ========================== //
        /**
         * <b>읽기전용</b><br>
         * 타겟타입:(Element, ID)<br>
         * 대상의 Rectangle 반환, padding과 border포함된 수치<br>
         * @param	{Boolean}	relative	기본값false, false면 document 기준, true면 vieport 기준으로 계산
         * @return	{Object}	left, top, width, height
         */
        rect: function ( relative ) {
            var el = this.element(),
                result = {},
                rect = el.getBoundingClientRect();
    
            if ( relative ) {
                result.left = rect.left;
                result.top = rect.top;
    
                var docEl = document.documentElement;
                var vWidth = docEl.clientWidth,
                    vHeight = docEl.clientHeight,
                    elWidth = ( rect.left < 0 )? rect.right : rect.right - rect.left,
                    elHeight = ( rect.top < 0 )? rect.bottom : rect.bottom - rect.top;
    
                result.width = ( rect.right > vWidth )? elWidth - (rect.right - vWidth) : elWidth;
                result.height = ( rect.bottom > vHeight )? elHeight - (rect.bottom - vHeight) : elHeight;
            } else {
                result.left = rect.left + $B(window).scrollLeft();
                result.top = rect.top + $B(window).scrollTop();
                result.width = rect.right - rect.left;
                result.height = rect.bottom - rect.top;
            }
            return result;
        },
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element)
         * Border, 스크롤바가 제외되고 Padding이 포함된 가로사이즈 반환, window, document, screen지원
         * @return	{Number}
         */
        width: function () {
            var el = this.element();
    
            if ( el === document ) {
                return $B.measure.documentWidth();
            } else if ( el === window ) {
                return $B.measure.windowWidth();
            } else if ( el === screen ) {
                return screen.width;// (작업표시줄 포함)
            } else {
                return el.clientWidth;
            }
        },
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element)
         * Border, 스크롤바가 제외되고 Padding이 포함된 세로사이즈 반환, window, document, screen지원
         * @return	{Number}
         */
        height: function () {
            var el = this.element();
    
            if ( el === document ) {
                return $B.measure.documentHeight();
            } else if ( el === window ) {
                return $B.measure.windowHeight();
            } else if ( el === screen ) {
                return screen.height;// (작업표시줄 포함)
            } else {
                return el.clientHeight;
            }
        },
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element)
         * Border, 스크롤바, Padding이 제외된 가로사이즈 반환, screen 지원
         * @return	{Number}
         */
        innerWidth: function () {
            var el = this.element();
            if ( el === document || el === window ) {
                return $B.measure.windowWidth();
            } else if ( el === screen ) {
                return screen.availWidth;
            } else {
                var pl, pr, value = this.width();
    
                pl = parseFloat( this.css('padding-left') );
                pr = parseFloat( this.css('padding-right') );
                return value - (( pl > 0 ? pl : 0 ) + ( pr > 0 ? pr : 0 ));
            }
        },
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element)
         * Border, 스크롤바, Padding이 제외된 세로사이즈 반환, screen 지원
         * @return	{Number}
         */
        innerHeight: function () {
            var el = this.element();
            if ( el === document || el === window ) {
                return $B.measure.windowHeight();
            } else if ( el === screen ) {
                return screen.availHeight;
            } else {
                var pt, pb, value = this.height();
    
                pt = parseFloat( this.css('padding-top') );
                pb = parseFloat( this.css('padding-bottom') );
                return value - (( pt > 0 ? pt : 0 ) + ( pb > 0 ? pb : 0 ));
            }
        },
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element)
         * Padding, Border, 스크롤바가 포함된 가로사이즈 반환
         * @param   {Boolean}   includeMargin   margin 포함여부
         * @return	{Number}
         */
        outerWidth: function ( includeMargin ) {
            var el = this.element(),
                margin = 0;
    
            if ( el === window ) {
                if ( window.outerWidth ) {
                    return window.outerWidth;
                } else {
                    return $B.measure.windowWidth();
                }
            } else if ( el === document ) {
                return $B.measure.documentWidth();
            } else if ( el === screen ) {
                return screen.width;
            } else {
                if ( includeMargin === true ) {
                    var marginL = parseFloat( $B(el).css('margin-left') ),
                        marginR = parseFloat( $B(el).css('margin-right') );
    
                    if ( marginL ) margin += marginL;
                    if ( marginR ) margin += marginR;
                }
    
                return el.offsetWidth + margin;
            }
        },
        /**
         * <b>읽기전용</b>
         * 타겟타입:(Selector, Element)
         * Padding, Border, 스크롤바 포함된 세로사이즈 반환
         * @param   {Boolean}   includeMargin   margin 포함여부
         * @return	{Number}
         */
        outerHeight: function ( includeMargin ) {
            var el = this.element(),
                margin = 0;
    
            if ( el === window ) {
                if ( window.outerHeight ) {
                    return window.outerHeight;
                } else {
                    return $B.measure.windowHeight();
                }
            } else if ( el === document ) {
                return $B.measure.documentHeight();
            } else if ( el === screen ) {
                return screen.height;
            } else {
                if ( includeMargin === true ) {
                    var marginT = parseFloat( $B( el ).css( 'margin-top' ) ),
                        marginB = parseFloat( $B( el ).css( 'margin-bottom' ) );
    
                    if ( marginT ) margin += marginT;
                    if ( marginB ) margin += marginB;
                }
    
                return el.offsetHeight + margin;
            }
        },
        /**
         * <b>읽기전용</b><br>
         * 타겟타입:(Selector, Element), iframe<br>
         * iframe에 컨텐츠가 로드된후 컨텐츠 가로사이즈 반환<br>
         * <b>주의사항:</b>같은 도메인에서만 동작한다. 도메인이 다르면 0 반환
         * @return	{int}
         */
        contentWidth: function () {
            try {
                return this.element().contentWindow.document.documentElement.scrollWidth;
            } catch (e) {
                return 0;
            }
        },
    
        /**
         * <b>읽기전용</b><br>
         * 타겟타입:(Selector, Element), iframe<br>
         * iframe에 컨텐츠가 로드된후 컨텐츠 세로사이즈 반환<br>
         * <b>주의사항:</b>같은 도메인에서만 동작한다. 도메인이 다르면 0 반환
         * @return	{int}
         */
        contentHeight: function () {
            try {
                return this.element().contentWindow.document.documentElement.scrollHeight;
            } catch (e) {
                return 0;
            }
        },
    
        /**
         * 타겟타입:(Selector, Element)
         * 대상의 스크롤된 X좌표 설정하거나 반환, window 지원
         * @param	{Number}	value
         * @return	{Number}
         */
        scrollLeft: function ( value ) {
            //ie9, 크롬, 사파리, 파폭
            if ( typeof window.pageXOffset === 'number' ) {
                this.scrollLeft = function ( value ) {
                    var el = this.element();
    
                    if ( el === window || el === document ) {
                        //setter
                        if ( typeof value === 'number' ) {
                            window.scrollTo( value, window.pageYOffset );
                            //getter
                        } else {
                            return window.pageXOffset;
                        }
                    } else {
                        //setter
                        if ( typeof value === 'number' ) {
                            el.scrollLeft = value;
                            //getter
                        } else {
                            return el.scrollLeft;
                        }
                    }
                };
            } else {
                this.scrollLeft = function ( value ) {
                    var el = this.element();
    
                    if ( el === window || el === document ) el = document.documentElement;
                    //setter
                    if ( typeof value === 'number' ) {
                        el.scrollLeft = value;
                        //getter
                    } else {
                        return el.scrollLeft;
                    }
                };
            }
            return this.scrollLeft( value );
        },
        /**
         * 타겟타입:(Selector, Element)
         * 대상의 스크롤된 Y좌표 설정하거나 반환, window 지원
         * @param	{Number}	value
         * @return	{Number}
         */
        scrollTop: function ( value ) {
            //ie9, 크롬, 사파리, 파폭
            if ( typeof window.pageYOffset === 'number' ) {
                this.scrollTop = function ( value ) {
                    var el = this.element();
    
                    if ( el === window || el === document ) {
                        //setter
                        if ( typeof value === 'number' ) {
                            window.scrollTo( window.pageXOffset, value );
                            //getter
                        } else {
                            return window.pageYOffset;
                        }
                    } else {
                        //setter
                        if ( typeof value === 'number' ) {
                            el.scrollTop = value;
                            //getter
                        } else {
                            return el.scrollTop;
                        }
                    }
                };
            } else {
                this.scrollTop = function ( value ) {
                    var el = this.element();
    
                    if ( el === window || el === document ) el = document.documentElement;
                    //setter
                    if ( typeof value === 'number' ) {
                        el.scrollTop = value;
                        //getter
                    } else {
                        return el.scrollTop;
                    }
                };
            }
            return this.scrollTop( value );
        },
    
    
        // ========================== < Utilis > ========================== //
    
        /**
         * 타겟타입:(Element, Selector)<br>
         * SWF 삽입<br>
         * onReady 이벤트를 발생시키기 위해서는 flash에서 ExternalInterface.call( _onSwfEvent, { type: 'ready', id: _myID, value: 'test_value'} ); 형식으로 호출해줘야 한다.<br>
         * 타겟을 주지않으면 화면에 addChild를 할수없기때문에 ExternalInterface로 연결할수 없고, 때문에 onReady를 받을수 없다.<br>
         * Event Properties : id, target, value
         * @param	{String}	path		SWF경로
         * @param	{String}	width		가로폭
         * @param	{String}	height		세로폭
         * @param	{Object}	params		SWF에 넘길 params
         * @param	{Object}	dispatch	dispatch.onReady이벤트 전달, {type, id, target, value}
         * @param	{Object}	attributes	id, wmode, version 설정, 기본값 {id: '없으면 자동생성', wmode: 'opaque', version: '10,0,0,0', info: 'Adobe Flash Player를 설치해야 이용가능한 콘텐츠 입니다.'}
         * @return	{HTMLObjectElement}	SWF Object 노드
         */
        insertSWF: function ( path, width, height, params, dispatch, attributes ) {
            var el = ( this.target )? this.element() : null,
                wmode = ( attributes && attributes.wmode )? attributes.wmode : 'opaque',
                version = ( attributes && attributes.version )? attributes.version : '10,0,0,0',
                info = ( attributes && attributes.info )? attributes.info : 'Adobe Flash Player ' + version + ' 이상을 설치해야 이용가능한 콘텐츠 입니다.',
                id = ( attributes && attributes.id )? attributes.id : 'SWF_ID_' + __swfCount,
                htmlText = '',
                div = document.createElement( 'div' ),
                obj = null;
    
            if ( $B.ua.MSIE ) {
                htmlText += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + version + '" width="' + width + '" height="' + height + '"  id="' + id + '">';
                htmlText += '<param name="movie" value="' + path + '" />';
            } else {
                htmlText += '<object type="application/x-shockwave-flash" data="' + path + '" width="' + width + '" height="' + height + '" id="' + id + '" name="' + id + '">';
            }
    
            var n, valueStr = '';
            if ( params ) {
                for ( n in params ) {
                    valueStr += ('&' + n + '=' + encodeURIComponent( params[n] ));
                }
            }
    
            htmlText += '<param name="wmode" value="' + wmode + '" />';
            htmlText += '<param name="allowScriptAccess" value="always" />';
            htmlText += '<param name="FlashVars" value="id=' + id + '&width=' + encodeURIComponent( width ) + '&height=' + encodeURIComponent( height ) + '&onSwfEvent=ixBand._private.SWFManager.onSwfEvent' + valueStr + '" />';
            htmlText += '<p>' + info + '</p>';
    
            div.innerHTML = htmlText;
            obj = div.children[0];
            if ( el ) el.appendChild( obj );
            div = null;
    
            //dispatch 등록
            var data = { onReady: ( dispatch && dispatch.onReady )? dispatch.onReady : null, target: obj };
            $B._private.SWFManager.addSWFData( id, data );
    
            __swfCount++;
    
            return obj;
        },
    
        /**
         * 대상개체의 Text를 설정하거나 반환.
         * @param	{String}	str		설정할 문자열
         * @return	{String}
         */
        text: function ( str ) {
            if ( $B.ua.DOC_MODE_IE9_LT ) {
                this.text = function ( str ) {
                    var el = this.element();
    
                    //setter
                    if ( str || str == 0) {
                        el.innerText = String(str);
                        //getter
                    } else {
                        var getStr = el.innerText;
                        return getStr.replace( /[\n\r]+/g, '' );
                    }
                };
            } else {
                this.text = function ( str ) {
                    var el = this.element();
    
                    //setter
                    if ( str || str == 0) {
                        el.textContent = String(str);
                        //getter
                    } else {
                        return el.textContent;
                    }
                };
            }
            return this.text( str );
        },
    
        /**
         * 대상개체의 Html를 설정하거나 반환.
         * @param	{String}	html		설정할 Html문자열
         * @return	{String}	Html문자열
         */
        html: function ( html ) {
            var el = this.element();
    
            //setter
            if ( html || html == 0 ) {
                el.innerHTML = String(html);
                //getter
            } else {
                return el.innerHTML;
            }
        },
    
        /**
         * 대상개체의 CSS3 transition을 적용한다.
         * $B(selector).transition( 'none' ); transition을 중지하고 리셋 되어진다.
         * $B(selector).transition( 'left:200px', 'none' ); 스타일은 적용이 되고, transition은 중지 된다.
         * IE와 iOS에서는 해당노드가 화면에서 사라지면(display:none;) transition을 pause시키고 transitionend 이벤트도 보류된다.
         * @param	{String}	tStyle		taransition style, ex) left:220px
         * @param	{String}	tValue		taransition value, ex) left 0.6s ease
         * @param	{Object} 	dispatch	transition 이벤트, ex) {onTransitonEnd: handler}, (Event Properties : type, target, data)
         * @param	{*} 		data		transitionend 이벤트 핸들러에서 전달받을 data, ex) e.data
         */
        transition: function ( tStyle, tValue, dispatch, data ) {
            var _el = this.element(),
                _css = TRANSITION_NAME + ( tStyle == 'none'? 'none' : tValue ) + ';',
                _onTransitionEnd = ( dispatch && dispatch.onTransitionEnd )? dispatch.onTransitionEnd : null;
    
            //Transition
            if ( _onTransitionEnd ) {
                this.removeEvent( 'transitionend' );
                this.addEvent( 'transitionend', function (e) {
                    $B( this ).removeEvent( 'transitionend' );
    
                    //이벤트 전달
                    _onTransitionEnd.call( this, {type: 'transitionend', target: this, data: data} );
                });
            }
    
            $B.style.inline( _el, tStyle == 'none'? _css : tStyle + '; ' + _css );
        },
    
        // ========================== < Event > ========================== //
        /**
         * 타겟타입:(Element, ID)<br>
         * 이벤트 추가, style, script같은 특정 노드에서는 사용할수 없다.<br>
         * Event Properties : type, target, currentTarget, relatedTarget, eventPhase, clientX, clientY, screenX, screenY, shiftKey, charCode, delta:마우스휠이벤트에서 발생, stopPropagation(), preventDefault()<br>
         * offsetX는 크로스브라우저 지원이 안되기 때문에 구현하지 않았다<br>
         * @param	{String}	type			"on"빼고, "click"
         * @param	{Function}	handler			Event Handler
         * @param	{*}			data			Event Handler 에서 전달받을 데이타
         */
        addEvent: function ( type, handler, data ) {
            var el = this.element();
            $B.event.add( el, type, handler, data );
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 이벤트 삭제
         * @param	{String}	type	"on"빼고, "click"
         * @param	{Function}	handler		Event Handler
         */
        removeEvent: function ( type, handler ) {
            var el = this.element();
    
            if ( typeof type === 'string' ) {
                if ( typeof handler === 'function' ) {
                    $B.event.remove( el, type, handler );
                } else {
                    $B.event.removeTypeAll( el, type );
                }
            } else {
                $B.event.removeAll( [el] );
            }
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 대상의 모든 이벤트 삭제, removeEvent()와 다른점은 자식요소의 이벤트도 삭제할 수 있다.
         * @param	{Boolean}	childRemove	자식의 이벤트를 삭제할지 설정
         * @param	{Boolean}	clone		cloneNode()로 복사된 대상인지 설정
         */
        removeAllEvent: function ( childRemove, clone ) {
            //clone: clone된 대상인지.
            var el = this.element();
            $B.event.removeAll( [el], childRemove, clone );
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 이벤트 실행
         * @param	{String}	type	"on"빼고, "click"
         * @param	{*}			data	Event Handler 에서 전달받을 데이타
         */
        trigger: function ( type, data ) {
            var el = this.element();
    
            if ( typeof type === 'string' ) {
                $B.event.trigger( el, type, data );
            }
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 등록된 이벤트가 있는지 확인
         * @param	{String}	type	"on"빼고, "click"
         * @param	{Function}	handler		Event Handler
         * @return	{Boolean}
         */
        hasEvent: function ( type, handler ) {
            var el = this.element(),
                idx = $B.event.find( el, type, handler );
            return ( idx == -1 )? false : true;
        },
    
        /**
         * 타겟타입:(String) Event Type, on은 빼고 넣는다. 'onclick' - 'click'<br>
         * 해당이벤트를 지원하면 true를 반환.
         * @return	{Boolean}
         */
        hasEventType: function () {
            return ('on' + this.target in window);
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 마우스 커서를 pointer로 설정, 해지 한다.
         * @param	{Boolean}	state
         */
        buttonMode: function ( state ) {
            this.css( 'cursor:' + (state? 'pointer' : 'auto') );
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 객체 드래그 구현시 ondragstart의 동작을 막아, 드래그 구현시 방해되지 않게 하기 위해서 설정<br>
         * (false를 설정해야 제대로 드래그를 구현할수 있다.)
         * @param	{Boolean}	state	기본설정 true
         */
        dragEnable: function ( state ) {
            this.element().ondragstart = (state)? null : function (e) { return false; };
        },
    
        /**
         * 타겟타입:(Element, ID)<br>
         * 객체를 드래그 했을시 선택되는 설정<br>
         * FF는 타겟의 onmousemove, 기타 브라우저는 타겟의 onselectstart를 막아 구현하였다.
         * @param	{Boolean}	state	기본설정 true
         */
        selectEnable: function ( state ) {
            if ( typeof document.documentElement.onselectstart === 'undefined' ) {
                //FF
                this.selectEnable = function ( state ) {
                    //this.element().style.MozUserSelect = (state)? 'text' : 'none';
                    this.element().onmousedown = (state)? null : function (e) { return false; };
                };
            } else {
                this.selectEnable = function ( state ) {
                    this.element().onselectstart = (state)? null : function (e) { return false; };
                };
            }
            this.selectEnable( state );
        }
    };
    
    
    // ############################################################################ //
    // ############################################################################ //
    // 						_private : ixBand Private Class							//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand._private = {};
    
    
    // ============================================================== //
    // =====================	SWFManager	========================= //
    // ============================================================== //
    /**
     * <b>Static Class : </b>SWF Data 관리<br>
     * SWF에서 onReady를 dispatch할때 onSwfEvent를 호출한다.
     */
    ixBand._private.SWFManager = (function () {
        var _swfs = {};
    
        return {
            // ---------- Private Methods ---------- //
            //swf 데이타 등록
            addSWFData: function ( id, data ) {
                _swfs[id] = data;
            },
    
            //swf 데이타 삭제
            removeSWFData: function ( id ) {
                delete _swfs[id];
            },
    
            //swf에서 전달받은 event (메세지를 받는통로로 수정해보기...)
            onSwfEvent: function ( e ) {
                if ( e.type != 'ready' ) return;
                var data = _swfs[e.id];
                if ( data && data.onReady ) {
                    var value = ( e.value || e.value == 0 )? e.value : null;
                    data.onReady.call( this, {type: e.type, id: e.id, target: data.target, value: value} );
                    delete _swfs[e.id];
                }
            }
        };
    }());


    // ############################################################################ //
    // ############################################################################ //
    // 									selector									//
    // ############################################################################ //
    // ############################################################################ //
    
    /**
     * 내장함수 querySelectorAll 과 querySelector 일부 기능들을 구현
     * nodeName, .className, .className.className, #id, nodeName.className, nodeName.className.className, nodeName#id
     * [attr] 해당속성이 있을때, [attr=value] 값이 같을때, [attr^=value] 시작값이 같을때, [attr$=value] 끝값이 같을때, [attr*=value] 일부문자가 같을때, [attr~=value] 완전체단어일치, 띄워쓰기 가능
     * :first 같은 Filter형식 지원하지 않는다.
     */
    ixBand.selector = {
        //단일검색, parent는 반드시 입력해야 한다. 없으면 document라도 입력.
        one: function ( parent, selector ) {
            var selectList = this.selectorList( selector ),
                selNum = selectList.length,
                finishObj = this.parse( selectList[0].selector ),
                matchEl;
    
            //조건이 ID만 있을때
            if ( selNum == 1 && finishObj.length == 1 && finishObj.id ) {
                return document.getElementById( finishObj.id.replace('#', '') );
                //조건 검색
            } else {
                //모든태그 검색
                var allTag = parent.getElementsByTagName( finishObj.node || '*' ),
                    i, tagNum = allTag.length;
    
                for ( i = 0; i < tagNum; ++i ) {
                    var tag = allTag[i];
                    //첫번째 조건 검사
                    if ( this.match( tag, finishObj ) ) {
                        if ( selNum > 1 ) {
                            if ( this.depthMatch( parent, tag, selectList, 0 ) ) {
                                matchEl = tag;
                                break;
                            }
                        } else {
                            matchEl = tag;
                            break;
                        }
                    }
                }
            }
            return matchEl;
        },
    
        //조건에 부합하는 모든 개체 반환. parent는 반드시 입력해야 한다. 없으면 document라도 입력.
        all: function ( parent, selector ) {
            var selectList = this.selectorList( selector ),
                selNum = selectList.length,
                finishObj = this.parse( selectList[0].selector ),
                allTag = parent.getElementsByTagName( finishObj.node || '*' ),
                i, tagNum = allTag.length, matchEls = [];
    
            for ( i = 0; i < tagNum; ++i ) {
                var tag = allTag[i];
    
                //첫번째 조건 검사
                if ( this.match(tag, finishObj) ) {
                    if ( selNum > 1 ) {
                        if ( this.depthMatch(parent, tag, selectList, 0) ) matchEls.push( tag );
                    } else {
                        matchEls.push( tag );
                    }
                }
            }
            return matchEls;
        },
    
        /**
         * 해당 Selector조건과 일치하는 대상객체의 가장 가까운 조상 개체 반환.
         * @param	{Element}	el			대상개체
         * @param	{String}	selector	"> or Space" 직계, 방계 검색은 지원하지 않는다.
         * @param	{Element}	rootEl		검색할 최상위 개체
         * @return	{Element}	검색하는 대상이 없으면 undefined 반환.
         */
        closest: function ( el, selector, rootEl ) {
            var root = rootEl || document,
                parent = el.parentNode;
    
            if ( parent && parent != root ) {
                var match = this.match( parent, selector );
                return match? parent : this.closest( parent, selector );
            } else {
                return;
            }
        },
    
        /**
         * 해당 Selector조건과 일치하는 대상객체의 부모 개체 반환.
         * @param	{Element}	el			대상개체
         * @param	{String}	selector	"> or Space" 직계, 방계 검색은 지원하지 않는다.
         * @param	{Element}	rootEl		검색할 최상위 개체
         * @return	{Element}	검색하는 대상이 없으면 undefined 반환.
         */
        parent: function ( el, selector, rootEl ) {
            var root = rootEl || document,
                parent = el.parentNode;
    
            if ( selector ) {
                if ( parent && parent != root ) {
                    return this.match( parent, selector )? parent : undefined;
                } else {
                    return undefined;
                }
            } else {
                return parent;
            }
        },
    
        /**
         * 대상객체가 해당 selector조건과 일치하면 true반환.
         * @param	{Element}			el			대상개체
         * @param	{String || Object}	selector
         * @return	{Boolean}
         */
        match: function ( el, selector ) {
            //el = $B( el ).element();
            //이미 파싱된 Object면 다시 파싱하지 않는다.
            var matchList = (typeof selector === 'string')? this.parse( selector ) : selector,
                result = false, n;
    
            for ( n in matchList ) {
                switch ( n ) {
                    case 'node':
                        var node = el.nodeName;
    
                        if ( node ) {
                            node = node.toLowerCase();
                            result = ( node == matchList[n] );
                        } else {
                            result = false;
                        }
                        break;
                    case 'id':
                        result = ( $B(el).attr('id') == matchList[n] );
                        break;
                    case 'className':
                        result = $B( el ).hasClass( matchList[n] );
                        break;
                    case 'attr':
                        result = this.matchAttr( el, matchList[n] );
                        break;
                }
                //하나라도 false가 나오면 더이상 체크하지 않는다.
                if ( !result ) return result;
            }
    
            return result;
        },
    
        // ====================	Private Methods	==================== //
        //대상조건에 부합되는 개체가 있는지 직계, 방계 검색 하여 일치하는 값이 있으면 true반환.
        depthMatch: function ( root, el, selectList, idx ) {
            var currentSel = selectList[idx],//맨아래 조건
                nextIdx = idx + 1,
                nextSel = selectList[nextIdx],
                matchEl;
    
            if ( currentSel.type == 'parent' ) {
                matchEl = this.parent( el, nextSel.selector, root );
                //closest
            } else {
                matchEl = this.closest( el, nextSel.selector, root );
            }
    
            //검색결과가 있으면, 다음 조건 검색
            if ( matchEl ) {
                return (nextSel.type == 'first')? true : this.depthMatch( root, matchEl, selectList, nextIdx );
            } else {
                return false;
            }
        },
    
        //대상들중 조건에 일치하는 개체리스트 배열로 반환.
        matchList: function ( els, selector ) {
            var i, elNum = els.length, result = [];
    
            for ( i = 0; i < elNum; ++i ) {
                var el = els[i];
                if ( this.match(el, selector) ) result.push( el );
            }
            return result;
        },
    
        //Full Selector를 직계 방계 형태로 분리, [{type:'parent', value:''}, {type:'closest', value:''}]
        //순서를 뒤집어서 반환.
        selectorList: function ( selector ) {
            var result = [];
    
            selector = $B.string.trim( selector );
            //공백제거
            selector.replace( /(\[[^\[\]]+\])/g, function ( str ) {
                return str.replace( /\s/g, '' );
                //분리
            }).replace( /([\s\>]+)?([^\s\>]+)/g, function ( str, bullet, value ) {
                var type;
    
                if ( !bullet ) {
                    type = 'first';
                } else if ( bullet.indexOf('>') > -1 ) {
                    type = 'parent';
                } else {
                    type = 'closest';
                }
                result.push( {type: type, selector: value} );
            });
            return result.reverse();
        },
    
        //selector에서 attr을 분류, {length:조건의 갯수, node, id, className:Array, attr:Array}, 예) img[src*=gif].list[alt*=img]
        parse: function ( selector ) {
            var result = {}, index = 0;
    
            selector.replace( /([a-z]+)?(\#\w+)?(\.\w+)?(\[[^\[\]]+\])?/ig, function ( str, node, id, className, attr ) {
                if ( node ) result.node = node.toLowerCase(), index++;
                if ( id ) result.id = id.replace(/^\#/, ''), index++;
    
                //class 복수조건 가능
                if ( className ) {
                    var reClass = className.replace(/^\./, '');
                    if ( result.className ) {
                        result.className.push( reClass );
                    } else {
                        result.className = [reClass];
                    }
                    index++;
                }
                //attr 복수조건 가능
                if ( attr ) {
                    var reAttr = attr.replace(/[\s\"\'\[\]]/g, '');
                    if ( result.attr ) {
                        result.attr.push( reAttr );
                    } else {
                        result.attr = [reAttr];
                    }
                    index++;
                }
            });
    
            result.length = index;
            return result;
        },
    
        //attr들과 일치하면 true반환.
        matchAttr: function ( el, attrs ) {
            var i, attrNum = attrs.length, result = false;
    
            for ( i = 0; i < attrNum; ++i ) {
                //parseAttr
                //attrs[i].replace( /(^\w+)([\=\$\*\~\^]{1,2})?([\w\W]+)?|(^\w+)([^\=\$\*\~\^]+)/, function ( str, name, operator, value ) {
                attrs[i].replace( /(^\w+)([=$*~\^]{1,2})?([\w\W]+)?|(^\w+)([^=$*~\^]+)/, function ( str, name, operator, value ) {
                    if ( name ) {
                        var elValue = $B( el ).attr( name ),
                            reValue;
    
                        if ( operator ) {
                            if ( !elValue ) return;
    
                            //연산자
                            switch ( operator ) {
                                case '=':
                                    result = ( elValue == value );
                                    break;
                                case '*=':
                                    result = ( elValue.indexOf(value) > -1 );
                                    break;
                                case '~=':
                                    result = $B.string.isWholeWord( elValue, value );
                                    break;
                                case '^=':
                                    reValue = value.replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                                    result = new RegExp( '^' + reValue ).test( elValue );
                                    break;
                                case '$=':
                                    reValue = value.replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                                    result = new RegExp( reValue + '$' ).test( elValue );
                                    break;
                            }
                            //attr이 있는지 비교만 할때
                        } else {
                            result = ( !elValue )? false : true;
                        }
                    } else {
                        return false;
                    }
                });
    
                //하나라도 false가 나오면 더이상 체크하지 않는다.
                if ( !result ) return result;
            }
    
            return result;
        }
    };


    // ============================================================== //
    // =====================	CustomEvents	===================== //
    // ============================================================== //
    
    /**
     * CustomEvents 객체
     * 기본 Event Property : e.type
     * @param   {Boolean}   optionCheck (default:false)
     * @return	{Function}
     */
    var CustomEvents = function ( optionCheck ) {
        this.__eventPool__ = {};
        this.__uId__ = $B.string.unique();
        this.__eventOptionCheck__ = optionCheck || false;
    };
    
    CustomEvents.prototype = {
        /**
         * @param {String}          type      event type
         * @param {Function}        listener
         * @param {Object|Boolean}  options   useCapture, passive 등의 설정 용도
         */
        addListener: function ( type, listener, options ) {
            if ( ($B.isString(type) && type) && $B.isFunction(listener) && !this.hasListener(type, listener, options) ) {
                var events = this.__eventPool__[type];
                if ( !events ) events = this.__eventPool__[type] = [];
                events.push({
                    listener: listener,
                    options: options
                });
            }
    
            return this;
        },
    
        /**
         * @param {String}          type      event type
         * @param {Function}        listener
         * @param {Object|Boolean}  options   useCapture, passive 등
         */
        removeListener: function ( type, listener, options ) {
            var events = this.__eventPool__[type];
    
            if ( events ) {
                if ( $B.isFunction(listener) ) {
                    var evtLength = events.length, i;
    
                    if ( !$B.isEmpty(options) && this.__eventOptionCheck__ ) {
                        for ( i = 0; i < evtLength; ++i ) {
                            var eData = events[i];
                            if ( listener === eData.listener && $B.isEqual(eData.options, options) ) {
                                events.splice( $B.array.indexOf(events, events[i]), 1 );
                                break;
                            }
                        }
                    } else {
                        for ( i = 0; i < evtLength; ++i ) {
                            if ( listener === events[i].listener ) {
                                events.splice( $B.array.indexOf(events, events[i]), 1 );
                                break;
                            }
                        }
                    }
                } else {
                    delete this.__eventPool__[type];
                }
            } else {
                this.__eventPool__ = {};
            }
    
            return this;
        },
    
        /**
         * @param   {String}            type      event type
         * @param   {Function}          listener
         * @param   {Object|Boolean}    options   useCapture, passive 등
         * @return  {Boolean}
         */
        hasListener: function ( type, listener, options ) {
            var result = false,
                events = this.__eventPool__[type];
    
            if ( events ) {
                if ( $B.isFunction(listener) ) {
                    var evtLength = events.length, i;
    
                    if ( !$B.isEmpty(options) && this.__eventOptionCheck__ ) {
                        for ( i = 0; i < evtLength; ++i ) {
                            var eData = events[i];
                            if ( listener === eData.listener && $B.isEqual(eData.options, options) ) {
                                result = true;
                                break;
                            }
                        }
                    } else {
                        for ( i = 0; i < evtLength; ++i ) {
                            if ( listener === events[i].listener ) {
                                result = true;
                                break;
                            }
                        }
                    }
                } else {
                    result = true;
                }
            }
    
            return result;
        },
    
        /**
         * @param {String}  type     event type
         * @param {Object}  datas
         */
        dispatch: function ( type, datas ) {
            var _this = this,
                events = this.__eventPool__[type];
    
            if ( events ) {
                var evtLength = events.length;
                for ( var i = 0; i < evtLength; ++i ) {
                    var evt = {type: type};
    
                    if ( typeof datas === 'object' ) {
                        for ( var key in datas ) {
                            if ( key !== 'type' ) evt[key] = datas[key];
                        }
                    }
    
                    events[i].listener.call( _this, evt );
                }
            }
    
            return this;
        }
    };


    // ============================================================== //
    // =====================	Class			===================== //
    // ============================================================== //
    
    /**
     * Class 객체
     * extend, addListener, removeListener, hasListener, dispatch, methods 기본 제공 (extend시 override 주의)
     * initialize 는 기본실행
     * 주의 : instance 를 extend 하게되면 오류가 발생한다.
     * @return	{Function}
     */
    ixBand.Class = function () {};
    ixBand.Class.prototype = (function () {
        var proto = {
            __className__: '$B.Class'
        };
    
        for ( var key in CustomEvents.prototype ) {
            proto[key] = CustomEvents.prototype[key];
        }
    
        return proto;
    }());
    
    /**
     * Class.extend()
     * @param   {Object}    methods
     * @param   {String}    className
     * @returns {Function}
     */
    ixBand.Class.extend = function ( methods, className ) {
        var EXCEPTION_REG = new RegExp( '^(__parentClass__|__className__|__extends__|__override__)$' );
    
        var _parent = this,
            _className = ( typeof className === 'string' )? className : '$B.Class_' + __classCount++,
            _properties = {};
    
        if ( typeof methods === 'object' ) {
            var Class = function () {
                this.__uId__ = $B.string.unique();
                this.__eventPool__ = {};
    
                for ( var key in _properties ) {
                    this[key] = deepClone( _properties[key] );
                }
    
                if ( typeof this.initialize === 'function' ) {
                    this.initialize.apply( this, arguments );
                }
            };
    
            Class.prototype = {
                __parentClass__: _parent,
                __className__: _className,
                __extends__: ( _parent.prototype.__extends__ || _parent.prototype.__className__ ) + ' > ' + _className
            };
    
            var overwride = '';
    
            for ( var key in this.prototype ) {
                if ( !EXCEPTION_REG.test(key) ) {
                    var prop = this.prototype[key];
                    Class.prototype[key] = prop;
    
                    if ( !$B.isFunction(prop) ) {
                        _properties[key] = prop;
                    }
                }
            }
    
            for ( var key in methods ) {
                if ( !EXCEPTION_REG.test(key) ) {
                    var prop = methods[key];
    
                    if ( Class.prototype.hasOwnProperty(key) ) {
                        overwride += overwride? ', ' + key : key;
                    }
    
                    Class.prototype[key] = prop;
    
                    if ( !$B.isFunction(prop) ) {
                        _properties[key] = prop;
                    }
                }
            }
    
            Class.prototype.__override__ = overwride;
            Class.extend = ixBand.Class.extend;
            return Class;
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 										api										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.api = (function () {
        var _video = false,
            _audio = false,
            _canvas = false;
    
        /**
         * 특정 API 지원여부 (Modernizr - https://github.com/Modernizr/Modernizr)
         * @type	{$support}
         */
        var api = {
            /**
             * Canvas 태그 지원여부
             * @return	{Boolean}
             */
            supportCanvas: function () {
                var el = document.createElement( 'canvas' ),
                    _canvas = !!( el.getContext && el.getContext( '2d' ) );
    
                this.supportCanvas = function () { return _canvas; };
                return this.supportCanvas();
            },
    
            /**
             * Video 태그 지원여부
             * @return	{Boolean}
             */
            supportVideo: function () {
                var el = document.createElement( 'video' ),
                    bool = false;
                // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
                try {
                    if ( bool = !!el.canPlayType ) {
                        bool      = new Boolean(bool);
                        bool.ogg  = el.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');
                        bool.h264 = el.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');
                        bool.webm = el.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
                    }
    
                } catch(e) {}
                _video = bool;
    
                this.supportVideo = function () { return _video; };
                return this.supportVideo();
            },
    
            /**
             * Audio 태그 지원여부
             * @return	{Boolean}
             */
            supportAudio: function () {
                var el = document.createElement( 'audio' ),
                    bool = false;
    
                try {
                    if ( bool = !!el.canPlayType ) {
                        bool      = new Boolean(bool);
                        bool.ogg  = el.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                        bool.mp3  = el.canPlayType('audio/mpeg;')               .replace(/^no$/,'');
    
                        // Mimetypes accepted:
                        //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                        //   bit.ly/iphoneoscodecs
                        bool.wav  = el.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                        bool.m4a  = ( el.canPlayType('audio/x-m4a;')            ||
                        el.canPlayType('audio/aac;'))             .replace(/^no$/,'');
                    }
                } catch(e) {}
                _audio = bool;
    
                this.supportAudio = function () { return _audio; };
                return this.supportAudio();
            }
        };
    
        return api;
    }());


    // ############################################################################ //
    // ############################################################################ //
    // 									array										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.array = {
        /**
         * 배열의 내용을 불규칙 적으로 썩어서 새 배열을 반환.
         * @param	{Array}		target	대상 배열
         * @return	{Array}
         */
        shuffle: function ( target ) {
            if ( this.is(target) ) {
                var ary = target.concat([]),
                    num = ary.length - 1,
                    i, ran, tmp;
    
                for ( i = 0; i < num; ++i ) {
                    ran = Math.round( Math.random() * num );
                    tmp = ary[i];
                    ary[i] = ary[ran];
                    ary[ran] = tmp;
                }
                return ary;
            } else {
                throw new Error('[ixBand] "shuffle()" ' + MSG_NOT_ARRAY);
            }
        },
    
        /**
         * 해당객체가 배열이면 true, HTMLCollection은 false
         * @param	{*}			target
         * @return	{Boolean}
         */
        is: function ( target, errorMsg ) {
            var result = Object.prototype.toString.call( target ) === '[object Array]';
    
            if ( errorMsg && !result ) {
                warning( errorMsg );
                return false;
            } else {
                return result;
            }
        },
    
        /**
         * 지정된 함수에 대해 false를 반환하는 항목에 도달할 때까지 배열의 각 항목에 테스트 함수를 실행.
         * @param	{Array}		target		대상 배열
         * @param	{Function}	callback	function callback(item:*, index:int, array:Array):Boolean;
         * @return	{Boolean}	일치하는 요소가 없으면 false
         */
        every: function ( target, callback ) {
            if ( typeof Array.prototype.every === 'function' ) {
                this.every = function ( target, callback ) {
                    if ( this.is(target) ) {
                        return target.every( callback );
                    } else {
                        throw new Error('[ixBand] "every()" ' + MSG_NOT_ARRAY);
                    }
                };
            } else {
                this.every = function ( target, callback ) {
                    if ( this.is(target) ) {
                        var tArray = target,
                            aryNum = tArray.length,
                            result, i;
    
                        for ( i = 0; i < aryNum; ++i ) {
                            var ary = tArray[i];
                            result = callback.call( this , ary, i, tArray );
                            if ( result == false ) break;
                        }
                        return result;
                    } else {
                        throw new Error('[ixBand] "every()" ' + MSG_NOT_ARRAY);
                    }
                };
            }
    
            return this.every( target, callback );
        },
    
        /**
         * 지정된 함수에 대해 true를 반환하는 모든 항목이 포함된 새 배열을 반환.
         * @param	{Array}			target		대상 배열
         * @param	{Function}		callback	function callback(item:*, index:int, array:Array):Boolean;
         * @return	{Array}
         */
        filter: function ( target, callback ) {
            if ( typeof Array.prototype.filter === 'function' ) {
                this.filter = function ( target, callback ) {
                    if ( this.is(target) ) {
                        return target.filter( callback );
                    } else {
                        throw new Error('[ixBand] "filter()" ' + MSG_NOT_ARRAY);
                    }
                };
            } else {
                this.filter = function ( target, callback ) {
                    if ( this.is(target) ) {
                        var tArray = target,
                            aryNum = tArray.length,
                            result = [], i;
    
                        for ( i = 0; i < aryNum; ++i ) {
                            var ary = tArray[i],
                                state = callback.call( this , ary, i, tArray );
                            if ( state == true ) result.push( ary );
                        }
                        return result;
                    } else {
                        throw new Error('[ixBand] "filter()" ' + MSG_NOT_ARRAY);
                    }
                };
            }
    
            return this.filter( target, callback );
        },
    
        /**
         * 배열의 각 항목에 함수를 실행, for문을 직접쓰는것 보다는 느리다.
         * @param	{Array}			target		대상 배열
         * @param	{Function}		callback	function callback(item:*, index:int, array:Array):void;
         */
        forEach: function ( target, callback ) {
            if ( typeof Array.prototype.forEach === 'function' ) {
                this.forEach = function ( target, callback ) {
                    if ( this.is(target) ) {
                        target.forEach( callback );
                    } else {
                        throw new Error('[ixBand] "forEach()" ' + MSG_NOT_ARRAY);
                    }
                };
            } else {
                this.forEach = function ( target, callback ) {
                    if ( this.is(target) ) {
                        var tArray = target,
                            aryNum = tArray.length, i;
    
                        for ( i = 0; i < aryNum; ++i ) {
                            callback.call( this , tArray[i], i, tArray );
                        }
                    } else {
                        throw new Error('[ixBand] "forEach()" ' + MSG_NOT_ARRAY);
                    }
                };
            }
    
            this.forEach( target, callback );
        },
    
        /**
         * 대상배열안에 value와 같은요소가 존재하면 해당 Index를 반환한다.
         * @param	{Array}		target		대상 배열
         * @param	{*}			value
         * @return	{Int}		일치하는 요소가 없으면 -1
         */
        indexOf: function ( target, value ) {
            if ( typeof Array.prototype.indexOf === 'function' ) {
                this.indexOf = function ( target, value ) {
                    if ( this.is(target) ) {
                        return target.indexOf( value );
                    } else {
                        throw new Error('[ixBand] "indexOf()" ' + MSG_NOT_ARRAY);
                    }
                };
            } else {
                this.indexOf = function ( target, value ) {
                    if ( this.is(target) ) {
                        var tArray = target,
                            aryNum = tArray.length,
                            result = -1, i;
    
                        for ( i = 0; i < aryNum; ++i ) {
                            if ( tArray[i] === value ) {
                                result = i;
                                break;
                            }
                        }
                        return result;
                    } else {
                        throw new Error('[ixBand] "indexOf()" ' + MSG_NOT_ARRAY);
                    }
                };
            }
    
            return this.indexOf( target, value );
        },
    
        /**
         * 배열의 각 항목에 함수를 실행하고 원래 배열의 각 항목에 대한 함수 결과에 해당하는 항목으로 구성된 새 배열을 반환.
         * @param	{Array}			target		대상 배열
         * @param	{Function}		callback	function callback(item:*, index:int, array:Array):Array;
         * @return	{Array}
         */
        map: function ( target, callback ) {
            if ( typeof Array.prototype.map === 'function' ) {
                this.map = function ( target, callback ) {
                    if ( this.is(target) ) {
                        return target.map( callback );
                    } else {
                        throw new Error('[ixBand] "map()" ' + MSG_NOT_ARRAY);
                    }
                };
            } else {
                this.map = function ( target, callback ) {
                    if ( this.is(target) ) {
                        var tArray = target,
                            aryNum = tArray.length,
                            result = [], i;
    
                        for ( i = 0; i < aryNum; ++i ) {
                            var state = callback.call( this , tArray[i], i, tArray );
                            result.push( state );
                        }
                        return result;
                    } else {
                        throw new Error('[ixBand] "map()" ' + MSG_NOT_ARRAY);
                    }
                };
            }
    
            return this.map( target, callback );
        },
    
        /**
         * true를 반환하는 항목에 도달할 때까지 배열의 각 항목에 테스트 함수를 실행합니다.
         * @param	{Array}			target		대상 배열
         * @param	{Function}		callback	function callback(item:*, index:int, array:Array):Boolean;
         * @return	{Boolean}	일치하는 요소가 없으면 false
         */
        some: function ( target, callback ) {
            if ( typeof Array.prototype.some === 'function' ) {
                this.some = function ( target, callback ) {
                    if ( this.is(target) ) {
                        return target.some( callback );
                    } else {
                        throw new Error('[ixBand] "some()" ' + MSG_NOT_ARRAY);
                    }
                };
            } else {
                this.some = function ( target, callback ) {
                    if ( this.is(target) ) {
                        var tArray = target,
                            aryNum = tArray.length,
                            result, i;
    
                        for ( i = 0; i < aryNum; ++i ) {
                            var result = callback.call( this , tArray[i], i, tArray );
                            if ( result == true ) break;
                        }
                        return result;
                    } else {
                        throw new Error('[ixBand] "some()" ' + MSG_NOT_ARRAY);
                    }
                };
            }
    
            return this.some( target, callback );
        }
    };


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


    // ############################################################################ //
    // ############################################################################ //
    // 									event										//
    // ############################################################################ //
    // ############################################################################ //
    
    /**
     * 함수를 올바른 this 키워드와 함께 호출하기 위해서 클로저가 사용된다.<br>
     * 이런 종류의 클로저는 IE에서 메모리 누수를 발생시킬 수 있기 때문에, onunload 이벤트를 등록하고 이시점에 등록된 모든 이벤트를 삭제한다.<br>
     * Event Properties : type, target, currentTarget, relatedTarget, eventPhase, clientX, clientY, screenX, screenY, shiftKey, charCode, delta:마우스휠이벤트에서 발생, stopPropagation(), preventDefault()<br>
     */
    ixBand.event = (function () {
        //EventType의 크로스부라우징 처리
        var CrossType = {
            mousewheel: 'mousewheel',
            transitionend: 'transitionend'
        };
    
        if ( $B.ua.WEBKIT ) {
            CrossType.transitionend = 'webkitTransitionEnd';
        } else if ( $B.ua.OPERA ) {
            CrossType.transitionend = 'otransitionend';
        } else if ( $B.ua.FIREFOX ) {
            CrossType.mousewheel = 'DOMMouseScroll';
        }
    
        var _eventCount = 0,
            _hasDomEvent = ( document.addEventListener )? true : false,
            _hasIEEvent = ( document.attachEvent )? true : false;
    
        function getEventID () {
            return 'ixe' + new Date().getTime() + _eventCount++;
        }
    
        function removeAllHandlers (e) {
            var _this = this, id;
    
            for ( id in _this.__ix_allEvents__ ) {
                var h = _this.__ix_allEvents__[id];
                h.el.detachEvent( 'on' + h.type, h.wrapHandler );
                delete _this.__ix_allEvents__[id];
            }
        }
    
        //대상의 모든 이벤트 삭제
        function removeAllEvent ( el, clone ) {
            if ( el.__ix_eventIds__ ) {
                var ids = el.__ix_eventIds__,
                    eidNum = ids.length, i;
    
                for ( i = 0; i < eidNum; ++i ) {
                    var id = ids[i],
                        evt = window.__ix_allEvents__[id],
                        type = evt.type,
                        matchEl = ( clone )? true: evt.el == el;
    
                    //삭제
                    if ( matchEl ) {
                        Evt._removeEventListener( el, type, evt.wrapHandler );
    
                        //창마다 하나식 있는 __ix_allEvents__ 객체에서 이벤트정보 삭제
                        if ( !clone ) delete window.__ix_allEvents__[id];
                    }
                }
    
                if ( !clone ) el.__ix_eventIds__ = null;
            }
        }
    
        //크로스브라우징 이벤트 타입 반환
        function getCrossType ( type ) {
            var crossType = CrossType[type];
            return crossType || type;
        }
    
        //origin event type to cross event type
        function originToCrossType ( type ) {
            if ( type === 'DOMMouseScroll' ) {
                type = 'mousewheel';
            } else if ( type === 'webkitTransitionEnd' ) {
                type = 'transitionend';
            } else if ( type === 'otransitionend' ) {
                type = 'transitionend';
            }
    
            return type;
        }
    
    
        // ==================== Public Methods ==================== //
        var Evt = {
            add: null,
    
            find: function ( el, type, handler, isAll ) {
                var eventIds = el.__ix_eventIds__;
                //등록된 _ix_eventIds_가 없으면 -1반환
                if ( !eventIds ) return -1;
    
                var hNum = eventIds.length - 1,
                    alls = [],
                    i;
    
                type = getCrossType( type );
    
                //가장최근에 등록된 이벤트가 제거될 가능성이 높기때문에 루프를 뒤에서 부터 돈다.
                for ( i = hNum; i >= 0; --i ) {
                    var hId = eventIds[i],
                        evt = window.__ix_allEvents__[hId];
    
                    if ( isAll ) {
                        if ( evt.type === type ) {
                            alls.push( i );
                        }
                    } else {
                        if ( evt.type === type && evt.handler === handler ) {
                            return i;
                            break;
                        }
                    }
                }
    
                if ( isAll ) {
                    return alls;
                } else {
                    return -1;
                }
            },
    
            trigger: function ( el, type, data ) {
                if ( typeof document.dispatchEvent === 'function' ) {
                    // dispatch for firefox + others
                    var evt = document.createEvent( 'HTMLEvents' );
                    evt.initEvent( type, true, true ); // type,bubbling,cancelable
                    el.dispatchEvent( evt );
                } else if ( document.createEventObject ) {
                    // dispatch for IE
                    try {
                        var evtObj = document.createEventObject();
                        el.fireEvent( 'on' + type, evtObj );
                    } catch (e) {
                        //CustomEvent
                        var evts = this.find( el, type, null, true ),
                            evtLength = evts.length;
    
                        for ( var i = 0; i < evtLength; ++i ) {
                            var idx = evts[i],
                                id = el.__ix_eventIds__[idx],
                                evt = window.__ix_allEvents__[id];
    
                            evt.wrapHandler.call( e.el, {
                                type: evt.type,
                                currentTarget: el,
                                data: data || evt.customData
                            });
                        }
                    }
                }
            },
    
            remove: function ( el, type, handler ) {
                //el.__ix_eventIds__[] 배열에서 찾는다.
                var i = this.find( el, type, handler );
                if ( i == -1 ) return;
    
                var id = el.__ix_eventIds__[i],
                    h = window.__ix_allEvents__[id];
    
                this._removeEventListener( el, type, h.wrapHandler );
    
                //배열에서 el 제거
                el.__ix_eventIds__.splice( i, 1 );
                //창마다 하나식 있는 __ix_allEvents__ 객체에서 이벤트정보 삭제
                delete window.__ix_allEvents__[id];
            },
    
            //대상 개체의 해당 타입의 모든 이벤트 삭제
            removeTypeAll: function ( el, type ) {
                var eventIds = el.__ix_eventIds__;
                //등록된 _ix_eventIds_가 없으면 정지.
                if ( !eventIds ) return;
    
                //type = getCrossType( type );
    
                //가장최근에 등록된 이벤트가 제거될 가능성이 높기때문에 루프를 뒤에서 부터 돈다.
                for ( var i = eventIds.length - 1; i >= 0; --i ) {
                    var id = eventIds[i],
                        evt = window.__ix_allEvents__[id];
    
                    if ( evt.type == type ) {
                        this._removeEventListener( el, type, evt.wrapHandler );
                        //배열에서 el 제거
                        el.__ix_eventIds__.splice( i, 1 );
                        //창마다 하나식 있는 __ix_allEvents__ 객체에서 이벤트정보 삭제
                        delete window.__ix_allEvents__[id];
                    }
                }
            },
    
            //대상 객체의 이벤트 모두 삭제
            removeAll: function ( els, childRemove, clone ) {
                var i, elNum = els.length;
                for ( i = 0; i < elNum; ++i ) {
                    var el = els[i];
    
                    removeAllEvent( el, clone );
    
                    //자식 이벤트 삭제
                    if ( childRemove ) {
                        var children = el.children;
    
                        if ( children.length > 0 ) {
                            this.removeAll( children, true, clone );
                        }
                    }
                }
            },
    
            //removeEventListener 크로스브라우징 처리
            _removeEventListener: function ( el, type, handler ) {
                if ( _hasDomEvent ) {
                    this._removeEventListener = function ( el, type, handler ) {
                        el.removeEventListener( getCrossType(type), handler, false );
                    };
                } else if ( _hasIEEvent ) {
                    this._removeEventListener = function ( el, type, handler ) {
                        el.detachEvent( 'on' + type, handler );
                    };
                }
                this._removeEventListener( el, type, handler );
            },
    
            /**
             * 파폭에서 지원하지 않는 event.offsetX 크로스브라우징 해결하여 반환.
             * @param	{Object}	event	이벤트 핸들러의 이벤트.
             * @return	{Number}
             */
            offsetX: function ( evt ) {
                if ( !$B.ua.FIREFOX ) {
                    this.offsetX = function ( evt ) { return evt.offsetX; };
                    //파폭
                } else {
                    this.offsetX = function ( evt ) { return evt.layerX - evt.currentTarget.offsetLeft; };
                }
                return this.offsetX( evt );
            },
            /**
             * 파폭에서 지원하지 않는 event.offsetY 크로스브라우징 해결하여 반환.
             * @param	{Object}	event	이벤트 핸들러의 이벤트.
             * @return	{Number}
             */
            offsetY: function ( evt ) {
                if ( !$B.ua.FIREFOX ) {
                    this.offsetY = function ( evt ) { return evt.offsetY; };
                    //파폭
                } else {
                    this.offsetY = function ( evt ) { return evt.layerY - evt.currentTarget.offsetTop; };
                }
                return this.offsetY( evt );
            },
    
            /**
             * IE9 미만에서 지원하지 않는 event.pageX 크로스브라우징 해결하여 반환.
             * @param	{Object}	event	이벤트 핸들러의 이벤트.
             * @return	{Number}
             */
            pageX: function ( evt ) {
                if ( $B.ua.DOC_MODE_IE9_LT ) {
                    this.pageX = function ( evt ) {
                        var eDoc = evt.target.ownerDocument || document,
                            docEl = eDoc.documentElement,
                            body = eDoc.body;
    
                        return evt.clientX + ( docEl && docEl.scrollLeft || body && body.scrollLeft || 0 );
                    };
                } else {
                    this.pageX = function ( evt ) { return evt.pageX; };
                }
                return this.pageX( evt );
            },
            /**
             * IE9 미만에서 지원하지 않는 event.pageY 크로스브라우징 해결하여 반환.
             * @param	{Object}	event	이벤트 핸들러의 이벤트.
             * @return	{Number}
             */
            pageY: function ( evt ) {
                if ( $B.ua.DOC_MODE_IE9_LT ) {
                    this.pageY = function ( evt ) {
                        var eDoc = evt.target.ownerDocument || document,
                            docEl = eDoc.documentElement,
                            body = eDoc.body;
    
                        return evt.clientY + ( docEl && docEl.scrollTop || body && body.scrollTop || 0 );
                    };
                } else {
                    this.pageY = function ( evt ) { return evt.pageY; };
                }
                return this.pageY( evt );
            }
        };
    
        // ==================== DOM Browser ==================== //
    
        if ( _hasDomEvent ) {
            Evt.add = function ( el, type, handler, data ) {
                if ( this.find( el, type, handler ) != -1 ) return;
    
                //중첩된 함수를 정의하고 이 함수를 handler 함수 대신 등록한다.
                var wrapHandler = function (e) {
                    var evt = {
                        _event: e,			//실제 이벤트 객체
                        type: originToCrossType( e.type ),
                        target: e.target,
                        currentTarget: e.currentTarget,
                        relatedTarget: e.relatedTarget,
                        eventPhase: e.eventPhase,
                        //마우스 좌표
                        layerX: e.layerX, layerY: e.layerX,//파폭
                        clientX: e.clientX, clientY: e.clientY,
                        pageX: e.pageX, pageY: e.pageY,
                        offsetX: e.offsetX, offsetY: e.offsetY,
                        screenX: e.screenX, screenY: e.screenY,
                        shiftKey: e.shiftKey, charCode: e.charCode,
                        altKey: e.altKey,
                        ctrlKey: e.ctrlKey,
                        //이벤트 관리 함수
                        stopPropagation: function () { if (this._event) this._event.stopPropagation(); },
                        preventDefault: function () { if (this._event) this._event.preventDefault(); },
                        //mousewheel
                        delta: 0,
                        data: e.customData || data
                    };
    
                    /*
                     mousewheel delta
                     trace( 'detail:' + e.detail );//FF, Oprera
                     trace( 'wheelDelta:' + e.wheelDelta );//IE, Chrome, Safari, Opera
                     */
                    if ( e.wheelDelta ) {
                        evt.delta = e.wheelDelta / 120;
                    } else if ( e.detail ) {
                        evt.delta = -e.detail / 3;
                    }
    
                    handler.call( el, evt );
                };
    
                el.addEventListener( getCrossType(type), wrapHandler, false );
    
                var h = {
                    el: el,
                    type: type,
                    handler: handler,
                    wrapHandler: wrapHandler,
                    customData: data
                };
    
                var w = window,
                    id = getEventID();
    
                if ( !w.__ix_allEvents__ ) w.__ix_allEvents__ = {};
                w.__ix_allEvents__[id] = h;
    
                if ( !el.__ix_eventIds__ ) el.__ix_eventIds__ = [];
                el.__ix_eventIds__.push(id);
            };
    
            // ==================== IE6~8 Browser ==================== //
    
        } else if ( _hasIEEvent ) {
            Evt.add = function ( el, type, handler, data ) {
                if ( this.find( el, type, handler ) != -1 ) return;
    
                //중첩된 함수를 정의하고 이 함수를 handler 함수 대신 등록한다.
                var wrapHandler = function (e) {
                    if ( !e ) e = window.event;
    
                    var evt = {
                        _event: e,				//실제 IE이벤트 객체
                        type: e.type,
                        target: e.srcElement,
                        currentTarget: el,
                        relatedTarget: e.fromElement? e.fromElement : e.toElement,
                        eventPhase: ( e.srcElement == el )? 2 : 3,
                        //마우스 좌표
                        layerX: e.layerX, layerY: e.layerX,//파폭
                        clientX: e.clientX, clientY: e.clientY,
                        pageX: e.pageX, pageY: e.pageY,
                        offsetX: e.offsetX, offsetY: e.offsetY,
                        screenX: e.screenX, screenY: e.screenY,
                        shiftKey: e.shiftKey, charCode: e.keyCode,
                        altKey: e.altKey,
                        ctrlKey: e.ctrlKey,
                        //이벤트 관리 함수
                        stopPropagation: function () { if (this._event) this._event.cancelBubble = true; },
                        preventDefault: function () { if (this._event) this._event.returnValue = false; },
                        //mousewheel
                        delta: e.wheelDelta / 120,
                        data: e.customData || data
                    };
    
                    handler.call( el, evt );
                };
    
                //이벤트 등록
                el.attachEvent( 'on' + type, wrapHandler );
    
                var h = {
                    el: el,
                    type: type,
                    handler: handler,
                    wrapHandler: wrapHandler,
                    customData: data
                };
    
                var w = window,
                    id = getEventID();
    
                if ( !w.__ix_allEvents__ ) w.__ix_allEvents__ = {};
                w.__ix_allEvents__[id] = h;
    
                if ( !el.__ix_eventIds__ ) el.__ix_eventIds__ = [];
                el.__ix_eventIds__.push(id);
    
                //창과 관련된 onunload 이벤트가 없으면 하나 등록.
                if ( !w._ix_onunloadHandlerReg_ ) {
                    w._ix_onunloadHandlerReg_ = true;
                    w.attachEvent( 'onunload', removeAllHandlers );
                }
            };
        }
    
    
        // ============================================================== //
        // =====================	CustomEvents	===================== //
        // ============================================================== //
    
        /**
         * CustomEvents 객체
         * @return	{Function}
         */
        Evt.CustomEvents = CustomEvents;
    
        return Evt;
    }());


    // ############################################################################ //
    // ############################################################################ //
    // 									geom										//
    // ############################################################################ //
    // ############################################################################ //
    
    /**
     * @type {ixBand.geom}
     */
    ixBand.geom = {};


    // ############################################################################ //
    // ############################################################################ //
    // 									html										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.html = {
        HTML_CHARACTERS: {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"',
            '&#39;': "'",
            '&nbsp;': ' '
        },
    
        /**
         * "<" 태그를 "&lt;" 처럼 변형된 태그 문자열로 반환 (기존 변환된 문자열 유지)
         * @param	{String}	str
         * @return  {String}
         */
        encode: function ( str ) {
            if ( !str ) return '';
    
            var regAry = $B.object.toArray( this.HTML_CHARACTERS ),
                reg = new RegExp( '(' + regAry.join('|') + ')', 'g' ),
                characters = this._htmlChars ? this._htmlChars : this._htmlChars = $B.object.replaceKeyValue( this.HTML_CHARACTERS );
    
            return str.replace( reg, function ( match, capture ) {
                return characters[capture] || capture;
            });
        },
    
        /**
         * "&lt;" 처럼 변형된 태그 문자열을 "<" 태그로 반환 (기존 태그는 유지)
         * @param	{String}	str
         * @return  {String}
         */
        decode: function ( str ) {
            if ( !str ) return '';
    
            var _this = this,
                regAry = $B.object.toArray( _this.HTML_CHARACTERS, 'key' ),
                reg = new RegExp( '(' + regAry.join('|') + '|&#[0-9]{1,5};' + ')', 'g' );
    
            return str.replace( reg, function ( match, capture ) {
                return ( capture in _this.HTML_CHARACTERS ) ? _this.HTML_CHARACTERS[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
            });
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 									measure										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.measure = {
        /**
         * Document 가로사이즈 반환 (스크롤바 미포함)
         * @return	{Number}
         */
        documentWidth: function () {
            var docEl = document.documentElement;
            return Math.max( docEl.scrollWidth, document.body.scrollWidth, docEl.clientWidth );
        },
        /**
         * Document 세로로사이즈 반환 (스크롤바 미포함)
         * @return	{Number}
         */
        documentHeight: function () {
            var docEl = document.documentElement;
            return Math.max( docEl.scrollHeight, document.body.scrollHeight, docEl.clientHeight );
        },
        /**
         * Viewport 가로사이즈 반환 (메뉴바, 툴바, 스크롤바를 제외)
         * @return	{Number}
         */
        windowWidth: function () {
            return document.documentElement.clientWidth;
        },
        /**
         * Viewport 세로사이즈 반환 (메뉴바, 툴바, 스크롤바를 제외)
         * @return	{Number}
         */
        windowHeight: function () {
            return document.documentElement.clientHeight;
        },
        /**
         * Windows 바탕화면에서 브라우져 X좌표
         * @return	{Number}
         */
        screenX: function () {
            if ( window.screenLeft ) {
                this.screenX = function () { return window.screenLeft; };
            } else {
                this.screenX = function () { return window.screenX; };
            }
            return this.screenX();
        },
        /**
         * Windows 바탕화면에서 브라우져 Y좌표
         * @return	{Number}
         */
        screenY: function () {
            if ( window.screenTop ) {
                this.screenY = function () { return window.screenTop; };
            } else {
                this.screenY = function () { return window.screenY; };
            }
            return this.screenY();
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 									mobile										//
    // ############################################################################ //
    // ############################################################################ //
    
    
    /**
     * @type {ixBand.mobile}
     */
    ixBand.mobile = {
        TOUCH_ACTION: TOUCH_ACTION,
        TRANSITION: TRANSITION_NAME
    };
    


    // ############################################################################ //
    // ############################################################################ //
    // 									net										//
    // ############################################################################ //
    // ############################################################################ //
    
    /**
     * @type	{net}
     */
    ixBand.net = {
        /**
         * URL 이동
         * @param	{String}	url			이동할 페이지 url
         * @param	{String}	urlTarget	이동할 페이지 urlTarget
         */
        goToURL: function ( url, urlTarget ) {
            if ( !urlTarget ) {
                document.location.href = url;
            } else {
                switch ( urlTarget ) {
                    case '_blank':
                        window.open( url, urlTarget );
                        break;
                    case '_self':
                        self.location.href = url;
                        break;
                    case '_parent':
                        parent.location.href = url;
                        break;
                    case '_top':
                        top.location.href = url;
                        break;
                }
            }
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 									string										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.string = {
        /**
         * 대상이 문자열이면 true반환
         * @param	{String}	target		대상 문자열
         * @param	{String}	errorMsg	콘솔에 표시할 에러 메세지
         * @return	{Boolean}
         */
        is: function ( target, errorMsg ) {
            var result = ( typeof target === 'string' );
    
            if ( errorMsg && !result ) {
                warning( errorMsg );
                return false;
            } else {
                return result;
            }
        },
    
        /**
         * 문자열의 원하는 Index에 문자열을 추가하여 반환. 반복적용 가능.
         * 반복적용시 마지막 index에 문자추가되지 않음.
         * @param	{String}	target		대상 문자열
         * @param	{int}		addIndex	삽입할 Index.
         * @param	{String}	addText		추가할 문자열.
         * @param	{String}	direction	진행될 방향(left, right). 기본값 right
         * @param	{Boolean}	repeat		반복적용 설정. 기본값 false
         * @return	{String}
         */
        insert: function ( target, addIndex, addText, direction, repeat ) {
            direction = direction || 'right';
            repeat = ( repeat )? 'g' : '';
            var value = String( target ),
                reg = new RegExp( '.{' + addIndex + '}', repeat );
    
            if ( direction == 'right' ) {
                value = value.replace(reg, function (str) {
                    return str + addText;
                });
                var lastIdx = value.length - 1;
                return repeat && addText == value.charAt(lastIdx) ? value.substr(0, lastIdx) : value;
            } else {
                value = this.strrev( value );
                value = value.replace( reg, function ( str ) {
                    return str + addText;
                });
                value = this.strrev( value );
                return repeat && addText == value.charAt(0) ? value.substring(1) : value;
            }
        },
    
        /**
         * 숫자 "0"을 삽입하여 자리수를 맞춰 문자열을 반환.
         * 예)trace( .format(5, 3) );//005
         * @param	{String}	target		대상 문자열
         * @param	{int}		cipher		자리수 설정.
         * @param	{String}	fillStr		채워질 문자열, 기본 '0'
         * @return	{String}
         */
        format: function ( target, cipher, fillStr ) {
            fillStr = fillStr || '0';
            var str = String( target ),
                result = '', addNum = cipher - str.length, i;
    
            for ( i = 0; i < addNum; ++i ) {
                result += fillStr;
            }
            return result += str;
        },
    
        /**
         * 카멜표기법을 하이픈표기법으로 변환하여 반환.
         * @param	{String}	target		대상 문자열
         * @return	{String}	fontSize -> font-size
         */
        hyphenCase: function ( target ) {
            target = String( target );
            return target.replace( /[A-Z]/g, function ( val ) {
                return '-' + val.toLowerCase();
            });
        },
    
        /**
         * 하이픈표기법을 카멜표기법으로 변환하여 반환.
         * @param	{String}	target		대상 문자열
         * @return	{String}	font-size -> fontSize
         */
        camelCase: function ( target ) {
            target = String( target );
            return target.replace(/-\b([a-z])/g, function (str) {
                return str.charAt(1).toUpperCase();
            });
        },
    
        /**
         * 단어의 첫글짜를 대문자로 변환
         * @param	{String}	target		대상 문자열
         * @return	{String}
         */
        capitalize: function ( target ) {
            target = String( target );
            return target.replace(/\b([a-z])/g, function (str) {
                return str.toUpperCase();
            });
        },
    
        /**
         * 해당문자열에 해당 언어가 포함되어있는지 체크<br>
         * 예).isLanguage("string", "en", "number")
         * @param	{String}		target		대상 문자열
         * @param	{String...}		languages	영문(en),한글(ko),숫자(number),특수문자(해당문자입력)
         * @return	{Boolean}
         */
        isLanguage: function () {
            var target = arguments[0],
                regStr = '', langNum = arguments.length, i;
    
            target = String(target);
    
            for (i = 1; i < langNum; ++i) {
                switch( arguments[i] ) {
                    case 'en':
                        regStr += 'A-Za-z';
                        break;
                    case 'ko':
                        regStr += 'ㄱ-ㅣ가-힣';
                        break;
                    case 'number':
                        regStr += '0-9';
                        break;
                    default:
                        regStr += arguments[i].replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                        break;
                }
            }
            return new RegExp( '[' + regStr + ']' ).test( target );
        },
    
        /**
         * 해당 문자열에 일치하는 완전체 단어가 있는지 검사
         * 예)	.isWholeWord( "Hello World", "Hello" ); // true
         *		.isWholeWord( "Hello World", "He" ); // false
         * @param	{String}		target		대상 문자열
         * @param	{String, Array}	findStr		비교할 String or String Array, 문자열의 앞뒤로 공백이 들어가면 다른 문자열로 인식하여 false반환.
         * @param	{String}		flags		대소문자 구별하지 않으려면 "i", 멀티라인 검색은 "m"
         * @return	{Boolean}
         */
        isWholeWord: function ( target, findStr, flags ) {
            target = String( target );
    
            var num, i, strs, result = false;
    
            if ( $B.array.is(findStr) ) {
                strs = findStr;
                num = strs.length;
            } else {
                num = 1;
                strs = [findStr];
            }
    
            for ( i = 0; i < num; ++i ) {
                var str = strs[i].replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                result = new RegExp( '(?:\\s|^)' + str + '(?:\\s|$)', flags || '' ).test( target );
                if ( !result ) return false;
            }
    
            return result;
        },
    
        /**
         * 문자열(수치)을 3자리 숫자 단위표기법으로 반환.
         * @param	{String, Number}		target		대상 문자열
         * @return	{String}
         */
        numberFormat: function ( target ) {
            var str = String(target),
                minus = '',
                temps = [], result = '';
    
            if (str.charAt(0) == '-') {
                minus = '-';
                str = str.substring(1);
            }
    
            temps = str.split('.');
            result = minus + $B.string.insert( temps[0], 3, ',', 'left', true );
    
            return ( temps[1] )? result += '.' + temps[1] : result;
        },
    
        /**
         * 대상 문자열에서 html태그를 모두 삭제
         * @param	{String}		target		대상 문자열
         * @return	{String}
         */
        removeTags: function ( target ) {
            target = String( target );
            return target.replace(/<[^>]+>/g, '');
        },
    
        /**
         * 문자열을 뒤집어 반환.('abc' to 'cba')
         * @param	{String}	target		대상 문자열
         * @return	{String}
         */
        strrev: function ( target ) {
            target = String( target );
            return target.split('').reverse().join('');
        },
    
        /**
         * 문자열의 앞뒤 white space삭제(탭, 띄어쓰기, \n, \r)
         * @param	{String}	target		대상 문자열
         * @return	{String}
         */
        trim: function ( target ) {
            target = String( target );
            return ( target )? target.replace(/^\s+/, '').replace(/\s+$/, '') : '';
        },
    
        /**
         * 16자의 고유 문자열 반환. (해당 화면에서 절대 유일값, alphabet + int 조합)
         * @return	{String}
         */
        unique: function () {
            var random = Math.random(),
                randomStr = random.toString( 32 ).substr( 2 ),
                alphabet = Math.round( Math.random() * 21 + 10 ).toString( 32 );//a~v
    
            if ( randomStr.length < 2 ) randomStr = 'i' + alphabet + 'x' + alphabet + 'b' + alphabet + 'a' + alphabet + 'n' + alphabet + 'd';
            var result = alphabet + __keyCount.toString( 32 ) + randomStr + randomStr + randomStr + randomStr;
            __keyCount++;
            return result.substr( 0, 15 ) + alphabet;
        },
    
        /**
         * 문자열을 각 데이타 타입에 맞춰 변환
         * @param {String}  str
         * @returns {Boolean, String, Number, Null, Undefined}
         */
        convertDataType: function ( str ) {
            str = String( str );
    
            if ( str ) {
                if ( /^\s*true\s*$/.test(str) ) {
                    str = Boolean( str );
                } else if ( /^\s*false\s*$/.test(str) ) {
                    str = Boolean();
                } else if ( /^\s*-*[0-9\.]+\s*$/.test(str) ) {
                    str = Number( str );
                } else if ( /^\s*null\s*$/.test(str) ) {
                    str = null;
                } else if ( /^\s*undefined\s*$/.test(str) ) {
                    str = undefined;
                }
            }
            return str;
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 									object										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.object = {
        /**
         * 해당 값이 Object인지 여부 반환 (배열은 false)
         * @param	{Object}	obj
         * @returns {Boolean}
         */
        is: function ( obj, errorMsg ) {
            var result = Object.prototype.toString.call( obj ) === '[object Object]';
    
            if ( errorMsg && !result ) {
                warning( errorMsg );
                return false;
            } else {
                return result;
            }
        },
    
        /**
         * 순환 참조가 되지 않도록 Object 복사본을 반환.
         * 주의) instance는 제대로 복사되지 않는다.
         * @param	{Object}	value
         * @returns {Object}
         */
        clone: deepClone,
    
        /**
         * 두개의 Object를 확장 해서 (합쳐) 반환
         * @param {Object}	fromObj
         * @param {Object}	toObj	fromObj 와 같은 key를 가지고 있으면 toObj의 값이 우선이 된다.
         * @param {Boolean}	circularReference
         * 	순환참조를 유지할지 설정 (기본값 true)
         * 	순화참조를 하지 않을경우 object.clone()으로 복사된다.
         */
        extend: function ( fromObj, toObj, circularReference ) {
            circularReference = typeof circularReference === 'boolean' ? circularReference : true;
    
            var result = fromObj;
    
            if ( !circularReference ) {
                result = deepClone( fromObj );
                toObj = deepClone( toObj );
            }
    
            for ( var key in toObj ) {
                result[key] = toObj[key];
            }
    
            return result;
        },
    
        /**
         * Object를 배열로 변환하여 반환
         * @param   {Object}   obj
         * @param   {String}   target  ("value", "key") 기본값 "value"
         * @returns {Array}
         */
        toArray: function ( obj, target ) {
            var result = [];
            for ( var n in obj ) {
                result.push( target === 'key' ? n : obj[n] );
            }
    
            return result;
        },
    
        /**
         * Object의 key를 value로 value는 key로 변환하여 반환
         * @param   {Object}   obj
         * @returns {Object}
         */
        replaceKeyValue: function ( obj ) {
            var result = {};
            for ( var key in obj ) {
                var value = obj[key];
                result[value] = key;
            }
    
            return result;
        },
    
        length: function ( obj ) {
            var count = 0;
    
            for ( var n in obj ) {
                count++;
            }
    
            return count;
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 									style										//
    // ############################################################################ //
    // ############################################################################ //
    
    ixBand.style = {
        REG_CSS: /([a-zA-Z\-]+)\s*?:\s*?([#\w\-.,\s\/?&:=\(\)%]+);?/g,
        REG_CSS_VALUE: /\s*?([-\d\.]+|#[\da-fA-F]+)\s*([a-zA-Z\%]+)?/,
    
        /**
         * 인라인스타일을 설정하거나 반환.
         * @param	{Element}	el			대상 Element
         * @param	{String}	propStr		"width:100px; z-index:2" 표기법, 설정하지 않으면 cssText반환
         * @return  {String}
         */
        inline: function ( el, propStr ) {
            var css = ( el && el.style )? el.style.cssText : '';
    
            //setter
            if ( $B.string.is(propStr) ) {
                propStr = $B.string.trim( propStr );
    
                if ( css && css.charAt( css.length-1 ) != ';' ) css += ';';//Opera에서는 css 속성끝에 ";"처리를 하지 않으면 에러가 난다.
                el.style.cssText = css + ' ' + propStr;
                //getter
            } else {
                return css;
            }
        },
    
        /**
         * 지정된 ComputedStyle을 보정없이 반환, 읽기전용
         * Style이 100%와 같은 형식으로 지정이 되어있다면, IE와 FF브라우져에서 다른값을 반환할수있다(IE=100%, FF=현재사이즈px).
         * 사파리, 크롬, z-index를 구할려면, position이 설정되어 있어야 한다. 아니면 'auto'라고 반환.
         * @param	{Element}	el			대상 Element
         * @param	{String}	property	기본값 all, z-index표기법 사용
         * @return	{Style, StyleValue}
         */
        current: function ( el, property ) {
            if ( window.getComputedStyle ) {
                this.current = function ( el, property ) {
                    var current = window.getComputedStyle( el, null );
                    if ( !current ) return;
    
                    return ( property )? current.getPropertyValue( property ) : current;
                };
    
                //IE6~8
            } else if ( document.documentElement.currentStyle ) {
                this.current = function ( el, property ) {
                    var current = el.currentStyle;
                    if ( !current ) return;
    
                    return ( property )? current[$B.string.camelCase(property)] : current;
                };
            }
    
            return this.current( el, property );
        },
    
        /**
         * 지정된 ComputedStyle을 보정(pixel)하여 반환 (IE6~8 전용), 읽기전용
         * 사파리, 크롬, z-index를 구할려면, position이 설정되어 있어야 한다. 아니면 'auto'라고 반환.
         * @param	{Element}	el			대상 Element
         * @param	{String}	property	기본값 all, z-index표기법 사용
         * @return	{Style, StyleValue}
         */
        computed: function ( el, property ) {
            var left, rs, rsLeft,
                result = $B.style.current( el, property ),
                style = el.style,
                name = $B.string.camelCase( property );
    
            if ( result == null && style && style[name] ) result = style[name];
    
            var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                rposition = /^(top|right|bottom|left)$/,
                rnumnonpx = new RegExp( '^(' + core_pnum + ')(?!px)[a-z%]+$', 'i' );
    
            if ( rnumnonpx.test( result ) && !rposition.test( name ) ) {
                left = style.left;
                rs = el.runtimeStyle;
                rsLeft = rs && rs.left;
    
                if ( rsLeft ) rs.left = el.currentStyle.left;
    
                style.left = (name === 'fontSize')? '1em' : result;
                result = style.pixelLeft + 'px';
    
                style.left = left;
                if ( rsLeft ) rs.left = rsLeft;
            }
    
            if ( result == 'auto' && name == 'width' || name == 'height' ) {
                result = $B( el ).rect()[name] + 'px';
            }
    
            //color값에서 keyword를 16진수로 변환
            if ( /color/i.test(property) ) {
                var colorKey = $B.color.keyword( result );
                if ( colorKey )  result = colorKey;
            }
    
            return result;
        },
    
        /**
         * opacity(투명도)를 설정하거나 반환, IE6~8 크로스브라우징을 위해서 사용, ie6에서는 png핵을 이용한 png에만 적용가능
         * @param	{Element}	el			대상 Element
         * @param	{Number}	percent	0~1
         */
        opacity: function ( el, percent ) {
            if ( $B.ua.DOC_MODE_IE9_LT ) {
                this.opacity = function ( el, percent ) {
                    //setter
                    if ( percent || percent == 0 ) {
                        percent = Number(percent);
                        //el.style.opacity = percent;
    
                        var ralpha = /alpha\([^)]*\)/i,
                            style = el.style,
                            cStyle = el.currentStyle,
                            opacity = ( typeof percent === 'number' )? 'alpha(opacity=' + (percent * 100) + ')' : '',
                            filter = cStyle && cStyle.filter || style.filter || '', css = '';
    
                        //style.zoom = 1;
                        if ( percent >= 1 && $B.string.trim( filter.replace( ralpha, '' ) ) === '' ) {
                            style.removeAttribute( 'filter' );
                            if ( cStyle && !cStyle.filter ) return;
                        }
    
                        //style.filter = ralpha.test( filter )? filter.replace( ralpha, opacity ) : filter + ' ' + opacity;
                        css = ralpha.test( filter )? filter.replace( ralpha, opacity ) : filter + ' ' + opacity;
                        $B.style.inline( el, 'zoom: 1; filter:' + css );
    
                        //getter
                    } else {
                        var ropacity = /opacity\s*=\s*([^)]*)/;
                        return ropacity.test( (el.currentStyle ? el.currentStyle.filter : el.style.filter) || '' ) ?
                        0.01 * parseFloat( RegExp.$1 ) : 1;
                    }
                };
            } else {
                this.opacity = function ( el, percent ) {
                    //setter
                    if ( percent || percent == 0 ) {
                        el.style.opacity = percent;
                        //getter
                    } else {
                        return $B.style.current( el, 'opacity' );
                    }
                };
            }
    
            return this.opacity( el, percent );
        },
    
        /**
         * Style Properties를 {propName: {name, value, unit}} 형식으로 파싱해서 반환
         * @param	{String}		target		대상 스타일 문자열, 예)"width: 100px; height: 200px;"
         * @return	{Object}
         */
        parse: function ( target ) {
            var props = {};
    
            String(target).replace( this.REG_CSS, function ( str, n, v ) {
                var obj = $B.style.parseValue( v );
                props[ $B.string.camelCase(n) ] = {name: n, value: obj.value, unit: obj.unit};
            });
            return props;
        },
    
        /**
         * Style Property Value를 Object(value, unit)으로 파싱해서 반환
         * @param	{String}		target		대상 스타일값 문자열, 예)"100px"
         * @return	{Object}
         */
        parseValue: function ( target ) {
            var result = {},
                val = String( target );
    
            if ( val && val.indexOf('(') > -1 ) {
                result = {value: $B.string.trim(val), unit: ''};
            } else {
                val.replace( this.REG_CSS_VALUE, function (str, v, u) {
                    result = {value: $B.string.trim(v), unit: u || ''};
                });
            }
            return result;
        },
    
        /**
         * 인라인 스타일 property를 삭제.
         * @param	{Element}	el			대상 Element
         * @param	{String}	property		"z-index" 표기법
         */
        remove: function ( el, property ) {
            if ( el ) $B( el.style ).removeProp( property );
        }
    };


    // ############################################################################ //
    // ############################################################################ //
    // 									utils										//
    // ############################################################################ //
    // ############################################################################ //
    /**
     * @type	{utils}
     */
    ixBand.utils = {
        /**
         * 쿠키를 반환하거나 설정한다.
         * @param {String}	name			쿠키명
         * @param {String, Boolean, Number}	value			쿠키값 설정, encodeURIComponent로 인코딩되어 저장된다.
         * @param {Number}	expireMinutes	만료시간 설정, 30초 입력시 0.5, 값을 넣지 않으면 Session Cookie가 된다.
         * @param {String}	path			경로설정, 하위폴더에서도 해당 쿠키를 사용하기 위해서 설정, "/"로 시작해야 한다. ex: "/sub/", 기본값 "/"
         * @param {String}	domain			서브도메인을 설정
         * @param {Boolean} secure          SSL을 이용하여 서버에 쿠키를 전송
         * @return	{String}	cookieValue, decodeURIComponent로 디코딩되어 반환, 찾지 못하면 undefined
         */
        cookie: function ( name, value, expireMinutes, path, domain, secure ) {
            //setter
            if ( typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ) {
                var min = ( expireMinutes || expireMinutes == 0 )? Number( expireMinutes ) : '',
                    today = new Date(),
                    result = name + '=' + encodeURIComponent( value ) + '; path=' + ( path || '/' ) + ';';
    
                if ( typeof min === 'number' ) {
                    today.setSeconds( today.getSeconds() + (min * 60) );
                    result += ' expires=' + today.toUTCString() + ';';
                }
    
                if ( typeof domain === 'string' && domain.length > 0 ) result += ' domain=' + domain + ';';
                if ( secure === true )  result += ' secure';
    
                document.cookie = result;
    
                //getter
            } else {
                var reg = new RegExp( '(?:' + name + '=)([\\w\\W][^;]*)' ),
                    result = undefined;
    
                document.cookie.replace( reg, function ( fs, v ) {
                    result = decodeURIComponent( v );
                });
                return result;
            }
        },
    
        /**
         * target과 자식들의 Custom Attribute 검색후 삭제
         * @param	{Array}		els			대상 Element 배열
         * @param	{Array}		attrs		Attribute Name 배열
         * @param	{Boolean}	childAttr	자식들도 검색할건지 설정, 기본 false
         */
        removeCustomAttribute: function ( els, attrs, childAttr ) {
            var i, j, elNum = els.length, children, attrNum = attrs.length;
    
            for ( i = 0; i < elNum; ++i ) {
                var el = els[i];
    
                for ( j = 0; j < attrNum; ++j ) {
                    var prop =  attrs[j];
    
                    if ( $B( el ).attr( prop ) ) {
                        $B( el ).removeAttr( prop );
                    }
                }
    
                if ( childAttr ) {
                    children = el.children;
                    if ( children.length > 0 ) {
                        $B.utils.removeCustomAttribute( children, attrs, true );
                    }
                }
            }
        },
    
        /**
         * IE7~8 PNG Opacity 버그 핵, img와 background-img에 적용가능, IE9부터는 동작하지 않게 분기되어 있다.
         * background가 적용되어있으면 아래의 버그핵을 적용하지 않아도 된다.
         * <버그핵이 정상적으로 반영되기 위한조건>
         * 1. 투명 PNG이미지는 반드시 Node에 싸서 Node에 Opacity를 줘야 한다.
         * 2. ie8에서 이미지에 position을 주면 안된다.
         * 3. ie8에서 filter상속 부분때문에.. 자식들에게 filter: inherit를 써준다.
         * 4. ie7에서 자식들에게 필터 상속을 하려면 부모의 positon을 꼭 써줘야 한다.
         * @param	{Selector || Array || Element}	target		대상들
         * @param	{Boolean}	overlay		기본값 true, false설정시 그림자가 진해지는 현상은 제거할수 있으나 이미지에 따라 제대로 핵이 안될수도 있다.
         */
        hackPNGOpacity: function ( target, overlay ) {
            if ( !$B.ua.DOC_MODE_IE9_LT ) return;
            overlay = ( overlay == false )? false : true;
            var imgs, i, imgNum;
    
            if ( typeof target === 'string' ) {
                imgs = $B( document ).selectorAll( target );
            } else if ( $B.array.is(target) ) {
                imgs = target;
            } else {
                imgs = [target];
            }
    
            imgNum = imgs.length;
    
            for ( i = 0; i < imgNum; ++i ) {
                var img = imgs[i], imgSrc = '', bg_style;
    
                if ( img.nodeName ) {
                    if ( img.nodeName == 'IMG' ) {
                        if ( img.src ) imgSrc = img.src;
                    } else {
                        bg_style = $B.style.current( img, 'background-image' );
                        if ( bg_style.indexOf('url') > -1 ) imgSrc = bg_style.split('"')[1];
                    }
    
                    if ( /.png|.PNG/.test(imgSrc) ) {
                        if ( overlay ) imgSrc = '';
                        img.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",sizingMethod="scale",src="' + imgSrc + '")';
                    }
                }
            }
        },
    
        /**
         * url의 parameter 의 값을 반환하거나, object를 조합하여 url parameter string으로 반환
         * @param {String, Object}    value
         * @return  {*}
         */
        urlParam: function ( value ) {
            if ( $B.isObject(value) ) {
                var str = location.search;
    
                str = ( /^\?[^\?\=]+\=/.test(str) )? str + '&' : '?' + str;
    
                for ( var key in value ) {
                    str += key + '=' + value[key] + '&';
                }
    
                return str.replace( /\&$/, '' );
            } else {
                var result = {};
                location.search.replace( /(\w*)\=([^&]*)/g, $B.bind(function ( str, prop, val ) {
                    if ( prop ) result[prop] = $B.string.convertDataType( val );
                }, this));
    
                if ( typeof value === 'string' ) {
                    if ( result[value] ) {
                        result = result[value];
                    } else {
                        result = '';
                    }
                }
    
                return result;
            }
        }
    };


    // ============================================================== //
    // =====================		Ease	========================= //
    // ============================================================== //
    /**
     * Easing
     * http://code.google.com/p/tweener/
     * @type	{ease}
     * @param	{Number}	t	Current time (in frames or seconds).
     * @param	{Number}	b	Starting value.
     * @param	{Number}	c	Change needed in value.
     * @param	{Number}	d	Expected easing duration (in frames or seconds).
     * @return	{Number}	The correct value.
     */
    ixBand.utils.ease = {
        none: function(t, b, c, d) {
            return c*t/d + b;
        },
        yoyo: function(t, b, c, d) {
            return ixBand.utils.ease.quadOut(t, b, c, d/2);
        },
        bounceIn: function(t, b, c, d) {
            return c - ixBand.utils.ease.bounceOut(d-t, 0, c, d) + b;
        },
        bounceOut: function(t, b, c, d) {
            if((t/=d) <(1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if(t <(2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if(t <(2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        bounceInOut: function(t, b, c, d) {
            if(t < d/2) return ixBand.utils.ease.bounceIn(t*2, 0, c, d) * .5 + b;
            else return ixBand.utils.ease.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
        },
        cubicIn: function(t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        cubicOut: function(t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        cubicInOut: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        elasticIn: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
            if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
        },
        elasticOut: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
            if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
            return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
        },
        elasticInOut: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
            if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
            if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        quadIn: function(t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        //Default
        quadOut: function(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        quadInOut: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 *((--t)*(t-2) - 1) + b;
        },
        backIn: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        backOut: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        backInOut: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    };


    // ============================================================== //
    // =====================	Between			===================== //
    // ============================================================== //
    
    /**
     * 구간을 설정하고, 구간에 해당되면 이벤트를 발생시킨다.
     * Event : activate (구간에 진입시 한번만 발생), deactivate (구간에 진입시 한번만 발생), between (구간에 진입시 계속해서 발생)
     * Event Properties : e.percent, e.totalPercent, e.index, e.value, e.data
     * @param   {Array} positions   포지션 데이타 배열, [{min:Number, max:Number, data:*}, ...
     */
    ixBand.utils.Between = $B.Class.extend({
        _startValue: 0,
        _endValue: 0,
        _disabled: false,
        _activeIndex: -1,
    
        initialize: function ( positions ) {
            this.update( positions );
            this._evtData = {empty: true};
            return this;
        },
    
        // ==================== Public Methods ==================== //
        /**
         * 포지션 데이타 갱신
         * @param   {Array} positions   포지션 데이타 배열, [{min:Number, max:Number, data:*}, ...
         */
        update: function ( positions ) {
            if ( $B.isArray(positions) && !$B.isEmpty(positions) ) {
                this._startValue = positions[0].min;
                this._endValue = positions[positions.length - 1].max;
                this._positions = positions.concat([]);
            }
            return this;
        },
        /**
         * 기준 수치를 갱신하여 이벤트를 발생시킨다. (positions, baseValue 둘중에 하나라도 값의 변화가 있어야 동작한다.)
         * @param   {Number} baseValue   기준이 되는 수치 갱신
         */
        trigger: function ( baseValue ) {
            if ( !$B.isEmpty(baseValue) ) {
                this._calculate( baseValue );
            }
            return this;
        },
        /**
         * 이벤트 발생 허용
         */
        enable: function () {
            this._disabled = false;
            return this;
        },
        /**
         * 이벤트 발생 차단
         */
        disable: function () {
            this._disabled = true;
            return this;
        },
    
        // ==================== Private Methods ==================== //
    
        _isEqual: function ( datas ) {
            var result = true;
    
            for ( var key in datas ) {
                if ( key !== 'data' ) {
                    if ( this._evtData[key] !== datas[key] ) {
                        result = false;
                        break;
                    }
                }
            }
    
            return result;
        },
    
        _calculate: function ( value ) {
            if ( !$B.isArray(this._positions) ) return;
            var activeData = this._getActiveData( value );
    
            if ( activeData.activeIndex > -1 ) {
                //activate
                this._dispatch( 'activate', activeData, value );
            } else {
                //deactivate
                this._dispatch( 'deactivate', activeData, value );
            }
        },
    
        _getActiveData: function ( value ) {
            var result = {activeIndex: -1},
                posLength = this._positions.length;
    
            for ( var i = 0; i < posLength; ++i ) {
                var pos = this._positions[i];
                if ( pos.min <= value && pos.max >= value ) {
                    result.activeIndex = i;
                    result.data = pos;
                    break;
                }
            }
    
            return result;
        },
    
        _valueToPercent: function ( min, max, value ) {
            return (value - min) / (max - min);
        },
    
        _dispatch: function ( type, datas, value ) {
            if ( this._disabled ) return;
    
            var evtData, isBetween;
    
            if ( type === 'activate' ) {
                evtData = {
                    percent: this._valueToPercent( datas.data.min, datas.data.max, value ),
                    totalPercent: this._valueToPercent( this._startValue, this._endValue, value ),
                    value: value,
                    index: datas.activeIndex,
                    data: datas.data.data
                };
            } else {
                evtData = {};
            }
    
            isBetween = type === 'activate' && !this._isEqual( evtData );
    
            if ( this._activeIndex !== datas.activeIndex ) {
                this.dispatch( type, evtData );
                if ( !isBetween ) this._evtData = evtData;
            }
    
            if ( isBetween ) {
                this.dispatch( 'between', evtData );
                this._evtData = evtData;
            }
    
            this._activeIndex = datas.activeIndex;
        }
    
    }, '$B.utils.Between');


    // ============================================================== //
    // =====================	Delay		========================= //
    // ============================================================== //
    /**
     * Delay<br>
     * 지정한 시간이 지난후 Function실행후 Timer는 자동 삭제 된다.
     * @class	{Delay}
     * @constructor
     */
    ixBand.utils.Delay = $B.Class.extend({
        initialize: function () {
            this._delays = {};
            this._count = 0;
            return this;
        },
    
        // ===============	Public Methods =============== //
        /**
         * Delay 시작, 고유 아이디 반환
         * @param	{Number}		delay		1000/1초
         * @param	{Function}		callback	실행할 함수
         * @param	{*}				data		핸들러에서 전달받을 data
         * @return	{Int}			id			고유아이디 반환
         */
        start: function ( delay, callback, data ) {
            data = ( data || data == 0 )? data : null;
            this._count++;
            var count = this._count;
            var _this = this;
    
            this._delays[count] = setTimeout(function () {
                callback.call( _this, {data: data});
                _this.clear(count);
            }, delay);
            return count;
        },
        /**
         * 진행중인 Delay 를 모두 중지, 삭제한다.
         * @param	{Int}	id	아이디를 넣으면 해당 아이디를 가지는 Delay만 정지,삭제<br>넣지 않으면 모두삭제
         */
        clear: function (id) {
            if ( id ) {
                if ( this._delays[id] ) {
                    clearTimeout(this._delays[id]);
                    delete this._delays[id];
                }
            } else {
                for ( id in this._delays ) {
                    clearTimeout(this._delays[id]);
                    delete this._delays[id];
                }
            }
            return this;
        }
    }, '$B.utils.Delay');


    // ============================================================== //
    // =====================	RemainTimer	========================= //
    // ============================================================== //
    /**
     * Dday, 1초에 한번 이벤트 발생<br>
     * Event : timer, complete
     * Event Property : type, target, day, hour, minute, second
     * @class	{RemainTimer}
     * @constructor
     * @param	{Int}		startTime	시작시간, UTC milisecond형식
     * @param	{Int}		finishTime	완료시간, UTC milisecond형식
     */
    ixBand.utils.RemainTimer = $B.Class.extend({
        DELAY: 1000,
    
        initialize: function ( startTime, finishTime ) {
            this._startTime = startTime;
            this._finishTime = finishTime;
            this._beginTime = startTime;
            this._finishTime = finishTime;
            this._delay = this.DELAY;
            this._interval = null;
            this._running = false;
    
            this._handler = $B.bind(function (e) {
                var dday = this._getTime();
                dday.target = this;
                this.dispatch( 'timer', dday );
    
                if ( dday._gap <= 0 ) {
                    this.stop();
                    this.dispatch( 'complete', dday );
                }
            }, this);
            return this;
        },
    
        // ===============	Public Methods	=============== //
    
        /** Timer 시작, 이미 실행중이면 다시 시작하지 않는다. */
        start: function () {
            if ( !this._interval ) this._interval = setInterval( this._handler, this._delay );
            this._running = true;
            return this;
        },
        /** Timer 정지, currentCount는 재설정 하지 않는다. */
        stop: function () {
            if ( this._interval ) clearInterval( this._interval );
            this._interval = null;
            this._running = false;
            return this;
        },
        /** Stop후 currentCount = 0
         * @param	{Number}	startTime		시작시간 재설정, UTC milisecond형식, 설정하지 않으면 처음 설정했던 시작시간으로 되돌아 간다.
         * @param	{Number}	finishTime		완료시간 재설정, UTC milisecond형식, 설정하지 않으면 처음 설정했던 완료시간으로 되돌아 간다.
         * @return	this
         */
        reset: function ( startTime, finishTime ) {
            this.stop();
            this._reset( startTime, finishTime );
            return this;
        },
        /** 타이머가 실행 중이면 true반환 */
        running: function () {
            return this._running;
        },
    
        // ===============	Private Methods	=============== //
    
        _getTime: function () {
            var day, hour, minute, second,
                gapTime = this._finishTime - ( this._beginTime += this.DELAY );
    
            if ( gapTime <= 0 ) {
                return {_gap: 0, day: 0, hour: 0, minute: 0, second: 0};
            } else {
                day = Math.floor( gapTime / 1000 / 60 / 60 / 24 );
                hour = Math.floor( gapTime / 1000 / 60 / 60 - (24 * day) );
                minute = Math.floor( gapTime / 1000 / 60 - (24 * 60 * day ) - (60 * hour) );
                second = Math.floor( gapTime / 1000 - (24 * 60 * 60 * day) - (60 * 60 * hour) - (60 * minute) );
                return {_gap: gapTime, day: day, hour: hour, minute: minute, second: second};
            }
        },
    
        _reset: function ( begin, finish ) {
            this._beginTime = ( typeof begin === 'number' )? begin : this._startTime;
            this._finishTime = ( typeof finish === 'number' )? finish : this._finishTime;
        }
    }, '$B.utils.RemainTimer');


    // ============================================================== //
    // =====================	Timer		========================= //
    // ============================================================== //
    /**
     * Timer<br>
     * Event : timer, complete
     * Event Property : type, target, currentCount, data
     * @class	{Timer}
     * @constructor
     * @param	{Number}	delay		1000/1초
     * @param	{Int}		repeatCount	반복횟수, 0은 무한반복
     * @param	{Object}	data		이벤트 핸들어서 전달 받을 데이타
     */
    ixBand.utils.Timer = $B.Class.extend({
        initialize: function ( delay, repeatCount, data ) {
            this._delay = delay;
            this._repeatCount = repeatCount || 0;
            this._data = data;
            this._interval = null;
            this._running = false;
            this._count = 0;
    
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods	=============== //
    
        /** Timer 시작, 이미 실행중이면 다시 시작하지 않는다. */
        start: function () {
            if (!this._interval) this._interval = setInterval(this._handler, this._delay);
            this._running = true;
            return this;
        },
        /** Timer 정지, currentCount는 재설정 하지 않는다. */
        stop: function () {
            if (this._interval) clearInterval(this._interval);
            this._interval = null;
            this._running = false;
            return this;
        },
        /** Stop후 currentCount = 0
         * @return	this
         */
        reset: function () {
            this.stop();
            this._resetCount();
            return this;
        },
        /** 타이머가 실행 중이면 true반환 */
        running: function () {
            return this._running;
        },
    
        // ===============	Private Methods	=============== //
    
        _setEvents: function () {
            this._handler = $B.bind(function (e) {
                ++this._count;
                this.dispatch( 'timer', {target: this, currentCount: this._count, data: this._data} );
                if ( this._repeatCount > 0 && this._repeatCount == this._count ) {
                    this.stop();
                    this.dispatch( 'complete', {target: this, currentCount: this._count, data: this._data} );
                }
            }, this);
        },
    
        _resetCount: function () {
            this._count = 0;
        }
    }, '$B.utils.Timer');


    // ============================================================== //
    // =====================	TweenCore	========================= //
    // ============================================================== //
    /**
     * TweenCore
     * Event : tween, complete, seekcomplete
     * Event Property : type, target, currentValue, progress=시간진행률, percent, currentCount, totalCount, data
     * @class	{TweenCore}
     * @constructor
     * @param	{Number}		duration	동작되는 시간, 초
     * @param	{Number}		begin		출발값
     * @param	{Number}		finish		도착값
     * @param	{Object}		option		ease: ixBand.utils.ease 선택, 추가 하여 사용
     * @param	{Object}		data		이벤트핸들러에서 전달받을수 있다. e.data
     */
    ixBand.utils.TweenCore = $B.Class.extend({
        initialize: function ( duration, begin, finish, option, data ) {
            this._duration = duration;
            this._begin = begin;
            this._finish = finish;
            this._option = option || {};
            this._ease = this._option.ease || $B.utils.ease.quadOut;
            this._data = ( $B.isEmpty(data) )? null : data;
    
            this._finishValue = 0;
            this._cValue = 0;
            this._fps = 0;
            this._loopTime = 0;
            this._currentCount = 0;
            this._interval = null;
            this._progress = 0;
            this._percent = 0;
            this._totalCount = 0;
            this._seekCount = 0;
            this._forward = null;
            this._delay = null;
    
            this._delayTime = 0;
            this._delayCallback = null;
            this._seekCom = false;//true면 seekcomplete 발생
    
            this._setValue( this._begin, this._finish );
            //기본 fps PC : 60, Mobile : 30
            this._setFPS( ($B.ua.MOBILE_IOS || $B.ua.ANDROID) ? 30 : 60 );
            this._setEventsHandler();
            return this;
        },
    
        // ===============	Public Methods =============== //
    
        /** 해당 초만큼 지연시킨후 다음 Method실행, 한명령줄에 하나의 delay만 사용한다.
         * @param	{Number}	time		초단위, 예) 0.5초
         * @param	{Function}	callback	delay가 끝나는 이벤트 전달
         * @return	this
         */
        delay: function ( time, callback ) {
            this._delayTime = time * 1000;
            if ( callback ) this._delayCallback = callback;
            return this;
        },
        /** 시작(리셋후)
         * @return	this
         */
        start: function () {
            this.reset();
            this.seek( 1, 'not' );
            return this;
        },
        /** 정지
         * @return	this
         */
        stop: function () {
            this._clearDelay();
            this._timerStop();
            return this;
        },
        /** Stop후 0
         * @return	this
         */
        reset: function () {
            this._clearDelay();
            this._timerStop();
            this._reset();
            return this;
        },
        /**
         * 해당탐색 구간으로 Tween
         * @param	{Number}	progress 0~1
         * @return	this
         */
        seek: function ( progress, seekCom ) {
            if ( progress < 0 ) {
                progress = 0;
            } else if ( progress > 1 ) {
                progress = 1;
            }
    
            this._seekCom = ( seekCom === 'not' )? false : true;
            this._setSeekValue( progress );
            //this._clearDelay();
    
            if ( this._delayTime > 0 ) {
                this._startDelay( this._timerStart, this._delayTime );
            } else {
                this._timerStart();
            }
            return this;
        },
        /**
         * 해당탐색 구간으로 즉시 이동
         * @param	{Number}	progress 0~1
         * @return	this
         */
        seekTo: function ( progress ) {
            if ( progress < 0 ) {
                progress = 0;
            } else if ( progress > 1 ) {
                progress = 1;
            }
    
            this._seekCom = true;
            this._setSeekValue( progress );
            //this._clearDelay();
    
            if ( this._delayTime > 0 ) {
                this._startDelay( this._to, this._delayTime );
            } else {
                this._to();
            }
            return this;
        },
        /** progress가 0이면 1, 1이면 0으로 Tween
         * @return	this
         */
        toggle: function () {
            var per = 0;
    
            if ( this._forward == null ) {
                per = ( this._progress == 0 )? 1 : 0;
            } else {
                per = ( this._forward )? 0 : 1;
            }
    
            this.seek( per );
            return this;
        },
        /**
         * value 재설정
         * @param	{Number}	begin	출발값
         * @param	{Number}	finish	도착값
         * @param	{Object}	data	이벤트핸들러에서 전달받을수 있다. e.data
         * @return	this
         */
        value: function ( begin, finish, data ) {
            this._setValue( begin, finish, data );
            return this;
        },
        /**
         * FPS설정
         * @param	{Int}	frame	기본 fps PC : 60, Mobile : 30
         * @return	{Int, this}
         */
        fps: function ( frame ) {
            if ( $B.isNumber(frame) ) {
                this._setFPS( frame );
                return this;
            } else {
                return this._fps;
            }
        },
    
        // ===============	Private Methods =============== //
        _setEventsHandler: function () {
            this._timerStart = $B.bind(function () {
                //delayComplete
                if ( this._delayCallback ) this._delayCallback.call( this, {type: 'delay', data: this._data} );
                this._clearDelay();
    
                if ( this._duration <= 0 ) {
                    this._cValue = finish;
                    this._progress = 1;
                    this._percent = 1;
    
                    this.dispatch( 'tween', {target: this, currentValue: this._cValue, progress: this._progress, percent: this._percent, currentCount: this._currentCount, totalCount: this._totalCount, data: this._data} );
                    this.dispatch( 'complete', {target: this, currentValue: this._cValue, progress: this._progress, percent: this._percent, currentCount: this._currentCount, totalCount: this._totalCount, data: this._data});
                } else {
                    if ( !this._interval ) this._interval = setInterval( this._intervalHandler, this._loopTime );
                }
            }, this);
    
            this._to = $B.bind(function () {
                //delayComplete
                if ( this._delayCallback ) this._delayCallback.call( this, {type: 'delay', data: this._data} );
                this._clearDelay();
    
                this._currentCount = this._seekCount;
                this._intervalHandler();
            }, this);
    
            this._intervalHandler = $B.bind(function (e) {
                this._cValue = this._ease.call( this, this._currentCount, this._begin, this._finishValue, this._totalCount );
                this._percent = ( this._finishValue == 0 )? 1 : ( this._cValue - this._begin ) / this._finishValue;
                this._progress = this._currentCount / this._totalCount;
    
                var evt = {target: this, currentValue: this._cValue, progress: this._progress, percent: this._percent, currentCount: this._currentCount, totalCount: this._totalCount, data: this._data };
                //tween
                this.dispatch( 'tween', evt );
                //complete
                if ( this._currentCount >= this._totalCount && this._seekCount == this._totalCount ) {
                    this._timerStop();
                    this.dispatch( 'complete', evt );
                    if ( this._seekCom ) this.dispatch( 'seekcomplete', evt );
                //seek
                } else {
                    if ( this._currentCount == this._seekCount ) {
                        this._timerStop();
                        if ( this._seekCom ) this.dispatch( 'complete', evt );
                        return;
                    }
                    if ( this._forward != null ) this._currentCount = ( this._forward )? ++this._currentCount : --this._currentCount;
                }
            }, this);
        },
    
        _setValue: function ( v_begin, v_finish, v_values ) {
            this._begin = ( $B.isNumber(v_begin) )? v_begin : this._cValue;
            if ( $B.isNumber(v_finish) ) this._finish = v_finish;
            if ( !$B.isEmpty(v_values) ) this._data = v_values;
    
            this._finishValue = this._finish - this._begin;
        },
    
        _timerStop: function () {
            if ( this._interval ) {
                clearInterval( this._interval );
                this._interval = null;
            }
        },
    
        _reset: function () {
            this._forward = null;
            this._cValue = this._begin;
            this._progress = 0;
            this._percent = 0;
            this._currentCount = 0;
        },
    
        _setSeekValue: function ( per ) {
            this._seekCount = Math.round( this._totalCount * per );
    
            if ( this._seekCount > this._currentCount ) {
                this._forward = true;
            } else if ( this._seekCount < this._currentCount ) {
                this._forward = false;
            } else {
                this._forward = null;
            }
        },
    
        _startDelay: function ( callBack, time ) {
            if ( !this._delay ) this._delay = setTimeout( callBack, time );
        },
    
        _clearDelay: function () {
            if ( this._delay ) {
                clearTimeout( this._delay );
                this._delay = null;
            }
            this._delayTime = 0;
            this._delayCallback = null;
        },
    
        _setFPS: function ( val ) {
            this._fps = val;
            this._loopTime = Math.ceil( 1000 / this._fps );
            this._totalCount = Math.ceil( (this._duration * 1000) / this._loopTime );
        }
    }, '$B.utils.TweenCore');


    // ============================================================== //
    // =====================	TweenCSS	========================= //
    // ============================================================== //
    /**
     * CSS기반 Tweener
     * ie7에서 동작하지 않을시 대상에 position을 설정하면 된다.
     * Event : tween, complete, seekcomplete
     * Event Property : type, target, progress=시간진행률, percent, currentCount, totalCount, data
     * @class	{TweenCSS}
     * @constructor
     * @param	{Selector, Element, jQuery}	target			대상
     * @param	{Number}			duration		동작되는 시간, 초
     * @param	{String}			begin_props		출발값들, null을 설정하면 대상의 스타일 속성을 검색(해당스타일 속성이 없으면 에러)
     * @param	{String}			finish_props	도착값들
     * @param	{Object}			option			ease: ixBand.utils.ease 선택, 추가 하여 사용
     * @param	{Object}			data			이벤트핸들러에서 전달받을수 있다. e.data
     */
    ixBand.utils.TweenCSS = $B.Class.extend({
        initialize: function ( target, duration, begin_props, finish_props, option, data ) {
            this._target = $B( target ).element();
            this._duration = duration;
            this._option = option;
            this._data = data;
    
            this._b_props = [];
            this._f_props = [];
            this._propLength = 0;
    
            //스타일속성, 값, 단위 분리
            this.addProp( begin_props, finish_props );
            this._addEvents();
            return this;
        },
    
        // ===============	Public Methods =============== //
    
        /** 해당 초만큼 지연시킨후 다음 Method실행, 한명령줄에 하나의 delay만 사용한다.
         * @param	{Number}	time		초단위, 예) 0.5초
         * @param	{Function}	callback	delay가 끝나는 이벤트 전달
         * @return	this
         */
        delay: function ( time, callback ) {
            this._tweenCore.delay( time, callback );
            return this;
        },
        /** 시작(리셋후)
         * @return	this
         */
        start: function () {
            this._tweenCore.start();
            return this;
        },
        /** 정지
         * @return	this
         */
        stop: function () {
            this._tweenCore.stop();
            return this;
        },
        /** Stop후 0
         * @return	this
         */
        reset: function () {
            this._tweenCore.reset();
            return this;
        },
        /**
         * 해당탐색 구간으로 Tween
         * @param	{Number}	progress 0~1
         * @return	this
         */
        seek: function ( progress ) {
            this._tweenCore.seek( progress );
            return this;
        },
        /**
         * 해당탐색 구간으로 즉시 이동
         * @param	{Number}	progress 0~1
         * @return	this
         */
        seekTo: function ( progress ) {
            this._tweenCore.seekTo( progress );
            return this;
        },
        /** progress가 0이면 1, 1이면 0으로 Tween
         * @return	this
         */
        toggle: function () {
            this._tweenCore.toggle();
            return this;
        },
    
        /**
         * FPS설정
         * @param	{Int}	frame	기본 fps PC : 60, Mobile : 30
         * @return	{Int, this}
         */
        fps: function ( frame ) {
            if ( $B.isNumber(frame) ) {
                this._tweenCore.fps( frame );
                return this;
            } else {
                return this._tweenCore.fps();
            }
        },
    
        /**
         * 스타일 속성들 추가<br>
         * 예)'width: 100px; z-index: 3;'
         * @param	{String}	begin_props
         * @param	{String}	finish_props
         * @return	this
         */
        addProp: function ( begin_props, finish_props ) {
            var b_props = ( begin_props )? $B.style.parse( begin_props ) : [],
                f_props = $B.style.parse( finish_props ), n;
    
            for ( n in f_props ) {
                var f_property = f_props[n],
                    b_property = b_props[n];
    
                if ( !b_property ) b_property = this._getTweenStyle( this._target, f_property );
                //Color
                if( f_property.name.indexOf('color') > -1 ) {
                    var cType = $B.color.type( f_property.value );
    
                    if ( $B.ua.DOC_MODE_IE9_LT && cType == 'rgba' ) cType = 'rgb';
    
                    f_property.unit = 'color';
                    f_property.colorType = cType;
                } else {
                    b_property.value = Number( b_property.value );
                    f_property.value = Number( f_property.value ) - b_property.value;
                }
    
                //Scroll
                var cName = $B.string.camelCase( b_property.name );
                if ( cName == 'scrollTop' || cName == 'scrollLeft' ) {
                    b_property.name = cName;
                    f_property.name = $B.string.camelCase( f_property.name );
                }
    
                this._addProperty( b_property, f_property );
            }
            return this;
        },
        /**
         * 스타일속성들 삭제<br>
         * 'z-index' 표기법 사용
         * @param	{String...}		propName
         * @return	this
         */
        removeProp: function () {
            var args = arguments,
                argNum = args.length, i;
    
            for ( i = 0; i < argNum; ++i ) {
                var delIdx = this._propertyIndexOf( args[i] );
    
                if ( delIdx > -1 ) {
                    this._b_props.splice( delIdx, 1 );
                    this._f_props.splice( delIdx, 1 );
                }
            }
    
            this._propLength = this._f_props.length;
            return this;
        },
    
        // ===============	Private Methods =============== //
        _addEvents: function () {
            this._tweenHandler = $B.bind(function (e) {
                var i, c_value;
                for ( i = 0; i < this._propLength; ++i ) {
                    var f_property = this._f_props[i],
                        b_property = this._b_props[i],
                        fName = f_property.name,
                        fValue = f_property.value;
    
                    //Color
                    if( f_property.unit == 'color' ) {
                        c_value = $B.color.mix( b_property.value, fValue, e.percent, f_property.colorType );
                    } else {
                        c_value = ( fValue * e.percent + b_property.value ) + f_property.unit;
                    }
    
                    //Opacity
                    if ( fName == 'opacity' ) {
                        $B.style.opacity( this._target, fValue * e.percent + b_property.value );
                        //ScrollTop
                    } else if ( fName == 'scrollTop' ) {
                        $B( this._target ).scrollTop( Number(c_value) );
                        //ScrollLeft
                    } else if ( fName == 'scrollLeft' ) {
                        $B( this._target ).scrollLeft( Number(c_value) );
                    } else {
                        this._target.style[f_property.styleName] = c_value;
                    }
                }
    
                this.dispatch( e.type, e );
            }, this);
    
            this._tweenCore = new $B.utils.TweenCore( this._duration, 0, 1, this._option, this._data )
                    .addListener( 'tween', this._tweenHandler )
                    .addListener( 'complete', this._tweenHandler )
                    .addListener( 'seekcomplete', this._tweenHandler );
        },
    
        //스타일속성이 있는지 체크후 index반환, 없을시 -1
        _propertyIndexOf: function ( propName ) {
            var result = -1, i;
            for ( i = 0; i < this._propLength; ++i ) {
                if ( this._f_props[i].name == propName ) {
                    result = i;
                    break;
                }
            }
            return result;
        },
    
        //스타일속성 배열에 넣기
        _addProperty: function ( begin_prop, finish_prop ) {
            var findIdx = this._propertyIndexOf( finish_prop.name ),
                styleName = $B.string.camelCase( finish_prop.name );
    
            begin_prop.styleName = styleName;
            finish_prop.styleName = styleName;
    
            if ( findIdx == -1 ) {
                this._b_props.push( begin_prop );
                this._f_props.push( finish_prop );
            } else {
                this._b_props[findIdx] = begin_prop;
                this._f_props[findIdx] = finish_prop;
            }
    
            this._propLength = this._f_props.length;
        },
    
        /**
         * 현재 객체의 Style Property 를 파싱해서 반환
         * @private
         */
        _getTweenStyle: function ( target, propSet ) {
            var get_prop = {},
                cName = $B.string.camelCase( propSet.name ),
                value, valueSet;
    
            get_prop.name = propSet.name;
    
            if ( cName == 'scrollTop' ) {
                value = $B( target ).scrollTop();
            } else if ( cName == 'scrollLeft' ) {
                value = $B( target ).scrollLeft();
            } else {
                value = $B( target ).css( get_prop.name );
            }
    
            if ( value == 'transparent' || value == 'auto' || value == undefined ) {
                throw new Error( '[ixBand] TweenCSS의 대상의 Style "' + get_prop.name + '"가 설정되어 있지않아 Tween 실행불가!' );
            }
    
            if ( typeof value === 'number' ) value = String(value);
    
            valueSet = $B.style.parseValue( value );
            get_prop.value = valueSet.value;
            get_prop.unit = valueSet.unit;
    
            return get_prop;
        }
    }, '$B.utils.TweenCSS');


    // ============================================================== //
    // =====================	TouchEvent		===================== //
    // ============================================================== //
    
    /**
     * TouchEvent 크로스 브라우징, 하나의 대상의 하나의 TouchEvent 객체 등록
     * @constructor
     * @param	{Element || Selector || jQuery}	target		이벤트 발생 대상
     */
    ixBand.event.TouchEvent = $B.Class.extend({
        POINTER_TYPES: ['', '', 'touch', 'pen', 'mouse'],
    
        initialize: function ( target ) {
            this._target = $B( target ).element();
            this._touches = {};
            this._isEndEvent = false;
    
            this._setEvents();
        },
    
        // ===============	Public Methods =============== //
    
        /**
         * 이벤트 등록
         * @param	{String}	type		touchstart, touchmove, touchend, touchcancel
         * @param	{Function}	listener		event listener
         * @param	{Boolean|Object}	useCapture || options	capture, passive 등을 설정, default:false
         * 				https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener 참조
         * @return	{TouchEvent}
         */
        addListener: function ( type, listener, useCapture ) {
            if ( this._target && $B.ua.TOUCH_DEVICE && /^touch/i.test(type) ) {
                useCapture = useCapture || false;
    
                if ( this.hasListener(type, listener, useCapture) ) return this;
    
                if ( MS_POINTER && !this._isEndEvent ) {
                    document.addEventListener( this._getCrossType('touchend'), this._touchHandler, false );
                    document.addEventListener( this._getCrossType('touchcancel'), this._touchHandler, false );
                    this._isEndEvent = true;
                }
    
                //중첩된 함수를 정의하고 이 함수를 listener 함수 대신 등록한다.
                var wrapHandler = $B.bind(function (e) {
                    var crossType = this._originToCrossType( e.type );
    
                    if ( MS_POINTER ) {
                        if ( crossType === 'touchstart' || crossType === 'touchmove' ) {
                            this._addTouch(e);
                        } else if ( crossType === 'touchend' || crossType === 'touchcancel' ) {
                            this._removeTouch(e);
                        }
                    }
    
                    var evt = {
                        _event: e,			//실제 이벤트 객체
                        type: crossType,
                        target: e.target,
                        currentTarget: e.currentTarget,
                        relatedTarget: e.relatedTarget,
                        eventPhase: e.eventPhase,
                        shiftKey: e.shiftKey, charCode: e.charCode,
                        altKey: e.altKey,
                        ctrlKey: e.ctrlKey,
                        //이벤트 관리 함수
                        stopPropagation: function () { if (this._event) this._event.stopPropagation(); },
                        preventDefault: function () { if (this._event) this._event.preventDefault(); },
                        touches: this._getTouches( crossType, e )
                    };
    
                    this.dispatch( evt.type, evt );
                }, this);
    
                var evtData = {
                    useCapture: useCapture || false,
                    wrapHandler: wrapHandler
                };
    
                $B.Class.prototype.addListener.call( this, type, listener, evtData );
                this._target.addEventListener( this._getCrossType(type), wrapHandler, evtData.useCapture );
            }
            return this;
        },
    
        /**
         * 이벤트 삭제, type만 입력하면 해당 타입과 일치하는 이벤트 모두 삭제, type listener모두 설정하지 않으면 대상의 모든 이벤트 삭제
         * @param	{String}	type		touchstart, touchmove, touchend, touchcancel
         * @param	{Function}	listener		event listener
         * @param	{Boolean|Object}	useCapture || options	capture, passive 등을 확인 후 삭제, default:false
         * @return	{TouchEvent}
         */
        removeListener: function ( type, listener, useCapture ) {
            var events = this.__eventPool__[type],
                crossType = this._getCrossType( type ),
                evtLength = 0, i;
    
            if ( events ) {
                evtLength = events.length;
    
                if ( $B.isFunction(listener) ) {
                    for ( i = 0; i < evtLength; ++i ) {
                        var eData = events[i];
                        if ( listener === eData.listener && $B.isEqual(eData.options.useCapture, useCapture || false) ) {
                            this._target.removeEventListener( crossType, eData.options.wrapHandler, eData.options.useCapture );
                            events.splice( $B.array.indexOf(events, events[i]), 1 );
                        }
                    }
                } else {
                    for ( i = 0; i < evtLength; ++i ) {
                        this._target.removeEventListener( crossType, events[i].options.wrapHandler, events[i].options.useCapture );
                    }
    
                    delete this.__eventPool__[type];
                }
            } else {
                for ( var key in this.__eventPool__ ) {
                    events = this.__eventPool__[key];
                    crossType = this._getCrossType( key );
                    evtLength = events.length;
    
                    for ( i = 0; i < evtLength; ++i ) {
                        this._target.removeEventListener( crossType, events[i].options.wrapHandler, events[i].options.useCapture );
                    }
                }
                this.__eventPool__ = {};
            }
            return this;
        },
    
        /**
         * 이벤트 등록여부 반환
         * @param	{String}	type		touchstart, touchmove, touchend, touchcancel
         * @param	{Function}	listener		event listener
         * @param	{Boolean}	useCapture	useCapture || options	capture, passive 등의 설정 여부 확인, default:false
         * @return	{Boolean}
         */
        hasListener: function ( type, listener, useCapture ) {
            var result = false,
                events = this.__eventPool__[type];
    
            if ( events ) {
                if ( $B.isFunction(listener) ) {
                    var evtLength = events.length, i;
    
                    if ( !$B.isEmpty(useCapture) ) {
                        for ( i = 0; i < evtLength; ++i ) {
                            var eData = events[i];
                            if ( listener === eData.listener && $B.isEqual(eData.options.useCapture, useCapture || false) ) {
                                result = true;
                                break;
                            }
                        }
                    } else {
                        for ( i = 0; i < evtLength; ++i ) {
                            if ( listener === events[i].listener ) {
                                result = true;
                                break;
                            }
                        }
                    }
                } else {
                    result = true;
                }
            }
    
            return result;
        },
    
        /**
         * 등록된 모든 이벤트 삭제
         * @return	{TouchEvent}
         */
        clear: function () {
            this.removeListener();
    
            if ( MS_POINTER && this._isEndEvent ) {
                document.removeEventListener( this._getCrossType('touchend'), this._touchHandler, false );
                document.removeEventListener( this._getCrossType('touchcancel'), this._touchHandler, false );
                this._isEndEvent = false;
            }
    
            return this;
        },
    
        // ===============	Private Methods =============== //
    
        _setEvents: function () {
            this._touchHandler = $B.bind(function (e) {
                this._removeTouch(e);
            }, this);
        },
    
        _addTouch: function ( event ) {
            //if ( event.pointerType == 'mouse' || event.pointerType == 4 ) return;
    
            this._touches[event.pointerId] = {
                target: event.target,
                clientX: event.clientX,
                clientY: event.clientY,
                pageX: event.pageX,
                pageY: event.pageY,
                screenX: event.screenX,
                screenY: event.screenY,
                pointerType: this._getPointerType( event ) //IE only
            };
        },
    
        _removeTouch: function ( event ) {
            delete this._touches[event.pointerId];
        },
    
        _getPointerType: function ( event ) {
            var result = 'touch', pointerType = event.pointerType;
    
            if ( typeof pointerType === 'string' ) {
                result = pointerType;
            } else if ( typeof pointerType === 'number' && pointerType > -1 && pointerType < 5 ) {
                result = POINTER_TYPES[pointerType];
            }
    
            return result;
        },
    
        //크로스브라우징 TouchEvent Touches 반환
        _getTouches: function ( type, event ) {
            var touches = [];
    
            if ( MS_POINTER ) {
                for ( var n in this._touches ) {
                    touches.push( this._touches[n] );
                }
            } else {
                touches = event.touches;
            }
    
            return touches;
        },
    
        //크로스브라우징 이벤트 타입 반환
        _getCrossType: function ( type ) {
            var crossType = CrossTouchEvent[type];
            return crossType || type;
        },
    
        //origin event type to cross event type
        _originToCrossType: function ( type ) {
            if ( /pointerdown/i.test(type) ) {
                type = 'touchstart';
            } else if ( /pointermove/i.test(type) ) {
                type = 'touchmove';
            } else if ( /pointerup/i.test(type) ) {
                type = 'touchend';
            } else if ( /pointercancel/i.test(type) ) {
                type = 'touchcancel';
            }
    
            return type;
        }
    }, '$B.event.TouchEvent');


    // ============================================================== //
    // =====================	DoubleTab	========================= //
    // ============================================================== //
    /**
     * DoubleTab
     * Event Property : type, target, currentTarget, stopPropagation(), preventDefault()
     * @class	{DoubleTab}
     * @constructor
     * @param	{Element || Selector || jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
     */
    ixBand.event.DoubleTab = $B.Class.extend({
        initialize: function ( target ) {
            this._target = $B( target ).element();
            this._delay = 400;
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods	=============== //
    
        /**
         * DoubleTab Event 활성화
         * @return	{DoubleTab}
         */
        enable: function () {
            if ( !this._touchEvent.hasListener('touchstart', this._touchHandler) ) {
                this._touchEvent.addListener( 'touchstart', this._touchHandler );
            }
            return this;
        },
    
        /**
         * DoubleTab Event 비활성화
         * @return	{DoubleTab}
         */
        disable: function () {
            this._touchEvent.removeListener( 'touchstart', this._touchHandler );
            return this;
        },
    
        /**
         * DoubleTab Event 및 설정값 삭제
         */
        clear: function () {
            this._touchEvent.clear();
            return this;
        },
    
        /**
         * 민감도 설정, 기본값 1.
         * 민감도를 Number로 지정, 1보다 커질수록 둔감해지고 작아질수록 민감해진다
         * @param	{Number}	value	0~1
         * @return	{DoubleTab}
         */
        sensitivity: function ( value ) {
            this._delay = value * 400;
            return this;
        },
    
        // ===============	Private Methods	=============== //
    
        _setEvents: function () {
            var _startTime = 0,
                _pos = {};
    
            this._touchHandler = $B.bind(function (e) {
                var currentTime = new Date().getTime(),
                    currentPos = this._getPos(),
                    interval = currentTime - _startTime;
    
                if ( interval < this._delay && this._isSamePos(_pos, currentPos) ) {
                    this.dispatch( 'doubletab', {
                        target: e.target,
                        currentTarget: this._target,
                        stopPropagation: function () { e.stopPropagation(); },
                        preventDefault: function () { e.preventDefault(); }
                    });
                } else {
                    _startTime = currentTime;
                    _pos = currentPos;
                }
            }, this);
    
            this._touchEvent = new $B.event.TouchEvent( this._target );
            this.enable();
        },
    
        _getPos: function () {
            var result = {};
    
            if ( this._target === window || this._target === document ) {
                result = {
                    left: $B( this._target ).scrollLeft() || 0,
                    top: $B( this._target ).scrollTop() || 0
                };
            } else {
                result = $B( this._target ).rect( true );
            }
    
            return result;
        },
    
        _isSamePos: function ( pos1, pos2 ) {
            return ( pos1.left === pos2.left && pos1.top === pos2.top );
        }
    
    }, '$B.event.DoubleTab');


    // ============================================================== //
    // =====================	GestureAxis		===================== //
    // ============================================================== //
    
    /**
     * 대상영역의 Touch 방향 dispatch (Windows8.* 터치 디바이스 미지원)
     * Event : axis
     * Event Property : type, target, currentTarget, axis:(vertical, horizontal), pageX, pageY, direction:(left, right, top, bottom, none)
     * @constructor
     * @param	{Element, Selector, jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
     * @param   {Object}    options
     *      - {Boolean} preventDefault  safari v10 에서 세로축 touchstart를 막고 싶을때만 설정한다.
     */
    ixBand.event.GestureAxis = $B.Class.extend({
        initialize: function ( target, options ) {
            this._target = $B( target ).element();
            this._options = options || {};
            this._aType = ( this._options.aType )? this._options.aType : 'auto';
            //safari v10 에서 세로축 touchstart를 막고 싶을때만 사용한다.
            this._preventDefault = this._options.preventDefault || false;
            this._startX = 0;
            this._startY = 0;
            this._moveCount = 0;
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods	=============== //
    
        enable: function () {
            this._targetTouch.addListener( 'touchstart', this._axisHandler );
            return this;
        },
        //비활성화
        disable: function () {
            this._targetTouch.removeListener();
            this._winTouch.removeListener();
            return this;
        },
        //이벤트 및 기본설정 삭제
        clear: function () {
            this._targetTouch.clear();
            this._winTouch.clear();
            return this;
        },
    
        // ===============	Private Methods	=============== //
    
        _setEvents: function () {
            this._targetTouch = new $B.event.TouchEvent( this._target );
            this._winTouch = new $B.event.TouchEvent( window );
    
            this._axisHandler = $B.bind( function (e) {
                var evt, pageX = this._startX, pageY = this._startY;
    
                if ( e.touches.length > 0 ) {
                    var touch = e.touches[0];
                    pageX = touch.pageX;
                    pageY = touch.pageY;
                }
    
                switch ( e.type ) {
                    case 'touchstart':
                        e.stopPropagation();
                        if ( this._preventDefault ) e.preventDefault();
    
                        this._moveCount = 0;
                        this._startX = pageX;
                        this._startY = pageY;
    
                        this._winTouch.addListener( 'touchmove', this._axisHandler, {passive: false} );
                        this._winTouch.addListener( 'touchend', this._axisHandler );
                        this._targetTouch.addListener( 'touchcancel', this._axisHandler );
                        break;
                    case 'touchmove':
                        var axis = this._getAxisType( this._startX, this._startY, pageX, pageY );
                        evt = {target: e.target, currentTarget: this._target, axis: axis, direction: '', pageX: pageX, pageY: pageY};
    
                        this._moveCount++;
    
                        if ( MS_POINTER && axis == 'none' && this._moveCount < 3  ) {
                            break;
                        } else {
                            if ( this._aType == 'auto' ) {
                                if ( axis != 'none' ) {
                                    e.preventDefault();
                                    evt.direction = this._getDirectionType( axis, this._startX, this._startY, pageX, pageY );
                                    this.dispatch( 'axis', evt );
                                }
                            } else if ( this._aType == axis ) {
                                e.preventDefault();
                                evt.direction = this._getDirectionType( axis, this._startX, this._startY, pageX, pageY );
                                this.dispatch( 'axis', evt );
                            }
                        }
                    case 'touchend':
                    case 'touchcancel':
                        this._winTouch.removeListener( 'touchmove' );
                        this._winTouch.removeListener( 'touchend' );
                        this._targetTouch.removeListener( 'touchcancel' );
                        break;
                }
            }, this);
    
            this.enable();
        },
    
        //제스츄어 방향축 반환 (vertical, horizontal)
        _getAxisType: function ( startX, startY, endX, endY ) {
            var gapH = Math.max( startX, endX ) - Math.min( startX, endX ),
                gapV = Math.max( startY, endY ) - Math.min( startY, endY );
    
            if ( gapH > gapV ) {
                return 'horizontal';
            } else if ( gapH < gapV ) {
                return 'vertical';
            } else {
                return 'none';
            }
        },
    
        //제스츄어 방향 반환 (left, right, top, bottom, none)
        _getDirectionType: function ( axis, startX, startY, endX, endY ) {
            var result = 'none';
    
            if ( axis == 'horizontal' ) {
                if ( startX > endX ) {
                    result = 'left';
                } else if ( startX < endX ) {
                    result = 'right';
                }
            } else {
                if ( startY > endY ) {
                    result = 'top';
                } else if ( startY < endY ) {
                    result = 'bottom';
                }
            }
    
            return result;
        }
    
    }, '$B.event.GestureAxis');


    // ============================================================== //
    // =====================	MultiTouch	========================= //
    // ============================================================== //
    
    /**
     * 터치 디바이스에서 대상영역의 Multi Touch Gesture검출기 생성 (Windows8.* 터치 디바이스 지원, Android 2.*에서는 지원하지 않는다.)
     * Event : multitouchstart, multitouchmove, multitouchend
     * Event Property : type, pageX, pageY, clientX, clientY, growX, growY, growAngle, growScale, angle, scale,  pan, distanceH, distanceV, degree, radian, radius, pointers[{target, pageX, pageY, clientX, clientY, growX, growY}]
     * @class	{MultiTouch}
     * @constructor
     * @param	{Element, Selector, jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
     */
    ixBand.event.MultiTouch = $B.Class.extend({
        initialize: function ( target ) {
            this._target = $B( target ).element();
            this._hasTouchEvent = false;
            this._hasMultiTouchStart = false;
            this._totalAngle = 0;
            this._startRadius = 0;
            this._oldRadius = 0;
            this._isPan = null;
            this._startDistanceH = 0;
            this._startDistanceV = 0;
            this._oldCenterX = 0;
            this._oldCenterY = 0;
            this._oldPageX1 = 0;
            this._oldPageY1 = 0;
            this._enable = true;
            this._oldEvt = {};
    
            if ( MS_POINTER ) this._setTouchAction( 'none' );
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods	=============== //
    
        /**
         * MultiTouch 검출 허용 설정
         * @return	{MultiTouch}
         */
        enable: function () {
            this._enable = true;
            if ( MS_POINTER ) this._setTouchAction( 'none' );
            return this;
        },
        /**
         * MultiTouch 검출 비허용 설정
         * @return	{MultiTouch}
         */
        disable: function () {
            this._enable = false;
            if ( MS_POINTER ) this._setTouchAction( 'auto' );
            return this;
        },
    
        /**
         * MultiTouch Event 및 설정값 삭제
         */
        clear: function () {
            this._touchEvent.clear();
            this._winTouchEvent.clear();
            this._removeTouchEvent();
    
            if ( MS_POINTER ) this._setTouchAction( 'auto' );
            return this;
        },
    
        // ===============	Private Methods	=============== //
    
        _setEvents: function () {
            this._touchHandler = $B.bind(function (e) {
                if ( !this._enable ) return this._removeTouchEvent();
    
                var evt, pageX1, pageY1, pageX2, pageY2, clientX1, clientY1, clientX2, clientY2,
                    touches = e.touches, touch1, touch2, currentTouchLength = e.touches.length;
    
                if ( currentTouchLength > 1 ) {
                    touch1 = touches[0];
                    touch2 = touches[1];
    
                    pageX1 = touch1.pageX;
                    pageY1 = touch1.pageY;
                    pageX2 = touch2.pageX;
                    pageY2 = touch2.pageY;
                    clientX1 = touch1.clientX;
                    clientY1 = touch1.clientY;
                    clientX2 = touch2.clientX;
                    clientY2 = touch2.clientY;
    
                    var distanceH = this._getDistance( pageX1, pageX2 ),
                        distanceV = this._getDistance( pageY1, pageY2 ),
                        radius = this._getRadius( distanceH, distanceV ),
                        radian = this._getRadian( distanceH, distanceV ),
                        degree = this._radianToDeg( radian ),
                        cPageX = this._getCenterPos( pageX1, pageX2, distanceH ),
                        cPageY = this._getCenterPos( pageY1, pageY2, distanceV ),
                        cClientX = this._getCenterPos( clientX1, clientX2, distanceH ),
                        cClientY = this._getCenterPos( clientY1, clientY2, distanceV );
    
                    evt = {
                        type: '', pointers: this._getPointers( touches ),
                        growAngle: 0, growScale: 0, angle: 0, scale: 1,
                        degree: degree, radian: radian, radius: radius,
                        distance: radius * 2, distanceH: distanceH, distanceV: distanceV,
                        pageX: cPageX, pageY: cPageY, clientX: cClientX, clientY: cClientY, pan: false
                    };
    
                    if ( e.type == 'touchmove' ) {
                        e.preventDefault();
    
                        var gAngle = this._getBetweenAngle( this._oldPageX1, this._oldPageY1, pageX1, pageY1, this._oldCenterX, this._oldCenterY, cPageX, cPageY ),
                            tScale = radius / this._startRadius,
                            gScale = ( radius - this._oldRadius ) / this._startRadius;
    
                        this._totalAngle += gAngle;
    
                        evt.growAngle = gAngle;
                        evt.angle = this._totalAngle;
                        evt.scale = tScale;
                        evt.growScale = gScale;
                        evt.pan = this._isPanEvent( this._startDistanceH, this._startDistanceV, distanceH, distanceV );
                        this.dispatch( 'multitouchmove', evt );
                        //Start
                    } else if ( e.type == 'touchstart' ) {
                        var touchStarted = this._hasMultiTouchStart;
    
                        this._hasMultiTouchStart = true;
                        this._startRadius = radius;
                        this._totalAngle = 0;
                        this._isPan = null;
                        this._startDistanceH = distanceH;
                        this._startDistanceV = distanceV;
    
                        if ( !touchStarted ) {
                            //start시에는 grow관련값이 모두 0이다.
                            this.dispatch( 'multitouchstart', evt );
                        }
                    }
    
                    this._oldPageX1 = pageX1;
                    this._oldPageY1 = pageY1;
                    this._oldCenterX = cPageX;
                    this._oldCenterY = cPageY;
                    this._oldRadius = radius;
                    this._oldEvt = evt;
                }
    
                if ( e.type == 'touchend' || e.type == 'touchcancel' ) {
                    //MultiTouchStart가 발생하고 난후에만 End이벤트가 발생한다.
                    if ( this._hasMultiTouchStart && currentTouchLength < 2 ) {
                        this._removeTouchEvent();
                        this.dispatch( 'multitouchend', this._oldEvt );
                        this._hasMultiTouchStart = false;
                    }
                }
            }, this);
    
            this._startHandler = $B.bind(function (e) {
                this._addTouchEvent();
            }, this);
    
            this._touchEvent = new $B.event.TouchEvent( this._target ).addListener( 'touchstart', this._startHandler );
            this._winTouchEvent = new $B.event.TouchEvent( window );
        },
    
        //Touch Pointer Event를 이용할때 이벤트전달 설정
        _setTouchAction: function ( state ) {
            this._target.style[TOUCH_ACTION] = state;//none, auto
            //마우스로 컨트롤시 드래그 방지
            if ( state == 'auto' ) {
                $B( this._target ).removeEvent( 'dragstart' );
            } else {
                $B( this._target ).addEvent( 'dragstart', function (e) {
                    e.preventDefault()
                });
            }
        },
    
        _addTouchEvent: function () {
            if ( this._hasTouchEvent ) return;
            this._winTouchEvent.addListener( 'touchstart', this._touchHandler, {passive: false} );
            this._winTouchEvent.addListener( 'touchmove', this._touchHandler, {passive: false} );
            this._winTouchEvent.addListener( 'touchend', this._touchHandler );
            this._winTouchEvent.addListener( 'touchcancel', this._touchHandler );
            this._hasTouchEvent = true;
        },
    
        _removeTouchEvent: function () {
            if ( !this._hasTouchEvent ) return;
            this._winTouchEvent.removeListener();
            this._hasTouchEvent = false;
        },
    
        _getPointers: function ( touches ) {
            var result = [],
                length = touches.length;
    
            for ( var i = 0; i < length; ++i ) {
                var touch = touches[i];
                result.push( {target: touch.target, pageX: touch.pageX, pageY: touch.pageY, clientX: touch.clientX, clientY: touch.clientY} );
            }
    
            return result;
        },
    
        _getCenterPos: function ( pos1, pos2, distance ) {
            return Math.min( pos1, pos2 ) + Math.abs( distance / 2 );
        },
        //반지름 반환
        _getRadius: function ( posX, posY ) {
            return Math.sqrt( posX * posX + posY * posY );
        },
        //좌표를 라디안으로 반환 0~180, -180
        _getRadian: function ( posX, posY ) {
            //return Math.acos( distanceY / radius );
            return Math.atan2( posY, posX );
        },
        //Radian을 호도각으로 변환
        _radianToDeg: function ( radian ) {
            return radian * 180 / Math.PI;
        },
        //pointer의 거리 반환.
        _getDistance: function ( pos1, pos2 ) {
            return -pos1 + Math.abs(pos2);
        },
        //현재 동작이 Pan이면 true반환.
        _isPanEvent: function ( sdX, sdY, dX, dY ) {
            if ( this._isPan == false ) return false;
    
            var gap = PX_RATIO * 10;//Pan이 발생하는 사이즈 px기준
            var gx = Math.abs( sdX - dX ),
                gy = Math.abs( sdY - dY );
    
            return this._isPan = gx < gap && gy < gap;
        },
        //움직인 각도 반환
        _getBetweenAngle: function ( opX1, opY1, npX1, npY1, ocX, ocY, ncX, ncY ) {
            //중심점 보정
            var cGapX = ncX - ocX,
                cGapY = ncY - ocY,
                ccX = ncX - cGapX,//보정된 ncX
                ccY = ncY - cGapY,//보정된 ncY
                cX1 = npX1 - cGapX,//보정된 npX1
                cY1 = npY1 - cGapY;//보정된 npY1
    
            //중심점 기준의 좌표로 보정
            var ox = opX1 - ocX,
                oy = opY1 - ocY,
                nx = npX1 - ncX,
                ny = npY1 - ncY,
                cw = this._isClockwise( ox, oy, nx, ny ),
                angle = this._vectorToAngle( opX1, opY1, cX1, cY1, ccX, ccY );
    
            return cw? angle : -angle;
        },
    
        //3점의 각도 구하기 (기준점 cx, cy)
        _vectorToAngle: function ( x1, y1, x2, y2, cx, cy ) {
            var a = Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) ),
                b = Math.sqrt( Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2) ),
                c = Math.sqrt( Math.pow(cx - x2, 2) + Math.pow(cy - y2, 2) ),
                r = ( Math.pow(b,2) + Math.pow(c,2) - Math.pow(a,2) ) / ( 2 * b * c ),
                radian = Math.acos( r );
    
            //return radian * ( 180 / Math.PI );
            return this._radianToDeg( radian );
        },
    
        //시계방향인지 Boolean으로 반환
        _isClockwise: function ( x1, y1, x2, y2 ) {
            return (x1 * y2 - y1 * x2) > 0;
        }
    }, '$B.event.MultiTouch');


    // ============================================================== //
    // =====================	ParallaxScroll	===================== //
    // ============================================================== //
    
    /**
     * Parallax Scroll 이벤트 검출기,
     * Event : activate (구간에 진입시 한번만 발생), deactivate (구간에 진입시 한번만 발생), between (구간에 진입시 계속해서 발생)
     * Event Properties : e.percent, e.totalPercent, e.index:'deactivate'발생시 이전'activate' index반환, e.value, e.data
     * @param	{Array}		포지션 데이타 배열, [{min:Number, max:Number, data:*}, ...
     * @param	{String}	scrollType	vertical, horizontal (default=vertical)
     * @param	{Element}	scrollTarget	scroll을 발생시킬 대상 설정 (default=window)
     */
    ixBand.event.ParallaxScroll = $B.utils.Between.extend({
        initialize: function ( positions, scrollType, scrollTarget ) {
            this._scrollTarget = scrollTarget || window;
            this._scrollType = scrollType || 'vertical';
            $B.utils.Between.prototype.initialize.call( this, positions );
            this._setEvents();
            return this;
        },
    
        // ==================== Public Methods ==================== //
        /**
         * 이벤트를 강제로 실행시킬때 사용, (positions, scroll값 둘중에 하나라도 값의 변화가 있어야 동작한다.)
         */
        trigger: function () {
            var baseValue = ( this._scrollType === 'vertical' )? $B( this._scrollTarget ).scrollTop() : $B( this._scrollTarget ).scrollLeft();
            $B.utils.Between.prototype.trigger.call( this, baseValue );
            return this;
        },
    
        /**
         * 이벤트 및 기본설정 삭제
         */
        clear: function () {
            $B( this._scrollTarget ).removeEvent( 'scroll', this._scrollHandler );
            return this;
        },
    
        // ==================== Private Methods ==================== //
    
        _setEvents: function () {
            this._scrollHandler = $B.bind( this.trigger, this );
            $B( this._scrollTarget ).addEvent( 'scroll', this._scrollHandler );
        }
    }, '$B.event.ParallaxScroll');


    // ============================================================== //
    // =====================	Responsive		===================== //
    // ============================================================== //
    
    /**
     * 설정한 사이즈에 따라 window resize이벤트를 통해서 해당 이벤트를 발생시킨다. (IE9~)
     * Event : responsive, resize
     * Event Properties : e.responsiveType
     * @param   {String}    type        ex) 'width' or 'height'
     * @param   {Array}     positions   포지션 데이타 배열, [{min:Number, max:Number, type:String}, ...
     */
    ixBand.event.Responsive = $B.Class.extend({
        _disabled: false,
        _hasEvents: false,
        _positions: [],
        _currentSize: 0,
    
        initialize: function ( type, positions ) {
            if ( $B.ua.SAFARI || $B.ua.MOBILE_IOS || $B.ua.ANDROID || $B.ua.WINDOWS_PHONE ) {
                //safari, mobile
                this._sizeTarget = document.documentElement;
                this._sizeProp = ( type === 'height' )? 'clientHeight' : 'clientWidth';
            } else {
                //pc
                this._sizeTarget = window;
                this._sizeProp = ( type === 'height' )? 'innerHeight' : 'innerWidth';
            }
    
            this._currentSize = this._sizeTarget[this._sizeProp];
            this._setPositions( positions );
            return this;
        },
    
        // ==================== Public Methods ==================== //
        /**
         * 현재 해상도의 Type을 반환.
         * positions 데이타 등록시 설정한 type속성 중에 해당하는 값을 반환
         * @return	{String}
         */
        responsiveType: function () {
            if ( $B.ua.WINDOWS_PHONE || !$B.ua.DOC_MODE_IE9_LT ) {
                return this._getSizeType( this._sizeTarget[this._sizeProp] );
            } else {
                return this._positions[this._positions.length - 1].type;
            }
        },
        /**
         * 이벤트 발생 허용
         */
        enable: function () {
            this._disabled = false;
            return this;
        },
        /**
         * 이벤트 발생 비허용
         */
        disable: function () {
            this._disabled = true;
            return this;
        },
        /**
         * 이벤트 및 기본설정 삭제
         */
        clear: function () {
            this._removeEvents();
            return this;
        },
    
        //override
        addListener: function ( type, callback ) {
            this._setEvents();
            $B.Class.prototype.addListener.call( this, type, callback );
            return this;
        },
    
        // ==================== Private Methods ==================== //
    
        _setPositions: function ( positions ) {
            if ( $B.isArray(positions) && !$B.isEmpty(positions) ) {
                this._positions = positions.concat([]);
            }
            return this;
        },
    
        _setEvents: function () {
            if ( this._hasEvents ) return;
    
            var sizeType = '';
    
            this._resizeHandler = $B.bind( function (e) {
                if ( this._disabled ) return;
                var rType = this.responsiveType(),
                    currentSize = this._sizeTarget[this._sizeProp];
    
                if ( rType !== sizeType ) {
                    this.dispatch( 'responsive', {responsiveType: rType} );
                }
    
                if ( this._currentSize !== currentSize ) {
                    this.dispatch( 'resize', {responsiveType: rType} );
                }
    
                sizeType = rType;
                this._currentSize = currentSize;
            }, this);
    
            $B( window ).addEvent( 'resize', this._resizeHandler );
            this._hasEvents = true;
        },
    
        _getSizeType: function ( current ) {
            var result = '';
    
            var length = this._positions.length;
    
            for ( var i = 0; i < length; ++i ) {
                var pos = this._positions[i];
    
                if ( pos.min <= current && pos.max >= current ) {
                    result = pos.type;
                    break;
                }
            }
    
            return result;
        },
    
        _removeEvents: function () {
            if ( !this._hasEvents ) return;
    
            $B( window ).removeEvent( 'resize', this._resizeHandler );
            this._hasEvents = false;
        }
    
    }, '$B.event.Responsive');


    // ============================================================== //
    // =====================	Rotation	    ===================== //
    // ============================================================== //
    /**
     * RotationEvent
     * Event Type : rotationstart, rotationmove, rotationend, rotation, resize
     * @param	{Selector, Element, jQuery}	target			이벤트 발생 대상
     * @param	{Object}    options
     *              - {Array}	datumPoint		기준 중심 좌표 x, y배열, 대상 대비 %, ex) ['50%', '50%'], (px, %단위 지원)
     *              - {Number}	baseAngle		progress를 계산할 기준이 되는 각도 설정 (기본값: 0, 9시 방향이 0도, 0 ~ 360)
     *              - {Array, Number}   radius  호의 x, y축 반지름 설정, (기본값: ['50%', '50%'], px, %단위 지원)
     * @constructor
     */
    ixBand.event.Rotation = $B.Class.extend({
        initialize: function ( target, options ) {
            this._target = $B( target ).element();
            this._options = $B.isObject( options )? $B.object.clone( options ) : {};
    
            this._eventTarget = null;
            this._disabed = false;
            this._touchEvent = null;
            this._winTouchEvent = null;
    
            this._min = null;
            this._max = null;
            this._degree = 0;
            this._progress = 0;
    
            this._setOptions( this._options );
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods =============== //
        /**
         * 각도설정 및 반환
         * @param	{Number}	degree
         * @return	{RotationEvent, Number}
         */
        degree: function ( degree ) {
            if ( $B.isNumber(degree) ) {
                if ( !this._disabed ) {
                    var clockwise = ( this._degree < degree ),
                        grow = this._getGrow( this._degree, degree, clockwise );
    
                    degree = this._correctDegree( degree );
    
                    var center = this._centerPoint,
                        point = this._getPoint( degree, center );
    
                    this._dispatch( 'rotation', undefined, degree, point, point, center, grow );
                }
                return this;
            } else {
                return this._degree;
            }
        },
        /**
         * 회전 각도설정 및 반환
         * @param	{Number}	progress
         * @return	{RotationEvent, Number}
         */
        rotation: function ( progress ) {
            if ( $B.isNumber(progress) ) {
                if ( !this._disabed ) {
                    var clockwise = ( this._progress < progress ),
                        grow = this._getGrow( this._progress, progress, clockwise ),
                        center = this._centerPoint,
                        degree = this._progressToDeg( progress ),
                        point = this._getPoint( degree, center );
    
                    this._dispatch( 'rotation', undefined, degree, point, point, center, grow );
                }
                return this;
            } else {
                return this._progress;
            }
        },
        /**
         * resize시 기준 좌표들 다시 계산하여 resize 이벤트 전달
         * @return	{RotationEvent}
         */
        resize: function () {
            this._resetOptions( this._options );
    
            var center = this._centerPoint,
                point = this._getPoint( this._degree, center );
    
            this._dispatch( 'resize', undefined, this._degree, point, point, center, 0 );
            return this;
        },
        /**
         * progress 최소값 설정, 음수, 양수 설정가능
         * @param	{Number}	progress     최소값
         * @return	{RotationEvent}
         */
        min: function ( progress ) {
            if ( $B.isNumber(progress) ) {
                this._min = progress;
            }
    
            return this;
        },
        /**
         * progress 최대값 설정, 음수, 양수 설정가능
         * @param	{Number}	progress     최대값
         * @return	{RotationEvent}
         */
        max: function ( progress ) {
            if ( $B.isNumber(progress) ) {
                this._max = progress;
            }
    
            return this;
        },
        /**
         * progress reset (min, max값이 설정되지 않았을때만 동작)
         * @return	{RotationEvent}
         */
        reset: function () {
            if ( this._min === null && this._max === null ) this._progress = 0;
            return this;
        },
        /**
         * 이벤트 활성화 설정
         * @return	{RotationEvent}
         */
        enable: function () {
            if ( !this._disabed ) return this;
            this._disabed = false;
            this._setTouchAction( 'none' );
            this._setEvents();
            return this;
        },
        /**
         * 이벤트 비활성화 설정
         * @return	{RotationEvent}
         */
        disable: function () {
            if ( this._disabed ) return this;
            this._disabed = true;
            this._setTouchAction( 'auto' );
            this.clear();
            return this;
        },
        /**
         * 등록된 모든 이벤트 삭제
         * @return	{RotationEvent}
         */
        clear: function () {
            this._setTouchAction( 'auto' );
    
            if ( this._touchEvent ) {
                this._touchEvent.clear();
                this._winTouchEvent.clear();
            } else {
                $B( this._target ).removeEvent( 'mousedown', this._onMouse );
                $B( document ).removeEvent( 'mousemove', this._onMouse );
                $B( document ).removeEvent( 'mouseup', this._onMouse );
            }
            return this;
        },
    
        // ===============	Private Methods =============== //
    
        _setOptions: function ( options ) {
            // baseAngle ----------
            this._baseAngle = options.baseAngle? this._correctDegree( options.baseAngle ) : 0;
            this._resetOptions( options );
    
            //point
            var center = this._centerPoint,
                point = this._getPoint( this._baseAngle, center );
    
            this._pageX = point.x;
            this._pageY = point.y;
            this._pointX = point.x;
            this._pointY = point.y;
            this._centerX = center.x;
            this._centerY = center.y;
    
            // touch-action ----------
            if ( navigator.pointerEnabled ) {
                this._msTouchAction = 'touch-action';
            } else if ( navigator.msPointerEnabled ) {
                this._msTouchAction = '-ms-touch-action';
            }
        },
    
        _resetOptions: function ( options ) {
            // parse dotumPoint ----------
            if ( $B.isEmpty(options.datumPoint) || !$B.isArray(options.datumPoint) ) {
                this._datumPoint = ['50%', '50%'];
            } else if ( $B.isArray(options.datumPoint) && options.datumPoint.length < 2 ) {
                this._datumPoint.push( '50%' );
            } else {
                this._datumPoint = options.datumPoint;
            }
    
            this._datumPoint = this._styleToValues( this._datumPoint );
    
            // radius ----------
            var radiusValues = options.radius;
    
            if ( $B.isEmpty(radiusValues) || !$B.isArray(radiusValues) ) {
                radiusValues = ['50%', '50%'];
            }
    
            radiusValues = this._styleToValues( radiusValues, true );
            this._radiusX = radiusValues[0];
            this._radiusY = radiusValues[1];
    
            // center position
            this._centerPoint = this._getCenterPoint();
        },
    
        _getGrow: function ( oldDeg, newDeg, clockwise ) {
            var result = 0;
    
            if ( clockwise ) {
                result = newDeg - oldDeg;
            } else {
                result = -( oldDeg - newDeg );
            }
    
            return result;
        },
    
        _styleToValues: function ( ary, isRadius ) {
            var result = [];
    
            for ( var i in ary ) {
                var str = ary[i],
                    valueObj = $B.style.parseValue( str );
    
                if ( valueObj.unit === '%' ) {
                    if ( isRadius ) {
                        if ( i == 0 ) {
                            var width = $B( this._target ).innerWidth() || 0;
                            result.push( width * (valueObj.value / 100) );
                        } else {
                            var height = $B( this._target ).innerHeight() || 0;
                            result.push( height * (valueObj.value / 100) );
                        }
                    } else {
                        result.push( valueObj.value / 100 );
                    }
                } else {
                    result.push( Number(valueObj.value) );
                }
            }
    
            return result;
        },
    
        _setEvents: function () {
            this._setTouchAction( 'none' );
    
            if ( $B.ua.TOUCH_DEVICE ) {
                this._touchEvent = new $B.event.TouchEvent( this._target );
                this._winTouchEvent = new $B.event.TouchEvent( window );
                this._onTouch = $B.bind( this._touchHandler, this );
                this._touchEvent.addListener( 'touchstart', this._onTouch );
            } else {
                this._onMouse = $B.bind( this._mouseHandler, this );
                $B( this._target ).addEvent( 'mousedown', this._onMouse );
            }
        },
    
        _setTouchAction: function ( state ) {
            if ( !$B.ua.TOUCH_DEVICE ) return;
    
            $B( this._target ).css( this._msTouchAction + ':' + state + ';' );
    
            //마우스로 컨트롤시 드래그 방지
            if ( state == 'auto' ) {
                if ( this._onDrag ) $B( this._target ).removeEvent( 'dragstart', this._onDrag );
            } else {
                this._onDrag = $B.bind( this._dragHandler, this );
                $B( this._target ).addEvent( 'dragstart', this._onDrag );
            }
        },
    
        _mouseHandler: function (e) {
            if ( this._disabed ) return;
            e.preventDefault();
    
            var offset = this._getOffset( e.clientX, e.clientY ),
                center = this._centerPoint,
                radian = this._posToRadian( offset.x, offset.y, center.x, center.y ),
                degree = this._getAngle( radian ),
                point = this._getPoint( degree, center ),
                grow = this._getBetweenAngle( degree, point, center );
    
            switch ( e.type ) {
                case 'mousedown':
                    $B( document ).addEvent( 'mousemove', this._onMouse );
                    $B( document ).addEvent( 'mouseup', this._onMouse );
                    this._dispatch( 'rotationstart', e.target, degree, point, offset, center, grow, true );
                    break;
                case 'mousemove':
                    this._dispatch( 'rotationmove', e.target, degree, point, offset, center, grow, true );
                    break;
                case 'mouseup':
                    $B( document ).removeEvent( 'mousemove', this._onMouse );
                    $B( document ).removeEvent( 'mouseup', this._onMouse );
                    this._dispatch( 'rotationend', e.target, degree, point, offset, center, grow, true );
                    break;
            }
        },
    
        _touchHandler: function (e) {
            if ( this._disabed ) return;
            e.preventDefault();
    
            var touch = e.touches[0];
    
            if ( e.type === 'touchstart' || e.type === 'touchmove' ) {
                this._pageX = touch.pageX;
                this._pageY = touch.pageY;
                this._eventTarget = touch.target;
            }
    
            var offset = this._getOffset( this._pageX, this._pageY, true ),
                center = this._centerPoint,
                radian = this._posToRadian( offset.x, offset.y, center.x, center.y ),
                degree = this._getAngle( radian ),
                point = this._getPoint( degree, center ),
                grow = this._getBetweenAngle( degree, point, center );
    
            switch ( e.type ) {
                case 'touchstart':
                    this._winTouchEvent.addListener( 'touchmove', this._onTouch, {passive: false} );
                    this._winTouchEvent.addListener( 'touchend', this._onTouch );
                    this._winTouchEvent.addListener( 'touchcancel', this._onTouch );
                    this._dispatch( 'rotationstart', this._eventTarget, degree, point, offset, center, grow, true );
                    break;
                case 'touchmove':
                    this._dispatch( 'rotationmove', this._eventTarget, degree, point, offset, center, grow, true );
                    break;
                case 'touchend':
                case 'touchcancel':
                    this._winTouchEvent.removeListener();
                    this._dispatch( 'rotationend', this._eventTarget, degree, point, offset, center, grow, true );
                    break;
            }
        },
    
        _correctDegree: function ( deg ) {
            deg = deg % 360;
            if ( deg < 0 ) deg = 360 + deg;
    
            return deg;
        },
    
        _progressToDeg: function ( progress ) {
            var deg = ( progress - (360 - this._baseAngle) ) % 360;
            if ( deg < 0 ) deg = 360 + deg;
            return deg;
        },
    
        _getOffset: function ( posX, posY, isTouch ) {
            var pos = $B( this._target ).rect();
    
            if ( isTouch ) {
                return {x: posX - pos.left, y: posY - pos.top};
            } else {
                var scrollX = $B( window ).scrollLeft(),
                    scrollY = $B( window ).scrollTop();
    
                return {x: posX + scrollX - pos.left, y: posY + scrollY - pos.top};
            }
        },
    
        _getCenterPoint: function () {
            var width = $B( this._target ).innerWidth(),
                height = $B( this._target ).innerHeight();
    
            return {x: width * this._datumPoint[0], y: height * this._datumPoint[1]};
        },
    
        //0~360
        _getAngle: function ( radian ) {
            return this._radianToDeg( radian ) + 180;
        },
    
        _getPoint: function ( degree, center ) {
            var radian = Math.PI / 180 * ( -degree + 270 ),
                posX = this._radiusX * Math.sin( radian ) + center.x,
                posY = this._radiusY * Math.cos( radian ) + center.y;
    
            return { x: posX, y: posY };
        },
    
        //좌표를 라디안으로 반환
        _posToRadian: function ( x, y, cx, cy ) {
            var dx = x - cx,
                dy = y - cy;
            return Math.atan2( dy, dx );
        },
    
        //Radian을 호도각으로 변환
        _radianToDeg: function ( radian ) {
            return radian * 180 / Math.PI;
        },
    
        _degToRadian: function ( degree ) {
            return Math.PI / 180 * degree;
        },
    
        //변화된 각도양 반환
        _getBetweenAngle: function ( degree, point, center ) {
            var angle = 0;
    
            if ( this._degree !== degree ) {
                //중심점 기준의 좌표로 보정
                var ox = this._pointX - this._centerX,
                    oy = this._pointY - this._centerY,
                    nx = point.x - center.x,
                    ny = point.y - center.y,
                    cw = this._isClockwise( ox , oy, nx, ny );
    
                if ( cw ) {
                    if ( degree < this._degree ) {
                        angle = ( 360 - this._degree ) + degree;
                    } else {
                        angle = degree - this._degree;
                    }
                } else {
                    if ( degree < this._degree ) {
                        angle = -( this._degree - degree );
                    } else {
                        angle = -( this._degree + (360 - degree) );
                    }
                }
            }
    
            return angle;
        },
    
        //시계방향인지 Boolean 으로 반환
        _isClockwise: function ( ox, oy, nx, ny ) {
            return ( ox * ny - oy * nx ) > 0;
        },
    
        _dragHandler: function (e) {
            e.preventDefault();
        },
    
        _dispatch: function ( type, target, degree, point, offset, center, grow, userInteraction ) {
            var progress = this._progress + grow;
    
            if ( this._min !== null && progress < this._min ) {
                degree = this._progressToDeg( this._min );
                point = this._getPoint( degree, center );
                if ( userInteraction ) {
                    grow = this._getBetweenAngle( degree, point, center );
                } else {
                    grow += this._min - progress;
                }
    
                progress = this._min;
            } else if ( this._max !== null && progress > this._max ) {
                degree = this._progressToDeg( this._max );
                point = this._getPoint( degree, center );
                if ( userInteraction ) {
                    grow = this._getBetweenAngle( degree, point, center );
                } else {
                    grow -= progress - this._max;
                }
    
                progress = this._max;
            }
    
            this._degree = degree;
            this._progress = progress;
            this._pointX = point.x;
            this._pointY = point.y;
            this._centerX = center.x;
            this._centerY = center.y;
    
            this.dispatch( type, {
                target: target,
                currentTarget: this._target,
                degree: degree,//절대각도 (9시방향이 0도)
                radian: this._degToRadian( degree ),
                offsetX: offset.x,
                offsetY: offset.y,
                pointX: point.x,
                pointY: point.y,
                grow: grow,//grow 1회 추가된 rotation 수치
                progress: progress//progress 시작점에서 부터의 rotation 수치
            });
        }
    }, '$B.event.Rotation');


    // ============================================================== //
    // =====================	ScrollEnd		===================== //
    // ============================================================== //
    
    /**
     * 대상영역의 ScrollEnd 이벤트
     * Event : scrolltop, scrollrignt, scrollbottom, scrollleft
     * Event Property : type, target, currentTarget
     * @constructor
     * @param	{Element, Selector, jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
     */
    ixBand.event.ScrollEnd = $B.Class.extend({
        _enable: false,
        _correctSize: 0,
        _gap: {left: 0, right: 0, top: 0, bottom: 0},
        _active: {scrollleft: false, scrollright: false, scrolltop: false, scrollbottom: false},
    
        initialize: function ( target ) {
            this._target = $B( target ).element();
    
            if ( this._target === window || this._target === document ) {
                this._winTarget = true;
            } else if ( !/^textarea$/i.test(this._target.nodeName) ) {
                //chrome ~55 scrollWidth, scrollHeight 1px issue
                if ( $B.ua.ANDROID && parseInt($B.ua.CHROME_VERSION) < 56 ) {
                    this._correctSize = 1;
                }
            }
    
            this._scrollX = -1;
            this._scrollY = -1;
            this._scrollW = 0;
            this._scrollH = 0;
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods	=============== //
    
        /**
         * 이벤트를 발생시키는 시점을 조절할 수치 설정
         * @param {Object}  values  {left, right, top, bottom}
         */
        gap: function ( values ) {
            if ( $B.isObject(values) ) {
                for ( var key in values ) {
                    var val = values[key];
    
                    if ( this._gap.hasOwnProperty(key) && typeof val === 'number' ) {
                        if ( val > 0 ) {
                            this._gap[key] = val;
                        } else {
                            this._gap[key] = 0;
                        }
                    }
                }
            }
    
            return this;
        },
    
        enable: function () {
            if ( this._enable ) return this;
            $B( this._target ).addEvent( 'scroll', this._scrollHandler );
            this._enable = true;
            return this;
        },
    
        //비활성화
        disable: function () {
            if ( !this._enable ) return this;
            $B( this._target ).removeEvent( 'scroll', this._scrollHandler );
            this._enable = false;
            return this;
        },
    
        /**
         * 강제로 실행시켜 해당 조건에 부합되면 이벤트를 발생시킨다.
         * @param {String}  type    발생시킬 event type, 설정하지 않으면 등록된 모든이벤트를 대상으로 한다.
         */
        trigger: function ( type ) {
            var scrollX = $B( this._target ).scrollLeft(),
                scrollY = $B( this._target ).scrollTop(),
                scrollW = this._getTargetSize( 'width' ),
                scrollH = this._getTargetSize( 'height' );
    
            if ( scrollH > 0 ) {
                if ( this._scrollY !== scrollY || scrollH !== this._scrollH ) {
                    this._scrollY = scrollY;
                    this._scrollH = scrollH;
    
                    if ( type === 'scrolltop' ) {
                        this._dispatch( type, scrollY, this._gap.top );
                    } else if ( type === 'scrollbottom' ) {
                        this._dispatch( type, scrollY, this._gap.top );
                    } else {
                        this._dispatch( 'scrolltop', scrollY, this._gap.top );
                        this._dispatch( 'scrollbottom', scrollY, scrollH - this._gap.bottom );
                    }
                }
            }
    
            if ( scrollW > 0 ) {
                if ( this._scrollX !== scrollX || scrollW !== this._scrollW ) {
                    this._scrollX = scrollX;
                    this._scrollW = scrollW;
    
                    if ( type === 'scrollleft' ) {
                        this._dispatch( type, scrollX, this._gap.left );
                    } else if ( type === 'scrollright' ) {
                        this._dispatch( type, scrollX, scrollW - this._gap.right );
                    } else {
                        this._dispatch( 'scrollleft', scrollX, this._gap.left );
                        this._dispatch( 'scrollright', scrollX, scrollW - this._gap.right );
                    }
                }
            }
    
            return this;
        },
    
        /**
         * 내부의 컨텐츠가 스크롤이 발생할 수 있는 만큼 긴 컨텐츠인지 여부 반환
         * scrollleft, scrollright는 가로사이즈, scrolltop, scrollbottom은 세로사이즈를 체크하여 반환
         * @param {String}  type    체크할 event type
         * @returns {Boolean}
         */
        isScrollContent: function ( type ) {
            var result = false;
    
            if ( type === 'scrollleft' || type === 'scrollright' ) {
                result = this._getTargetSize( 'width' ) > 0;
            } else if ( type === 'scrolltop' || type === 'scrollbottom' ) {
                result = this._getTargetSize( 'height' ) > 0;
            }
    
            return result;
        },
    
        //이벤트 및 기본설정 삭제
        clear: function () {
            this.disable();
            return this;
        },
    
        // ===============	Private Methods	=============== //
    
        _setEvents: function () {
            this._scrollHandler = $B.bind(function (e) {
                this.trigger();
            }, this);
    
            this.enable();
        },
    
        _getTargetSize: function ( type ) {
            var result = 0,
                prop = $B.string.capitalize( type );
    
            if ( this._winTarget ) {
                result = $B.measure['document' + prop]() - $B.measure['window' + prop]();
            } else {
                result = this._target['scroll' + prop] - this._target['client' + prop];
                result = result - this._correctSize;
            }
    
            return result;
        },
    
        _dispatch: function ( type, pos, base ) {
            var isActivePos = false;
    
            if ( type === 'scrollleft' || type === 'scrolltop' ) {
                isActivePos = pos <= base;
            } else {
                isActivePos = pos >= base;
            }
    
            if ( !this._active[type] && isActivePos ) {
                this._active[type] = true;
                this.dispatch( type, {target: this._target, currentTarget: this._target} );
            } else if ( !isActivePos ) {
                this._active[type] = false;
            }
        }
    }, '$B.event.ScrollEnd');


    // ============================================================== //
    // =====================	Swipe		========================= //
    // ============================================================== //
    
    /**
     * 스마트폰에서 대상영역을 Swipe시킬때 사용 (Windows8.* 터치 디바이스 지원)
     * onSwipe, onMove Event Property : type, target, axis:(vertical, horizontal), swipe:('left', 'right', 'up', 'down', 'none'), moveX, moveY, growX, growY, duration, speed<br>
     * onAxis Event Property : type, target, axis:(vertical, horizontal), pageX, pageY, direction:(left, right, top, bottom, none)
     * TODO:// Mobile Safari v10~ 에서 "touchmove" e.preventDefault() 동작 하지 않는 문제
     * @class	{Swipe}
     * @constructor
     * @param	{Element, Selector, jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
     * @param	{Object}	options
     *      - {String}	axis		axis : vertical, horizontal, auto, (기본값 = 'horizontal')
     *      - {Boolean} preventDefault  safari v10 에서 세로축 touchstart를 막고 싶을때만 설정한다.
     */
    ixBand.event.Swipe = $B.Class.extend({
        SWIPE_BASE_W: 40,//swipe 판별 기준 px
        SWIPE_BASE_H: 40,
    
        _sensitiveH: 1,
        _sensitiveV: 1,
        _enable: true,
    
        initialize: function ( target, options ) {
            this._target = $B( target ).element();
            this._options = options || {};
            this._aType = this._options.axis || 'horizontal';
            this._startX = 0;
            this._startY = 0;
            this._moveX = 0;
            this._moveY = 0;
            this._growX = 0;
            this._growY = 0;
            this._offsetBeginX = 0;
            this._offsetBeginY = 0;
            this._pageX = 0;
            this._pageY = 0;
            this._speed = 0;
            this._startTime = 0;
            this._isTouchMove = false;
            //Swipe 기준 사이즈 보정 설정
            this._swipeWidth = this._swipeSizeCalibration( this.SWIPE_BASE_W, this._sensitiveH );
            this._swipeHeight = this._swipeSizeCalibration( this.SWIPE_BASE_H, this._sensitiveV );
            this._axis = null;
            this._swipe = null;
    
            this._tAction = ( this._aType == 'auto' )? 'none' : ( this._aType == 'horizontal' )? 'pan-y' : 'pan-x';
            this._setTouchAction( this._tAction );
            this._setEvents();
            return this;
        },
    
        // ===============	Public Methods =============== //
        /**
         * 민감도 설정, 화면의 가로사이즈 기준, 기본값 1.
         * 민감도를 Number로 지정, 1보다 커질수록 둔감해지고 작아질수록 민감해진다, h만 설정하면 가로축 세로축의 민감도가 같게 설정된다.
         * @param	{Number}	h	가로축 민감도 설정
         * @param	{Number}	v	세로축 민감도 설정
         * @return	{Swipe}
         */
        //horizontal, vertical 감도 별도 설정
        sensitivity: function ( h, v ) {
            var sv = v || h;
            if ( !sv ) return this;
            this._sensitiveH = h;
            this._sensitiveV = v || h;
            this._swipeWidth = this._swipeSizeCalibration( this.SWIPE_BASE_W, h );
            this._swipeHeight = this._swipeSizeCalibration( this.SWIPE_BASE_H, sv );
            return this;
        },
        /**
         * Swipe 동작 허용 설정
         * @return	{Swipe}
         */
        enable: function () {
            this._gAxis.enable();
            this._enable = true;
            this._setTouchAction( this._tAction );
            return this;
        },
        /**
         * Swipe 동작 비허용 설정
         * @return	{Swipe}
         */
        disable: function () {
            this._gAxis.disable();
            this._enable = false;
            this._setTouchAction( 'auto' );
            return this;
        },
        /**
         * 현재 디바이스 해상도에 맞게 민감도 보정이된 swipeWidth 기준값을 반환.
         * 기본 swipeWidth값은 '40'
         * @return	{Number}	px기준으론 반환.
         */
        swipeWidth: function () {
            return this._swipeWidth;
        },
        /**
         * 현재 디바이스 해상도에 맞게 민감도 보정이된 swipeHeight 기준값을 반환.
         * 기본 swipeHeight값은 '40'
         * @return	{Number}	px기준으론 반환.
         */
        swipeHeight: function () {
            return this._swipeHeight;
        },
        //이벤트 및 기본설정 삭제
        clear: function () {
            this._gAxis.clear();
            this._winTouchEvent.clear();
            this._setTouchAction( 'auto' );
            return this;
        },
    
        // ===============	Private Methods =============== //
    
        _setEvents: function () {
            this._winTouchEvent = new $B.event.TouchEvent( window );
    
            //Axis을 이용하여 제스추어 방향 알아내기
            this._gAxis = new $B.event.GestureAxis( this._target, {
                aType: this._aType,
                preventDefault: this._options.preventDefault
            });
            this._gAxis.addListener( 'axis', $B.bind(function (e) {
                if ( !this._enable ) return this._winTouchEvent.removeListener();
                this.dispatch( 'axis', e );
    
                this._axis = e.axis;
                this._speed = this._getSpeed( this._axis, e.pageX, e.pageY );
                this._startX = e.pageX;
                this._startY = e.pageY;
                this._pageX = e.pageX;
                this._pageY = e.pageY;
                this._moveX = 0;
                this._moveY = 0;
                this._growX = 0;
                this._growY = 0;
                this._offsetBeginX = e.pageX;
                this._offsetBeginY = e.pageY;
                this._startTime = new Date().getTime();
    
                this._addTouchEvent();
            }, this));
    
            this._touchHandler = $B.bind( function (e) {
                if ( !this._enable ) return this._winTouchEvent.removeListener();
    
                switch ( e.type ) {
                    case 'touchmove':
                        e.preventDefault();
    
                        var pageX = this._startX, pageY = this._startY;
    
                        if ( e.touches.length > 0 ) {
                            var touch = e.touches[0];
                            pageX = touch.pageX;
                            pageY = touch.pageY;
                        }
    
                        this._moveX = pageX - this._startX;
                        this._moveY = pageY - this._startY;
                        this._growX = pageX - this._offsetBeginX;
                        this._growY = pageY - this._offsetBeginY;
                        this._speed = this._getSpeed( this._axis, pageX, pageY );
                        this._pageX = pageX;
                        this._pageY = pageY;
                        this._offsetBeginX = pageX;
                        this._offsetBeginY = pageY;
                        this._isTouchMove = true;
    
                        this.dispatch( 'move', {target: e.target, currentTarget: this._target, axis: this._axis, swipe: this._swipe, pageX: this._pageX, pageY: this._pageY, growX: this._growX, growY: this._growY, moveX: this._moveX, moveY: this._moveY, duration: 0, speed: this._speed} );
                        break;
                    case 'touchcancel':
                    case 'touchend':
                        if ( this._isTouchMove ) {
                            var duration = new Date().getTime() - this._startTime;
                            this._swipe = this._getSwipType( this._axis, this._moveX, this._moveY, duration );
                        } else {
                            this._swipe = 'none';
                        }
    
                        this.dispatch( 'swipe', {target: e.target, currentTarget: this._target, axis: this._axis, swipe: this._swipe, pageX: this._pageX, pageY: this._pageY, growX: this._growX, growY: this._growY, moveX: this._moveX, moveY: this._moveY, duration: duration, speed: this._speed} );
                        this._isTouchMove = false;
                        this._winTouchEvent.removeListener();
                        break;
                }
            }, this);
        },
    
        //Swipe 기준 사이즈 보정
        _swipeSizeCalibration: function ( size, sensitivie ) {
            return PX_RATIO * size * sensitivie;
        },
    
        //Touch Pointer Event를 이용할때 이벤트전달 설정
        _setTouchAction: function ( state ) {
            if ( MS_POINTER ) {
                this._target.style[TOUCH_ACTION] = state;//none, auto
                //마우스로 컨트롤시 드래그 방지
    
                if ( state == 'auto' ) {
                    this._target.removeEventListener( 'dragstart', this._dragHandlr, false );
                } else {
                    this._target.addEventListener( 'dragstart', this._dragHandlr, false );
                    //this._target.addEventListener( 'selectstart', function (e) {e.preventDefault();}, false );
                }
            }
        },
    
        _dragHandlr: function (e) {
            e.preventDefault();
        },
    
        _addTouchEvent: function () {
            this._winTouchEvent.addListener( 'touchmove', this._touchHandler, {passive: false} );
            this._winTouchEvent.addListener( 'touchend', this._touchHandler );
            this._winTouchEvent.addListener( 'touchcancel', this._touchHandler );
        },
    
        //Swip 방향 반환 (left, right, up, down, none)
        _getSwipType: function ( type, mx, my, swipeTime ) {
            var swipeSize = 0, result = 'none';
    
            if ( type == 'horizontal' ) {
                swipeSize = this._sensitivityCalibration( this._swipeWidth, swipeTime );
    
                if ( swipeSize <= Math.abs(mx) ) {
                    if ( mx > 0 ) result = 'right';
                    if ( mx < 0 ) result = 'left';
                }
            } else {
                swipeSize = this._sensitivityCalibration( this._swipeHeight, swipeTime );
    
                if ( swipeSize <= Math.abs(my) ) {
                    if ( my > 0 ) result = 'down';
                    if ( my < 0 ) result = 'up';
                }
            }
            return result;
        },
    
        //터치를 빠르게 진행할경우 sensitivity를 민감하게 설정
        _sensitivityCalibration: function ( swipeSize, swipeTime ) {
            if ( swipeTime > 50 && swipeTime < 200 ) {
                return swipeSize * 0.2;
            } else {
                return swipeSize;
            }
        },
    
        _getSpeed: function ( axis, x, y ) {
            var result = 0;
    
            if ( axis === 'horizontal' ) {
                result = Math.abs( this._pageX - x );
            } else {
                result = Math.abs( this._pageY - y );
            }
    
            return result || 0;
        }
    }, '$B.event.Swipe');


    // ============================================================== //
    // =====================	Matrix		========================= //
    // ============================================================== //
    
    /**
     * 3x3 변형행렬, 2D Matrix
     * @class	{Matrix}
     * @constructor
     * @param	{Number}	a	크기를 조절하거나 회전할 때 x축의 픽셀 위치에 영향을 주는 값.
     * @param	{Number}	b	회전하거나 기울일 때 y축의 픽셀 위치에 영향을 주는 값.
     * @param	{Number}	c	회전하거나 기울일 때 x축의 픽셀 위치에 영향을 주는 값.
     * @param	{Number}	d	크기를 조절하거나 회전할 때 y축의 픽셀 위치에 영향을 주는 값.
     * @param	{Number}	tx	x축을 따라 각 점이 평행 이동할 거리.
     * @param	{Number}	ty	y축을 따라 각 점이 평행 이동할 거리.
     */
    ixBand.geom.Matrix = $B.Class.extend({
        //degrees to radians
        DEG_TO_RAD: Math.PI / 180,
    
        initialize: function ( a, b, c, d, tx, ty ) {
            this.a = a || 1;
            this.b = b || 0;
            this.u = 0;
            this.c = c || 0;
            this.d = d || 1;
            this.v = 0;
            this.tx = tx || 0;
            this.ty = ty || 0;
            this.w = 1;
        },
    
        // ===============	Public Methods =============== //
    
        /**
         * matrix를 CSS3에서 사용할 수 있도록 문자열로 반환
         * @return {Matrix}
         */
        toString: function () {
            var m = this;
            return m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.tx + ',' + m.ty;
        },
        /**
         * 행렬을 현재 행렬과 연결하여 두 행렬의 기하학적 효과를 효율적으로 결합
         * @param	{Matrix}	mtx
         * @return {Matrix}
         */
        concat: function ( mtx ) {
            var result = {},
                m = this;
    
            result.a = m.a * mtx.a + m.b * mtx.c + m.u * mtx.tx;
            result.b = m.a * mtx.b + m.b * mtx.d + m.u * mtx.ty;
            result.u = m.a * mtx.u + m.b * mtx.v + m.u * mtx.w;
            result.c = m.c * mtx.a + m.d * mtx.c + m.v * mtx.tx;
            result.d = m.c * mtx.b + m.d * mtx.d + m.v * mtx.ty;
            result.v = m.c * mtx.u + m.d * mtx.v + m.v * mtx.w;
            result.tx = m.tx * mtx.a + m.ty * mtx.c + m.w * mtx.tx;
            result.ty = m.tx * mtx.b + m.ty * mtx.d + m.w * mtx.ty;
            result.w = m.tx * mtx.u + m.ty * mtx.v + m.w * mtx.w;
            m.a = result.a;
            m.b = result.b;
            m.u = result.u;
            m.c = result.c;
            m.d = result.d;
            m.v = result.v;
            m.tx = result.tx;
            m.ty = result.ty;
            m.w = result.w;
            return m;
        },
        /**
         * 이 행렬의 복제본인 새 Matrix 객체와, 포함된 객체의 동일한 복사본을 함께 반환.
         * @return	{Matrix}	복제본 Matrix
         */
        clone: function () {
            var m = this;
            return	new $B.geom.Matrix( m.a, m.b, m.c, m.d, m.tx, m.ty );
        },
        /**
         * 행렬에 크기 조절 변형을 적용. x 축에는 sx가 곱해지고 y 축에는 sy가 곱해짐.
         * @param	{Number}	sx	scaleX
         * @param	{Number}	sy	scaleY.
         * @return {Matrix}
         */
        scale: function ( sx, sy ) {
            var mtx = new $B.geom.Matrix( sx, 0, 0, sy, 0, 0 );
            return this.concat( mtx );
        },
        /**
         * Matrix 객체에 회전 변형을 적용
         * @param	{Number}	angle	Degree
         * @return {Matrix}
         */
        rotate: function ( angle ) {
            var rad = this.DEG_TO_RAD * angle,
                cosVal = Math.cos( rad ),
                sinVal = Math.sin( rad ),
                mtx = new $B.geom.Matrix( cosVal, sinVal, -sinVal, cosVal, 0, 0 );
            return this.concat( mtx );
        },
        /**
         * Matrix 객체에 기울이기 또는 시어링 변형을 적용
         * @param	{Number}	rx	Degree
         * @param	{Number}	ry	Degree
         * @return {Matrix}
         */
        skew: function ( rx, ry ) {
            var radx = this.DEG_TO_RAD * rx,
                rady = this.DEG_TO_RAD * ry,
            //mtx = new $B.geom.Matrix( 1, rady, radx, 1, 0, 0 );
                mtx = new $B.geom.Matrix( 1, Math.tan(rady), Math.tan(radx), 1, 0, 0 );
            return this.concat( mtx );
        },
        /**
         * dx 및 dy 매개 변수에 지정된 대로 x 및 y 축을 따라 행렬을 평행 이동
         * @param	{Number}	dx	x 축을 따라 오른쪽으로 이동할 크기
         * @param	{Number}	dy	y 축을 따라 아래쪽으로 이동할 크기
         * @return {Matrix}
         */
        translate: function ( dx, dy ) {
            dy = dy || 0;
            var mtx = new $B.geom.Matrix( 1, 0, 0, 1, dx, dy );
            return this.concat( mtx );
        },
        /**
         * Matrix 객체가 나타내는 기하학적 변형을 지정된 점에 적용한 결과를 반환
         * @param	{Point}		point	x와 y를 가지고 있는 Object
         * @return	{Point}		x와 y좌표를 가지고 있는 Point 객체 반환
         */
        transform: function ( point ) {
            var result = {},
                m = this;
    
            result.x = m.a * point.x + m.c * point.y + m.tx;
            result.y = m.b * point.x + m.d * point.y + m.ty;
            return result;
        }
    }, '$B.geom.Matrix');


    // ============================================================== //
    // =====================	Matrix3D	========================= //
    // ============================================================== //
    
    /**
     * 4x4 변형행렬, 3D Matrix
     * @class {Matrix3D}
     */
    ixBand.geom.Matrix3D = $B.Class.extend({
        //degrees to radians
        DEG_TO_RAD: Math.PI / 180,
    
        initialize: function ( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34 ) {
            /*
             | 1 0 0 0 |	sx	m12	m13	tx |
             | 0 1 0 0 |	m21	sy	m23	ty |
             | 0 0 1 0 |	m31	m32	sz	tz |
             | 0 0 0 1 |	m41	m42	m43	tw |
             */
            /*
             if ( a || b || c ) {
             this.rawData = [a, b, c, [0, 0, 0, 1]];
             } else {
             this.rawData = [
             [1, 0, 0, 0],
             [0, 1, 0, 0],
             [0, 0, 1, 0],
             [0, 0, 0, 1]];
             }
             */
    
            if ( m11 || m11 == 0 ) {
                this.m11 = m11;//scaleX
                this.m12 = m12;
                this.m13 = m13;
                this.m14 = m14;//tx
                this.m21 = m21;
                this.m22 = m22;//scaleY
                this.m23 = m23;
                this.m24 = m24;//ty
                this.m31 = m31;
                this.m32 = m32;
                this.m33 = m33;//scaleZ
                this.m34 = m34;//tz
            } else {
                this.m11 = 1;
                this.m12 = 0;
                this.m13 = 0;
                this.m14 = 0;
                this.m21 = 0;
                this.m22 = 1;
                this.m23 = 0;
                this.m24 = 0;
                this.m31 = 0;
                this.m32 = 0;
                this.m33 = 1;
                this.m34 = 0;
            }
    
            this.m41 = 0;
            this.m42 = 0;
            this.m43 = 0;
            this.m44 = 1;//tw
        },
    
        // ===============	Public Methods =============== //
    
        //matrix3d를 CSS3에서 사용할 수 있도록 문자열로 반환
        toString: function () {
            //var raw = this.rawData;
            //return raw[0].join(',') + ',' + raw[1].join(',') + ',' + raw[2].join(',') + ',' + raw[3].join(',');
            var m = this;
            return m.m11 +','+ m.m12 +','+ m.m13 +','+ m.m14 +','+ m.m21 +','+ m.m22 +','+ m.m23 +','+ m.m24 +','+ m.m31 +','+ m.m32 +','+ m.m33 +','+ m.m34 +','+ m.m41 +','+ m.m42 +','+ m.m43 +','+ m.m44;
        },
    
        /**
         * 행렬을 현재 행렬과 연결하여 두 행렬의 기하학적 효과를 효율적으로 결합
         * @param	{Matrix3D}	mtx3d
         * @return	{Matrix3D}
         */
        concat: function ( mtx3d ) {
            var om = this,
                nm = mtx3d,
                m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44;
    
            m11 = om.m11 * nm.m11 + om.m12 * nm.m21 + om.m13 * nm.m31 + om.m14 * nm.m41;
            m12 = om.m11 * nm.m12 + om.m12 * nm.m22 + om.m13 * nm.m32 + om.m14 * nm.m42;
            m13 = om.m11 * nm.m13 + om.m12 * nm.m23 + om.m13 * nm.m33 + om.m14 * nm.m43;
            m14 = om.m11 * nm.m14 + om.m12 * nm.m24 + om.m13 * nm.m34 + om.m14 * nm.m44;
    
            m21 = om.m21 * nm.m11 + om.m22 * nm.m21 + om.m23 * nm.m31 + om.m24 * nm.m41;
            m22 = om.m21 * nm.m12 + om.m22 * nm.m22 + om.m23 * nm.m32 + om.m24 * nm.m42;
            m23 = om.m21 * nm.m13 + om.m22 * nm.m23 + om.m23 * nm.m33 + om.m24 * nm.m43;
            m24 = om.m21 * nm.m14 + om.m22 * nm.m24 + om.m23 * nm.m34 + om.m24 * nm.m44;
    
            m31 = om.m31 * nm.m11 + om.m32 * nm.m21 + om.m33 * nm.m31 + om.m34 * nm.m41;
            m32 = om.m31 * nm.m12 + om.m32 * nm.m22 + om.m33 * nm.m32 + om.m34 * nm.m42;
            m33 = om.m31 * nm.m13 + om.m32 * nm.m23 + om.m33 * nm.m33 + om.m34 * nm.m43;
            m34 = om.m31 * nm.m14 + om.m32 * nm.m24 + om.m33 * nm.m34 + om.m34 * nm.m44;
    
            m41 = om.m41 * nm.m11 + om.m42 * nm.m21 + om.m43 * nm.m31 + om.m44 * nm.m41;
            m42 = om.m41 * nm.m12 + om.m42 * nm.m22 + om.m43 * nm.m32 + om.m44 * nm.m42;
            m43 = om.m41 * nm.m13 + om.m42 * nm.m23 + om.m43 * nm.m33 + om.m44 * nm.m43;
            m44 = om.m41 * nm.m14 + om.m42 * nm.m24 + om.m43 * nm.m34 + om.m44 * nm.m44;
    
            om.m11 = m11;
            om.m12 = m12;
            om.m13 = m13;
            om.m14 = m14;
    
            om.m21 = m21;
            om.m22 = m22;
            om.m23 = m23;
            om.m24 = m24;
    
            om.m31 = m31;
            om.m32 = m32;
            om.m33 = m33;
            om.m34 = m34;
    
            om.m41 = m41;
            om.m42 = m42;
            om.m43 = m43;
            om.m44 = m44;
    
    
            return this;
        },
        /**
         * 이 행렬의 복제본인 새 Matrix3D 객체와, 포함된 객체의 동일한 복사본을 함께 반환.
         * @return	{Matrix3D} 복제된 새 Matrix3D
         */
        clone: function () {
            var mtx3d = new $B.geom.Matrix3D();
            mtx3d.rawData = this.rawData.concat([]);
            return	mtx3d;
        },
        /**
         * 행렬에 크기 조절 변형을 적용.
         * @param	{Number}	sx	scaleX
         * @param	{Number}	sy	scaleY
         * @param	{Number}	sz	scaleZ
         * @return	{Matrix3D}
         */
        scale: function ( sx, sy, sz ) {
            var mtx3d = new $B.geom.Matrix3D( sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0 );
            return this.concat( mtx3d );
        },
        /**
         * 행렬에 X축 크기 조절 변형을 적용.
         * @param	{Number}	scale	scaleX
         * @return	{Matrix3D}
         */
        scaleX: function ( scale ) {
            return this.scale( scale, 1, 1 );
        },
        /**
         * 행렬에 Y축 크기 조절 변형을 적용.
         * @param	{Number}	scale	scaleY
         * @return	{Matrix3D}
         */
        scaleY: function ( scale ) {
            return this.scale( 1, scale, 1 );
        },
        /**
         * 행렬에 Z축 크기 조절 변형을 적용.
         * @param	{Number}	scale	scaleZ
         * @return	{Matrix3D}
         */
        scaleZ: function ( scale ) {
            return this.scale( 1, 1, scale );
        },
        /**
         * Matrix 객체에 X축 회전 변형을 적용
         * @param	{Number}	angle	Degree
         * @return	{Matrix3D}
         */
        rotateX: function ( angle ) {
            var rad = this.DEG_TO_RAD * angle,
                cosVal = Math.cos( rad ),
                sinVal = Math.sin( rad ),
                mtx3d = new $B.geom.Matrix3D( 1, 0, 0, 0, 0, cosVal, -sinVal, 0, 0, sinVal, cosVal, 0 );
            return this.concat( mtx3d );
        },
        /**
         * Matrix 객체에 Y축 회전 변형을 적용
         * @param	{Number}	angle	Degree
         * @return	{Matrix3D}
         */
        rotateY: function ( angle ) {
            var rad = this.DEG_TO_RAD * angle,
                cosVal = Math.cos( rad ),
                sinVal = Math.sin( rad ),
                mtx3d = new $B.geom.Matrix3D( cosVal,  0, sinVal, 0, 0, 1, 0, 0, -sinVal, 0,  cosVal, 0 );
            return this.concat( mtx3d );
        },
        /**
         * Matrix 객체에 Z축 회전 변형을 적용
         * @param	{Number}	angle	Degree
         * @return	{Matrix3D}
         */
        rotateZ: function ( angle ) {
            var rad = this.DEG_TO_RAD * angle,
                cosVal = Math.cos( rad ),
                sinVal = Math.sin( rad ),
                mtx3d = new $B.geom.Matrix3D( cosVal, -sinVal, 0, 0, sinVal, cosVal, 0, 0, 0, 0, 1, 0 );
            return this.concat( mtx3d );
        },
        /**
         * dx, dy, dz 매개 변수에 지정된 대로 x, y, z 축을 따라 행렬을 평행 이동
         * @param	{Number}	dx	x 축을 따라 오른쪽으로 이동할 크기
         * @param	{Number}	dy	y 축을 따라 아래쪽으로 이동할 크기
         * @param	{Number}	dz	z 축을 따라 이동할 크기
         * @return	{Matrix3D}
         */
        translate3d: function ( dx, dy, dz ) {
            var mtx3d = new $B.geom.Matrix3D( 1, 0, 0, dx, 0, 1, 0, dy, 0, 0, 1, dz );
            return this.concat( mtx3d );
        },
        /**
         * Matrix3D 객체가 나타내는 기하학적 변형을 지정된 점에 적용한 결과를 반환
         * @param	{Point3D}		point3D	x, y, z를 가지고 있는 Object
         * @return	{Point3D}		x, y, z좌표를 가지고 있는 Point3D 객체 반환
         */
        transform3d: function ( point3D ) {
            var result = {},
                m = this;
    
            result.x = m.m11 * point3D.x + m.m12 * point3D.y + m.m13 * point3D.z + m.m14;
            result.y = m.m21 * point3D.x + m.m22 * point3D.y + m.m23 * point3D.z + m.m24;
            result.z = m.m31 * point3D.x + m.m32 * point3D.y + m.m33 * point3D.z + m.m34;
            return result;
        }
    }, '$B.geom.Matrix3D');


    // ============================================================== //
    // =====================	HttpRequest	========================= //
    // ============================================================== //
    /**
     * HttpRequest (xml, text기반 통신), 로컬서버에서는 비정상작동 할수 있다.<br>
     * 같은 도메인의 데이타 파일만 가져올수 있다.<br>
     * JS파일 로드에서 사용된다.(new_script.text = e.text)
     * Evetn : complete, error, progress(IE10~지원, Android2.*~지원)
     * Event Property : type, target, xml, text, status(상태 코드수치), statusText(에러메세지를 받을때 활용), data
     * @class	{HttpRequest}
     * @constructor
     * @param	{String}	path	경로 : String
     * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
     * @param	{String}	method	'GET' or 'POST', 기본값 'GET'<br>POST요청은 URL매개변수의 길이가 2,048글자를 넘을때만 사용, IE에서 URL길이 2,048자이상은 잘라버리기때문.
     * @param	{String}	charset	기본값 'UTF-8'(method가 POST 일때만 적용)
     */
    ixBand.net.HttpRequest = $B.Class.extend({
        initialize: function ( path, data, method, charset ) {
            this._path = path;
            this._data = data;
            this.xhr = null;
            this._method = method || 'GET';
            this._charset = charset || 'UTF-8';
    
            this._setEvents();
        },
        // ===============	Public Methods =============== //
    
        /** HttpRequest 정지, 이벤트삭제 */
        abort: function () {
            this._removeEvents();
            this.xhr.abort();
            return this;
        },
        /**
         * HttpRequest connect<br>
         * 다시 호출할려면 abort시킨후 호출해야한다.
         * @param	{String}	params	예)count=100&time=100
         * @param	{Boolean}	cache	GET으로 요청할때 캐시가 false면 url에 requestTime을 추가하여 캐시를 방지한다.
         */
        load: function ( params, cache ) {
            var sp = ( this._path.indexOf('?') < 0 )? '?' : '&',
                url = ( cache )? this._path : this._path + sp + 'requestTime=' + new Date().getTime();
    
            //URI encode
            if ( params ) {
                var datas = params.split( '&' ),
                    paramNum = datas.length,
                    dataSet, i;
    
                params = '';
                for ( i = 0; i < paramNum; ++i ) {
                    dataSet = datas[i].split( '=' );
                    params += dataSet[0] + '=' + encodeURIComponent( dataSet[1] );
                    if ( i < paramNum - 1 ) params += '&';
                }
            }
    
            this.xhr.onreadystatechange = this._handler;
    
            //GET
            if ( /get/i.test(this._method) ) {
                if ( params && params != '' ) url += '&' + params;
                this.xhr.open( 'GET', url, true );
                this.xhr.send( null );
                //POST
            } else {
                this.xhr.open( 'POST', url, true );
                this.xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded; charset=' + this._charset );
                this.xhr.send( params );
            }
            return this;
        },
    
        /**
         * 서버에 Stream으로 파일전송<br>
         * 다시 호출할려면 abort시킨후 호출해야한다.
         * method설정과 괸계없이 무조건 POST전송
         * @param	{String}	data	base64 image data
         */
        upload: function ( data ) {
            this.xhr.onreadystatechange = this._handler;
            this.xhr.open( 'POST', this._path, true );
            this.xhr.setRequestHeader( 'Content-type', 'application/octet-stream' );
            //this.xhr.setRequestHeader( 'Content-Type', 'application/upload' );
            this.xhr.send( data );
    
            return this;
        },
    
        // ===============	Private Methods =============== //
    
        _setEvents: function () {
            this._handler = $B.bind(function (e) {
                //DONE
                if ( this.xhr.readyState !== 4 ) return false;
                var evt = {target: this, xml: this.xhr.responseXML, text: this.xhr.responseText, status: this.xhr.status, statusText: this.xhr.statusText, data: this._data};
    
                if ( this.xhr.status == 200 ) {
                    this.dispatch( 'complete', evt );
                } else {
                    this.dispatch( 'error', evt );
                }
    
                this._removeEvents();
            }, this);
    
            //"Microsoft.XMLHTTP", "MSXML2.XMLHTTP.3.0"는 readyState 3를 지원하지 않는다.
            var i, activeXids = ['MSXML2.XMLHTTP.6.0', 'MSXML3.XMLHTTP', 'Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.3.0'],
                activeXidNum = activeXids.length;
    
            if ( window.XMLHttpRequest ) {
                this.xhr = new XMLHttpRequest();
            } else {
                for ( i = 0; i < activeXidNum; ++i ) {
                    try {
                        this.xhr = new ActiveXObject( activeXids[i] );
                        break;
                    } catch (e) {}
                }
            }
        },
    
        _removeEvents: function () {
            if ( this.xhr ) this.xhr.onreadystatechange = null;
        }
    }, '$B.net.HttpRequest');


    // ============================================================== //
    // =====================	ImageLoader	========================= //
    // ============================================================== //
    /**
     * 이미지 로더
     * target을 지정하지 않았을때는 el.appendChild(e.img) 이런식으로 화면에 붙인다.<br>
     * img src를 넣을경우 특정 브라우져에서 정상로드시에도 error를 반환할때가 있다.<br>
     * 로컬에서 테스트시 ie6,7에서 complete 이벤트가 무한발생한다.
     * Event : complete, error
     * Event Property : type, img, data
     * @constructor
     * @param	{String}	path	이미지경로
     * @param	{HTMLImageElement}	target	img 타겟, 지정하지 않을때는 null을 설정한다.
     * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
     */
    ixBand.net.ImageLoader = $B.Class.extend({
        initialize: function ( path, target, data ) {
            this._path = path;
            this._data = data;
            this.img = target || new Image();
            this._isComplete = false;
    
            this._setEvents();
        },
    
        // ===============	Public Methods =============== //
        /** Load 취소 */
        unload: function () {
            if ( this._isComplete ) return;
            this._removeEvents();
            this.img.src = null;
            return this;
        },
    
        /** Load 시작, 다시 호출할려면 unload시킨후 호출. */
        load: function () {
            if ( this._isComplete ) return;
            $B( this.img ).addEvent( 'load', this._handler );
            $B( this.img ).addEvent( 'error', this._handler );
            this.img.src = this._path;
            return this;
        },
    
        // ===============	Private Methods =============== //
    
        _setEvents: function () {
            this._handler = $B.bind( function (e) {
                var evt = {target: this, img: this.img, data: this._data};
    
                switch (e.type) {
                    case 'load':
                        evt.type = 'complete';
                        this._isComplete = true;
                        this.dispatch( 'complete', evt );
                        break;
                    case 'error':
                        this.dispatch( 'error', evt );
                        break;
                }
    
                this._removeEvents();
            }, this);
        },
    
        _removeEvents: function () {
            $B( this.img ).removeEvent( 'load', this._handler );
            $B( this.img ).removeEvent( 'error', this._handler );
        }
    }, '$B.net.ImageLoader');


    // ============================================================== //
    // =====================	JSLoader	========================= //
    // ============================================================== //
    /**
     * JS파일 로더, 로컬서버에서는 비정상작동 할수 있다.
     * Event : complete, error 이벤트를 지원하지 않는다.
     * Event Property : type, script, data
     * @class	{JSLoader}
     * @constructor
     * @param	{String}	path	경로 : String
     * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
     */
    ixBand.net.JSLoader = $B.Class.extend({
        initialize: function ( path, data ) {
            this._path = path;
            this._isComplete = false;
            this._data = data;
            this.script = document.createElement( 'script' );
            this.script.type = 'text/javascript';
    
            this._setEvents();
        },
    
        // ===============	Public Methods =============== //
        /** Load 취소, Load가 완료된 후에는 unload되지 않는다. */
        unload: function () {
            if ( this._isComplete ) return;
            this._removeEvents();
            this.script.src = null;
        },
    
        /** Load 시작, 로드가 진행중이면 unload시킨후 로드해야 한다. 로드완료후 호출 불가능. */
        load: function () {
            if ( this._isComplete ) return;
    
            //IE
            if ( this.script.readyState ) {
                this.script.onreadystatechange = $B.bind( function (e) {
                    if ( this.script.readyState === 'loaded' || this.script.readyState === 'complete' ) {
                        this._removeEvents();
                        this._isComplete = true;
                        this.dispatch( 'load', {target: this, script: this.script, data: this._data} );
                    }
                }, this);
            } else {
                this.script.onload = $B.bind( function (e) {
                    this._removeEvents();
                    this._isComplete = true;
                    this.dispatch( 'load', {target: this, script: this.script, data: this._data} );
                }, this);
            }
    
            this.script.src = this._path;
            document.getElementsByTagName( 'head' )[0].appendChild( this.script );
        },
    
        //로드여부 반환
        complete: function () {
            return this._isComplete;
        },
    
        // ===============	Private Methods =============== //
    
        _removeEvents: function () {
            //IE
            if ( this.script.readyState ) {
                this.script.onreadystatechange = null;
            } else {
                this.script.onload = null;
            }
        }
    
    }, '$B.net.JSLoader');
})();