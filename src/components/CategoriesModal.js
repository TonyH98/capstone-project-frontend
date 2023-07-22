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
                        className="lg:absolute lg:right-4 lg:top-3"
                    >
                        X
                    </div>
                    <p className="lg:pb-6 lg:pt-4 lg:text-center">
                        Select up to <span className="lg:underline lg:underline-offset-4 lg:text-blue lg:-500">three</span> categories
                    </p>
                    <div className="lg:flex lg:flex-wrap lg:justify-center">
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
                        className="lg:bg-emerald-500 lg:text-white lg:px-8 lg:py-1 lg:mt-3 lg:mb-2 lg:rounded-md lg:border lg:float-right"
                    >
                        Done
                    </button>
                </div>
            </>
        );
    
}

export default CategoriesModal