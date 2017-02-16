// ============================================================== //
// =====================	MultiTouch	========================= //
// ============================================================== //

/**
 * 터치 디바이스에서 대상영역의 Multi Touch Gesture검출기 생성 (Windows8.* 터치 디바이스 지원, Android 2.*에서는 지원하지 않는다.)
 * Event : multitouchstart, multitouchmove, multitouchend
 * Event Property : type, pageX, pageY, clientX, clientY, growX, growY, pan, distance, degree, radian, pointers[{target, pageX, pageY, clientX, clientY, growX, growY}]
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
        this._startDistanceX = 0;
        this._startDistanceY = 0;
        this._oldCenterX = 0;
        this._oldCenterY = 0;
        this._oldPageX1 = 0;
        this._oldPageY1 = 0;
        this._enable = true;
        this._oldEvt = {
            type: '', pointers: [{pageX: 0, pageY: 0, clientX: 0, clientY: 0}, {pageX: 0, pageY: 0, clientX: 0, clientY: 0}],
            growAngle: 0, growScale: 0, angle: 0, scale: 1,
            degree: 0, radian: 0, radius: 0, distanceX: 0, distanceY: 0,
            pageX: 0, pageY: 0, clientX: 0, clientY: 0, pan: false
        };

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
                touches = e.touches, touch1, touch2, touchNum = e.touches.length;

            if ( touchNum > 1 ) {
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

                var distanceX = this._getDistance( pageX1, pageX2 ),
                    distanceY = this._getDistance( pageY1, pageY2 ),
                    radius = this._getRadius( distanceX, distanceY ),
                    radian = this._getRadian( distanceX, distanceY ),
                    degree = this._radianToDeg( radian ),
                    cPageX = this._getCenterPos( pageX1, pageX2, distanceX ),
                    cPageY = this._getCenterPos( pageY1, pageY2, distanceY ),
                    cClientX = this._getCenterPos( clientX1, clientX2, distanceX ),
                    cClientY = this._getCenterPos( clientY2, clientY2, distanceY );

                var pointers = [{pageX: pageX1, pageY: pageY1, clientX: clientX1, clientY: clientY1},
                    {pageX: pageX2, pageY: pageY2, clientX: clientX2, clientY: clientY2}];

                evt = {
                    type: '', pointers: pointers,
                    growAngle: 0, growScale: 0, angle: 0, scale: 1,
                    degree: degree, radian: radian, radius: radius, distanceX: distanceX, distanceY: distanceY,
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
                    evt.pan = this._isPanEvent( this._startDistanceX, this._startDistanceY, distanceX, distanceY );
                    this.dispatch( 'multitouchmove', evt );
                    //Start
                } else if ( e.type == 'touchstart' ) {
                    this._hasMultiTouchStart = true;
                    this._startRadius = radius;
                    this._totalAngle = 0;
                    this._isPan = null;
                    this._startDistanceX = distanceX;
                    this._startDistanceY = distanceY;

                    //start시에는 grow관련값이 모두 0이다.
                    this.dispatch( 'multitouchstart', evt );
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
                if ( this._hasMultiTouchStart ) {
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