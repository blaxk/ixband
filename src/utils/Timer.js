// ============================================================== //
// =====================	Timer		========================= //
// ============================================================== //
/**
 * Timer<br>
 * Event : timer, complete
 * Event Property : type, target, currentCount, data
 * @class	{Timer}
 * @constructor
 * @param	{Number}	delay		1000/1초
 * @param	{Int}		repeatCount	반복횟수, 0은 무한반복
 * @param	{Object}	data		이벤트 핸들어서 전달 받을 데이타
 */
ixBand.utils.Timer = $B.Class.extend({
    initialize: function ( delay, repeatCount, data ) {
        this._delay = delay;
        this._repeatCount = repeatCount || 0;
        this._data = data;
        this._interval = null;
        this._running = false;
        this._count = 0;

        this._setEvents();
    },

    // ===============	Public Methods	=============== //

    /** Timer 시작, 이미 실행중이면 다시 시작하지 않는다. */
    start: function () {
        if (!this._interval) this._interval = setInterval(this._handler, this._delay);
        this._running = true;
        return this;
    },
    /** Timer 정지, currentCount는 재설정 하지 않는다. */
    stop: function () {
        if (this._interval) clearInterval(this._interval);
        this._interval = null;
        this._running = false;
        return this;
    },
    /** Stop후 currentCount = 0
     * @return	this
     */
    reset: function () {
        this.stop();
        this._resetCount();
        return this;
    },
    /** 타이머가 실행 중이면 true반환 */
    running: function () {
        return this._running;
    },

    // ===============	Private Methods	=============== //

    _setEvents: function () {
        this._handler = $B.bind(function (e) {
            ++this._count;
            this.dispatch( 'timer', {target: this, currentCount: this._count, data: this._data} );
            if ( this._repeatCount > 0 && this._repeatCount == this._count ) {
                this.stop();
                this.dispatch( 'complete', {target: this, currentCount: this._count, data: this._data} );
            }
        }, this);
    },

    _resetCount: function () {
        this._count = 0;
    }
}, '$B.utils.Timer');