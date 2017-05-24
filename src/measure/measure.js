// ############################################################################ //
// ############################################################################ //
// 									measure										//
// ############################################################################ //
// ############################################################################ //

ixBand.measure = {
    /**
     * Document 가로사이즈 반환 (스크롤바 미포함)
     * @return	{Number}
     */
    documentWidth: function () {
        var docEl = document.documentElement;
        return Math.max( docEl.scrollWidth, document.body.scrollWidth, docEl.clientWidth );
    },
    /**
     * Document 세로로사이즈 반환 (스크롤바 미포함)
     * @return	{Number}
     */
    documentHeight: function () {
        var docEl = document.documentElement;
        return Math.max( docEl.scrollHeight, document.body.scrollHeight, docEl.clientHeight );
    },
    /**
     * Viewport 가로사이즈 반환 (메뉴바, 툴바, 스크롤바를 제외)
     * @return	{Number}
     */
    windowWidth: function () {
        return document.documentElement.clientWidth;
    },
    /**
     * Viewport 세로사이즈 반환 (메뉴바, 툴바, 스크롤바를 제외)
     * @return	{Number}
     */
    windowHeight: function () {
        return document.documentElement.clientHeight;
    },
    /**
     * Windows 바탕화면에서 브라우져 X좌표
     * @return	{Number}
     */
    screenX: function () {
        if ( window.screenLeft ) {
            this.screenX = function () { return window.screenLeft; };
        } else {
            this.screenX = function () { return window.screenX; };
        }
        return this.screenX();
    },
    /**
     * Windows 바탕화면에서 브라우져 Y좌표
     * @return	{Number}
     */
    screenY: function () {
        if ( window.screenTop ) {
            this.screenY = function () { return window.screenTop; };
        } else {
            this.screenY = function () { return window.screenY; };
        }
        return this.screenY();
    }
};