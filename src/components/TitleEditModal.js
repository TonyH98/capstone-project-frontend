import "./tooltip.css"

function TitleEditModal({ eventInfo, updatedEventInfo, handleTextChange, handleEdit }) {
    return (
        <div className="tooltiptext-bottom bg-white w-full">
        <div className="ml-10 mt-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedEventInfo.title}
            onChange={handleTextChange}
            className="ml-3 rounded h-8 w-3/4 bg-gray-100"
          />
        </div>
        <div className="ml-10 mb-14">
          <label htmlFor="age_restriction">Age Restriction</label>
          <select
            id="age_restriction"
            name="age_restriction"
            required
            onChange={handleTextChange}
            className="ml-1 mr-6 mt-2 rounded h-8 text-sm pb-1 bg-gray-100"
          >
            {updatedEventInfo.age_restriction ? 
              <option value={true} selected> True </option>
              : <option value={true}> True </option>
            }
            {!updatedEventInfo.age_restriction ? 
              <option value={false} selected> False </option>
              : <option value={false}> False </option>
            }
          </select>
          {updatedEventInfo.age_restriction ? (
  <div className="inline">
    <label htmlFor="age_min">Min</label>
    <input
      type="number"
      id="age_min"
      value={updatedEventInfo.age_min}
      onChange={handleTextChange}
      className="w-14 pr-1 mr-2 text-center rounded h-8 bg-gray-100 ml-1"
    />
    <label htmlFor="age_max">Max</label>
    <input
      type="number"
      id="age_max"
      value={updatedEventInfo.age_max}
      onChange={handleTextChange}
      className="w-14 pr-1 text-center rounded h-8 bg-gray-100 ml-1"
    />
  </div>
) : null}
        </div>
        <button
          type="button"
          className="border bg-emerald-500 rounded-md text-white rounded shadow px-8 py-1 position absolute right-10 bottom-3"
          onClick={handleEdit}
        >
          Save
        </button>
      </div>
    );
}

export default TitleEditModal;