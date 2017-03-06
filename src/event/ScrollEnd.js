// ============================================================== //
// =====================	ScrollEnd		===================== //
// ============================================================== //

/**
 * 대상영역의 ScrollEnd 이벤트
 * Event : scrolltop, scrollrignt, scrollbottom, scrollleft, scroll
 * Event Property : type, target, currentTarget
 * @constructor
 * @param	{Element, Selector, jQuery}	target		터치이벤트 발생시킬 대상, 내장함수 querySelector() 로 구현되어졌다, 단일개체. http://www.w3.org/TR/css3-selectors/#link
 * @param   {Object}    options
 *      - {Boolean}     noneScrollDispatchEvent     콘텐츠가 부모영역보다 짧아 스크롤이 발생되지 않는시점에 이벤트를 받을지 여부 설정
 */
ixBand.event.ScrollEnd = $B.Class.extend({
    _enable: false,
    _gap: {left: 0, right: 0, top: 0, bottom: 0},
    _active: {scrollleft: false, scrollright: false, scrolltop: false, scrollbottom: false},

    initialize: function ( target, options ) {
        this._target = $B( target ).element();
        this._options = options || {};

        if ( this._target === window || this._target === document ) {
            this._winTarget = true;
        }

        this._scrollX = -1;
        this._scrollY = -1;
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

        if ( this._scrollY != scrollY && scrollH > 0 ) {
            this._scrollY = scrollY;

            if ( type === 'scrolltop' ) {
                this._dispatch( type, scrollY, this._gap.top );
            } else if ( type === 'scrollbottom' ) {
                this._dispatch( type, scrollY, this._gap.top );
            } else {
                this._dispatch( 'scrolltop', scrollY, this._gap.top );
                this._dispatch( 'scrollbottom', scrollY, scrollH - this._gap.bottom );
            }
        }

        if ( this._scrollX != scrollX && scrollW > 0 ) {
            this._scrollX = scrollX;

            if ( type === 'scrollleft' ) {
                this._dispatch( type, scrollX, this._gap.left );
            } else if ( type === 'scrollright' ) {
                this._dispatch( type, scrollX, scrollW - this._gap.right );
            } else {
                this._dispatch( 'scrollleft', scrollX, this._gap.left );
                this._dispatch( 'scrollright', scrollX, scrollW - this._gap.right );
            }
        }

        return this;
    },

    /**
     * 내부의 컨텐츠가 스크롤이 발생하지 않을만큼 짧은 컨텐츠인지 여부 반환
     * scrollleft, scrollright는 가로사이즈, scrolltop, scrollbottom은 세로사이즈를 체크하여 반환
     * @param {String}  type    체크할 event type
     * @returns {Boolean}
     */
    isLessContent: function ( type ) {
        var scrollW = this._getTargetSize( 'width' ),
            scrollH = this._getTargetSize( 'height' ),
            result = false;

        if ( type === 'scrollleft' || type === 'scrollright' ) {
            result = !( scrollW > 0 );
        } else if ( type === 'scrolltop' || type === 'scrollbottom' ) {
            result = !( scrollH > 0 );
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