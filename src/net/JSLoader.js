// ============================================================== //
// =====================	JSLoader	========================= //
// ============================================================== //
/**
 * JS파일 로더, 로컬서버에서는 비정상작동 할수 있다.<br>
 * Event Property : type, target, script, data
 * @class	{JSLoader}
 * @constructor
 * @param	{String}	path	경로 : String
 * @param	{Object}	dispatch	Event들 onComplete:Function, 에러이벤트가 발생하지 않는다.
 * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
 */
ixBand.net.JSLoader = function ( path, dispatch, data ) {
    data = ( data || data == 0 )? data : null;

    this._path = path;
    this._isComplete = false;
    this._onComplete = ( dispatch && dispatch.onComplete )? dispatch.onComplete : {};
    this.script = document.createElement( 'script' );
    this.script.type = 'text/javascript';

    this._evt = {type: 'complete', target: this, script: this.script, data: data};

    //IE
    if ( this.script.readyState ) {
        this._removeEvents = function () {
            this.script.onreadystatechange = null;
        };
    } else {
        this._removeEvents = function () {
            this.script.onload = null;
        };
    }
};

ixBand.net.JSLoader.prototype = {
    /** Load 취소, Load가 완료된 후에는 unload되지 않는다. */
    unload: function () {
        if ( this._isComplete ) return;
        this._removeEvents();
        this.script.src = null;
    },
    /** Load 시작, 로드가 진행중이면 unload시킨후 로드해야 한다. 로드완료후 호출 불가능. */
    load: function () {
        if ( this._isComplete ) return;
        var _this = this;
        //IE
        if ( this.script.readyState ) {
            this.script.onreadystatechange = function (e) {
                if ( _this.script.readyState == 'loaded' || _this.script.readyState == 'complete' ) {
                    _this._removeEvents();
                    _this._onComplete.call( _this, _this._evt );
                    _this._isComplete = true;
                }
            };
        } else {
            this.script.onload = function (e) {
                _this._removeEvents();
                _this._onComplete.call( _this, _this._evt );
                _this._isComplete = true;
            };
        }
        this.script.src = this._path;
        document.getElementsByTagName( 'head' )[0].appendChild( this.script );
    }
};