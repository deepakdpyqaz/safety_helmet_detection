const input = document.getElementById("input");
const output = document.getElementById("output");
const video = document.createElement("video");
const control = document.getElementById("control");
const ctxi = input.getContext('2d');
const ctxo = output.getContext('2d');
const width = 608;
const height = 608;
let localStream = null;
ctxi.fillStyle = "black";
ctxi.fillRect(0, 0, width, height);
ctxo.fillStyle = "black";
ctxo.fillRect(0, 0, width, height);
let sts = true;
const colors = {
    "Without helmet": "red",
    "With helmet": "green"
}

function processFrame() {
    if(sts) return;
    let data = ctxi.getImageData(0, 0, width, height);
    fetch("/process", {
        method: "post",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            "data": Array.from(data.data).filter((elem, idx) => {
                return idx % 4 != 3
            })
        })
    }).then((r) => {
        return r.json()
    }).then((res) => {
        ctxo.clearRect(0, 0, width, height);
        ctxo.beginPath(0,0,width,height);
        ctxo.putImageData(data, 0, 0);
        if (res.status) {
            for (let detection of res.data) {
                x = detection[0][0];
                y = detection[0][1];
                w = detection[0][2];
                h = detection[0][3];
                ctxo.strokeStyle = colors[detection[1]];
                ctxo.lineWidth = "2";
                ctxo.rect(x, y, w, h);
                ctxo.stroke();
            }
        }
    }).catch((err) => {
        console.log(err.message);
    }).finally(()=>{
        control.classList.remove("btn-secondary");
        control.classList.add("btn-primary");
        control.innerText = "Detect";
        sts = true;
    })
    // setTimeout(processFrame,1000);
}
window.navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        width:618,
        height:618,
    }
}).then((stream) => {
    localStream = stream;
    video.srcObject = stream;
    video.play();
    setInterval(() => {
        ctxi.drawImage(video, 0, 0, width, height);
    }, 40)
})
control.addEventListener("click",()=>{
    if(sts){
        control.classList.remove("btn-primary");
        control.classList.add("btn-secondary");
        control.innerText = "Processing";
        sts = false;
        processFrame();
    }
})