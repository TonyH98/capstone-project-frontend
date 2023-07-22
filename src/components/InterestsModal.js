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
      <div className={`${styles.card} lg:relative lg:w-[750px]`}>
        <div
          onClick={() => setOpenInterestModal(false)}
          className="lg:absolute lg:right-4 lg:top-3"
        >
          X
        </div>
        <p className="lg:pb-6 lg:pt-4 lg:text-center">Select all that apply</p>
        <div className="lg:flex lg:flex-wrap lg:justify-center">
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
          className="lg:bg-emerald-500 lg:text-white lg:px-8 lg:py-1 lg:mt-3 lg:mb-2 lg:rounded-md lg:border lg:float-right"
        >
          Done
        </button>
      </div>
    </>
  );
}

export default InterestsModal;
