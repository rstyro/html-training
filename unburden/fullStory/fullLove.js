window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * 公共方法
 */
class Commons {
    static getRandom(min, max) {
        const range = max - min;
        return min + Math.floor(Math.random() * range);
    }

    static getFontsize() {
        return this.getRandom(10, 30)
    }

    static getRgba(opacity) {
        return "rgba(" + this.getRandom(0, 255)
            + "," + this.getRandom(0, 255)
            + "," + this.getRandom(0, 255) + "," + opacity + ")";
    }

    static getColor() {
        let val = Math.random() * 10;
        if (val > 0 && val <= 1) {
            return '#00f';
        } else if (val > 1 && val <= 2) {
            return '#f00';
        } else if (val > 2 && val <= 3) {
            return '#0f0';
        } else if (val > 3 && val <= 4) {
            return '#368';
        } else if (val > 4 && val <= 5) {
            return '#666';
        } else if (val > 5 && val <= 6) {
            return '#333';
        } else if (val > 6 && val <= 7) {
            return '#f50';
        } else if (val > 7 && val <= 8) {
            return '#e96d5b';
        } else if (val > 8 && val <= 9) {
            return '#5be9e9';
        } else {
            return '#d41d50';
        }
    }
}

/**
 * 坐标 的加减乘除
 */
class Point {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    add(o) {
        let p = this.clone();
        p.x += o.x;
        p.y += o.y;
        return p;
    }

    sub(o) {
        let p = this.clone();
        p.x -= o.x;
        p.y -= o.y;
        return p;
    }

    div(n) {
        let p = this.clone();
        p.x /= n;
        p.y /= n;
        return p;
    }

    mul(n) {
        let p = this.clone();
        p.x *= n;
        p.y *= n;
        return p;
    }

}

class Heart {
    constructor(size, add, type) {
        // 弧度
        this.t = 0;
        // 1 黑桃心形、2 笛卡尔心形
        this.type = type || 1;
        // 每次增长多少弧度
        this.add = add || 0.02;
        // 控制心型的大小
        this.size = size || 15;
        // 最大弧度
        this.maxRadian = 2 * Math.PI;
        // 根据增长弧度得循环次数
        this.maxCount = Math.ceil(this.maxRadian / this.add);
        // 数组
        this.points = [];

        for (let i = 0; i <= this.maxCount; i++) {
            let x, y;
            if (type === 1) {
                x = this.size * (16 * Math.pow(Math.sin(this.t), 3));
                y = this.size * (13 * Math.cos(this.t) - 5 * Math.cos(2 * this.t) - 2 * Math.cos(3 * this.t) - Math.cos(4 * this.t)) * -1;
            } else {
                x = this.size * (2 * Math.sin(this.t) + Math.sin(2 * this.t));
                y = this.size * (2 * Math.cos(this.t) + Math.cos(2 * this.t));
            }
            this.t += add;
            this.points.push(new Point(x, y));
        }
    }

    getPoints() {
        return this.points;
    }

    static getImage() {
        this.canvas = document.createElement('canvas');
        let ctx = this.canvas.getContext('2d');
        this.canvas.width = 100;
        this.canvas.height = 100;
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.globalAlpha = 0.5;
        let heart = new Heart(2, 0.02, 1);
        let arr = heart.getPoints();
        for (let i = 0; i < arr.length; i++) {
            ctx.lineTo(arr[i].x, arr[i].y);
            ctx.fillStyle = '#f00';
            ctx.strokeStyle = '#f00';
            ctx.fill();
        }
        // create the image
        let image = new Image();
        image.src = this.canvas.toDataURL();
        return image;
    }

}

class PointPool {
    constructor(canvas, settings) {
        this.canvas = canvas;
        this.points = [];
        this.settings = settings;
        let w = this.canvas.width;
        let h = this.canvas.height;
        for (let i = 0; i < this.settings.num; i++) {
            let x = Commons.getRandom(0, w);
            let y = Commons.getRandom(0, h);
            let point = new Point(x, y);
            if (i % 5 === 0 && this.settings.imageList.length>0) {
                this.points.push(new Item(point, -1, i%this.settings.imageList.length));
            } else {
                // 随机
                // let index = Commons.getRandom(0, this.settings.textList.length);
                // 按顺序添加
                let index = i%this.settings.textList.length;
                this.points.push(new Item(point, index, -1));
            }
        }
    }


}

