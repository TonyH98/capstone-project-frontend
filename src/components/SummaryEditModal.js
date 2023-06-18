import styles from "./modal.module.css";

function SummaryEditModal({ eventInfo, updatedEventInfo, setOpenSummaryEdit, handleTextChange, handleEdit }) {
    return (
        <div className="relative">
            <div className={`${styles.card} w-1/3`}>
                <label
                    htmlFor="summary" 
                    className="block mb-2"
                >
                    Summary
                </label>
                <div className="relative">
                    <textarea 
                        id="summary"
                        name="summary"
                        onChange={handleTextChange}
                        className="w-full rounded pb-10 mb-10"
                    >
                        {eventInfo?.summary}
                    </textarea>
                    <p className={`${updatedEventInfo?.summary.length >= 250 ? 'text-red-700' : null} absolute bottom-5 left-3 text-sm`}>
                        {updatedEventInfo?.summary.length}/250 characters
                    </p>
                </div>
                <button
                    className="bg-emerald-500 text-white px-8 py-1 mt-3 mb-2 rounded-md border absolute right-3 bottom-3"
                    onClick={handleEdit}
                >
                    Save
                </button>
            </div>
            <div 
                onClick={() => setOpenSummaryEdit(false)}
                className={`${styles.cardBg}`}
            />
        </div>
    );
}

export default SummaryEditModal;