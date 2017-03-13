// ============================================================== //
// =====================	HttpRequest	========================= //
// ============================================================== //
/**
 * HttpRequest (xml, text기반 통신), 로컬서버에서는 비정상작동 할수 있다.<br>
 * 같은 도메인의 데이타 파일만 가져올수 있다.<br>
 * JS파일 로드에서 사용된다.(new_script.text = e.text)
 * Evetn : complete, error, progress(IE10~지원, Android2.*~지원)
 * Event Property : type, target, xml, text, status(상태 코드수치), statusText(에러메세지를 받을때 활용), data
 * @class	{HttpRequest}
 * @constructor
 * @param	{String}	path	경로 : String
 * @param	{Object}	data	이벤트핸들러 에서 전달, 'e.data'
 * @param	{String}	method	'GET' or 'POST', 기본값 'GET'<br>POST요청은 URL매개변수의 길이가 2,048글자를 넘을때만 사용, IE에서 URL길이 2,048자이상은 잘라버리기때문.
 * @param	{String}	charset	기본값 'UTF-8'(method가 POST 일때만 적용)
 */
ixBand.net.HttpRequest = $B.Class.extend({
    initialize: function ( path, data, method, charset ) {
        this._path = path;
        this._data = data;
        this.xhr = null;
        this._method = method || 'GET';
        this._charset = charset || 'UTF-8';

        this._setEvents();
    },
    // ===============	Public Methods =============== //

    /** HttpRequest 정지, 이벤트삭제 */
    abort: function () {
        this._removeEvents();
        this.xhr.abort();
        return this;
    },
    /**
     * HttpRequest connect<br>
     * 다시 호출할려면 abort시킨후 호출해야한다.
     * @param	{String}	params	예)count=100&time=100
     * @param	{Boolean}	cache	GET으로 요청할때 캐시가 false면 url에 requestTime을 추가하여 캐시를 방지한다.
     */
    load: function ( params, cache ) {
        var sp = ( this._path.indexOf('?') < 0 )? '?' : '&',
            url = ( cache )? this._path : this._path + sp + 'requestTime=' + new Date().getTime();

        //URI encode
        if ( params ) {
            var datas = params.split( '&' ),
                paramNum = datas.length,
                dataSet, i;

            params = '';
            for ( i = 0; i < paramNum; ++i ) {
                dataSet = datas[i].split( '=' );
                params += dataSet[0] + '=' + encodeURIComponent( dataSet[1] );
                if ( i < paramNum - 1 ) params += '&';
            }
        }

        this.xhr.onreadystatechange = this._handler;

        //GET
        if ( /get/i.test(this._method) ) {
            if ( params && params != '' ) url += '&' + params;
            this.xhr.open( 'GET', url, true );
            this.xhr.send( null );
            //POST
        } else {
            this.xhr.open( 'POST', url, true );
            this.xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded; charset=' + this._charset );
            this.xhr.send( params );
        }
        return this;
    },

    /**
     * 서버에 Stream으로 파일전송<br>
     * 다시 호출할려면 abort시킨후 호출해야한다.
     * method설정과 괸계없이 무조건 POST전송
     * @param	{String}	data	base64 image data
     */
    upload: function ( data ) {
        this.xhr.onreadystatechange = this._handler;
        this.xhr.open( 'POST', this._path, true );
        this.xhr.setRequestHeader( 'Content-type', 'application/octet-stream' );
        //this.xhr.setRequestHeader( 'Content-Type', 'application/upload' );
        this.xhr.send( data );

        return this;
    },

    // ===============	Private Methods =============== //

    _setEvents: function () {
        this._handler = $B.bind(function (e) {
            //DONE
            if ( this.xhr.readyState !== 4 ) return false;
            var evt = {target: this, xml: this.xhr.responseXML, text: this.xhr.responseText, status: this.xhr.status, statusText: this.xhr.statusText, data: this._data};

            if ( this.xhr.status == 200 ) {
                this.dispatch( 'complete', evt );
            } else {
                this.dispatch( 'error', evt );
            }

            this._removeEvents();
        }, this);

        //"Microsoft.XMLHTTP", "MSXML2.XMLHTTP.3.0"는 readyState 3를 지원하지 않는다.
        var i, activeXids = ['MSXML2.XMLHTTP.6.0', 'MSXML3.XMLHTTP', 'Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.3.0'],
            activeXidNum = activeXids.length;

        if ( window.XMLHttpRequest ) {
            this.xhr = new XMLHttpRequest();
        } else {
            for ( i = 0; i < activeXidNum; ++i ) {
                try {
                    this.xhr = new ActiveXObject( activeXids[i] );
                    break;
                } catch (e) {}
            }
        }
    },

    _removeEvents: function () {
        if ( this.xhr ) this.xhr.onreadystatechange = null;
    }
}, '$B.net.HttpRequest');