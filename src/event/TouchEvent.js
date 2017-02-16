// ============================================================== //
// =====================	TouchEvent		===================== //
// ============================================================== //

/**
 * TouchEvent 크로스 브라우징, 하나의 대상의 하나의 TouchEvent 객체 등록
 * @constructor
 * @param	{Element || Selector || jQuery}	target		이벤트 발생 대상
 */
ixBand.event.TouchEvent = function ( target ) {
    var _this = this,
        POINTER_TYPES = ['', '', 'touch', 'pen', 'mouse'];

    this._eventPool = {};
    this._target = $B( target ).element();
    this._eventId = 0;
    this._touches = {};
    this._isEndEvent = false;

    this._addTouch = function ( event ) {
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
    };

    this._removeTouch = function ( event ) {
        delete this._touches[event.pointerId];
    };

    this._getPointerType = function ( event ) {
        var result = 'touch', pointerType = event.pointerType;

        if ( typeof pointerType === 'string' ) {
            result = pointerType;
        } else if ( typeof pointerType === 'number' && pointerType > -1 && pointerType < 5 ) {
            result = POINTER_TYPES[pointerType];
        }

        return result;
    };

    //크로스브라우징 TouchEvent Touches 반환
    this._getTouches = function ( event ) {
        var touches;

        if ( MS_POINTER ) {
            touches = [];
            for ( var n in this._touches ) {
                touches.push(this._touches[n]);
            }
        } else {
            touches = event.touches;
        }

        return touches;
    };

    //크로스브라우징 이벤트 타입 반환
    this._getCrossType = function ( type ) {
        var crossType = CrossTouchEvent[type];
        return crossType || type;
    };

    //origin event type to cross event type
    this._originToCrossType = function ( type ) {
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
    };

    this._removeEvent = function ( id, evtObj, useCapture ) {
        this._target.removeEventListener( this._getCrossType(evtObj.type), evtObj.wrapHandler, useCapture || evtObj.useCapture );
        delete this._eventPool[id];
    };

    this._touchHandler = function (e) {
        _this._removeTouch(e);
    };
};

ixBand.event.TouchEvent.prototype = {
    /**
     * 이벤트 등록
     * @param	{String}	type		touchstart, touchmove, touchend, touchcancel
     * @param	{Function}	handler		event handler
     * @param	{Boolean|Object}	useCapture || options	capture, passive 등을 설정, default:false
     * 				https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener 참조
     * @return	{TouchEvent}
     */
    addListener: function ( type, handler, useCapture ) {
        if ( this._target && $B.ua.TOUCH_DEVICE && /^touch/i.test(type) ) {
            useCapture = useCapture || false;

            if ( this.hasListener(type, handler, useCapture) ) return this;

            var _this = this;

            if ( MS_POINTER && !this._isEndEvent ) {
                document.addEventListener( this._getCrossType('touchend'), this._touchHandler, false );
                document.addEventListener( this._getCrossType('touchcancel'), this._touchHandler, false );
                this._isEndEvent = true;
            }

            //중첩된 함수를 정의하고 이 함수를 handler 함수 대신 등록한다.
            var wrapHandler = function (e) {
                var crossType = _this._originToCrossType( e.type );

                if ( MS_POINTER ) {
                    if ( crossType === 'touchstart' || crossType === 'touchmove' ) {
                        _this._addTouch(e);
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
                    touches: _this._getTouches(e)
                };

                if ( MS_POINTER ) {
                    if ( crossType === 'touchend' || crossType === 'touchcancel' ) {
                        _this._removeTouch(e);
                    }
                }

                handler.call( _this, evt );
            };

            this._target.addEventListener( _this._getCrossType(type), wrapHandler, useCapture || false );

            this._eventPool[_this._eventId++] = {
                type: type,
                handler: handler,
                wrapHandler: wrapHandler,
                useCapture: useCapture
            };
        }
        return this;
    },

    /**
     * 이벤트 삭제, type만 입력하면 해당 타입과 일치하는 이벤트 모두 삭제, type handler모두 설정하지 않으면 대상의 모든 이벤트 삭제
     * @param	{String}	type		touchstart, touchmove, touchend, touchcancel
     * @param	{Function}	handler		event handler
     * @param	{Boolean|Object}	useCapture || options	capture, passive 등을 확인 후 삭제, default:false
     * @return	{TouchEvent}
     */
    removeListener: function ( type, handler, useCapture ) {
        if ( type && handler && useCapture ) {
            for ( var n in this._eventPool ) {
                var event = this._eventPool[n];

                if ( event.type === type && event.handler === handler && $B.isEqual(event.useCapture, useCapture) ) {
                    console.log( '-basic_remove:', type );
                    this._removeEvent( n, event, useCapture );
                }
            }
        } else if ( type && handler ) {
            for ( var n in this._eventPool ) {
                var event = this._eventPool[n];

                if ( event.type === type && event.handler === handler ) {
                    this._removeEvent( n, event );
                }
            }
        } else if ( type ) {
            for ( var n in this._eventPool ) {
                var event = this._eventPool[n];
                if ( event.type === type ) this._removeEvent( n, event );
            }
        } else {
            for ( var n in this._eventPool ) {
                this._removeEvent( n, this._eventPool[n] );
            }
        }
        return this;
    },

    /**
     * 이벤트 등록여부 반환
     * @param	{String}	type		touchstart, touchmove, touchend, touchcancel
     * @param	{Function}	handler		event handler
     * @param	{Boolean}	useCapture	useCapture || options	capture, passive 등의 설정 여부 확인, default:false
     * @return	{Boolean}
     */
    hasListener: function ( type, handler, useCapture ) {
        for ( var n in this._eventPool ) {
            var event = this._eventPool[n];

            if ( event.type === type && event.handler === handler && $B.isEqual(event.useCapture, useCapture) ) {
                return true;
                break;
            }
        }
        return false;
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
    }
};