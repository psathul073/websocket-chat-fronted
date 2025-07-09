import WaveFormPlayer from './Waveform-player';

const SlicedText = ({ replyToId, messages, msg }) => {

    let text = '';
    replyToId ? text = messages.find(msg => msg.id === replyToId).text : text = msg

    // If text is an image URL.
    if (/\.(jpeg|jpg|png|gif)(\?.*)?$/i.test(text)) {
        return (
            <img
            className='reply-img'
                src={text}
                alt=""
                style={{ width: "100%", maxWidth: "200px", borderRadius: "8px" }}
            />
        )
    }
    // If text is an audio URL.
    if (/\.(webm|mp3|wav)(\?.*)?$/i.test(text)) {
        return <WaveFormPlayer src={text} />
    }
    // If text is an URL.
    if (/(https?:\/\/[^\s]+)/g.test(text)) {
        return <a className='reply-link' href={text} target="_blank">{text}</a>
    }
    return (
        <p className='reply-text'>{text}</p>
    )
}

export default SlicedText