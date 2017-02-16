// ############################################################################ //
// ############################################################################ //
// 									style										//
// ############################################################################ //
// ############################################################################ //

ixBand.style = {
    /**
     * 인라인스타일을 설정하거나 반환.
     * @param	{Element}	el			대상 Element
     * @param	{String}	propStr		"width:100px; z-index:2" 표기법, 설정하지 않으면 cssText반환,
     */
    inline: function ( el, propStr ) {
        var css = (el && el.style)? el.style.cssText : '';

        //setter
        if ( propStr ) {
            propStr = $B.string.trim( propStr );

            if ( css && css.charAt( css.length-1 ) != ';' ) css += ';';//Opera에서는 css 속성끝에 ";"처리를 하지 않으면 에러가 난다.
            el.style.cssText = css + ' ' + propStr;
            //getter
        } else {
            return css;
        }
    },

    /**
     * 지정된 ComputedStyle을 보정없이 반환, 읽기전용
     * Style이 100%와 같은 형식으로 지정이 되어있다면, IE와 FF브라우져에서 다른값을 반환할수있다(IE=100%, FF=현재사이즈px).
     * 사파리, 크롬, z-index를 구할려면, position이 설정되어 있어야 한다. 아니면 'auto'라고 반환.
     * @param	{Element}	el			대상 Element
     * @param	{String}	property	기본값 all, z-index표기법 사용
     * @return	{Style, StyleValue}
     */
    current: function ( el, property ) {
        if ( window.getComputedStyle ) {
            this.current = function ( el, property ) {
                var current = window.getComputedStyle( el, null );
                if ( !current ) return;

                return ( property )? current.getPropertyValue( property ) : current;
            };

            //IE6~8
        } else if ( document.documentElement.currentStyle ) {
            this.current = function ( el, property ) {
                var current = el.currentStyle;
                if ( !current ) return;

                return ( property )? current[$B.string.camelCase(property)] : current;
            };
        }

        return this.current( el, property );
    },

    /**
     * 지정된 ComputedStyle을 보정(pixel)하여 반환 (IE6~8 전용), 읽기전용
     * 사파리, 크롬, z-index를 구할려면, position이 설정되어 있어야 한다. 아니면 'auto'라고 반환.
     * @param	{Element}	el			대상 Element
     * @param	{String}	property	기본값 all, z-index표기법 사용
     * @return	{Style, StyleValue}
     */
    computed: function ( el, property ) {
        var left, rs, rsLeft,
            result = $B.style.current( el, property ),
            style = el.style,
            name = $B.string.camelCase( property );

        if ( result == null && style && style[name] ) result = style[name];

        var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            rposition = /^(top|right|bottom|left)$/,
            rnumnonpx = new RegExp( '^(' + core_pnum + ')(?!px)[a-z%]+$', 'i' );

        if ( rnumnonpx.test( result ) && !rposition.test( name ) ) {
            left = style.left;
            rs = el.runtimeStyle;
            rsLeft = rs && rs.left;

            if ( rsLeft ) rs.left = el.currentStyle.left;

            style.left = (name === 'fontSize')? '1em' : result;
            result = style.pixelLeft + 'px';

            style.left = left;
            if ( rsLeft ) rs.left = rsLeft;
        }

        if ( result == 'auto' && name == 'width' || name == 'height' ) {
            result = $B( el ).rect()[name] + 'px';
        }

        //color값에서 keyword를 16진수로 변환
        if ( /color/i.test(property) ) {
            var colorKey = $B.color.keyword( result );
            if ( colorKey )  result = colorKey;
        }

        return result;
    },

    /**
     * opacity(투명도)를 설정하거나 반환, IE6~8 크로스브라우징을 위해서 사용, ie6에서는 png핵을 이용한 png에만 적용가능
     * @param	{Element}	el			대상 Element
     * @param	{Number}	percent	0~1
     */
    opacity: function ( el, percent ) {
        if ( $B.ua.DOC_MODE_IE9_LT ) {
            this.opacity = function ( el, percent ) {
                //setter
                if ( percent || percent == 0 ) {
                    percent = Number(percent);
                    //el.style.opacity = percent;

                    var ralpha = /alpha\([^)]*\)/i,
                        style = el.style,
                        cStyle = el.currentStyle,
                        opacity = ( typeof percent === 'number' )? 'alpha(opacity=' + (percent * 100) + ')' : '',
                        filter = cStyle && cStyle.filter || style.filter || '', css = '';

                    //style.zoom = 1;
                    if ( percent >= 1 && $B.string.trim( filter.replace( ralpha, '' ) ) === '' ) {
                        style.removeAttribute( 'filter' );
                        if ( cStyle && !cStyle.filter ) return;
                    }

                    //style.filter = ralpha.test( filter )? filter.replace( ralpha, opacity ) : filter + ' ' + opacity;
                    css = ralpha.test( filter )? filter.replace( ralpha, opacity ) : filter + ' ' + opacity;
                    $B.style.inline( el, 'zoom: 1; filter:' + css );

                    //getter
                } else {
                    var ropacity = /opacity\s*=\s*([^)]*)/;
                    return ropacity.test( (el.currentStyle ? el.currentStyle.filter : el.style.filter) || '' ) ?
                    0.01 * parseFloat( RegExp.$1 ) : 1;
                }
            };
        } else {
            this.opacity = function ( el, percent ) {
                //setter
                if ( percent || percent == 0 ) {
                    el.style.opacity = percent;
                    //getter
                } else {
                    return $B.style.current( el, 'opacity' );
                }
            };
        }

        return this.opacity( el, percent );
    },

    /**
     * Style Properties를 {propName: {name, value, unit}} 형식으로 파싱해서 반환
     * @param	{String}		target		대상 스타일 문자열, 예)"width: 100px; height: 200px;"
     * @return	{Object}
     */
    parse: function ( target ) {
        var props = {};
        //String(target).replace(/([a-zA-Z\-]+)\s*?:\s*?([#\w\.\-\,\s\/\?\&\:\=\(\)\%]+);?/g, function ( str, n, v ) {
        String(target).replace(/([a-zA-Z\-]+)\s*?:\s*?([#\w\-.,\s\/?&:=\(\)%]+);?/g, function ( str, n, v ) {
            var obj = $B.style.parseValue( v );
            props[ $B.string.camelCase(n) ] = {name: n, value: obj.value, unit: obj.unit};
        });
        return props;
    },

    /**
     * Style Property Value를 Object(value, unit)으로 파싱해서 반환
     * @param	{String}		target		대상 스타일값 문자열, 예)"100px"
     * @return	{Object}
     */
    parseValue: function ( target ) {
        var result = {},
            val = String( target );

        if ( val && val.indexOf('(') > -1 ) {
            result = {value: $B.string.trim(val), unit: ''};
        } else {
            val.replace(/\s*?([-\d\.]+|#[\da-fA-F]+)([a-zA-Z\%]+)?/, function (str, v, u) {
                result = {value: $B.string.trim(v), unit: u || ''};
            });
        }
        return result;
    }
};