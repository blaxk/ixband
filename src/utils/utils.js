// ############################################################################ //
// ############################################################################ //
// 									utils										//
// ############################################################################ //
// ############################################################################ //
/**
 * @type	{utils}
 */
ixBand.utils = {
    /**
     * 쿠키를 반환하거나 설정한다.
     * @param {String}	name			쿠키명
     * @param {String, Boolean, Number}	value			쿠키값 설정, encodeURIComponent로 인코딩되어 저장된다.
     * @param {Number}	expireMinutes	만료시간 설정, 30초 입력시 0.5, 값을 넣지 않으면 Session Cookie가 된다.
     * @param {String}	path			경로설정, 하위폴더에서도 해당 쿠키를 사용하기 위해서 설정, "/"로 시작해야 한다. ex: "/sub/", 기본값 "/"
     * @param {String}	domain			서브도메인을 설정
     * @param {Boolean} secure          SSL을 이용하여 서버에 쿠키를 전송
     * @param {String} 	sameSite        SameSite 설정 ("strict", "lax", "")
     * @return	{String}	cookieValue, decodeURIComponent로 디코딩되어 반환, 찾지 못하면 undefined
     */
	cookie: function (name, value, expireMinutes, path, domain, secure, sameSite ) {
        //setter
        if ( typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ) {
            var min = ( expireMinutes || expireMinutes == 0 )? Number( expireMinutes ) : '',
                today = new Date(),
                result = name + '=' + encodeURIComponent( value ) + '; path=' + ( path || '/' ) + ';';

            if ( typeof min === 'number' ) {
                today.setSeconds( today.getSeconds() + (min * 60) );
                result += ' expires=' + today.toUTCString() + ';';
            }

			if ( typeof domain === 'string' && domain.length > 0 ) result += ' domain=' + domain + ';';
			if ( typeof sameSite === 'string' ) result += ' samesite=' + sameSite.toLowerCase() + ';';
            if ( secure === true )  result += ' secure';

            document.cookie = result;

            //getter
		} else {
			var reg = new RegExp( '(^| )' + name.replace('.', '\\.') + '=([^;]*)' ),
                result = undefined;

            document.cookie.replace( reg, function ( fs, s, v ) {
				result = decodeURIComponent(v);
				return fs
            });
            return result;
        }
    },

    /**
     * target과 자식들의 Custom Attribute 검색후 삭제
     * @param	{Array}		els			대상 Element 배열
     * @param	{Array}		attrs		Attribute Name 배열
     * @param	{Boolean}	childAttr	자식들도 검색할건지 설정, 기본 false
     */
    removeCustomAttribute: function ( els, attrs, childAttr ) {
        var i, j, elNum = els.length, children, attrNum = attrs.length;

        for ( i = 0; i < elNum; ++i ) {
            var el = els[i];

            for ( j = 0; j < attrNum; ++j ) {
                var prop =  attrs[j];

                if ( $B( el ).attr( prop ) ) {
                    $B( el ).removeAttr( prop );
                }
            }

            if ( childAttr ) {
                children = el.children;
                if ( children.length > 0 ) {
                    $B.utils.removeCustomAttribute( children, attrs, true );
                }
            }
        }
    },

    /**
     * IE7~8 PNG Opacity 버그 핵, img와 background-img에 적용가능, IE9부터는 동작하지 않게 분기되어 있다.
     * background가 적용되어있으면 아래의 버그핵을 적용하지 않아도 된다.
     * <버그핵이 정상적으로 반영되기 위한조건>
     * 1. 투명 PNG이미지는 반드시 Node에 싸서 Node에 Opacity를 줘야 한다.
     * 2. ie8에서 이미지에 position을 주면 안된다.
     * 3. ie8에서 filter상속 부분때문에.. 자식들에게 filter: inherit를 써준다.
     * 4. ie7에서 자식들에게 필터 상속을 하려면 부모의 positon을 꼭 써줘야 한다.
     * @param	{Selector || Array || Element}	target		대상들
     * @param	{Boolean}	overlay		기본값 true, false설정시 그림자가 진해지는 현상은 제거할수 있으나 이미지에 따라 제대로 핵이 안될수도 있다.
     */
    hackPNGOpacity: function ( target, overlay ) {
        if ( !$B.ua.DOC_MODE_IE9_LT ) return;
        overlay = ( overlay == false )? false : true;
        var imgs, i, imgNum;

        if ( typeof target === 'string' ) {
            imgs = $B( document ).selectorAll( target );
        } else if ( $B.array.is(target) ) {
            imgs = target;
        } else {
            imgs = [target];
        }

        imgNum = imgs.length;

        for ( i = 0; i < imgNum; ++i ) {
            var img = imgs[i], imgSrc = '', bg_style;

            if ( img.nodeName ) {
                if ( img.nodeName == 'IMG' ) {
                    if ( img.src ) imgSrc = img.src;
                } else {
                    bg_style = $B.style.current( img, 'background-image' );
                    if ( bg_style.indexOf('url') > -1 ) imgSrc = bg_style.split('"')[1];
                }

                if ( /.png|.PNG/.test(imgSrc) ) {
                    if ( overlay ) imgSrc = '';
                    img.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",sizingMethod="scale",src="' + imgSrc + '")';
                }
            }
        }
    },

    /**
     * url의 parameter 의 값을 반환하거나, object를 조합하여 url parameter string으로 반환
     * @param {String, Object}    value
     * @return  {*}
     */
    urlParam: function ( value ) {
        if ( $B.isObject(value) ) {
            var str = location.search;

            str = ( /^\?[^\?\=]+\=/.test(str) )? str + '&' : '?' + str;

            for ( var key in value ) {
                str += key + '=' + value[key] + '&';
            }

            return str.replace( /\&$/, '' );
        } else {
            var result = {};
            location.search.replace( /(\w*)\=([^&]*)/g, $B.bind(function ( str, prop, val ) {
                if ( prop ) result[prop] = $B.string.convertDataType( val );
            }, this));

            if ( typeof value === 'string' ) {
                if ( result[value] ) {
                    result = result[value];
                } else {
                    result = '';
                }
            }

            return result;
        }
    }
};