import Image from 'next/image'
import React from 'react'

const LinkCard = (props) => {
    const name = props?.name
    const link = props?.link

    return (
        <div className='card shadow-md '>
            <div className='flex'>
                {/* <Image src={"https://fastly.picsum.photos/id/113/200/200.jpg?grayscale&hmac=piXK8Ger5U_ECJE3gSeqq5PIhOpgc1gus6p--ruVvVQ"} width={100} height={100} alt="framework" /> */}
                <p className='text-md font-bold ml-4 my-4'>{name}</p>
            </div>
        </div>
    )
}

export default LinkCard