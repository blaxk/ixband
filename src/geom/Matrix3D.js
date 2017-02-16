// ============================================================== //
// =====================	Matrix3D	========================= //
// ============================================================== //

/**
 * 4x4 변형행렬, 3D Matrix
 * @class {Matrix3D}
 */
ixBand.geom.Matrix3D = function ( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34 ) {
    /*
     | 1 0 0 0 |	sx	m12	m13	tx |
     | 0 1 0 0 |	m21	sy	m23	ty |
     | 0 0 1 0 |	m31	m32	sz	tz |
     | 0 0 0 1 |	m41	m42	m43	tw |
     */
    /*
     if ( a || b || c ) {
     this.rawData = [a, b, c, [0, 0, 0, 1]];
     } else {
     this.rawData = [
     [1, 0, 0, 0],
     [0, 1, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1]];
     }
     */

    if ( m11 || m11 == 0 ) {
        this.m11 = m11;//scaleX
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;//tx
        this.m21 = m21;
        this.m22 = m22;//scaleY
        this.m23 = m23;
        this.m24 = m24;//ty
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;//scaleZ
        this.m34 = m34;//tz
    } else {
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m24 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        this.m34 = 0;
    }

    this.m41 = 0;
    this.m42 = 0;
    this.m43 = 0;
    this.m44 = 1;//tw

};

