// ============================================================== //
// =====================	ImageLoader	========================= //
// ============================================================== //
/**
 * 이미지 로더<br>
 * target을 지정하지 않았을때는 el.appendChild(e.img) 이런식으로 화면에 붙인다.<br>
 * img src를 넣을경우 특정 브라우져에서 정상로드시에도 error를 반환할때가 있다.<br>
 * 로컬에서 테스트시 ie6,7에서 complete 이벤트가 무한발생한다.
 * Event Property : type, target, img, data
 * @class	{ImageLoader}
 * @constructor
 * @param	{HTMLImageElement}	target	img 타겟, 지정하지 않을때는 null을 설정한다.
 * @param	{String}	path	이미지경로
 * @param	{Object}	dispatch	Event들 onComplete:Function, onError:Function
 * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
 */
ixBand.net.ImageLoader = function ( target, path, dispatch, data ) {
    data = ( data || data == 0 )? data : null;

    var _this = this;

    this._path = path;
    this.img = target || new Image();
    this._handler = null;
    this._onComplete = null;
    this._onError = null;
    this._isComplete = false;

    this._removeEvents = function () {
        $B(this.img).removeEvent('load', this._handler);
        $B(this.img).removeEvent('error', this._handler);
    };

    if (dispatch) {
        this._onComplete = (typeof dispatch.onComplete === 'function')? dispatch.onComplete : {};
        this._onError = (typeof dispatch.onError === 'function')? dispatch.onError : {};

        this._handler = function (e) {
            var evt = { target: _this, img: _this.img, data: data };

            switch (e.type) {
                case 'load':
                    evt.type = 'complete';
                    _this._isComplete = true;
                    _this._onComplete.call(_this, evt);
                    break;
                case 'error':
                    evt.type = 'error';
                    _this._onError.call(_this, evt);
                    break;
            }
            _this._removeEvents();
        };
    }
};

ixBand.net.ImageLoader.prototype = {
    /** Load 취소 */
    unload: function () {
        if (this._isComplete) return;
        this._removeEvents();
        this.img.src = null;
        return this;
    },
    /** Load 시작, 다시 호출할려면 unload시킨후 호출. */
    load: function () {
        if (this._isComplete) return;
        if (typeof this._onComplete === 'function') $B(this.img).addEvent('load', this._handler);
        if (typeof this._onError === 'function') $B(this.img).addEvent('error', this._handler);
        this.img.src = this._path;
        return this;
    }
};