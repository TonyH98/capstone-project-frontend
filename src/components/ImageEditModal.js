import "./tooltip.css"

function ImageEditModal({ updatedEventInfo, handleTextChange, handleEdit }) {
    console.log(updatedEventInfo)
    return (
        <div className="tooltiptext">
            <div className="w-96 mx-16 mt-6 mb-16">
                <label htmlFor="location_image" className="block">Image URL:</label>
                <input
                    type="text"
                    id="location_image"
                    name="location_image"
                    value={updatedEventInfo?.location_image}
                    onChange={handleTextChange}
                    className="w-full rounded h-8 bg-gray-100 inline"
                />
                <button
                    className="bg-emerald-500 text-white px-8 py-1 mt-3 mb-2 rounded-md border absolute right-3 bottom-3"
                    onClick={handleEdit}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default ImageEditModal;