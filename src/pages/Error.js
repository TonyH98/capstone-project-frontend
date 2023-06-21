import Lottie from 'lottie-react'
import animationData from '../assets/404.json'

function Error(props) {
    return (
        <div className='bg-white'>
            <div className='h-[20%] w-[60%] m-auto'>
                <Lottie animationData={animationData} />
            </div>
        </div>
    );
}

export default Error;