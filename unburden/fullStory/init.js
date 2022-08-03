class SayLove{
    constructor(type,canvas,arr,num) {
        this.type=type;
        this.canvas=canvas;
        this.ctx = canvas.getContext("2d");
        this.arr=arr||["I Love You","爱你"]
        this.num=num;
        this.list=[];

    }

    init(){
        this.onMyResize();
        this.list=[];
        this.cavW = this.canvas.width;
        this.cavH = this.canvas.height;
        for (let i = 0; i < this.num; i++) {
            let x = Math.random() * this.cavW;
            let y = Math.random() * this.cavH;
            let randomIndex = Math.floor(Math.random()*this.arr.length);
            let text=this.arr[randomIndex];
            this.list.push(new SaveItem(x,y,text,this.canvas));
        }
        requestAnimationFrame(this.render.bind(this));
        window.addEventListener('resize', (()=>{
            this.onMyResize();

        }));
    }

    onMyResize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        console.log(this.canvas.width,this.canvas.height)
    }

    render(){
        this.ctx.clearRect(0,0,this.cavW,this.cavH);
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].draw();
            this.list[i].update();
        }
        // next animation frame
        requestAnimationFrame(this.render.bind(this));
    }
}

class SaveItem{
    constructor(x,y,text,canvas) {
        this.x = x;
        this.y = y;
        this.text=text;
        this.canvas=canvas;
        this.ctx=this.canvas.getContext("2d");
        this.fontSize =  Math.random() * 30;
        // 偏移量
        this.offset = {
            x: (Math.random() - .5) * 5,
            y: (Math.random() - .5) * 5
        }
        // 透明度 最低0.5
        this.opacity = Math.random() * .5 + .5;
        // 缩放比例，最小0.02
        this.targetScale = Math.random() * .15 + .02;
        this.scale = Math.random() * this.targetScale;

    }
    getColor() {
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

    draw(){
        this.ctx.save();
        this.ctx.globalAlpha=this.opacity;
        this.ctx.fillStyle = this.getColor();
        this.ctx.font = 'italic ' + this.fontSize + 'px sans-serif';
        // 填充字符串
        this.ctx.fillText(this.text, this.x, this.y);
        // 文字内容的宽度
        // this.width=this.ctx.measureText(this.text).width;
        // this.height=this.ctx.measureText(this.text).height;
        this.ctx.restore();

        // requestAnimationFrame(this.render.bind(this));
    }
    update(){
        this.x += this.offset.x;
        this.y += this.offset.y;
        if (this.x > this.canvas.width || this.x  < 0
        || this.y < 0 || this.y>this.canvas.height) {
            // 重新初始化位置
            this.scale = 0;
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
        }

        // 放大
        this.scale += (this.targetScale - this.scale) * .1;
        if (this.fontSize > 80) {
            this.fontSize = 2;
        }
    }


}
