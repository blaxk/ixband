// ############################################################################ //
// ############################################################################ //
// 									net										//
// ############################################################################ //
// ############################################################################ //

/**
 * @type	{net}
 */
ixBand.net = {
    /**
     * URL 이동
     * @param	{String}	url			이동할 페이지 url
     * @param	{String}	urlTarget	이동할 페이지 urlTarget
     */
    goToURL: function ( url, urlTarget ) {
        if ( !urlTarget ) {
            document.location.href = url;
        } else {
            switch ( urlTarget ) {
                case '_blank':
                    window.open( url, urlTarget );
                    break;
                case '_self':
                    self.location.href = url;
                    break;
                case '_parent':
                    parent.location.href = url;
                    break;
                case '_top':
                    top.location.href = url;
                    break;
            }
        }
    }
};