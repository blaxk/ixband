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
		this._gapTime = finishTime - startTime;
		this._beginTime = 0;
        this._interval = null;

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
		if ( !this._interval ) {
			this._beginTime = new Date().getTime()
			this._interval = setInterval(this._handler, this.DELAY);
		}
        
        return this;
    },
    /** Timer 정지, delay를 재설정 하지 않는다. */
    stop: function () {
        if ( this._interval ) clearInterval( this._interval );
        this._interval = null;
        return this;
    },
    /** Stop후 재설정
     * @param	{Number}	startTime		시작시간 재설정, UTC milisecond형식, 설정하지 않으면 처음 설정했던 시작시간으로 되돌아 간다.
     * @param	{Number}	finishTime		완료시간 재설정, UTC milisecond형식, 설정하지 않으면 처음 설정했던 완료시간으로 되돌아 간다.
     * @return	this
     */
    reset: function ( startTime, finishTime ) {
        this.stop();
		this._startTime = (typeof startTime === 'number') ? startTime : this._startTime;
		this._finishTime = (typeof finishTime === 'number') ? finishTime : this._finishTime;
		this._gapTime = this._finishTime - this._startTime;
        return this;
    },
    /** 타이머가 실행 중이면 true반환 */
    running: function () {
		return this._interval;
    },

    // ===============	Private Methods	=============== //

    _getTime: function () {
		var day, hour, minute, second;

		this._gapTime -= this._delay();
		this._beginTime = new Date().getTime();

		if ( this._gapTime <= 0 ) {
            return { _gap: 0, day: 0, hour: 0, minute: 0, second: 0 };
        } else {
			day = Math.floor( this._gapTime / 1000 / 60 / 60 / 24 );
			hour = Math.floor( this._gapTime / 1000 / 60 / 60 - (24 * day) );
			minute = Math.floor( this._gapTime / 1000 / 60 - (24 * 60 * day ) - (60 * hour) );
			second = Math.floor( this._gapTime / 1000 - (24 * 60 * 60 * day) - (60 * 60 * hour) - (60 * minute) );
			return { _gap: this._gapTime, day: day, hour: hour, minute: minute, second: second };
        }
    },
	
	_delay: function () {
		return new Date().getTime() - this._beginTime;
	}
}, '$B.utils.RemainTimer');