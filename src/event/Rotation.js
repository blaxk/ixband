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
		if ( navigator.pointerEnabled || 'onpointerdown' in window ) {
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