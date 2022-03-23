import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import Link from "next/link";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import Input from "@mui/material/Input";
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import Button from "@mui/material/Button";
import styles from '../styles/Home.module.css'

axios.defaults.baseURL = 'https://helmetdetectiondeepak.herokuapp.com/';

function cleanup() {
    const height = 416;
    const width = 416;
    const input = document.getElementById("input");
    let ctxi = input.getContext('2d');
    ctxi.fillStyle = "white";
    ctxi.fillRect(0, 0, width, height);
    const output = document.getElementById("output");
    let ctxo = output.getContext('2d');
    ctxo.fillStyle = "white";
    ctxo.fillRect(0, 0, width, height);
}
function ImageDetection() {
    const width = 416;
    const height = 416;
    const handleChange = (e) => {
        if (e.target.files.length == 0) return;
        let imageFile = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = function (e) {
            var myImage = new Image();
            myImage.src = e.target.result;
            myImage.onload = function (ev) {
                var myCanvas = document.getElementById("input");
                var myContext = myCanvas.getContext("2d");
                myContext.drawImage(myImage, 0, 0, width, height);
            }
        }
    }
    useEffect(() => {
        return (() => {
            cleanup()
        })
    })
    return (
        <>
            <h1 style={{ "textAlign": "center" }}>
                Upload Image {' '}
                <label htmlFor="icon-button-file">
                    <Input accept="image/*" id="icon-button-file" onChange={handleChange} type="file" style={{ 'display': 'none' }} />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                    </IconButton>
                </label>
            </h1>
            <h3 style={{ "textAlign": "center" }}>
                Click detect button to detect the image
            </h3>
        </>
    )

}

function VideoDetection() {
    const width = 416;
    const height = 416;
    let streamHandler = null;
    const [videoHandler, setVideoHandler] = useState(null);
    const handleChange = (e) => {
        if (e.target.files.length == 0) return;
        clearInterval(videoHandler);
        let videoFile = e.target.files[0];
        let videoUrl = window.URL.createObjectURL(videoFile);
        let video = document.createElement("video");
        video.setAttribute('src', videoUrl);
        video.setAttribute('loop', true);
        video.play();
        const input = document.getElementById("input");
        let ctxi = input.getContext('2d');
        let it = setInterval(() => {
            ctxi.drawImage(video, 0, 0, width, height);
        }, 40);
        setVideoHandler(it);
        streamHandler = it;
    }
    useEffect(() => {
        return (() => {
            clearInterval(streamHandler);
            cleanup();
        })
    }, [])
    return (
        <>
            <h1 style={{ "textAlign": "center" }}>
                Upload Video {' '}
                <label htmlFor="icon-button-file">
                    <Input accept="video/*" id="icon-button-file" onChange={handleChange} type="file" style={{ 'display': 'none' }} />
                    <IconButton color="primary" aria-label="upload picture" component="span">
                        <VideoCameraFrontIcon />
                    </IconButton>
                </label>
            </h1>
            <h3 style={{ "textAlign": "center" }}>
                Click detect button to detect the snapshot
            </h3>
        </>
    )
}

