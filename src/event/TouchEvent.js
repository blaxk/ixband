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