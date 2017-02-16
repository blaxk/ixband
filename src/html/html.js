// ############################################################################ //
// ############################################################################ //
// 									html										//
// ############################################################################ //
// ############################################################################ //

ixBand.html = {
    HTML_CHARACTERS: {
        '&amp;': '&',
        '&gt;': '>',
        '&lt;': '<',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' '
    },

    /**
     * "<" 태그를 "&lt;" 처럼 변형된 태그 문자열로 반환 (기존 변환된 문자열 유지)
     * @param	{String}	str
     * @return  {String}
     */
    encode: function ( str ) {
        if ( !str ) return '';

        var regAry = $B.object.toArray( this.HTML_CHARACTERS ),
            reg = new RegExp( '(' + regAry.join('|') + ')', 'g' ),
            characters = this._htmlChars ? this._htmlChars : this._htmlChars = $B.object.replaceKeyValue( this.HTML_CHARACTERS );

        return str.replace( reg, function ( match, capture ) {
            return characters[capture] || capture;
        });
    },

    /**
     * "&lt;" 처럼 변형된 태그 문자열을 "<" 태그로 반환 (기존 태그는 유지)
     * @param	{String}	str
     * @return  {String}
     */
    decode: function ( str ) {
        if ( !str ) return '';

        var _this = this,
            regAry = $B.object.toArray( _this.HTML_CHARACTERS, 'key' ),
            reg = new RegExp( '(' + regAry.join('|') + '|&#[0-9]{1,5};' + ')', 'g' );

        return str.replace( reg, function ( match, capture ) {
            return ( capture in _this.HTML_CHARACTERS ) ? _this.HTML_CHARACTERS[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        });
    }
};