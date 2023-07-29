import "../pages/EventDetails/tooltip.css"

function AttendeesEditModal({ updatedEventInfo, setOpenAttendeesEdit, handleTextChange, handleEdit }) {
    return (
        <div>
            <div className="tooltiptext-right w-56">
                <label htmlFor="max_people" className="block text-left lg:ml-3">Max Participants</label>
                <input
                    type="number"
                    id="max_people"
                    name="max_people"
                    value={updatedEventInfo?.max_people}
                    onChange={handleTextChange}
                    className="w-20 text-center pr-2 rounded h-8 inline"
                />
                <button
                    className="bg-emerald-500 text-white px-5 py-1 mt-3 mb-2 ml-3 rounded-md border inline"
                    onClick={() => {
                        handleEdit();
                        setOpenAttendeesEdit(false);
                      }}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default AttendeesEditModal;