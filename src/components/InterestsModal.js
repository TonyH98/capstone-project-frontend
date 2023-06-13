// Pop up modal that opens when edit button in interests field of user profile is clicked
import CategoryPill from "./CategoryPill";
import styles from "./modal.module.css";
import { useUser } from "../contexts/UserProvider";

function InterestsModal({
  isSelected,
  setIsSelected,
  categories,
  setOpenInterestModal,
}) {
  const { loggedInUser, setLoggedInUser } = useUser();

  const sortedCategories = categories.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <div
        className={styles.cardBg}
        onClick={() => setOpenInterestModal(false)}
      />
      <div className={`${styles.card} relative w-[750px]`}>
        <div
          onClick={() => setOpenInterestModal(false)}
          className="absolute right-4 top-3"
        >
          X
        </div>
        <p className="pb-6 pt-4 text-center">Select all that apply</p>
        <div className="flex flex-wrap justify-center">
          {sortedCategories.map((category) => {
            return (
              <CategoryPill
                key={category.id}
                category={category}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setOpenInterestModal(false)}
          className="bg-emerald-500 text-white px-8 py-1 mt-3 mb-2 rounded-md border float-right"
        >
          Done
        </button>
      </div>
    </>
  );
}

export default InterestsModal;
