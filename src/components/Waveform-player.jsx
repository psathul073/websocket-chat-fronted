import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Icon from "../icons/Icon";


const WaveFormPlayer = ({ src, color }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);


    useEffect(() => {

        if (waveformRef.current && !wavesurfer.current) {
            // Create a WaveSurfer instance
            wavesurfer.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#d4d4d8",
                progressColor: color,
                cursorWidth: 0,
                height: 30,
                width: 160,
                barWidth: 5,
                barHeight: 5,
                barGap: 5,
                barRadius: 30,
                
            });

            // Load the audio file.
            wavesurfer.current.load(src);
            // When playing, update current time.
            wavesurfer.current.on('audioprocess', () => {
                setCurrentTime(wavesurfer.current.getCurrentTime());
            });
            // When user seeks, also update..
            wavesurfer.current.on("seek", () => {
                setCurrentTime(wavesurfer.current.getCurrentTime());
            });

            //Listen for play/pause.
            wavesurfer.current.on('play', () => setIsPlaying(true));
            wavesurfer.current.on('pause', () => setIsPlaying(false));


        };
        // Clean up when unmounted or src changes.
        return () => {
            wavesurfer.current && wavesurfer.current.destroy();
            wavesurfer.current = null;
        };

    }, [src]);


    const togglePlay = () => {
        wavesurfer.current && wavesurfer.current.playPause();
    };

    const formatTime = (seconds) => {
        // const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        // return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        return `0:${String(s).padStart(2, "0")}`
    };

    return (
        <div className="audio-player">
            {/* Controls */}
            <button className="play-btn" style={{color: color}} onClick={togglePlay}>{!isPlaying ? <Icon name={'play'} /> : <Icon name={'pause'} /> }</button>

            {/* Waveform */}
            <div className="audio-wave" ref={waveformRef} />

            {/* Timeline container */}
            <div className="timer" style={{ margin: "10px 0", fontFamily: "monospace" }}>
                {formatTime(currentTime)}
            </div>
        </div>
    );
}

export default WaveFormPlayer