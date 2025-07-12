
const ConfirmModel = ({ title, msg, loading, confirm, cancel,type }) => {


    return (
        <div className="confirm-backdrop">
            {/* Reusable confirm model */}
            <div id="confirm-model">
                <h2>{title}</h2>
                <p>{msg}</p>
                <div className="model-actions">
                    <button className="cnl-btn" onClick={cancel}>Cancel</button>
                    <button disabled={loading} className="del-btn" onClick={confirm}>Delete {type} {loading && <span className="loader"></span>}</button>
                </div>
            </div>

        </div>
    )
}

export default ConfirmModel