ixBand.geom.Matrix3D.prototype = {
    //degrees to radians
    DEG_TO_RAD: Math.PI / 180,

    //matrix3d를 CSS3에서 사용할 수 있도록 문자열로 반환
    toString: function () {
        //var raw = this.rawData;
        //return raw[0].join(',') + ',' + raw[1].join(',') + ',' + raw[2].join(',') + ',' + raw[3].join(',');
        var m = this;
        return m.m11 +','+ m.m12 +','+ m.m13 +','+ m.m14 +','+ m.m21 +','+ m.m22 +','+ m.m23 +','+ m.m24 +','+ m.m31 +','+ m.m32 +','+ m.m33 +','+ m.m34 +','+ m.m41 +','+ m.m42 +','+ m.m43 +','+ m.m44;
    },

    /**
     * 행렬을 현재 행렬과 연결하여 두 행렬의 기하학적 효과를 효율적으로 결합
     * @param	{Matrix3D}	mtx3d
     * @return	{Matrix3D}
     */
    concat: function ( mtx3d ) {
        var om = this,
            nm = mtx3d,
            m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44;

        m11 = om.m11 * nm.m11 + om.m12 * nm.m21 + om.m13 * nm.m31 + om.m14 * nm.m41;
        m12 = om.m11 * nm.m12 + om.m12 * nm.m22 + om.m13 * nm.m32 + om.m14 * nm.m42;
        m13 = om.m11 * nm.m13 + om.m12 * nm.m23 + om.m13 * nm.m33 + om.m14 * nm.m43;
        m14 = om.m11 * nm.m14 + om.m12 * nm.m24 + om.m13 * nm.m34 + om.m14 * nm.m44;

        m21 = om.m21 * nm.m11 + om.m22 * nm.m21 + om.m23 * nm.m31 + om.m24 * nm.m41;
        m22 = om.m21 * nm.m12 + om.m22 * nm.m22 + om.m23 * nm.m32 + om.m24 * nm.m42;
        m23 = om.m21 * nm.m13 + om.m22 * nm.m23 + om.m23 * nm.m33 + om.m24 * nm.m43;
        m24 = om.m21 * nm.m14 + om.m22 * nm.m24 + om.m23 * nm.m34 + om.m24 * nm.m44;

        m31 = om.m31 * nm.m11 + om.m32 * nm.m21 + om.m33 * nm.m31 + om.m34 * nm.m41;
        m32 = om.m31 * nm.m12 + om.m32 * nm.m22 + om.m33 * nm.m32 + om.m34 * nm.m42;
        m33 = om.m31 * nm.m13 + om.m32 * nm.m23 + om.m33 * nm.m33 + om.m34 * nm.m43;
        m34 = om.m31 * nm.m14 + om.m32 * nm.m24 + om.m33 * nm.m34 + om.m34 * nm.m44;

        m41 = om.m41 * nm.m11 + om.m42 * nm.m21 + om.m43 * nm.m31 + om.m44 * nm.m41;
        m42 = om.m41 * nm.m12 + om.m42 * nm.m22 + om.m43 * nm.m32 + om.m44 * nm.m42;
        m43 = om.m41 * nm.m13 + om.m42 * nm.m23 + om.m43 * nm.m33 + om.m44 * nm.m43;
        m44 = om.m41 * nm.m14 + om.m42 * nm.m24 + om.m43 * nm.m34 + om.m44 * nm.m44;

        om.m11 = m11;
        om.m12 = m12;
        om.m13 = m13;
        om.m14 = m14;

        om.m21 = m21;
        om.m22 = m22;
        om.m23 = m23;
        om.m24 = m24;

        om.m31 = m31;
        om.m32 = m32;
        om.m33 = m33;
        om.m34 = m34;

        om.m41 = m41;
        om.m42 = m42;
        om.m43 = m43;
        om.m44 = m44;


        return this;
    },
    /**
     * 이 행렬의 복제본인 새 Matrix3D 객체와, 포함된 객체의 동일한 복사본을 함께 반환.
     * @return	{Matrix3D} 복제된 새 Matrix3D
     */
    clone: function () {
        var mtx3d = new $B.geom.Matrix3D();
        mtx3d.rawData = this.rawData.concat([]);
        return	mtx3d;
    },
    /**
     * 행렬에 크기 조절 변형을 적용.
     * @param	{Number}	sx	scaleX
     * @param	{Number}	sy	scaleY
     * @param	{Number}	sz	scaleZ
     * @return	{Matrix3D}
     */
    scale: function ( sx, sy, sz ) {
        var mtx3d = new $B.geom.Matrix3D( sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0 );
        return this.concat( mtx3d );
    },
    /**
     * 행렬에 X축 크기 조절 변형을 적용.
     * @param	{Number}	scale	scaleX
     * @return	{Matrix3D}
     */
    scaleX: function ( scale ) {
        return this.scale( scale, 1, 1 );
    },
    /**
     * 행렬에 Y축 크기 조절 변형을 적용.
     * @param	{Number}	scale	scaleY
     * @return	{Matrix3D}
     */
    scaleY: function ( scale ) {
        return this.scale( 1, scale, 1 );
    },
    /**
     * 행렬에 Z축 크기 조절 변형을 적용.
     * @param	{Number}	scale	scaleZ
     * @return	{Matrix3D}
     */
    scaleZ: function ( scale ) {
        return this.scale( 1, 1, scale );
    },
    /**
     * Matrix 객체에 X축 회전 변형을 적용
     * @param	{Number}	angle	Degree
     * @return	{Matrix3D}
     */
    rotateX: function ( angle ) {
        var rad = this.DEG_TO_RAD * angle,
            cosVal = Math.cos( rad ),
            sinVal = Math.sin( rad ),
            mtx3d = new $B.geom.Matrix3D( 1, 0, 0, 0, 0, cosVal, -sinVal, 0, 0, sinVal, cosVal, 0 );
        return this.concat( mtx3d );
    },
    /**
     * Matrix 객체에 Y축 회전 변형을 적용
     * @param	{Number}	angle	Degree
     * @return	{Matrix3D}
     */
    rotateY: function ( angle ) {
        var rad = this.DEG_TO_RAD * angle,
            cosVal = Math.cos( rad ),
            sinVal = Math.sin( rad ),
            mtx3d = new $B.geom.Matrix3D( cosVal,  0, sinVal, 0, 0, 1, 0, 0, -sinVal, 0,  cosVal, 0 );
        return this.concat( mtx3d );
    },
    /**
     * Matrix 객체에 Z축 회전 변형을 적용
     * @param	{Number}	angle	Degree
     * @return	{Matrix3D}
     */
    rotateZ: function ( angle ) {
        var rad = this.DEG_TO_RAD * angle,
            cosVal = Math.cos( rad ),
            sinVal = Math.sin( rad ),
            mtx3d = new $B.geom.Matrix3D( cosVal, -sinVal, 0, 0, sinVal, cosVal, 0, 0, 0, 0, 1, 0 );
        return this.concat( mtx3d );
    },
    /**
     * dx, dy, dz 매개 변수에 지정된 대로 x, y, z 축을 따라 행렬을 평행 이동
     * @param	{Number}	dx	x 축을 따라 오른쪽으로 이동할 크기
     * @param	{Number}	dy	y 축을 따라 아래쪽으로 이동할 크기
     * @param	{Number}	dz	z 축을 따라 이동할 크기
     * @return	{Matrix3D}
     */
    translate3d: function ( dx, dy, dz ) {
        var mtx3d = new $B.geom.Matrix3D( 1, 0, 0, dx, 0, 1, 0, dy, 0, 0, 1, dz );
        return this.concat( mtx3d );
    },
    /**
     * Matrix3D 객체가 나타내는 기하학적 변형을 지정된 점에 적용한 결과를 반환
     * @param	{Point3D}		point3D	x, y, z를 가지고 있는 Object
     * @return	{Point3D}		x, y, z좌표를 가지고 있는 Point3D 객체 반환
     */
    transform3d: function ( point3D ) {
        var result = {},
            m = this;

        result.x = m.m11 * point3D.x + m.m12 * point3D.y + m.m13 * point3D.z + m.m14;
        result.y = m.m21 * point3D.x + m.m22 * point3D.y + m.m23 * point3D.z + m.m24;
        result.z = m.m31 * point3D.x + m.m32 * point3D.y + m.m33 * point3D.z + m.m34;
        return result;
    }
};