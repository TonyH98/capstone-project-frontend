import styles from "./modal.module.css";

function SummaryEditModal({ eventInfo, updatedEventInfo, setOpenSummaryEdit, handleTextChange, handleEdit }) {
    return (
        <div className="lg:relative">
            <div className={`${styles.card} w-1/3`}>
                <label
                    htmlFor="summary" 
                    className="lg:block mb-2"
                >
                    Summary
                </label>
                <div className="lg:relative">
                    <textarea 
                        id="summary"
                        name="summary"
                        onChange={handleTextChange}
                        className="lg:w-full lg:rounded lg:pb-10 lg:mb-10"
                    >
                        {eventInfo?.summary}
                    </textarea>
                    <p className={`${updatedEventInfo?.summary.length >= 250 ? 'lg:text-red-700' : null} lg:absolute lg:bottom-5 lg:left-3 lg:text-sm`}>
                        {updatedEventInfo?.summary.length}/250 characters
                    </p>
                </div>
                <button
                    className="lg:bg-emerald-500 lg:text-white lg:px-8 lg:py-1 lg:mt-3 lg:mb-2 lg:rounded-md lg:border lg:absolute lg:right-3 lg:bottom-3"
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