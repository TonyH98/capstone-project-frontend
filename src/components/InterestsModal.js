// Pop up modal that opens when edit button in interests field of user profile is clicked
import CategoryPill from "./CategoryPill";
import styles from "./modal.module.css"

function InterestsModal({ isSelected, setIsSelected, categories, setOpenModal}) {

    const sortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));
    console.log(categories)

    return (
        <>
            <div 
                className={styles.cardBg}
                onClick={() => setOpenModal(false)} 
            />
            <div className={`${styles.card} relative`}>
                <div 
                    onClick={() => setOpenModal(false)}
                    className="absolute right-4 top-3"
                >
                    X
                </div>
                <p className="pb-6 pt-4">Select all that apply</p>
                <div className="flex flex-wrap justify-center">
                    {            
                        sortedCategories.map((category) => {
                                return (
                                    <CategoryPill
                                        id={category.id}
                                        key={category.id}
                                        category={category.name}
                                        isSelected={isSelected}
                                        setIsSelected={setIsSelected}
                                    />
                                )
                            }
                        )
                    }
                </div>
                <button
                    type='button'
                    onClick={() => setOpenModal(false)}    
                    className="bg-emerald-500 text-white px-8 py-1 mt-3 mb-2 rounded-md border float-right"
                >
                    Done
                </button>
            </div>
        </>
    );
}

export default InterestsModal;