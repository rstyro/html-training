class Point {
    constructor(x, y) {
        this.x = (typeof x !== 'undefined') ? x : 0;
        this.y = (typeof y !== 'undefined') ? y : 0;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    length(length) {
        if (typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    }

    normalize() {
        let length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    }
}


class Particle{
    constructor(settings) {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
        this.settings=settings;
    }

    initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * this.settings.particles.effect;
        this.acceleration.y = dy * this.settings.particles.effect;
        this.age = 0;
    }

    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    }

    draw(context, image) {
        function ease(t) {
            return (--t) * t * t + 1;
        }

        let size = image.width * ease(this.age / this.settings.particles.duration);
        context.globalAlpha = 1 - this.age / this.settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    }
}


class ParticlePool{

    constructor(settings) {
        // create and populate particle pool
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;
        this.particles = new Array(settings.particles.length);
        for (let i = 0; i < this.particles.length; i++)
            this.particles[i] = new Particle(settings);
    }

    add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);

        // handle circular queue
        this.firstFree++;
        if (this.firstFree == this.particles.length) this.firstFree = 0;
        if (this.firstActive == this.firstFree) this.firstActive++;
        if (this.firstActive == this.particles.length) this.firstActive = 0;
    }

    update(deltaTime) {
        let i;

        // update active particles
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++)
                this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++)
                this.particles[i].update(deltaTime);
            for (i = 0; i < this.firstFree; i++)
                this.particles[i].update(deltaTime);
        }

        // remove inactive particles
        while (this.particles[this.firstActive].age >= this.duration && this.firstActive != this.firstFree) {
            this.firstActive++;
            if (this.firstActive == this.particles.length) this.firstActive = 0;
        }


    }

    draw (context, image) {
        // draw active particles
        if (this.firstActive < this.firstFree) {
            for (let i = this.firstActive; i < this.firstFree; i++)
                this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
            for (let i = this.firstActive; i < this.particles.length; i++)
                this.particles[i].draw(context, image);
            for (let i = 0; i < this.firstFree; i++)
                this.particles[i].draw(context, image);
        }
    }
}

class HeartImage{
    constructor(settings){
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = settings.particles.size;
        this.canvas.height = settings.particles.size;
        this.settings=settings;
    }

    getImage(){
        // create the path
        this.context.beginPath();
        let t = -Math.PI;
        let point = this.to(t);
        this.context.moveTo(point.x, point.y);
        while (t < Math.PI) {
            t += 0.1; // baby steps!
            point = this.to(t);
            this.context.lineTo(point.x, point.y);
        }
        this.context.closePath();
        // create the fill
        this.context.fillStyle = '#e32929';
        this.context.fill();
        // create the image
        let image = new Image();
        image.src = this.canvas.toDataURL();
        return image;
    }

    to(t) {
        let point = pointOnHeart(t);
        point.x = this.settings.particles.size / 2 + point.x * this.settings.particles.size / 550;
        point.y = this.settings.particles.size / 2 - point.y * this.settings.particles.size / 550;
        return point;
    }
}


function animationFrame(){
    let b = 0;
    let c = ["ms", "moz", "webkit", "o"];
    for (let a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
        window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"]
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, e) {
            let d = new Date().getTime();
            let f = Math.max(0, 16 - (d - b));
            let g = window.setTimeout(function () {
                callback(d + f)
            }, f);
            b = d + f;
            return g
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (d) {
            clearTimeout(d)
        }
    }
}


function pointOnHeart(t) {

    // let points = [], x, y, t;
    // for (let i = 10; i < 30; i += 0.2) {
    //     t = i / Math.PI;
    //     x = 16 * Math.pow(Math.sin(t), 3);
    //     y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    //     points.push(new Point(x, y));
    // }
    const scac=16;
    return new Point(

        16 * Math.pow(Math.sin(t), 3) *scac,
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))*scac
    );

    // return new Point(
    //     160 * Math.pow(Math.sin(t), 3),
    //     130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
    // );
}

class Heart{
    constructor(canvas){
        this.settings = {
            particles: {
                length: 500, // maximum amount of particles
                duration: 2, // particle duration in sec
                velocity: 100, // particle velocity in pixels/sec
                effect: -0.75, // play with this for a nice effect
                size: 30, // particle size in pixels
            },
        }
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.particles = new ParticlePool(this.settings);
        this.particleRate = this.settings.particles.length / this.settings.particles.duration; // particles/sec
        this.time=new Date().getTime() / 1000;
        this.image = new HeartImage(this.settings).getImage();
        this.b=0;

    }

    init(){
        // delay rendering bootstrap
        animationFrame();
        setTimeout( ()=> {
            // that.onResize();
            this.onMyResize();
            this.render();
        }, 10);

        window.addEventListener('resize', (()=>{
            this.onMyResize();
        }));
    }

    render() {
        // next animation frame
        requestAnimationFrame(this.render.bind(this));

        // update time
        let newTime = new Date().getTime() / 1000,
            deltaTime = newTime - (this.time || newTime);
        this.time = newTime;

        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // create new particles
        let amount = this.particleRate * deltaTime;
        for (let i = 0; i < amount; i++) {
            let pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            let dir = pos.clone().length(this.settings.particles.velocity);
            this.particles.add(this.canvas.width / 2 + pos.x, this.canvas.height / 2 - pos.y, dir.x, -dir.y);
        }

        // update and draw particles
        this.particles.update(deltaTime);
        this.particles.draw(this.context, this.image);
    }

    onMyResize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
}

// export {
//     Heart,
// }
