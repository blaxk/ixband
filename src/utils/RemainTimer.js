// ============================================================== //
// =====================	RemainTimer	========================= //
// ============================================================== //
/**
 * Dday, 1초에 한번 이벤트 발생<br>
 * Event : timer, complete
 * Event Property : type, target, day, hour, minute, second
 * @class	{RemainTimer}
 * @constructor
 * @param	{Int}		startTime	시작시간, UTC milisecond형식
 * @param	{Int}		finishTime	완료시간, UTC milisecond형식
 */
ixBand.utils.RemainTimer = $B.Class.extend({
    DELAY: 1000,

    initialize: function ( startTime, finishTime ) {
        this._startTime = startTime;
        this._finishTime = finishTime;
        this._beginTime = startTime;
        this._finishTime = finishTime;
        this._delay = this.DELAY;
        this._interval = null;
        this._running = false;

        this._handler = $B.bind(function (e) {
            var dday = this._getTime();
            dday.target = this;
            this.dispatch( 'timer', dday );

            if ( dday._gap <= 0 ) {
                this.stop();
                this.dispatch( 'complete', dday );
            }
        }, this);
        return this;
    },

    // ===============	Public Methods	=============== //

    /** Timer 시작, 이미 실행중이면 다시 시작하지 않는다. */
    start: function () {
        if ( !this._interval ) this._interval = setInterval( this._handler, this._delay );
        this._running = true;
        return this;
    },
    /** Timer 정지, currentCount는 재설정 하지 않는다. */
    stop: function () {
        if ( this._interval ) clearInterval( this._interval );
        this._interval = null;
        this._running = false;
        return this;
    },
    /** Stop후 currentCount = 0
     * @param	{Number}	startTime		시작시간 재설정, UTC milisecond형식, 설정하지 않으면 처음 설정했던 시작시간으로 되돌아 간다.
     * @param	{Number}	finishTime		완료시간 재설정, UTC milisecond형식, 설정하지 않으면 처음 설정했던 완료시간으로 되돌아 간다.
     * @return	this
     */
    reset: function ( startTime, finishTime ) {
        this.stop();
        this._reset( startTime, finishTime );
        return this;
    },
    /** 타이머가 실행 중이면 true반환 */
    running: function () {
        return this._running;
    },

    // ===============	Private Methods	=============== //

    _getTime: function () {
        var day, hour, minute, second,
            gapTime = this._finishTime - ( this._beginTime += this.DELAY );

        if ( gapTime <= 0 ) {
            return {_gap: 0, day: 0, hour: 0, minute: 0, second: 0};
        } else {
            day = Math.floor( gapTime / 1000 / 60 / 60 / 24 );
            hour = Math.floor( gapTime / 1000 / 60 / 60 - (24 * day) );
            minute = Math.floor( gapTime / 1000 / 60 - (24 * 60 * day ) - (60 * hour) );
            second = Math.floor( gapTime / 1000 - (24 * 60 * 60 * day) - (60 * 60 * hour) - (60 * minute) );
            return {_gap: gapTime, day: day, hour: hour, minute: minute, second: second};
        }
    },

    _reset: function ( begin, finish ) {
        this._beginTime = ( typeof begin === 'number' )? begin : this._startTime;
        this._finishTime = ( typeof finish === 'number' )? finish : this._finishTime;
    }
}, '$B.utils.RemainTimer');