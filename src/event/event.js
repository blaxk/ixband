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

        for ( id in _this._ix_allEvents_ ) {
            var h = _this._ix_allEvents_[id];
            h.el.detachEvent( 'on' + h.type, h.wrapHandler );
            delete _this._ix_allEvents_[id];
        }
    }

    //대상의 모든 이벤트 삭제
    function removeAllEvent ( el, clone ) {
        if ( el._ix_eventIds_ ) {
            var ids = el._ix_eventIds_,
                eidNum = ids.length, i;

            for ( i = 0; i < eidNum; ++i ) {
                var id = ids[i],
                    evt = window._ix_allEvents_[id],
                    type = evt.type,
                    matchEl = ( clone )? true: evt.el == el;

                //삭제
                if ( matchEl ) {
                    Evt._removeEventListener( el, type, evt.wrapHandler );

                    //창마다 하나식 있는 _ix_allEvents_ 객체에서 이벤트정보 삭제
                    if ( !clone ) delete window._ix_allEvents_[id];
                }
            }

            if ( !clone ) el._ix_eventIds_ = null;
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
            var eventIds = el._ix_eventIds_;
            //등록된 _ix_eventIds_가 없으면 -1반환
            if ( !eventIds ) return -1;

            var hNum = eventIds.length - 1,
                alls = [],
                i;

            type = getCrossType( type );

            //가장최근에 등록된 이벤트가 제거될 가능성이 높기때문에 루프를 뒤에서 부터 돈다.
            for ( i = hNum; i >= 0; --i ) {
                var hId = eventIds[i],
                    evt = window._ix_allEvents_[hId];

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
                            id = el._ix_eventIds_[idx],
                            evt = window._ix_allEvents_[id];

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
            //el._ix_eventIds_[] 배열에서 찾는다.
            var i = this.find( el, type, handler );
            if ( i == -1 ) return;

            var id = el._ix_eventIds_[i],
                h = window._ix_allEvents_[id];

            this._removeEventListener( el, type, h.wrapHandler );

            //배열에서 el 제거
            el._ix_eventIds_.splice( i, 1 );
            //창마다 하나식 있는 _ix_allEvents_ 객체에서 이벤트정보 삭제
            delete window._ix_allEvents_[id];
        },

        //대상 개체의 해당 타입의 모든 이벤트 삭제
        removeTypeAll: function ( el, type ) {
            var eventIds = el._ix_eventIds_;
            //등록된 _ix_eventIds_가 없으면 정지.
            if ( !eventIds ) return;

            //type = getCrossType( type );

            //가장최근에 등록된 이벤트가 제거될 가능성이 높기때문에 루프를 뒤에서 부터 돈다.
            for ( var i = eventIds.length - 1; i >= 0; --i ) {
                var id = eventIds[i],
                    evt = window._ix_allEvents_[id];

                if ( evt.type == type ) {
                    this._removeEventListener( el, type, evt.wrapHandler );
                    //배열에서 el 제거
                    el._ix_eventIds_.splice( i, 1 );
                    //창마다 하나식 있는 _ix_allEvents_ 객체에서 이벤트정보 삭제
                    delete window._ix_allEvents_[id];
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

            if ( !w._ix_allEvents_ ) w._ix_allEvents_ = {};
            w._ix_allEvents_[id] = h;

            if ( !el._ix_eventIds_ ) el._ix_eventIds_ = [];
            el._ix_eventIds_.push(id);
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

            if ( !w._ix_allEvents_ ) w._ix_allEvents_ = {};
            w._ix_allEvents_[id] = h;

            if ( !el._ix_eventIds_ ) el._ix_eventIds_ = [];
            el._ix_eventIds_.push(id);

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