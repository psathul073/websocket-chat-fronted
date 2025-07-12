import React, { useEffect, useRef, useState } from 'react'
import Icon from '../icons/Icon'
import GiphyBox from './Giphy-box'
import FormatText from './Format-text'
import formatTime from '../utils/format-time'
import imageUpload from '../apis/image-upload'
import { deleteMessage } from '../utils/room-manage'
import audioUpload from '../apis/audio-upload'
import SlicedText from './Sliced-text'


const ChatBox = ({ user, socket, room, messages, leaveRoom, isDisable, setIsDisable, connection }) => {

    const [text, setText] = useState('');
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [scaleImage, setScaleImage] = useState(null);
    const textareaRef = useRef(null);
    const scrollRef = useRef(null);


    // For send texts.
    const sendMessage = () => {
        if (!text.trim()) return;

        socket.send(JSON.stringify({
            action: "message",
            roomName: room,
            username: user.username,
            text,
            uid: user.uid,
            replyTo: replyTo ? replyTo.id : null,
        }));

        setText("");
        setReplyTo(null);
    };

    // For send image.
    const handleImageUpload = async (e) => {

        const max_file_size = 1.2 * 1024 * 1024; // 1.2Mb in bytes.
        const selectedImg = e.target.files[0];
        if (!selectedImg) return;
        if (selectedImg > max_file_size) return;

        const formData = new FormData();
        formData.append('image', selectedImg);

        const result = await imageUpload(formData);

        if (result.url) {

            socket.send(JSON.stringify({
                action: "message",
                roomName: room,
                username: user.username,
                text: result?.url,
                uid: user.uid,
                type: 'image',
                public_id: result?.public_id,
            }));
        }

    };

    // For send gif.
    const handleGifSelect = (gifUrl) => {
        socket.send(JSON.stringify({
            action: "message",
            roomName: room,
            username: user.username,
            text: gifUrl,
            uid: user.uid,
        }));
    };

    // For audio.
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];
            // If record is started store chunks in array.
            recorder.ondataavailable = (bEv) => chunks.push(bEv.data);
            // If record is stop combine all chinks and convert into one blob file,
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/webm" });

                const formData = new FormData();
                formData.append("audio", blob, "voice.webm");
                const result = await audioUpload(formData);
                if (result.url) {
                    socket.send(JSON.stringify({
                        action: "message",
                        roomName: room,
                        username: user.username,
                        text: result?.url,
                        uid: user.uid,
                        type: 'audio',
                        public_id: result?.public_id,
                    }));
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);

            // Stop after 10 seconds..
            setTimeout(() => {
                recorder.stop();
                setIsRecording(false);
            }, 10000);


        } catch (err) {
            console.error("Microphone permission denied", err);
            alert('Microphone permission denied');
        }


    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };


    // Adjust text area height based on msg length,
    useEffect(() => {
        const textarea = textareaRef.current;
        // Reset height.
        textarea.style.height = 'auto';
        // Set to scroll height.
        textarea.style.height = textarea.scrollHeight + 'px';

    }, [text]);

    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className='chat-backdrop'>

            {/* Chat box container */}
            <div id="chat-room">

                {/* Head section */}
                <header className='chat-head'>
                    <div className='chat-profile'>
                        <img src={user?.avatar ? user.avatar : "/avatar.webp"} alt="avatar" style={{ outlineColor: connection ? '#15803d' : '#be123c' }} />
                        <h3>{user?.username} <br /> <p>{connection ? 'Online' : 'Offline'}</p></h3>

                    </div>
                    <button className='exit-btn' onClick={leaveRoom}><Icon name={'exit'} /></button>
                </header>

                {/* Messages section */}
                <div className='messages'>
                    {
                        messages?.map((msg) => (

                            <div key={msg.id} className={`message ${msg.userId === user.uid ? 'sent' : 'received'} `}>
                                <p className="name">{msg.username}</p>
                                {msg.replyTo && (
                                    <blockquote className="reply">
                                        <p>Reply to :</p>  <SlicedText messages={messages} replyToId={msg.replyTo} />
                                    </blockquote>
                                )}

                                <FormatText text={msg.text} color={msg.userId === user.uid ? '#fff' : '#000'} scaleImg={setScaleImage} />

                                <p className="time">
                                    {formatTime(msg.timestamp)}
                                </p>
                                <div className='msg-action'>
                                    {msg.userId === user.uid && <button disabled={isDisable} onClick={() => { deleteMessage(socket, msg.id, room, user.uid); setIsDisable(true) }} > <Icon name={'delete'} /> </button>}
                                    <button className='reply-btn' onClick={() => setReplyTo(msg)}><Icon name={'reply'} /></button>
                                </div>

                            </div>
                        ))
                    }
                    <div ref={scrollRef}></div>
                </div>

                {/* Input section */}
                <div className='input-container'>

                    {replyTo && (
                        <div className="reply-context">
                            <div className='reply-header'>
                                <strong>{replyTo?.username}</strong>
                                <button onClick={() => setReplyTo(null)}> <Icon name={'X'} /></button>
                            </div>
                            <blockquote className='to-reply'>
                                <SlicedText msg={replyTo.text} />
                            </blockquote>
                        </div>
                    )}

                    {/* Gif picker box */}
                    {showGifPicker && <GiphyBox gifSelect={handleGifSelect} setShowGifPicker={setShowGifPicker} />}

                    <div className='input-box'>
                        <textarea ref={textareaRef} value={text}
                            onChange={(e) => setText(e.target.value)} type="text" maxLength={200} rows={1} placeholder='Message...' />
                        <button className='input-bt' onClick={() => setShowGifPicker(!showGifPicker)}>
                            <Icon name={'gif'} /></button>

                        <button className='input-bt'>
                            <label htmlFor="img-input"><Icon name={'gallery'} /></label>
                            <input type="file" name="image" id="img-input" accept='image/png, image/jpeg, image/webp' onChange={handleImageUpload} />
                        </button>
                        {
                            !text.length ?
                                <div> {!isRecording ? <button className='input-bt mic' onClick={startRecording} >< Icon name={'mic'} /></button> : <button className='input-bt mic' onClick={stopRecording}><Icon name={'micOff'} /></button>}</div>
                                : <button className='input-bt send' onClick={sendMessage}><Icon name={'send'} /></button>
                        }
                    </div>

                </div>

            </div>

            {/* Image viewer */}
            {scaleImage && <div className='img-view'>
                <img src={scaleImage} alt="image" />
                <button onClick={() => setScaleImage(null)}><Icon name={'X'} /></button>
            </div>}

        </div>
    )
}

export default ChatBox