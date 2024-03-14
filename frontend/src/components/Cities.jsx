import { useEffect, useState } from 'react'
import { useCity } from '../context/cityProvider'
import Card from './Card'

function Cities() {
  const { city1, city2, city3, city4 } = useCity();
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const isAllResolved = city1.isResolved || city2.isResolved || city3.isResolved || city4.isResolved;
    setResolved(isAllResolved);
  }, [city1.isResolved, city2.isResolved, city3.isResolved, city4.isResolved])

  return (
    <div className='h-[90vh] mx-9'>
      {!resolved && <div className='flex w-full h-[80vh] justify-center text-center items-center'>
          <div className='italic text-xl'>Select Cities from settings.</div>
        </div>
      }
      {resolved && <div className='flex w-full flex-col mt-8'>
        <div className='italic text-xl text-center'>Weather App</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8'>
          {city1.isResolved && <Card city={city1} setResolved={setResolved}/>}
          {city2.isResolved && <Card city={city2} setResolved={setResolved}/>}
          {city3.isResolved && <Card city={city3} setResolved={setResolved}/>}
          {city4.isResolved && <Card city={city4} setResolved={setResolved}/>}
        </div>
      </div>
      }
    </div>
  )
}

export default Cities