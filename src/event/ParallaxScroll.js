// ============================================================== //
// =====================	ParallaxScroll	===================== //
// ============================================================== //

/**
 * Parallax Scroll 이벤트 검출기,
 * Event : activate (구간에 진입시 한번만 발생), deactivate (구간에 진입시 한번만 발생), between (구간에 진입시 계속해서 발생)
 * Event Properties : e.percent, e.totalPercent, e.index:'deactivate'발생시 이전'activate' index반환, e.value, e.data
 * @param	{Array}		포지션 데이타 배열, [{min:Number, max:Number, data:*}, ...
 * @param	{String}	scrollType	vertical, horizontal (default=vertical)
 * @param	{Element}	scrollTarget	scroll을 발생시킬 대상 설정 (default=window)
 */
ixBand.event.ParallaxScroll = $B.utils.Between.extend({
    initialize: function ( positions, scrollType, scrollTarget ) {
        this._scrollTarget = scrollTarget || window;
        this._scrollType = scrollType || 'vertical';
        $B.utils.Between.prototype.initialize.call( this, positions );
        this._setEvents();
        return this;
    },

    // ==================== Public Methods ==================== //
    /**
     * 이벤트를 강제로 실행시킬때 사용, (positions, scroll값 둘중에 하나라도 값의 변화가 있어야 동작한다.)
     */
    trigger: function () {
        var baseValue = ( this._scrollType === 'vertical' )? $B( this._scrollTarget ).scrollTop() : $B( this._scrollTarget ).scrollLeft();
        $B.utils.Between.prototype.trigger.call( this, baseValue );
        return this;
    },

    /**
     * 이벤트 및 기본설정 삭제
     */
    clear: function () {
        $B( this._scrollTarget ).removeEvent( 'scroll', this._scrollHandler );
        return this;
    },

    // ==================== Private Methods ==================== //

    _setEvents: function () {
        this._scrollHandler = $B.bind( this.trigger, this );
        $B( this._scrollTarget ).addEvent( 'scroll', this._scrollHandler );
    }
}, '$B.event.ParallaxScroll');