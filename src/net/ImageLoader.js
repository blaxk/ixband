// ============================================================== //
// =====================	ImageLoader	========================= //
// ============================================================== //
/**
 * 이미지 로더
 * target을 지정하지 않았을때는 el.appendChild(e.img) 이런식으로 화면에 붙인다.<br>
 * img src를 넣을경우 특정 브라우져에서 정상로드시에도 error를 반환할때가 있다.<br>
 * 로컬에서 테스트시 ie6,7에서 complete 이벤트가 무한발생한다.
 * Event : complete, error
 * Event Property : type, img, data
 * @constructor
 * @param	{String}	path	이미지경로
 * @param	{HTMLImageElement}	target	img 타겟, 지정하지 않을때는 null을 설정한다.
 * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
 */
ixBand.net.ImageLoader = $B.Class.extend({
    initialize: function ( path, target, data ) {
        this._path = path;
        this._data = data;
        this.img = target || new Image();
        this._isComplete = false;

        this._setEvents();
    },

    // ===============	Public Methods =============== //
    /** Load 취소 */
    unload: function () {
        if ( this._isComplete ) return;
        this._removeEvents();
        this.img.src = null;
        return this;
    },

    /** Load 시작, 다시 호출할려면 unload시킨후 호출. */
    load: function () {
        if ( this._isComplete ) return;
        $B( this.img ).addEvent( 'load', this._handler );
        $B( this.img ).addEvent( 'error', this._handler );
        this.img.src = this._path;
        return this;
    },

    // ===============	Private Methods =============== //

    _setEvents: function () {
        this._handler = $B.bind( function (e) {
            var evt = {target: this, img: this.img, data: this._data};

            switch (e.type) {
                case 'load':
                    evt.type = 'complete';
                    this._isComplete = true;
                    this.dispatch( 'complete', evt );
                    break;
                case 'error':
                    this.dispatch( 'error', evt );
                    break;
            }

            this._removeEvents();
        }, this);
    },

    _removeEvents: function () {
        $B( this.img ).removeEvent( 'load', this._handler );
        $B( this.img ).removeEvent( 'error', this._handler );
    }
}, '$B.net.ImageLoader');