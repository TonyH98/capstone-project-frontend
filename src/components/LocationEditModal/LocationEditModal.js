import styles from ".././modal.module.css"

function LocationEditModal({
  updatedEventInfo,
  handleTextChange,
  handleEdit,
  getCoordinates,
  setOpenLocationEdit
}) {
    console.log(`${updatedEventInfo?.date_event.slice(6)}-${updatedEventInfo?.date_event.slice(0,2)}-${updatedEventInfo?.date_event.slice(3,5)}`)
  return (
    <>
      <div className={`${styles.card}`}>
        <div className="">
            <label htmlFor="date_event">
                Date
            <input
            type="date"
            id="date_event"
            value={updatedEventInfo.date_event}
            onChange={handleTextChange}
            required
            className="rounded h-8 ml-2"
          />

            </label>
        </div>
        {/* {
                    dateError && <p style={{color:"red"}}>{dateError}</p>
                } */}
        <div className="lg:my-2">
            <label 
                htmlFor="start_time"
            >
                Start
            </label>
            <input
                type="time"
                id="start_time"
                value={updatedEventInfo.start_time.slice(0,5)}
                onChange={handleTextChange}
                required
                className="lg:rounded lg:h-8 ml-2 lg:pl-3"
            />
            <label htmlFor="end_time" className="ml-3">
                End
            </label>
            <input
                type="time"
                id="end_time"
                value={updatedEventInfo.end_time.slice(0,5)}
                onChange={handleTextChange}
                required
                className="lg:rounded lg:h-8 ml-2 lg:pl-3"
            />
        </div>
        <div className="lg:mb-2">
            <label htmlFor="location" className="lg:inline">
                Location
            </label>
            <input
            type="text"
            id="location"
            value={updatedEventInfo.location}
            onChange={handleTextChange}
            required
            className="rounded lg:h-8 ml-2 inline lg:w-3/4"
          />
        </div>
        <div className="lg:mb-9">
            <label htmlFor="address">Address</label>
            <input
                type="text"
                id="address"
                value={updatedEventInfo.address}
                onChange={handleTextChange}
                required
                className="rounded lg:h-8 ml-2 lg:w-3/4"
            />
            <button
                type="button"
                className="underline ml-20 text-pink-400 text-md"
                onClick={getCoordinates}
            >
                Verify address
            </button>
        </div>
        <button 
            className="mt-2 lborder bg-emerald-500 text-white py-1 px-6 rounded shadow lg:position lg:absolute right-10 bottom-4 lg:hoverbg-emerald-300"
            onClick={handleEdit}
        >
            Save
        </button>
        <button 
            type="button"
            onClick={() => {setOpenLocationEdit(false)}}
            className="absolute right-4 top-2"
        >
            X
        </button>
      </div>
      <div 
        className={styles.cardBg}
        onClick={() => setOpenLocationEdit(false)}
      />
    </>
  );
}

export default LocationEditModal;
