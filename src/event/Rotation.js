// ============================================================== //
// =====================	Rotation	    ===================== //
// ============================================================== //
/**
 * RotationEvent
 * Event Property : type, target, currentTarget, offsetX, offsetY, degree, radian
 * Event Type : rotationstart, rotationmove, rotationend
 * @param	{Selector, Element, jQuery}	target			이벤트 발생 대상
 * @param	{Array}		datumPoint		기준 중심 좌표 x, y배열, 대상 대비 %, ex) [50%, 100%]
 * @constructor
 */
ixBand.event.Rotation = $B.Class.extend({
    initialize: function ( target, datumPoint ) {
        this._target = $B( target ).element();
        this._datumPoint = datumPoint;
        this._pageX = 0;
        this._pageY = 0;
        this._eventTarget = null;
        this._disabed = false;
        this._msTouchAction = '';
        this._touchEvent = null;
        this._winTouchEvent = null;
        this._radiusX = 100;
        this._radiusY = 100;

        this._setOptions();
        this._setEvents();
        return this;
    },

    // ===============	Public Methods =============== //
    /**
     * 회전 각도설정
     * @param	{Number}	degree		0 ~ 360 설정할 각도
     * @return	{RotationEvent}
     */
    rotation: function ( degree ) {
        this._setDegree( degree % 360 );
        return this;
    },
    /**
     * 호의 반지름 설정
     * @param	{Number}	x	x축 반지름 설정
     * @param	{Number}	y	y축 반지름 설정, 설정하지 않으면 x축설정을 따라간다.
     * @return	{RotationEvent}
     */
    radius: function ( x, y ) {
        this._radiusX = x;
        this._radiusY = y || x;
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
        e.stopPropagation();

        var offset = this._getOffset( e.clientX, e.clientY ),
            center = this._getCenterPos(),
            radian = this._getRadian( offset.x, offset.y, center.x, center.y ),
            degree = this._getAngle( radian ),
            point = this._getPoint( degree, center );

        switch ( e.type ) {
            case 'mousedown':
                $B( document ).addEvent( 'mousemove', this._onMouse );
                $B( document ).addEvent( 'mouseup', this._onMouse );
                this._dispatch( 'rotationstart', e.target, degree, radian, offset, point );
                break;
            case 'mousemove':
                this._dispatch( 'rotationmove', e.target, degree, radian, offset, point );
                break;
            case 'mouseup':
                $B( document ).removeEvent( 'mousemove', this._onMouse );
                $B( document ).removeEvent( 'mouseup', this._onMouse );
                this._dispatch( 'rotationend', e.target, degree, radian, offset, point );
                break;
        }
    },

    _touchHandler: function (e) {
        if ( this._disabed ) return;
        e.preventDefault();
        e.stopPropagation();

        var touch = e.touches[0];

        if ( e.type === 'touchstart' || e.type === 'touchmove' ) {
            this._pageX = touch.pageX;
            this._pageY = touch.pageY;
            this._eventTarget = touch.target;
        }

        var offset = this._getOffset( this._pageX, this._pageY, true ),
            center = this._getCenterPos(),
            radian = this._getRadian( offset.x, offset.y, center.x, center.y ),
            degree = this._getAngle( radian ),
            point = this._getPoint( degree, center );

        switch ( e.type ) {
            case 'touchstart':
                this._winTouchEvent.addListener( 'touchmove', this._onTouch );
                this._winTouchEvent.addListener( 'touchend', this._onTouch );
                this._winTouchEvent.addListener( 'touchcancel', this._onTouch );
                this._dispatch( 'rotationstart', this._eventTarget, degree, radian, offset, point );
                break;
            case 'touchmove':
                this._dispatch( 'rotationmove', this._eventTarget, degree, radian, offset, point );
                break;
            case 'touchend':
            case 'touchcancel':
                this._winTouchEvent.removeListener();
                this._dispatch( 'rotationend', this._eventTarget, degree, radian, offset, point );
                break;
        }
    },

    _setDegree: function ( deg ) {
        var center = this._getCenterPos(),
            point = this._getPoint( deg, center ),
            radian = this._getRadian( point.x, point.y, center.x, center.y );

        this._dispatch( 'rotation', undefined, deg, radian, point, point );
    },

    _setOptions: function () {
        if ( !$B.array.is(this._datumPoint) || this._datumPoint.length !== 2 ) {
            this._datumPoint = [50, 50];
        }

        for ( var i in this._datumPoint ) {
            this._datumPoint[i] = parseFloat( this._datumPoint[i] ) / 100;
        }

        if ( navigator.pointerEnabled ) {
            this._msTouchAction = 'touch-action';
        } else if ( navigator.msPointerEnabled ) {
            this._msTouchAction = '-ms-touch-action';
        }
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

    _getCenterPos: function () {
        var rect = $B( this._target ).rect();
        return {x: rect.width * this._datumPoint[0], y: rect.height * this._datumPoint[1]};
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
    _getRadian: function ( x, y, cx, cy ) {
        var dx = x - cx,
            dy = y - cy;
        return Math.atan2( dy, dx );
    },

    //Radian을 호도각으로 변환
    _radianToDeg: function ( radian ) {
        return radian * 180 / Math.PI;
    },

    _dragHandler: function (e) {
        e.preventDefault();
    },

    _dispatch: function ( type, target, degree, radian, offset, point ) {
        this.dispatch( type, {
            target: target,
            currentTarget: this._target,
            degree: degree,
            radian: radian,
            offsetX: offset.x,
            offsetY: offset.y,
            pointX: point.x,
            pointY: point.y
        });
    }
}, '$B.event.Rotation');