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