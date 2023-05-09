// For now these event cards will have hard coded information until the backend is setup
// I will leave the attending status out for now since that also depends on the backend
// The card should also be clickable to go to the event details page which will be setup once the routes are finished.
export default function EventCard() {
  return (
    <div>
      <h2>Title</h2>
      <p>Summary</p>
      <p>attending</p>
    </div>
  );
}
