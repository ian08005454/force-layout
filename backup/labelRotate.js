    /**
     * label旋转变换
     * @param {Float32Array|Array.<number>} out
     * @param {Float32Array|Array.<number>} a
     * @param {number} rad
     */
    function label_rotate(out, a, rad, sub_rotation) {

        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];


        if (rad >= 4.71 && rad <= 6) {
            var st = Math.sin(rad);
            var ct = Math.cos(rad);
        } else if (rad >= -1.57 && rad <= -0) {
            var st = -Math.sin(rad);
            var ct = -Math.cos(rad);
        } else {
            if (sub_rotation >= 2.397 && sub_rotation <= 3.88) {
                var st = -Math.sin(rad);
                var ct = -Math.cos(rad);
            } else {
                var st = Math.sin(rad);
                var ct = Math.cos(rad);
            }
        }

        out[0] = aa * ct + ab * st;
        out[1] = -aa * st + ab * ct;
        out[2] = ac * ct + ad * st;
        out[3] = -ac * st + ct * ad;
        out[4] = ct * atx + st * aty;
        out[5] = ct * aty - st * atx;

        return out;
    }
    function rotate(out, a, rad) {
        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];
        var st = Math.sin(rad);
        var ct = Math.cos(rad);
        out[0] = aa * ct + ab * st;
        out[1] = -aa * st + ab * ct;
        out[2] = ac * ct + ad * st;
        out[3] = -ac * st + ct * ad;
        out[4] = ct * atx + st * aty;
        out[5] = ct * aty - st * atx;
        return out;
      }