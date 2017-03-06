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