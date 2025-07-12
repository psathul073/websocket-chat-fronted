import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WaveFormPlayer from "./Waveform-player";

const FormatText = ({ text, color, scaleImg }) => {
    
    // If text is an image URL.
    if (/\.(jpeg|jpg|png|gif)(\?.*)?$/i.test(text)) {
        return (
            <img className="msg-img" src={text} alt="" onClick={() => scaleImg(text)} />
        )
    }
    // If text is an audio URL.
    if (/\.(webm|mp3|wav)(\?.*)?$/i.test(text)) {
        return <WaveFormPlayer src={text} color={color}/>
    }

    // Otherwise, treat as Markdown.
    return (
        <ReactMarkdown rehypePlugins={[remarkGfm]}
            components={{
                a: ({ ...props }) => (
                    <a
                        {...props}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#007bff" }}
                    />
                ),
            }}
        >
            {text}
        </ReactMarkdown>
    )

};

export default FormatText