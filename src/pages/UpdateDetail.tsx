import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom'
import { getUpdateInfo } from '../services/updateService';
import useErrorStore from '../store/useErrorStore';
import Tag from '../components/Tag';
import { useEffect } from 'react';
import { setInterceptor } from '../services/apiClient';

interface Date {
    date: string,
    timezone: string,
    timezone_type: number
}

interface Update {
    id: number,
    title: string,
    date: Date,
    description: string,
    images: Array<string>,
    elements: Array<string>
}
const UpdateDetail = () => {
    const setError = useErrorStore((state) => state.setError);
    const { updateId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setInterceptor(navigate);
    }, [navigate])

    const { data: updateInfo, error } = useQuery<Update>({
        queryKey: ['updateById', updateId],
        queryFn: () => getUpdateInfo(updateId!),
        enabled: !!updateId
    })
    if (error) setError(error.message);

    console.log(updateInfo);

    const handleOpenImage = (imageUrl: string) => {
        console.log(imageUrl)
        window.open(imageUrl, '_blank');
    }

    return (
        <div>
            {updateInfo ? (
                <div className='flex flex-col'>
                    <div className='text-offWhite flex px-10 font-display'>
                        <div className='flex flex-col w-5/6 justify-center'>
                            <div className='flex gap-x-12 items-center'>
                                <div className='text-darkTeal text-3xl font-semibold'>{updateInfo.title}</div>
                                <div className='text-offWhite text-xl font-light'>{new Date(updateInfo.date.date).toLocaleDateString('es-ES')} </div>
                            </div>
                            <div className='text-justify w-3/4 mt-5'>{updateInfo.description}</div>
                        </div>
                        <div className='w-1/6 flex flex-col items-end justify-start gap-3'>
                            {updateInfo.elements.map((element, index) =>
                                <Tag key={index} text={element} />
                            )}
                        </div>
                    </div>
                    <div className='flex flex-wrap my-10 gap-y-10 justify-center'>
                        {updateInfo.images.map((imageUrl, index) =>
                            <div key={index} className='w-1/3 flex p-3 justify-center'>
                                <img onClick={() => handleOpenImage(imageUrl)} className='rounded-md hover:cursor-pointer inner-border transition-all duration-100 object-contain' src={imageUrl} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default UpdateDetail