// ============================================================== //
// =====================	GestureAxis		===================== //
// ============================================================== //

/**
 * 대상영역의 Touch 방향 dispatch (Windows8.* 터치 디바이스 미지원)
 * Event : axis
 * Event Property : type, target, currentTarget, axis:(vertical, horizontal), pageX, pageY, direction:(left, right, top, bottom, none)
 * @constructor
 * @param	{Element, Selector, jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
 */
ixBand.event.GestureAxis = $B.Class.extend({
    initialize: function ( target, option ) {
        this._target = $B( target ).element();
        this._aType = ( option )? option.aType : 'auto';
        this._startX = 0;
        this._startY = 0;
        this._moveCount = 0;
        this._setEvents();
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