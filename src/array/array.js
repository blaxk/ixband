// ############################################################################ //
// ############################################################################ //
// 									array										//
// ############################################################################ //
// ############################################################################ //

ixBand.array = {
    /**
     * 배열의 내용을 불규칙 적으로 썩어서 새 배열을 반환.
     * @param	{Array}		target	대상 배열
     * @return	{Array}
     */
    shuffle: function ( target ) {
        if ( this.is(target) ) {
            var ary = target.concat([]),
                num = ary.length - 1,
                i, ran, tmp;

            for ( i = 0; i < num; ++i ) {
                ran = Math.round( Math.random() * num );
                tmp = ary[i];
                ary[i] = ary[ran];
                ary[ran] = tmp;
            }
            return ary;
        } else {
            throw new Error('[ixBand] "shuffle()" ' + MSG_NOT_ARRAY);
        }
    },

    /**
     * 해당객체가 배열이면 true, HTMLCollection은 false
     * @param	{*}			target
     * @return	{Boolean}
     */
    is: function ( target, errorMsg ) {
        var result = Object.prototype.toString.call( target ) === '[object Array]';

        if ( errorMsg && !result ) {
            warning( errorMsg );
            return false;
        } else {
            return result;
        }
    },

    /**
     * 지정된 함수에 대해 false를 반환하는 항목에 도달할 때까지 배열의 각 항목에 테스트 함수를 실행.
     * @param	{Array}		target		대상 배열
     * @param	{Function}	callback	function callback(item:*, index:int, array:Array):Boolean;
     * @return	{Boolean}	일치하는 요소가 없으면 false
     */
    every: function ( target, callback ) {
        if ( typeof Array.prototype.every === 'function' ) {
            this.every = function ( target, callback ) {
                if ( this.is(target) ) {
                    return target.every( callback );
                } else {
                    throw new Error('[ixBand] "every()" ' + MSG_NOT_ARRAY);
                }
            };
        } else {
            this.every = function ( target, callback ) {
                if ( this.is(target) ) {
                    var tArray = target,
                        aryNum = tArray.length,
                        result, i;

                    for ( i = 0; i < aryNum; ++i ) {
                        var ary = tArray[i];
                        result = callback.call( this , ary, i, tArray );
                        if ( result == false ) break;
                    }
                    return result;
                } else {
                    throw new Error('[ixBand] "every()" ' + MSG_NOT_ARRAY);
                }
            };
        }

        return this.every( target, callback );
    },

    /**
     * 지정된 함수에 대해 true를 반환하는 모든 항목이 포함된 새 배열을 반환.
     * @param	{Array}			target		대상 배열
     * @param	{Function}		callback	function callback(item:*, index:int, array:Array):Boolean;
     * @return	{Array}
     */
    filter: function ( target, callback ) {
        if ( typeof Array.prototype.filter === 'function' ) {
            this.filter = function ( target, callback ) {
                if ( this.is(target) ) {
                    return target.filter( callback );
                } else {
                    throw new Error('[ixBand] "filter()" ' + MSG_NOT_ARRAY);
                }
            };
        } else {
            this.filter = function ( target, callback ) {
                if ( this.is(target) ) {
                    var tArray = target,
                        aryNum = tArray.length,
                        result = [], i;

                    for ( i = 0; i < aryNum; ++i ) {
                        var ary = tArray[i],
                            state = callback.call( this , ary, i, tArray );
                        if ( state == true ) result.push( ary );
                    }
                    return result;
                } else {
                    throw new Error('[ixBand] "filter()" ' + MSG_NOT_ARRAY);
                }
            };
        }

        return this.filter( target, callback );
    },

    /**
     * 배열의 각 항목에 함수를 실행, for문을 직접쓰는것 보다는 느리다.
     * @param	{Array}			target		대상 배열
     * @param	{Function}		callback	function callback(item:*, index:int, array:Array):void;
     */
    forEach: function ( target, callback ) {
        if ( typeof Array.prototype.forEach === 'function' ) {
            this.forEach = function ( target, callback ) {
                if ( this.is(target) ) {
                    target.forEach( callback );
                } else {
                    throw new Error('[ixBand] "forEach()" ' + MSG_NOT_ARRAY);
                }
            };
        } else {
            this.forEach = function ( target, callback ) {
                if ( this.is(target) ) {
                    var tArray = target,
                        aryNum = tArray.length, i;

                    for ( i = 0; i < aryNum; ++i ) {
                        callback.call( this , tArray[i], i, tArray );
                    }
                } else {
                    throw new Error('[ixBand] "forEach()" ' + MSG_NOT_ARRAY);
                }
            };
        }

        this.forEach( target, callback );
    },

    /**
     * 대상배열안에 value와 같은요소가 존재하면 해당 Index를 반환한다.
     * @param	{Array}		target		대상 배열
     * @param	{*}			value
     * @return	{Int}		일치하는 요소가 없으면 -1
     */
    indexOf: function ( target, value ) {
        if ( typeof Array.prototype.indexOf === 'function' ) {
            this.indexOf = function ( target, value ) {
                if ( this.is(target) ) {
                    return target.indexOf( value );
                } else {
                    throw new Error('[ixBand] "indexOf()" ' + MSG_NOT_ARRAY);
                }
            };
        } else {
            this.indexOf = function ( target, value ) {
                if ( this.is(target) ) {
                    var tArray = target,
                        aryNum = tArray.length,
                        result = -1, i;

                    for ( i = 0; i < aryNum; ++i ) {
                        if ( tArray[i] === value ) {
                            result = i;
                            break;
                        }
                    }
                    return result;
                } else {
                    throw new Error('[ixBand] "indexOf()" ' + MSG_NOT_ARRAY);
                }
            };
        }

        return this.indexOf( target, value );
    },

    /**
     * 배열의 각 항목에 함수를 실행하고 원래 배열의 각 항목에 대한 함수 결과에 해당하는 항목으로 구성된 새 배열을 반환.
     * @param	{Array}			target		대상 배열
     * @param	{Function}		callback	function callback(item:*, index:int, array:Array):Array;
     * @return	{Array}
     */
    map: function ( target, callback ) {
        if ( typeof Array.prototype.map === 'function' ) {
            this.map = function ( target, callback ) {
                if ( this.is(target) ) {
                    return target.map( callback );
                } else {
                    throw new Error('[ixBand] "map()" ' + MSG_NOT_ARRAY);
                }
            };
        } else {
            this.map = function ( target, callback ) {
                if ( this.is(target) ) {
                    var tArray = target,
                        aryNum = tArray.length,
                        result = [], i;

                    for ( i = 0; i < aryNum; ++i ) {
                        var state = callback.call( this , tArray[i], i, tArray );
                        result.push( state );
                    }
                    return result;
                } else {
                    throw new Error('[ixBand] "map()" ' + MSG_NOT_ARRAY);
                }
            };
        }

        return this.map( target, callback );
    },

    /**
     * true를 반환하는 항목에 도달할 때까지 배열의 각 항목에 테스트 함수를 실행합니다.
     * @param	{Array}			target		대상 배열
     * @param	{Function}		callback	function callback(item:*, index:int, array:Array):Boolean;
     * @return	{Boolean}	일치하는 요소가 없으면 false
     */
    some: function ( target, callback ) {
        if ( typeof Array.prototype.some === 'function' ) {
            this.some = function ( target, callback ) {
                if ( this.is(target) ) {
                    return target.some( callback );
                } else {
                    throw new Error('[ixBand] "some()" ' + MSG_NOT_ARRAY);
                }
            };
        } else {
            this.some = function ( target, callback ) {
                if ( this.is(target) ) {
                    var tArray = target,
                        aryNum = tArray.length,
                        result, i;

                    for ( i = 0; i < aryNum; ++i ) {
                        var result = callback.call( this , tArray[i], i, tArray );
                        if ( result == true ) break;
                    }
                    return result;
                } else {
                    throw new Error('[ixBand] "some()" ' + MSG_NOT_ARRAY);
                }
            };
        }

        return this.some( target, callback );
    }
};