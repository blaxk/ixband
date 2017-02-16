// ############################################################################ //
// ############################################################################ //
// 									selector									//
// ############################################################################ //
// ############################################################################ //

/**
 * 내장함수 querySelectorAll 과 querySelector 일부 기능들을 구현
 * nodeName, .className, .className.className, #id, nodeName.className, nodeName.className.className, nodeName#id
 * [attr] 해당속성이 있을때, [attr=value] 값이 같을때, [attr^=value] 시작값이 같을때, [attr$=value] 끝값이 같을때, [attr*=value] 일부문자가 같을때, [attr~=value] 완전체단어일치, 띄워쓰기 가능
 * :first 같은 Filter형식 지원하지 않는다.
 */
ixBand.selector = {
    //단일검색, parent는 반드시 입력해야 한다. 없으면 document라도 입력.
    one: function ( parent, selector ) {
        var selectList = this.selectorList( selector ),
            selNum = selectList.length,
            finishObj = this.parse( selectList[0].selector ),
            matchEl;

        //조건이 ID만 있을때
        if ( selNum == 1 && finishObj.length == 1 && finishObj.id ) {
            return document.getElementById( finishObj.id.replace('#', '') );
            //조건 검색
        } else {
            //모든태그 검색
            var allTag = parent.getElementsByTagName( finishObj.node || '*' ),
                i, tagNum = allTag.length;

            for ( i = 0; i < tagNum; ++i ) {
                var tag = allTag[i];
                //첫번째 조건 검사
                if ( this.match( tag, finishObj ) ) {
                    if ( selNum > 1 ) {
                        if ( this.depthMatch( parent, tag, selectList, 0 ) ) {
                            matchEl = tag;
                            break;
                        }
                    } else {
                        matchEl = tag;
                        break;
                    }
                }
            }
        }
        return matchEl;
    },

    //조건에 부합하는 모든 개체 반환. parent는 반드시 입력해야 한다. 없으면 document라도 입력.
    all: function ( parent, selector ) {
        var selectList = this.selectorList( selector ),
            selNum = selectList.length,
            finishObj = this.parse( selectList[0].selector ),
            allTag = parent.getElementsByTagName( finishObj.node || '*' ),
            i, tagNum = allTag.length, matchEls = [];

        for ( i = 0; i < tagNum; ++i ) {
            var tag = allTag[i];

            //첫번째 조건 검사
            if ( this.match(tag, finishObj) ) {
                if ( selNum > 1 ) {
                    if ( this.depthMatch(parent, tag, selectList, 0) ) matchEls.push( tag );
                } else {
                    matchEls.push( tag );
                }
            }
        }
        return matchEls;
    },

    /**
     * 해당 Selector조건과 일치하는 대상객체의 가장 가까운 조상 개체 반환.
     * @param	{Element}	el			대상개체
     * @param	{String}	selector	"> or Space" 직계, 방계 검색은 지원하지 않는다.
     * @param	{Element}	rootEl		검색할 최상위 개체
     * @return	{Element}	검색하는 대상이 없으면 undefined 반환.
     */
    closest: function ( el, selector, rootEl ) {
        var root = rootEl || document,
            parent = el.parentNode;

        if ( parent && parent != root ) {
            var match = this.match( parent, selector );
            return match? parent : this.closest( parent, selector );
        } else {
            return;
        }
    },

    /**
     * 해당 Selector조건과 일치하는 대상객체의 부모 개체 반환.
     * @param	{Element}	el			대상개체
     * @param	{String}	selector	"> or Space" 직계, 방계 검색은 지원하지 않는다.
     * @param	{Element}	rootEl		검색할 최상위 개체
     * @return	{Element}	검색하는 대상이 없으면 undefined 반환.
     */
    parent: function ( el, selector, rootEl ) {
        var root = rootEl || document,
            parent = el.parentNode;

        if ( selector ) {
            if ( parent && parent != root ) {
                return this.match( parent, selector )? parent : undefined;
            } else {
                return undefined;
            }
        } else {
            return parent;
        }
    },

    /**
     * 대상객체가 해당 selector조건과 일치하면 true반환.
     * @param	{Element}			el			대상개체
     * @param	{String || Object}	selector
     * @return	{Boolean}
     */
    match: function ( el, selector ) {
        //el = $B( el ).element();
        //이미 파싱된 Object면 다시 파싱하지 않는다.
        var matchList = (typeof selector === 'string')? this.parse( selector ) : selector,
            result = false, n;

        for ( n in matchList ) {
            switch ( n ) {
                case 'node':
                    var node = el.nodeName;

                    if ( node ) {
                        node = node.toLowerCase();
                        result = ( node == matchList[n] );
                    } else {
                        result = false;
                    }
                    break;
                case 'id':
                    result = ( $B(el).attr('id') == matchList[n] );
                    break;
                case 'className':
                    result = $B( el ).hasClass( matchList[n] );
                    break;
                case 'attr':
                    result = this.matchAttr( el, matchList[n] );
                    break;
            }
            //하나라도 false가 나오면 더이상 체크하지 않는다.
            if ( !result ) return result;
        }

        return result;
    },

    // ====================	Private Methods	==================== //
    //대상조건에 부합되는 개체가 있는지 직계, 방계 검색 하여 일치하는 값이 있으면 true반환.
    depthMatch: function ( root, el, selectList, idx ) {
        var currentSel = selectList[idx],//맨아래 조건
            nextIdx = idx + 1,
            nextSel = selectList[nextIdx],
            matchEl;

        if ( currentSel.type == 'parent' ) {
            matchEl = this.parent( el, nextSel.selector, root );
            //closest
        } else {
            matchEl = this.closest( el, nextSel.selector, root );
        }

        //검색결과가 있으면, 다음 조건 검색
        if ( matchEl ) {
            return (nextSel.type == 'first')? true : this.depthMatch( root, matchEl, selectList, nextIdx );
        } else {
            return false;
        }
    },

    //대상들중 조건에 일치하는 개체리스트 배열로 반환.
    matchList: function ( els, selector ) {
        var i, elNum = els.length, result = [];

        for ( i = 0; i < elNum; ++i ) {
            var el = els[i];
            if ( this.match(el, selector) ) result.push( el );
        }
        return result;
    },

    //Full Selector를 직계 방계 형태로 분리, [{type:'parent', value:''}, {type:'closest', value:''}]
    //순서를 뒤집어서 반환.
    selectorList: function ( selector ) {
        var result = [];

        selector = $B.string.trim( selector );
        //공백제거
        selector.replace( /(\[[^\[\]]+\])/g, function ( str ) {
            return str.replace( /\s/g, '' );
            //분리
        }).replace( /([\s\>]+)?([^\s\>]+)/g, function ( str, bullet, value ) {
            var type;

            if ( !bullet ) {
                type = 'first';
            } else if ( bullet.indexOf('>') > -1 ) {
                type = 'parent';
            } else {
                type = 'closest';
            }
            result.push( {type: type, selector: value} );
        });
        return result.reverse();
    },

    //selector에서 attr을 분류, {length:조건의 갯수, node, id, className:Array, attr:Array}, 예) img[src*=gif].list[alt*=img]
    parse: function ( selector ) {
        var result = {}, index = 0;

        selector.replace( /([a-z]+)?(\#\w+)?(\.\w+)?(\[[^\[\]]+\])?/ig, function ( str, node, id, className, attr ) {
            if ( node ) result.node = node.toLowerCase(), index++;
            if ( id ) result.id = id.replace(/^\#/, ''), index++;

            //class 복수조건 가능
            if ( className ) {
                var reClass = className.replace(/^\./, '');
                if ( result.className ) {
                    result.className.push( reClass );
                } else {
                    result.className = [reClass];
                }
                index++;
            }
            //attr 복수조건 가능
            if ( attr ) {
                var reAttr = attr.replace(/[\s\"\'\[\]]/g, '');
                if ( result.attr ) {
                    result.attr.push( reAttr );
                } else {
                    result.attr = [reAttr];
                }
                index++;
            }
        });

        result.length = index;
        return result;
    },

    //attr들과 일치하면 true반환.
    matchAttr: function ( el, attrs ) {
        var i, attrNum = attrs.length, result = false;

        for ( i = 0; i < attrNum; ++i ) {
            //parseAttr
            //attrs[i].replace( /(^\w+)([\=\$\*\~\^]{1,2})?([\w\W]+)?|(^\w+)([^\=\$\*\~\^]+)/, function ( str, name, operator, value ) {
            attrs[i].replace( /(^\w+)([=$*~\^]{1,2})?([\w\W]+)?|(^\w+)([^=$*~\^]+)/, function ( str, name, operator, value ) {
                if ( name ) {
                    var elValue = $B( el ).attr( name ),
                        reValue;

                    if ( operator ) {
                        if ( !elValue ) return;

                        //연산자
                        switch ( operator ) {
                            case '=':
                                result = ( elValue == value );
                                break;
                            case '*=':
                                result = ( elValue.indexOf(value) > -1 );
                                break;
                            case '~=':
                                result = $B.string.isWholeWord( elValue, value );
                                break;
                            case '^=':
                                reValue = value.replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                                result = new RegExp( '^' + reValue ).test( elValue );
                                break;
                            case '$=':
                                reValue = value.replace( /[(){}[\]*+?.\\^$|,\-]/g, '\\$&' );
                                result = new RegExp( reValue + '$' ).test( elValue );
                                break;
                        }
                        //attr이 있는지 비교만 할때
                    } else {
                        result = ( !elValue )? false : true;
                    }
                } else {
                    return false;
                }
            });

            //하나라도 false가 나오면 더이상 체크하지 않는다.
            if ( !result ) return result;
        }

        return result;
    }
};