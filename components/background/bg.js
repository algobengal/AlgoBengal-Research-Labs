const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

const connectionRadius = 190;
const repelRadius = 140;
const chainRadius = 120;
const density = 0.00002;

let locks = [];

const mouse = {
    x: -10000,
    y: -10000,
    active: false
};

function setup() {

    const dpr = window.devicePixelRatio || 1;

    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr,0,0,dpr,0,0);

    locks = [];

    const count = Math.max(6, Math.floor(width * height * density));

    for(let i=0;i<count;i++){

        const x=Math.random()*width;
        const y=Math.random()*height;
        const size=3+Math.random()*4;

        locks.push({
            x,
            y,
            baseX:x,
            baseY:y,
            size,
            phase:Math.random()*Math.PI*2
        });

    }

}

function drawLock(cx,cy,size,color,glow){

    ctx.strokeStyle=color;
    ctx.lineWidth=1.2;

    ctx.beginPath();
    ctx.arc(cx,cy-size*0.35,size*0.55,Math.PI,0,false);
    ctx.stroke();

    ctx.fillStyle=color;

    const bodyW=size*1.25;
    const bodyH=size*0.95;

    const bodyX=cx-bodyW/2;
    const bodyY=cy-size*0.05;

    const r=1.5;

    ctx.beginPath();

    ctx.moveTo(bodyX+r,bodyY);
    ctx.lineTo(bodyX+bodyW-r,bodyY);
    ctx.quadraticCurveTo(bodyX+bodyW,bodyY,bodyX+bodyW,bodyY+r);

    ctx.lineTo(bodyX+bodyW,bodyY+bodyH-r);

    ctx.quadraticCurveTo(
        bodyX+bodyW,
        bodyY+bodyH,
        bodyX+bodyW-r,
        bodyY+bodyH
    );

    ctx.lineTo(bodyX+r,bodyY+bodyH);

    ctx.quadraticCurveTo(
        bodyX,
        bodyY+bodyH,
        bodyX,
        bodyY+bodyH-r
    );

    ctx.lineTo(bodyX,bodyY+r);

    ctx.quadraticCurveTo(
        bodyX,
        bodyY,
        bodyX+r,
        bodyY
    );

    ctx.closePath();
    ctx.fill();

    ctx.fillStyle="rgba(248,250,252,0.9)";

    ctx.beginPath();
    ctx.arc(cx,cy+size*0.35,size*0.18,0,Math.PI*2);
    ctx.fill();

    ctx.fillRect(
        cx-0.7,
        cy+size*0.35,
        1.4,
        size*0.4
    );

    if(glow>0){

        ctx.strokeStyle=`rgba(28,36,49,${glow*0.4})`;
        ctx.lineWidth=1;

        ctx.beginPath();
        ctx.arc(cx,cy+size*0.2,size*1.7,0,Math.PI*2);
        ctx.stroke();

    }

}

function animate(){

    ctx.clearRect(0,0,width,height);

    const time=performance.now()*0.001;

    // Repel

    locks.forEach(lock=>{

        const dx=lock.baseX-mouse.x;
        const dy=lock.baseY-mouse.y;

        const dist=Math.hypot(dx,dy);

        if(mouse.active && dist<repelRadius){

            const force=(repelRadius-dist)/repelRadius;

            lock.x=lock.baseX+(dx/(dist||1))*force*24;
            lock.y=lock.baseY+(dy/(dist||1))*force*24;

        }

        else{

            lock.x+=(lock.baseX-lock.x)*0.1;
            lock.y+=(lock.baseY-lock.y)*0.1;

        }

    });

    // Chain Links

    ctx.setLineDash([2,4]);

    for(let i=0;i<locks.length;i++){

        for(let j=i+1;j<locks.length;j++){

            const a=locks[i];
            const b=locks[j];

            const dist=Math.hypot(a.x-b.x,a.y-b.y);

            if(dist<chainRadius){

                const distA=Math.hypot(a.x-mouse.x,a.y-mouse.y);
                const distB=Math.hypot(b.x-mouse.x,b.y-mouse.y);

                const near=
                    mouse.active &&
                    distA<connectionRadius &&
                    distB<connectionRadius;

                const opacity=near
                    ?0.18+(1-Math.max(distA,distB)/connectionRadius)*0.35
                    :0.08;

                ctx.strokeStyle=`rgba(28,36,49,${opacity*1.5})`;
                ctx.lineWidth=0.7;

                ctx.beginPath();
                ctx.moveTo(a.x,a.y);
                ctx.lineTo(b.x,b.y);
                ctx.stroke();

            }

        }

    }

    ctx.setLineDash([]);

    // Cursor Connections

    locks.forEach(lock=>{

        const dx=lock.x-mouse.x;
        const dy=lock.y-mouse.y;

        const dist=Math.hypot(dx,dy);

        if(mouse.active && dist<connectionRadius){

            const opacity=1-dist/connectionRadius;

            ctx.strokeStyle=`rgba(28,36,49,${opacity*0.75})`;

            ctx.lineWidth=1;

            ctx.beginPath();
            ctx.moveTo(mouse.x,mouse.y);
            ctx.lineTo(lock.x,lock.y);
            ctx.stroke();

        }

    });

    // Draw Locks

    locks.forEach(lock=>{

        const dist=Math.hypot(lock.x-mouse.x,lock.y-mouse.y);

        const near=mouse.active && dist<connectionRadius;

        const glow=near ? 1-dist/connectionRadius : 0;

        const breathe=Math.sin(time+lock.phase)*0.5+0.5;

        const size=lock.size+(near ? glow*1.5 : breathe*0.3);

        const color=near
            ?`rgba(28,36,49,${0.8+glow*0.2})`
            :`rgba(28,36,49,${0.35+breathe*0.25})`;

        drawLock(lock.x,lock.y,size,color,glow);

    });

    // Cursor Glow

    if(mouse.active){

        const grad=ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            connectionRadius
        );

        grad.addColorStop(0,"rgba(28,36,49,0.07)");
        grad.addColorStop(1,"rgba(28,36,49,0)");

        ctx.fillStyle=grad;

        ctx.beginPath();
        ctx.arc(
            mouse.x,
            mouse.y,
            connectionRadius,
            0,
            Math.PI*2
        );
        ctx.fill();

    }

    requestAnimationFrame(animate);

}

// Mouse & Touch Events

window.addEventListener("mousemove",(e)=>{
    mouse.x=e.clientX;
    mouse.y=e.clientY;
    mouse.active=true;
});

document.addEventListener("mouseleave",()=>{
    mouse.active=false;
    mouse.x=-10000;
    mouse.y=-10000;
});

window.addEventListener("touchmove",(e)=>{
    const t=e.touches[0];
    if(t){
        mouse.x=t.clientX;
        mouse.y=t.clientY;
        mouse.active=true;
    }
},{passive:true});

window.addEventListener("touchend",()=>{
    mouse.active=false;
    mouse.x=-10000;
    mouse.y=-10000;
});

window.addEventListener("resize",setup);

setup();
animate();