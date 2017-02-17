// ############################################################################ //
// ############################################################################ //
// 									string										//
// ############################################################################ //
// ############################################################################ //

ixBand.string = {
    /**
     * 대상이 문자열이면 true반환
     * @param	{String}	target		대상 문자열
     * @param	{String}	errorMsg	콘솔에 표시할 에러 메세지
     * @return	{Boolean}
     */
    is: function ( target, errorMsg ) {
        var result = (typeof target === 'string');

        if ( errorMsg && !result ) {
            warning( errorMsg );
            return false;
        } else {
            return result;
        }
    },

    /**
     * 문자열의 원하는 Index에 문자열을 추가하여 반환. 반복적용 가능.
     * 반복적용시 마지막 index에 문자추가되지 않음.
     * @param	{String}	target		대상 문자열
     * @param	{int}		addIndex	삽입할 Index.
     * @param	{String}	addText		추가할 문자열.
     * @param	{String}	direction	진행될 방향(left, right). 기본값 right
     * @param	{Boolean}	repeat		반복적용 설정. 기본값 false
     * @return	{String}
     */
    insert: function ( target, addIndex, addText, direction, repeat ) {
        direction = direction || 'right';
        repeat = (repeat)? 'g' : '';
        var value = String(target),
            reg = new RegExp( '.{' + addIndex + '}', repeat );

        this.is( value, 'string.insert() ' + MSG_NOT_STRING );

        if (direction == 'right') {
            value = value.replace(reg, function (str) {
                return str + addText;
            });
            var lastIdx = value.length - 1;
            return repeat && addText == value.charAt(lastIdx) ? value.substr(0, lastIdx) : value;
        } else {
            value = this.strrev( value );
            value = value.replace( reg, function ( str ) {
                return str + addText;
            });
            value = this.strrev( value );
            return repeat && addText == value.charAt(0) ? value.substring(1) : value;
        }
    },

    /**
     * 숫자 "0"을 삽입하여 자리수를 맞춰 문자열을 반환.
     * 예)trace( .format(5, 3) );//005
     * @param	{String}	target		대상 문자열
     * @param	{int}		cipher		자리수 설정.
     * @param	{String}	fillStr		채워질 문자열, 기본 '0'
     * @return	{String}
     */
    format: function ( target, cipher, fillStr ) {
        fillStr = fillStr || '0';
        var str = String(target),
            result = '', addNum = cipher - str.length, i;

        this.is( str, 'string.format() ' + MSG_NOT_STRING );

        for ( i = 0; i < addNum; ++i ) {
            result += fillStr;
        }
        return result += str;
    },

    /**
     * 카멜표기법을 하이픈표기법으로 변환하여 반환.
     * @param	{String}	target		대상 문자열
     * @return	{String}	fontSize -> font-size
     */
    hyphenCase: function ( target ) {
        target = String(target);
        this.is( target, 'string.hyphenCase() ' + MSG_NOT_STRING );
        return target.replace( /[A-Z]/g, function ( val ) {
            return '-' + val.toLowerCase();
        });
    },

    /**
     * 하이픈표기법을 카멜표기법으로 변환하여 반환.
     * @param	{String}	target		대상 문자열
     * @return	{String}	font-size -> fontSize
     */
    camelCase: function ( target ) {
        target = String(target);
        this.is( target, 'string.camelCase() ' + MSG_NOT_STRING );
        return target.replace(/-\b([a-z])/g, function (str) {
            return str.charAt(1).toUpperCase();
        });
    },

    /**
     * 단어의 첫글짜를 대문자로 변환
     * @param	{String}	target		대상 문자열
     * @return	{String}
     */
    capitalize: function ( target ) {
        target = String(target);
        this.is( target, 'string.capitalize() ' + MSG_NOT_STRING );
        return target.replace(/\b([a-z])/g, function (str) {
            return str.toUpperCase();
        });
    },

    /**
     * 해당문자열에 해당 언어가 포함되어있는지 체크<br>
     * 예).isLanguage("string", "en", "number")
     * @param	{String}		target		대상 문자열
     * @param	{String...}		languages	영문(en),한글(ko),숫자(number),특수문자(해당문자입력)
     * @return	{Boolean}
     */
    isLanguage: function () {
        var target = arguments[0],
            regStr = '', langNum = arguments.length, i;

        target = String(target);
        this.is( target, 'string.isLanguage() ' + MSG_NOT_STRING );

        for (i = 1; i < langNum; ++i) {
            switch( arguments[i] ) {
                case 'en':
                    regStr += 'A-Za-z';
                    break;
                case 'ko':
                    regStr += 'ㄱ-ㅣ가-힣';
                    break;
                case 'number':
                    regStr += '0-9';
                    break;
                default:
                    regStr += arguments[i].replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                    break;
            }
        }
        return new RegExp( '[' + regStr + ']' ).test( target );
    },

    /**
     * 해당 문자열에 일치하는 완전체 단어가 있는지 검사
     * 예)	.isWholeWord( "Hello World", "Hello" ); // true
     *		.isWholeWord( "Hello World", "He" ); // false
     * @param	{String}		target		대상 문자열
     * @param	{String, Array}	findStr		비교할 String or String Array, 문자열의 앞뒤로 공백이 들어가면 다른 문자열로 인식하여 false반환.
     * @param	{String}		flags		대소문자 구별하지 않으려면 "i", 멀티라인 검색은 "m"
     * @return	{Boolean}
     */
    isWholeWord: function ( target, findStr, flags ) {
        target = String(target);
        this.is( target, 'string.isWholeWord() ' + MSG_NOT_STRING );

        var num, i, strs, result = false;

        if ( $B.array.is(findStr) ) {
            strs = findStr;
            num = strs.length;
        } else {
            num = 1;
            strs = [findStr];
        }

        for ( i = 0; i < num; ++i ) {
            var str = strs[i].replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
            result = new RegExp( '(?:\\s|^)' + str + '(?:\\s|$)', flags || '' ).test( target );
            if ( !result ) return false;
        }

        return result;
    },

    /**
     * 문자열(수치)을 3자리 숫자 단위표기법으로 반환.
     * @param	{String, Number}		target		대상 문자열
     * @return	{String}
     */
    numberFormat: function ( target ) {
        var str = String(target),
            minus = '',
            temps = [], result = '';

        this.is( str, 'string.numberFormat() ' + MSG_NOT_STRING );

        if (str.charAt(0) == '-') {
            minus = '-';
            str = str.substring(1);
        }

        temps = str.split('.');
        result = minus + $B.string.insert( temps[0], 3, ',', 'left', true );

        return ( temps[1] )? result += '.' + temps[1] : result;
    },

    /**
     * 대상 문자열에서 html태그를 모두 삭제
     * @param	{String}		target		대상 문자열
     * @return	{String}
     */
    removeTags: function ( target ) {
        target = String(target);
        this.is( target, 'string.removeTags() ' + MSG_NOT_STRING );
        return target.replace(/<[^>]+>/g, '');
    },

    /**
     * 문자열을 뒤집어 반환.('abc' to 'cba')
     * @param	{String}	target		대상 문자열
     * @return	{String}
     */
    strrev: function ( target ) {
        target = String(target);
        this.is( target, 'string.strrev() ' + MSG_NOT_STRING );
        return target.split('').reverse().join('');
    },

    /**
     * 문자열의 앞뒤 white space삭제(탭, 띄어쓰기, \n, \r)
     * @param	{String}	target		대상 문자열
     * @return	{String}
     */
    trim: function ( target ) {
        target = String(target);
        this.is( target, 'string.trim() ' + MSG_NOT_STRING );
        return ( target )? target.replace(/^\s+/, '').replace(/\s+$/, '') : '';
    },

    /**
     * 16자의 고유 문자열 반환. (해당 화면에서 절대 유일값, alphabet + int 조합)
     * @return	{String}
     */
    unique: function () {
        var random = Math.random(),
            randomStr = random.toString( 32 ).substr( 2 ),
            alphabet = Math.round( Math.random() * 21 + 10 ).toString( 32 );//a~v

        if ( randomStr.length < 2 ) randomStr = 'i' + alphabet + 'x' + alphabet + 'b' + alphabet + 'a' + alphabet + 'n' + alphabet + 'd';
        var result = alphabet + __keyCount.toString( 32 ) + randomStr + randomStr + randomStr + randomStr;
        __keyCount++;
        return result.substr( 0, 15 ) + alphabet;
    }
};