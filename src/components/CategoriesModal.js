import CategoryList from "./CategoryList"
import styles from "./modal.module.css"

function CategoriesModal ({eventInfo, category, setCategoryModal, setEventInfo}){
    return(

            <>
                <div 
                    className={styles.cardBg}
                    onClick={() => setCategoryModal(false)} 
                />
                <div className={`${styles.card} lg:relative lg:w-[750px]`}>
                    <div 
                        onClick={() => setCategoryModal(false)}
                        className="interset-modal-closing-button lg:absolute lg:right-4 lg:top-3"
                    >
                        X
                    </div>
                    <p className="interest-modal-header lg:pb-6 lg:pt-4 lg:text-center">
                        Select up to <span className="lg:underline lg:underline-offset-4 lg:text-blue lg:-500">three</span> categories
                    </p>
                    <div className=" flex flex-wrap justify-center">
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
                    <div className="interest-done-button-container lg:flex lg:justify-center">
                    <button
                        type='button'
                        onClick={() => setCategoryModal(false)}    
                        className="interest-modal-done-button lg:bg-emerald-500 lg:text-white lg:px-8 lg:py-1 lg:mt-3 lg:mb-2 lg:rounded-md lg:border"
                    >
                        Done
                    </button>

                    </div>
                </div>
            </>
        );
    
}

export default CategoriesModal