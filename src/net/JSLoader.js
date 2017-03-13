// ============================================================== //
// =====================	JSLoader	========================= //
// ============================================================== //
/**
 * JS파일 로더, 로컬서버에서는 비정상작동 할수 있다.
 * Event : complete, error 이벤트를 지원하지 않는다.
 * Event Property : type, script, data
 * @class	{JSLoader}
 * @constructor
 * @param	{String}	path	경로 : String
 * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
 */
ixBand.net.JSLoader = $B.Class.extend({
    initialize: function ( path, data ) {
        this._path = path;
        this._isComplete = false;
        this._data = data;
        this.script = document.createElement( 'script' );
        this.script.type = 'text/javascript';

        this._setEvents();
    },

    // ===============	Public Methods =============== //
    /** Load 취소, Load가 완료된 후에는 unload되지 않는다. */
    unload: function () {
        if ( this._isComplete ) return;
        this._removeEvents();
        this.script.src = null;
    },

    /** Load 시작, 로드가 진행중이면 unload시킨후 로드해야 한다. 로드완료후 호출 불가능. */
    load: function () {
        if ( this._isComplete ) return;

        //IE
        if ( this.script.readyState ) {
            this.script.onreadystatechange = $B.bind( function (e) {
                if ( this.script.readyState === 'loaded' || this.script.readyState === 'complete' ) {
                    this._removeEvents();
                    this._isComplete = true;
                    this.dispatch( 'load', {target: this, script: this.script, data: this._data} );
                }
            }, this);
        } else {
            this.script.onload = $B.bind( function (e) {
                this._removeEvents();
                this._isComplete = true;
                this.dispatch( 'load', {target: this, script: this.script, data: this._data} );
            }, this);
        }

        this.script.src = this._path;
        document.getElementsByTagName( 'head' )[0].appendChild( this.script );
    },

    //로드여부 반환
    complete: function () {
        return this._isComplete;
    },

    // ===============	Private Methods =============== //

    _removeEvents: function () {
        //IE
        if ( this.script.readyState ) {
            this.script.onreadystatechange = null;
        } else {
            this.script.onload = null;
        }
    }

}, '$B.net.JSLoader');