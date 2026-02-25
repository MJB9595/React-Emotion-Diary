import React , {useEffect}from 'react'

const useTitle = (title) => {
    useEffect(()=>{
        const $title = document.getElementsByTagName('title')[0]

        $title.innerHTML=title
    },[title])
  return (
    <div>
      
    </div>
  )
}

export default useTitle
