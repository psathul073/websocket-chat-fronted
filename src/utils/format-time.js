const formatTime = (unix) => {

    // Convert seconds + nano`s to milliseconds:
    const ms = unix._seconds * 1000 + unix._nanoseconds / 1e6;

    const date = new Date(ms);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

export default formatTime