class Item {
    constructor(point, textIndex, imgIndex) {
        this.point = point;
        this.textIndex = textIndex;
        this.imgIndex = imgIndex;
        this.opacity = Math.random() + 0.3;
        this.scale = Math.random() + 0.3;
        // 设置文字属性
        this.fillStyle = Commons.getRgba(this.opacity);
        this.fontSize = Commons.getFontsize();
        this.offsetPoint = this.getOffsetPoint();
        while (this.offsetPoint.x == 0 && this.offsetPoint.y == 0) {
            this.offsetPoint = this.getOffsetPoint();
        }
        this.offsetOpacity = Commons.getRandom(1, 10) * 0.01;
        this.offsetScale = Commons.getRandom(1, 10) * 0.01;
    }

    // 偏移量越大，速度越快
    getOffsetPoint() {
        return new Point(Commons.getRandom(-1, 2), Commons.getRandom(-1, 2));
    }

    draw(ctx, settings) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.scale(this.scale, this.scale);
        if (this.textIndex > -1) {
            ctx.fillStyle = this.fillStyle;
            ctx.font = "italic "+this.fontSize+"px sans-serif";
            // 填充字符串
            ctx.fillText(settings.textList[this.textIndex], this.point.x, this.point.y);
        } else {
            let img = settings.imageList[this.imgIndex];
            // 图片宽自适应
            let size = 130;
            if (img.width > img.height) {
                ctx.drawImage(img, this.point.x, this.point.y, size, size * img.height / img.width);
            } else {
                ctx.drawImage(img, this.point.x, this.point.y, size * img.width / img.height, size);
            }
        }
        // 字体闪光
        if(settings.flash){
            this.fillStyle=this.getColor();
        }
        ctx.restore();
    }

    getColor() {
        let arr = [];
        arr.push("#54d2d2");
        arr.push("#ffcb00");
        arr.push("#d3ea07");
        arr.push("#072448");
        arr.push("#e51300");
        arr.push("#0a36b3");
        arr.push("#ff06f1");
        arr.push("#08b3b3");
        arr.push("#0780de");
        arr.push("#ea3b68");
        let random = Commons.getRandom(0,arr.length);
        return arr[random];
    }

    update(settings) {
        this.point = this.point.add(this.offsetPoint);
        this.scale += this.offsetScale;
        if (this.scale > 1) {
            this.scale -= this.offsetScale;
        } else {
            this.scale += this.offsetScale;
        }
        if (this.opacity > 1) {
            this.opacity -= this.offsetOpacity;
        } else {
            this.opacity += this.offsetOpacity;
        }
        // 新的点
        if (this.point.x > settings.canvas.width || this.point.x < -50
            || this.point.y > settings.canvas.height || this.point.y < 0) {
            this.point = new Point(Commons.getRandom(0, settings.canvas.width)
                , Commons.getRandom(0, settings.canvas.height));
            this.fillStyle = Commons.getRgba(this.opacity);
            this.fontSize = Commons.getFontsize();
        }
    }

}

class FullLove {
    constructor(canvas,settings) {
        this.settings = settings||{};
        // 个数
        this.settings.num=this.settings.num||80;
        this.settings.textList=this.settings.textList||["我爱你","Love U"];
        this.settings.images=this.settings.images||[];
        this.settings.imageList=this.settings.imageList||[];
        // 字体是否闪光
        this.settings.flash=this.settings.flash||false;
        this.canvas = canvas;
        this.settings.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        for (let i = 0; i < this.settings.images.length; i++) {
            let image = new Image();
            image.src = this.settings.images[i];
            this.settings.imageList.push(image);
        }
        this.settings.imageList.push(Heart.getImage());
    }

    init() {
        setTimeout(() => {
            this.onMyResize();
            this.pointPool = new PointPool(canvas, this.settings);
            this.render();
        }, 10);

        window.addEventListener('resize', (() => {
            this.onMyResize();
        }));
    }

    onMyResize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    render() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.pointPool.points.length; i++) {
            this.pointPool.points[i].draw(this.ctx, this.settings);
            this.pointPool.points[i].update(this.settings);
        }
        window.requestAnimationFrame(this.render.bind(this));
    }
}
