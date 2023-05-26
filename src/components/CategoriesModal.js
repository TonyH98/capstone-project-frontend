import CategoryList from "./CategoryList"
import styles from "./modal.module.css"

function CategoriesModal ({eventInfo, category, setCategoryModal, setEventInfo}){
    return(

            <>
                <div 
                    className={styles.cardBg}
                    onClick={() => setCategoryModal(false)} 
                />
                <div className={`${styles.card} relative w-[750px]`}>
                    <div 
                        onClick={() => setCategoryModal(false)}
                        className="absolute right-4 top-3"
                    >
                        X
                    </div>
                    <p className="pb-6 pt-4 text-center">Select all that apply</p>
                    <div className="flex flex-wrap justify-center">
                        {            
                            category.map((category) => {
                                    return (
                                        <CategoryList
                                            key={category.id}
                                            category={category}
                                            eventInfo={eventInfo}
                                            setEventInfo={setEventInfo}
                                            
                                        />
                                    )
                                }
                            )
                        }
                    </div>
                    <button
                        type='button'
                        onClick={() => setCategoryModal(false)}    
                        className="bg-emerald-500 text-white px-8 py-1 mt-3 mb-2 rounded-md border float-right"
                    >
                        Done
                    </button>
                </div>
            </>
        );
    
}

export default CategoriesModal