// ============================================================== //
// =====================	Delay		========================= //
// ============================================================== //
/**
 * Delay<br>
 * 지정한 시간이 지난후 Function실행후 Timer는 자동 삭제 된다.
 * @class	{Delay}
 * @constructor
 */
ixBand.utils.Delay = $B.Class.extend({
    initialize: function () {
        this._delays = {};
        this._count = 0;
        return this;
    },

    // ===============	Public Methods =============== //
    /**
     * Delay 시작, 고유 아이디 반환
     * @param	{Number}		delay		1000/1초
     * @param	{Function}		callback	실행할 함수
     * @param	{*}				data		핸들러에서 전달받을 data
     * @return	{Int}			id			고유아이디 반환
     */
    start: function ( delay, callback, data ) {
        data = ( data || data == 0 )? data : null;
        this._count++;
        var count = this._count;
        var _this = this;

        this._delays[count] = setTimeout(function () {
            callback.call( _this, {data: data});
            _this.clear(count);
        }, delay);
        return count;
    },
    /**
     * 진행중인 Delay 를 모두 중지, 삭제한다.
     * @param	{Int}	id	아이디를 넣으면 해당 아이디를 가지는 Delay만 정지,삭제<br>넣지 않으면 모두삭제
     */
    clear: function (id) {
        if ( id ) {
            if ( this._delays[id] ) {
                clearTimeout(this._delays[id]);
                delete this._delays[id];
            }
        } else {
            for ( id in this._delays ) {
                clearTimeout(this._delays[id]);
                delete this._delays[id];
            }
        }
        return this;
    }
}, '$B.utils.Delay');