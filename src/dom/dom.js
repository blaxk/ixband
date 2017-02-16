// ===============	Public Methods =============== //

var _dom = {
    ixband: true,
    target: null,
    length: 0,
    // ========================== < Object > ========================== //

    /**
     * 타겟타입:(Selector, Element)<br>
     * 내장함수 querySelector 일부 기능들을 구현, 단일객체 선택
     * 지원형식: .className, .className.className, #id, node.className, node.className.className, node#id, ">" 직계 하위객체,  Space 방계 하위객체 모두, 다중 객체선택 구분자 ","
     * (","를 사용하여 다중 selector를 입력하면 나중에 작성된 selector를 기준으로 단일 element를 검출한다.)<br>
     * <b>주의:</b><br>
     * <li>최신 querySelector를 지원하는 브라우저에서는 내장 함수를 활용해서 구현되었고, IE6~7에서는 별도로 작성한 로직으로 동작한다.</li>
     * <li>IE6~7에서는 id난 className으로 검출할때 nodeName을 넣지않으면 타겟 문서 전체를 검색하기때문에 퍼포먼스가 떨어진다. 되도록이면 타겟과 nodeName을 넣고 검색을 해야한다.</li>
     * <li>*:first-child와 같은 Filter형식의 Selector는 지원하지 않는다.</li>
     * @param	{String}	str
     * @return	{Element}
     */
    selector: function ( str ) {
        if ( document.querySelector ) {
            this.selector = function ( str ) {
                var el = this.target? this.element() : document,
                    strAry = str.split( ',' );
                return el.querySelector( strAry[strAry.length - 1] );
            };
        } else {
            this.selector = function ( str ) {
                var el = this.target? this.element() : document,
                    strAry = str.split( ',' );//여러객체 선택자 분리
                return $B.selector.one( el, strAry[strAry.length - 1] );
            };
        }
        return this.selector( str );
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 내장함수 querySelectorAll 일부 기능들을 구현
     * 지원형식: .className, .className.className, #id, node.className, node.className.className, node#id, ">" 직계 하위객체,  Space 방계 하위객체 모두, 다중 객체선택 구분자 ","<br>
     * <b>주의:</b><br>
     * <li>최신 querySelectorAll를 지원하는 브라우저에서는 내장 함수를 활용해서 구현되었고, IE6~7에서는 별도로 작성한 로직으로 동작한다.</li>
     * <li>IE6~7에서는 id난 className으로 검출할때 nodeName을 넣지않으면 타겟 문서 전체를 검색하기때문에 퍼포먼스가 떨어진다. 되도록이면 타겟과 nodeName을 넣고 검색을 해야한다.</li>
     * <li>여기서 ID는 유일값이 아니다, 동일한 ID를 가지는 객체 모두 검출된다.</li>
     * <li>*:first-child와 같은 Filter형식의 Selector는 지원하지 않는다.</li>
     * @param	{String}	str
     * @return	{Array}
     */
    selectorAll: function ( str ) {
        if ( document.querySelectorAll ) {
            this.selectorAll = function ( str ) {
                var el = this.target? this.element() : document,
                    strAry = str.split( ',' ), num = strAry.length, result = [], i, els;

                for ( i = 0; i < num; ++i ) {
                    els = el.querySelectorAll( strAry[i] );
                    result = result.concat( $B(els).toArray() );
                }
                return result;
            };
        } else {
            this.selectorAll = function ( str ) {
                var el = this.target? this.element() : document,
                    strAry = str.split( ',' ), num = strAry.length, result = [], i, els;

                for ( i = 0; i < num; ++i ) {
                    els = $B.selector.all( el, strAry[i] );
                    result = result.concat( els );
                }
                return result;
            };
        }
        return this.selectorAll( str );
    },

    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element, jQuery)
     * 단일 Element 반환, 찾는 대상이 없으면 "ixError" 발생
     * @return	{Element}
     */
    element: function () {
        var target = this.target, el;

        if ( typeof target.get === 'function' ) {
            el = target.get(0);
        } else {
            el = ( typeof target === 'string' )? $B( document ).selector( target ) : target;
        }

        if ( el ) {
            this.target = el;
        } else {
            //warning( '"' + target + '" 와 일치하는 대상이 없습니다.' );
            throw new Error( '[ixBand] "' + target + '" 와 일치하는 대상이 없습니다.' );
        }
        return el;
    },

    /**
     * 타겟타입:(Selector, Element)
     * target의 appendChild(child);
     * @param	{Node}		child
     * @param	{Int}		index	배치할 index 0~ (선택사항) 수치가 자식수보다 크거나 작으면 맨뒤나 맨앞에 알아서 넣어준다.
     */
    addChild: function ( child, index ) {
        var el = this.element();
        if ( typeof index === 'number' ) {
            var children = el.children,
                childNum = children.length;

            if ( childNum > 0 && index < childNum ) {
                el.insertBefore( child, children[index] );
                return;
            }
        }
        el.appendChild( child );
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * target의 해당자식 노드 삭제
     * @param	{Node, Int}		child	node나 index:0~ 수치가 자식수보다 크거나 작으면 에러발생
     */
    removeChild: function ( child ) {
        var el = this.element();

        if ( typeof child === 'number' ) {
            var children = el.children,
                childNum = children.length;

            if ( childNum > 0 && childNum > child  ) {
                child = children[child];
            } else {
                warning('.removeChild()에 지정한 수치가 자식수보다 크거나 작습니다!');
                return;
            }
        }

        el.removeChild( child );
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 노드 복사<br>
     * ie6~8에서 addEvent로 등록된 이벤트를 제거하고 복사하기 위해서 사용한다.
     * @param	{Boolean}	childCopy	자식요소까지 복사할지 설정, 기본 false
     * @return	{Element}
     */
    clone: function ( childCopy ) {
        if ( $B.ua.DOC_MODE_IE9_LT ) {
            this.clone = function ( childCopy ) {
                var clone = this.element().cloneNode( childCopy );
                //이벤트삭제
                $B( clone ).removeAllEvent( childCopy, true );
                return clone;
            };
        } else {
            this.clone = function ( childCopy ) {
                return this.element().cloneNode( childCopy );
            };
        }
        return this.clone( childCopy );
    },

    /**
     * 타겟타입:(HTMLCollection)<br>
     * HTMLCollection을 배열로 바꿔서 반환한다.<br>
     * HTMLCollection을 자주 사용할때 배열로 반환하여 사용하는것이 속도향상에 도움이 된다.<br>
     * @return	{Array}
     */
    toArray: function () {
        //return Array.prototype.slice.call( this.target );
        var coll = this.target,
            num = coll.length,
            i, result = [];

        for ( i = 0; i < num; ++i ) {
            result[i] = coll[i];
        }
        return result;
    },

    /**
     * 타겟타입:(Selector, Element)
     * Element 속성을 설정하거나 반환한다.
     * @param	{String}	attr	IE6,7에서도 공통으로 'class'로 표기해서 사용할 수 있다.
     * @param	{String}	value
     */
    attr: function ( attr, value ) {
        var el = this.element();
        if ( attr == 'class' && $B.ua.DOC_MODE_IE8_LT ) attr = 'className';

        //setter
        if ( value || value == 0 ) {
            value = $B.string.trim( String(value) );
            el.setAttribute( attr, value );
            //getter
        } else {
            return el.getAttribute( attr );
        }
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * Element 속성 삭제<br>
     * @param	{String}	attribute	IE6,7에서도 공통으로 'class'로 표기해서 사용할 수 있다.
     */
    removeAttr: function ( attr ) {
        var el = this.element();
        if ( attr == 'class' && $B.ua.DOC_MODE_IE8_LT ) attr = 'className';
        el.removeAttribute( attr );
    },


    /**
     * 타겟타입:(Selector, Element)<br>
     * target의 자식노드들;
     * @return	{Array}
     */
    children: function ( selector ) {
        var el = this.element(),
            children = el.children;

        if ( typeof selector === 'string' ) {
            var elNum = children.length, result = [], i;

            for ( i = 0; i < elNum; ++i ) {
                var child = children[i],
                    match = $B.selector.match( child, selector );

                if ( match ) result.push( child );
            }
            return result;
        } else {
            //this.element().childNodes;
            return $B( children ).toArray();
        }
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 대상노드의 다음 노드를 반환 (대상노드와 같은 레벨), 빈 TextNode나 CommentNode는 무시.
     * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
     * @return	{Element}
     */
    next: function ( selector ) {
        var node = this.element().nextSibling;
        if ( !node ) return;

        //comment, text
        if ( node.nodeType == 8 || node.nodeType == 3 && !$B.string.trim(node.data) ) {
            return $B( node ).next( selector );
        } else {
            if ( typeof selector === 'string' ) node = $B.selector.match( node, selector )? node : undefined;
            return node;
        }
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 대상노드의 이전 노드를 반환 (대상노드와 같은 레벨), 빈 TextNode나 CommentNode는 무시.
     * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
     * @return	{Element}
     */
    prev: function ( selector ) {
        var node = this.element().previousSibling;
        if ( !node ) return;

        //comment, text
        if ( node.nodeType == 8 || node.nodeType == 3 && !$B.string.trim(node.data) ) {
            return $B( node ).prev( selector );
        } else {
            if ( typeof selector === 'string' ) node = $B.selector.match( node, selector )? node : undefined;
            return node;
        }
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 해당 Selector조건과 일치하는 대상객체의 가장 가까운 조상 개체 반환.
     * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
     * @return	{Element}
     */
    closest: function ( selector ) {
        var el = this.element();
        return $B.selector.closest( el, selector );
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 대상개체의 부모 노드를 반환.
     * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다, 설정하게되면 Selector와 일치해야 개체 반환.
     * @return	{Element}
     */
    parent: function ( selector ) {
        var el = this.element();
        return $B.selector.parent( el, selector );
    },

    /**
     * 타겟타입:(Selector, Element)<br>
     * 대상객체가 해당 selector조건과 일치하면 true반환.
     * @param	{String}	selector	매치시킬 Selector, "> or Space" 직계, 방계 검색은 지원하지 않는다.
     * @return	{Boolean}
     */
    match: function ( selector ) {
        var el = this.element();
        return $B.selector.match( el, selector );
    },

    /**
     * 타겟타입:(Selector, Array, jQuery)<br>
     * 대상객체들의 갯수만큼 callback 반복 호출 후 결과 반환, 반복문보다 느리다.
     * @param	{Function}	callback	function callback(el:Element, index:Int, array:Array):void
     * @return	{Boolean}	return된 값들의 배열
     */
    each: function ( callback ) {
        if ( typeof callback !== 'function' ) return;

        var target = this.target,
            els, elNum, i, result = [];

        if ( typeof target.get === 'function' ) {
            els = target.get();
        } else if ( $B.array.is(target) ) {
            els = target.concat( [] );
        } else if ( typeof target === 'string' ) {
            els = $B.selector.all( document, target );
        } else {
            els = [target];
        }

        elNum = els.length;

        for ( i = 0; i < elNum; ++i ) {
            var el = els[i], data;
            //this.target = el;
            data = callback.call( el, el, i, els );

            if ( data ) result.push( data );
        }

        return result;
    },


    // ========================== < Style > ========================== //

    /**
     * 타겟타입:(Selector, Element), 대상노드의 className 추가<br>
     * 여러개의 className을 추가할 수 있다. 예) addClass( 'a', 'b' );
     * 해당 classNam이 이미 설정되어 있으면 다시 설정하지 않는다.
     * @param	{String...}	className
     */
    addClass: function () {
        var el = this.element(),
            cName = $B( el ).attr( 'class' ),
            args = arguments;

        if ( cName ) {
            var argNum = args.length, selector = '', i;

            for ( i = 0; i < argNum; ++i ) {
                var arg = args[i];
                if ( !$B.string.isWholeWord( cName, arg ) ) selector += ( ' ' + arg );
            }

            $B( el ).attr( 'class', cName + selector );
        } else {
            $B( el ).attr( 'class', Array.prototype.slice.call(args).join(' ') );
        }
    },

    /**
     * 타겟타입:(Selector, Element), 대상노드의 해당 className 삭제<br>
     * 해당 classNam이 없으면 삭제하지 않는다.
     * @param	{String...}	className
     */
    removeClass: function () {
        var el = this.element(),
            cName = $B( el ).attr( 'class' );

        if ( cName ) {
            var args = arguments,
                argNum = args.length, i;

            for ( i = 0; i < argNum; ++i ) {
                cName = cName.replace( args[i], '' );
            }

            $B( el ).attr( 'class', cName );
        }
    },

    /**
     * 타겟타입:(Selector, Element), 대상노드의 해당 className의 존재여부 반환<br>
     * 여러개의 className을 비교할 수 있다. 예) hasClass( 'a', 'b' ); 이럴경우 두개의 className이 모두 일치해야 true를 반환.
     * @param	{String... || Array}	className	여러개의 className을 비교할 수 있다.
     * @return	{Boolean}	해당 className이 존재하면 true반환
     */
    hasClass: function ( className ) {
        var el = this.element(),
            cName = $B( el ).attr( 'class' ),
            find = $B.array.is(className)? className : Array.prototype.slice.call(arguments);

        return cName? $B.string.isWholeWord( cName, find ) : false;
    },

    /**
     * 타겟타입:(Selector, Element)
     * Inline Style설정, ComputedStyle을 반환
     * @param	{String}	propStr		"width:100px; z-index:2" 표기법, 입력하지 않으면 all (property를 입력하여 값을 구하는것이 정확하다)
     * @return	{String}
     */
    css: function ( propStr ) {
        if ( window.getComputedStyle ) {
            this.css = function ( propStr ) {
                var el = this.element();

                //setter
                if ( propStr && propStr.indexOf(':') > -1 ) {
                    $B.style.inline( el, propStr );
                    //getter
                } else {
                    return $B.style.current( el, propStr );
                }
            };

            //IE6~8
        } else if ( document.documentElement.currentStyle ) {
            this.css = function ( propStr ) {
                var el = this.element();

                //setter
                if ( propStr && propStr.indexOf(':') > -1 ) {
                    //opacity
                    if ( propStr.indexOf('opacity') > -1 ) {
                        $B.style.opacity( el, $B.style.parse( propStr ).opacity.value );
                    } else {
                        $B.style.inline( el, propStr );
                    }

                    //getter
                } else {
                    return ( propStr && propStr.indexOf('opacity') > -1 )? $B.style.opacity( el ) : $B.style.computed( el, propStr );
                }
            };
        }

        return this.css( propStr );
    },

    /**
     * 타겟타입:(Style, cssRule.style등등..)
     * Style Property를 설정하거나 반환.
     * @param	{String}	property	'z-index'표기방법
     * @return	{Property Value}
     */
    prop: function ( property, value ) {
        var el = this.element();
        //setter
        if ( value || value == 0 ) {
            el.setProperty( property, String(value), null );
            //getter
        } else {
            return el.getPropertyValue( property );
        }
    },

    /**
     * 타겟타입:(Style, cssRule.style등등..)<br>
     * Style Property 삭제
     * @param	{String}	property	'z-index'표기방법
     */
    removeProp: function ( property ) {
        this.element().removeProperty( property );
    },

    // ========================== < Measure > ========================== //
    /**
     * <b>읽기전용</b><br>
     * 타겟타입:(Element, ID)<br>
     * 대상의 Rectangle 반환, padding과 border포함된 수치<br>
     * @param	{Boolean}	relative	기본값false, false면 document 기준, true면 vieport 기준으로 계산
     * @return	{Object}	left, top, width, height
     */
    rect: function ( relative ) {
        var el = this.element(),
            result = {},
            rect = el.getBoundingClientRect();

        if ( relative ) {
            result.left = rect.left;
            result.top = rect.top;

            var docEl = document.documentElement;
            var vWidth = docEl.clientWidth,
                vHeight = docEl.clientHeight,
                elWidth = ( rect.left < 0 )? rect.right : rect.right - rect.left,
                elHeight = ( rect.top < 0 )? rect.bottom : rect.bottom - rect.top;

            result.width = ( rect.right > vWidth )? elWidth - (rect.right - vWidth) : elWidth;
            result.height = ( rect.bottom > vHeight )? elHeight - (rect.bottom - vHeight) : elHeight;
        } else {
            result.left = rect.left + $B(window).scrollLeft();
            result.top = rect.top + $B(window).scrollTop();
            result.width = rect.right - rect.left;
            result.height = rect.bottom - rect.top;
        }
        return result;
    },
    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element)
     * Border, 스크롤바가 제외되고 Padding이 포함된 가로사이즈 반환, window, document, screen지원
     * @return	{Number}
     */
    width: function () {
        var el = this.element();

        if ( el === document ) {
            return $B.measure.documentWidth();
        } else if ( el === window ) {
            return $B.measure.windowWidth();
        } else if ( el === screen ) {
            return screen.width;// (작업표시줄 포함)
        } else {
            return el.clientWidth;
        }
    },
    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element)
     * Border, 스크롤바가 제외되고 Padding이 포함된 세로사이즈 반환, window, document, screen지원
     * @return	{Number}
     */
    height: function () {
        var el = this.element();

        if ( el === document ) {
            return $B.measure.documentHeight();
        } else if ( el === window ) {
            return $B.measure.windowHeight();
        } else if ( el === screen ) {
            return screen.height;// (작업표시줄 포함)
        } else {
            return el.clientHeight;
        }
    },
    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element)
     * Border, 스크롤바, Padding이 제외된 가로사이즈 반환, screen 지원
     * @return	{Number}
     */
    innerWidth: function () {
        var el = this.element();
        if ( el === document || el === window ) return 0;

        if ( this.element() === screen ) {
            return screen.availWidth;
        } else {
            var pl, pr, value = this.width();

            pl = parseFloat( this.css('padding-left') );
            pr = parseFloat( this.css('padding-right') );
            return value - (( pl > 0 ? pl : 0 ) + ( pr > 0 ? pr : 0 ));
        }
    },
    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element)
     * Border, 스크롤바, Padding이 제외된 세로사이즈 반환, screen 지원
     * @return	{Number}
     */
    innerHeight: function () {
        var el = this.element();
        if ( el === document || el === window ) return 0;

        if ( el === screen ) {
            return screen.availHeight;
        } else {
            var pt, pb, value = this.height();

            pt = parseFloat( this.css('padding-top') );
            pb = parseFloat( this.css('padding-bottom') );
            return value - (( pt > 0 ? pt : 0 ) + ( pb > 0 ? pb : 0 ));
        }
    },
    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element)
     * Padding, Border, 스크롤바가 포함된 가로사이즈 반환
     * @return	{Number}
     */
    outerWidth: function () {
        var el = this.element();
        if ( el === document || el === window || el === screen ) return 0;

        return el.offsetWidth;
    },
    /**
     * <b>읽기전용</b>
     * 타겟타입:(Selector, Element)
     * Padding, Border, 스크롤바 포함된 세로사이즈 반환
     * @return	{Number}
     */
    outerHeight: function () {
        var el = this.element();
        if ( el === document || el === window || el === screen ) return 0;

        return el.offsetHeight;
    },
    /**
     * <b>읽기전용</b><br>
     * 타겟타입:(Selector, Element), iframe<br>
     * iframe에 컨텐츠가 로드된후 컨텐츠 가로사이즈 반환<br>
     * <b>주의사항:</b>같은 도메인에서만 동작한다. 도메인이 다르면 0 반환
     * @return	{int}
     */
    contentWidth: function () {
        try {
            return this.element().contentWindow.document.documentElement.scrollWidth;
        } catch (e) {
            return 0;
        }
    },

    /**
     * <b>읽기전용</b><br>
     * 타겟타입:(Selector, Element), iframe<br>
     * iframe에 컨텐츠가 로드된후 컨텐츠 세로사이즈 반환<br>
     * <b>주의사항:</b>같은 도메인에서만 동작한다. 도메인이 다르면 0 반환
     * @return	{int}
     */
    contentHeight: function () {
        try {
            return this.element().contentWindow.document.documentElement.scrollHeight;
        } catch (e) {
            return 0;
        }
    },

    /**
     * 타겟타입:(Selector, Element)
     * 대상의 스크롤된 X좌표 설정하거나 반환, window 지원
     * @param	{Number}	value
     * @return	{Number}
     */
    scrollLeft: function ( value ) {
        //ie9, 크롬, 사파리, 파폭
        if ( typeof window.pageXOffset === 'number' ) {
            this.scrollLeft = function ( value ) {
                var el = this.element();

                if ( el === window || el === document ) {
                    //setter
                    if ( value === 'number' ) {
                        window.scrollTo( value, window.pageYOffset );
                        //getter
                    } else {
                        return window.pageXOffset;
                    }
                } else {
                    //setter
                    if ( typeof value === 'number' ) {
                        el.scrollLeft = value;
                        //getter
                    } else {
                        return el.scrollLeft;
                    }
                }
            };
        } else {
            this.scrollLeft = function ( value ) {
                var el = this.element();

                if ( el === window || el === document ) el = document.documentElement;
                //setter
                if ( typeof value === 'number' ) {
                    el.scrollLeft = value;
                    //getter
                } else {
                    return el.scrollLeft;
                }
            };
        }
        return this.scrollLeft( value );
    },
    /**
     * 타겟타입:(Selector, Element)
     * 대상의 스크롤된 Y좌표 설정하거나 반환, window 지원
     * @param	{Number}	value
     * @return	{Number}
     */
    scrollTop: function ( value ) {
        //ie9, 크롬, 사파리, 파폭
        if ( typeof window.pageYOffset === 'number' ) {
            this.scrollTop = function ( value ) {
                var el = this.element();

                if ( el === window || el === document ) {
                    //setter
                    if ( typeof value === 'number' ) {
                        window.scrollTo( window.pageXOffset, value );
                        //getter
                    } else {
                        return window.pageYOffset;
                    }
                } else {
                    //setter
                    if ( typeof value === 'number' ) {
                        el.scrollTop = value;
                        //getter
                    } else {
                        return el.scrollTop;
                    }
                }
            };
        } else {
            this.scrollTop = function ( value ) {
                var el = this.element();

                if ( el === window || el === document ) el = document.documentElement;
                //setter
                if ( typeof value === 'number' ) {
                    el.scrollTop = value;
                    //getter
                } else {
                    return el.scrollTop;
                }
            };
        }
        return this.scrollTop( value );
    },

    // ========================== < Utilis > ========================== //

    /**
     * 타겟타입:(Element, Selector)<br>
     * SWF 삽입<br>
     * onReady 이벤트를 발생시키기 위해서는 flash에서 ExternalInterface.call( _onSwfEvent, { type: 'ready', id: _myID, value: 'test_value'} ); 형식으로 호출해줘야 한다.<br>
     * 타겟을 주지않으면 화면에 addChild를 할수없기때문에 ExternalInterface로 연결할수 없고, 때문에 onReady를 받을수 없다.<br>
     * Event Properties : id, target, value
     * @param	{String}	path		SWF경로
     * @param	{String}	width		가로폭
     * @param	{String}	height		세로폭
     * @param	{Object}	params		SWF에 넘길 params
     * @param	{Object}	dispatch	dispatch.onReady이벤트 전달, {type, id, target, value}
     * @param	{Object}	attributes	id, wmode, version 설정, 기본값 {id: '없으면 자동생성', wmode: 'opaque', version: '10,0,0,0', info: 'Adobe Flash Player를 설치해야 이용가능한 콘텐츠 입니다.'}
     * @return	{HTMLObjectElement}	SWF Object 노드
     */
    insertSWF: function ( path, width, height, params, dispatch, attributes ) {
        var el = ( this.target )? this.element() : null,
            wmode = ( attributes && attributes.wmode )? attributes.wmode : 'opaque',
            version = ( attributes && attributes.version )? attributes.version : '10,0,0,0',
            info = ( attributes && attributes.info )? attributes.info : 'Adobe Flash Player ' + version + ' 이상을 설치해야 이용가능한 콘텐츠 입니다.',
            id = ( attributes && attributes.id )? attributes.id : 'SWF_ID_' + __swfCount,
            htmlText = '',
            div = document.createElement( 'div' ),
            obj = null;

        if ( $B.ua.MSIE ) {
            htmlText += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + version + '" width="' + width + '" height="' + height + '"  id="' + id + '">';
            htmlText += '<param name="movie" value="' + path + '" />';
        } else {
            htmlText += '<object type="application/x-shockwave-flash" data="' + path + '" width="' + width + '" height="' + height + '" id="' + id + '" name="' + id + '">';
        }

        var n, valueStr = '';
        if ( params ) {
            for ( n in params ) {
                valueStr += ('&' + n + '=' + encodeURIComponent( params[n] ));
            }
        }

        htmlText += '<param name="wmode" value="' + wmode + '" />';
        htmlText += '<param name="allowScriptAccess" value="always" />';
        htmlText += '<param name="FlashVars" value="id=' + id + '&width=' + encodeURIComponent( width ) + '&height=' + encodeURIComponent( height ) + '&onSwfEvent=ixBand._private.SWFManager.onSwfEvent' + valueStr + '" />';
        htmlText += '<p>' + info + '</p>';

        div.innerHTML = htmlText;
        obj = div.children[0];
        if ( el ) el.appendChild( obj );
        div = null;

        //dispatch 등록
        var data = { onReady: ( dispatch && dispatch.onReady )? dispatch.onReady : null, target: obj };
        $B._private.SWFManager.addSWFData( id, data );

        __swfCount++;

        return obj;
    },

    /**
     * 대상개체의 Text를 설정하거나 반환.
     * @param	{String}	str		설정할 문자열
     * @return	{String}
     */
    text: function ( str ) {
        if ( $B.ua.DOC_MODE_IE9_LT ) {
            this.text = function ( str ) {
                var el = this.element();

                //setter
                if ( str || str == 0) {
                    el.innerText = String(str);
                    //getter
                } else {
                    var getStr = el.innerText;
                    return getStr.replace( /[\n\r]+/g, '' );
                }
            };
        } else {
            this.text = function ( str ) {
                var el = this.element();

                //setter
                if ( str || str == 0) {
                    el.textContent = String(str);
                    //getter
                } else {
                    return el.textContent;
                }
            };
        }
        return this.text( str );
    },

    /**
     * 대상개체의 Html를 설정하거나 반환.
     * @param	{String}	html		설정할 Html문자열
     * @return	{String}	Html문자열
     */
    html: function ( html ) {
        var el = this.element();

        //setter
        if ( html || html == 0) {
            el.innerHTML = String(html);
            //getter
        } else {
            return el.innerHTML;
        }
    },

    // ========================== < Event > ========================== //
    /**
     * 타겟타입:(Element, ID)<br>
     * 이벤트 추가, style, script같은 특정 노드에서는 사용할수 없다.<br>
     * Event Properties : type, target, currentTarget, relatedTarget, eventPhase, clientX, clientY, screenX, screenY, shiftKey, charCode, delta:마우스휠이벤트에서 발생, stopPropagation(), preventDefault()<br>
     * offsetX는 크로스브라우저 지원이 안되기 때문에 구현하지 않았다<br>
     * @param	{String}	type			"on"빼고, "click"
     * @param	{Function}	handler			Event Handler
     * @param	{*}			data			Event Handler 에서 전달받을 데이타
     */
    addEvent: function ( type, handler, data ) {
        var el = this.element();
        $B.event.add( el, type, handler, data );
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 이벤트 삭제
     * @param	{String}	type	"on"빼고, "click"
     * @param	{Function}	handler		Event Handler
     */
    removeEvent: function ( type, handler ) {
        var el = this.element();

        if ( typeof type === 'string' ) {
            if ( typeof handler === 'function' ) {
                $B.event.remove( el, type, handler );
            } else {
                $B.event.removeTypeAll( el, type );
            }
        } else {
            $B.event.removeAll( [el] );
        }
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 대상의 모든 이벤트 삭제, removeEvent()와 다른점은 자식요소의 이벤트도 삭제할 수 있다.
     * @param	{Boolean}	childRemove	자식의 이벤트를 삭제할지 설정
     * @param	{Boolean}	clone		cloneNode()로 복사된 대상인지 설정
     */
    removeAllEvent: function ( childRemove, clone ) {
        //clone: clone된 대상인지.
        var el = this.element();
        $B.event.removeAll( [el], childRemove, clone );
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 이벤트 실행
     * @param	{String}	type	"on"빼고, "click"
     * @param	{*}			data	Event Handler 에서 전달받을 데이타
     */
    trigger: function ( type, data ) {
        var el = this.element();

        if ( typeof type === 'string' ) {
            $B.event.trigger( el, type, data );
        }
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 등록된 이벤트가 있는지 확인
     * @param	{String}	type	"on"빼고, "click"
     * @param	{Function}	handler		Event Handler
     * @return	{Boolean}
     */
    hasEvent: function ( type, handler ) {
        var el = this.element(),
            idx = $B.event.find( el, type, handler );
        return ( idx == -1 )? false : true;
    },

    /**
     * 타겟타입:(String) Event Type, on은 빼고 넣는다. 'onclick' - 'click'<br>
     * 해당이벤트를 지원하면 true를 반환.
     * @return	{Boolean}
     */
    hasEventType: function () {
        return ('on' + this.target in window);
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 마우스 커서를 pointer로 설정, 해지 한다.
     * @param	{Boolean}	state
     */
    buttonMode: function ( state ) {
        this.css( 'cursor:' + (state? 'pointer' : 'auto') );
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 객체 드래그 구현시 ondragstart의 동작을 막아, 드래그 구현시 방해되지 않게 하기 위해서 설정<br>
     * (false를 설정해야 제대로 드래그를 구현할수 있다.)
     * @param	{Boolean}	state	기본설정 true
     */
    dragEnable: function ( state ) {
        this.element().ondragstart = (state)? null : function (e) { return false; };
    },

    /**
     * 타겟타입:(Element, ID)<br>
     * 객체를 드래그 했을시 선택되는 설정<br>
     * FF는 타겟의 onmousemove, 기타 브라우저는 타겟의 onselectstart를 막아 구현하였다.
     * @param	{Boolean}	state	기본설정 true
     */
    selectEnable: function ( state ) {
        if ( typeof document.documentElement.onselectstart === 'undefined' ) {
            //FF
            this.selectEnable = function ( state ) {
                //this.element().style.MozUserSelect = (state)? 'text' : 'none';
                this.element().onmousedown = (state)? null : function (e) { return false; };
            };
        } else {
            this.selectEnable = function ( state ) {
                this.element().onselectstart = (state)? null : function (e) { return false; };
            };
        }
        this.selectEnable( state );
    }
};


// ############################################################################ //
// ############################################################################ //
// 						_private : ixBand Private Class							//
// ############################################################################ //
// ############################################################################ //

ixBand._private = {};


// ============================================================== //
// =====================	SWFManager	========================= //
// ============================================================== //
/**
 * <b>Static Class : </b>SWF Data 관리<br>
 * SWF에서 onReady를 dispatch할때 onSwfEvent를 호출한다.
 */
ixBand._private.SWFManager = (function () {
    var _swfs = {};

    return {
        // ---------- Private Methods ---------- //
        //swf 데이타 등록
        addSWFData: function ( id, data ) {
            _swfs[id] = data;
        },

        //swf 데이타 삭제
        removeSWFData: function ( id ) {
            delete _swfs[id];
        },

        //swf에서 전달받은 event (메세지를 받는통로로 수정해보기...)
        onSwfEvent: function ( e ) {
            if ( e.type != 'ready' ) return;
            var data = _swfs[e.id];
            if ( data && data.onReady ) {
                var value = ( e.value || e.value == 0 )? e.value : null;
                data.onReady.call( this, {type: e.type, id: e.id, target: data.target, value: value} );
                delete _swfs[e.id];
            }
        }
    };
}());