function WebcamDetection() {
    let streamHandler = null;
    const width = 416;
    const height = 416;
    let streamTracks = null;
    useEffect(() => {
        const video = document.createElement("video");
        const input = document.getElementById("input");
        let ctxi = input.getContext('2d');
        window.navigator.mediaDevices.getUserMedia({ audio: false, video: { height: 416, width: 416 } }).then((stream) => {
            video.srcObject = stream;
            streamTracks = stream;
            video.play();
            streamHandler = setInterval(() => {
                ctxi.drawImage(video, 0, 0, width, height);
            }, 40)
        })
        return (() => {
            streamTracks.getTracks()[0].stop();
            clearInterval(streamHandler);
            cleanup();
        })
    }, [])
    return (
        <>
            <h1 style={{ "textAlign": "center" }}>
                Using webcam
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <LinkedCameraIcon />
                </IconButton>
            </h1>
            <h3 style={{ "textAlign": "center" }}>
                Click detect button to detect the snapshot
            </h3>
        </>
    )
}
function CanvasSupport() {

    const [input, setInput] = useState(null);
    const [output, setOutput] = useState(null);
    const [ctxi, setCtxi] = useState(null);
    const [ctxo, setCtxo] = useState(null);
    const width = 416;
    const height = 416;
    const colors = {
        "Without helmet": "red",
        "With helmet": "green"
    }
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const toggleLoading = () => {
        setOpen(!open);
    };
    function predictImage() {
        if (input != null && output != null) {
            let data = ctxi.getImageData(0, 0, 416, 416);
            setOpen(true);
            axios.post("/process", {
                "data": Array.from(data.data).filter((elem, idx) => {
                    return idx % 4 != 3
                })
            }).then((res) => {

                ctxo.clearRect(0, 0, width, height);
                ctxo.beginPath(0, 0, width, height);
                ctxo.putImageData(data, 0, 0);
                if (res.status) {
                    for (let detection of res.data.data) {
                        let x = detection[0][0];
                        let y = detection[0][1];
                        let w = detection[0][2];
                        let h = detection[0][3];
                        ctxo.strokeStyle = colors[detection[1]];
                        ctxo.lineWidth = "2";
                        ctxo.rect(x, y, w, h);
                        ctxo.stroke();
                    }
                }
            }).catch((e)=>{
                alert(e.message);
            }).finally(()=>{
                setOpen(false);
            })
        }
    }

    useEffect(() => {
        const ip = document.getElementById("input");
        const op = document.getElementById("output");
        const ctxip = ip.getContext('2d');
        const ctxop = op.getContext('2d');
        ctxip.fillStyle = "white";
        ctxip.fillRect(0, 0, width, height);
        ctxop.fillStyle = "white";
        ctxop.fillRect(0, 0, width, height);
        setInput(ip);
        setOutput(op);
        setCtxi(ctxip);
        setCtxo(ctxop);
    }, [])
    return (
        <Grid container justifyContent="center">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="primary" />
            </Backdrop>
            <Grid item xs={12} md={6} justifyContent="center" style={{ 'textAlign': "center" }}>
                <canvas id="input" className={styles.mycanvas} width="416" height="416" />
            </Grid>
            <Grid item xs={12} md={6} justifyContent="center" style={{ 'textAlign': "center" }}>
                <canvas id="output" className={styles.mycanvas} width="416" height="416" />
            </Grid>
            <Grid item md={12} style={{ "marginTop": "20px", 'textAlign': "center","marginBottom":"50px" }} justifyContent="center">
                <Button variant="contained" size="large" onClick={predictImage} disabled={open}>
                    Detect
                </Button>
            </Grid>
        </Grid>
    )
}
export default function Detection() {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const toggleLoading = () => {
        setOpen(!open);
    };
    const availableModes = ["Image", "Webcam", "Video"];
    const [mode, setMode] = useState(availableModes[0]);
    const handleChange = (e) => {
        setMode((e.target.value))
    }
    useEffect(() => {
        toggleLoading();
        axios.get("/").then((res) => {

        }).catch((err) => {
            alert("Cannot connect with server");
        }).finally(() => {
            setOpen(false);
        })
    }, [])
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="primary" />
            </Backdrop>
            <AppBar position="static">
                <Toolbar>
                    <Link href="/">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <HomeIcon /> {' '} Home
                        </IconButton>
                    </Link>
                </Toolbar>
            </AppBar>
            <div>

                <Grid container justifyContent="center" style={{ "marginTop": "50px" }}>
                    <Grid item rowSpacing={2} xs={12} style={{ 'textAlign': 'center', 'marginBottom': '20px' }}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={mode}
                            label="mode"
                            onChange={handleChange}
                            inputProps={{ style: { 'background': "white" } }}
                            style={{ 'background': '#0070f3', 'width': '80vw', 'color': '#fff' }}
                        >
                            {availableModes.map((elem, idx) => {
                                return <MenuItem value={elem} key={idx}>Detect using {elem}</MenuItem>
                            })}
                        </Select>
                    </Grid>
                    <Grid item rowSpacing={2} xs={12}>
                        {mode == "Image" ? <ImageDetection /> : null}
                        {mode == "Video" ? <VideoDetection /> : null}
                        {mode == "Webcam" ? <WebcamDetection /> : null}
                    </Grid>
                    <Grid item rowSpacing={12} xs={12} style={{ "marginTop": "50px" }}>
                        <CanvasSupport />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}