import "../pages/EventDetails/tooltip.css"

function AttendeesEditModal({ updatedEventInfo, setOpenAttendeesEdit, handleTextChange, handleEdit }) {
    return (
        <div>
            <div className="tooltiptext-right lg:w-56">
                <label htmlFor="max_people" className="lg:block lg:text-left lg:ml-3">Max Participants</label>
                <input
                    type="number"
                    id="max_people"
                    name="max_people"
                    value={updatedEventInfo?.max_people}
                    onChange={handleTextChange}
                    className="lg:w-20 lg:text-center lg:pr-2 lg:rounded lg:h-8 lg:inline"
                />
                <button
                    className="lg:bg-emerald-500 lg:text-white lg:px-5 lg:py-1 lg:mt-3 lg:mb-2 lg:ml-3 lg:rounded-md lg:border lg:inline"
                    onClick={handleEdit}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default AttendeesEditModal;