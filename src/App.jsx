import { useReducer, useRef, useState, createContext, useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Diary from './pages/Diary'
import Edit from './pages/Edit'
import Home from './pages/Home'
import New from './pages/New'
import NotFound from './pages/NotFound'

const mockData = [
  {
    id: 1,
    createdDate: new Date('2026-02-15').getTime(),
    emotionId: 1,
    content: '1번 일기의 내용'
  },
  {
    id: 2,
    createdDate: new Date('2026-02-10').getTime(),
    emotionId: 3,
    content: '2번 일기의 내용'
  },
  {
    id: 3,
    createdDate: new Date('2026-01-16').getTime(),
    emotionId: 4,
    content: '3번 일기의 내용'
  },
]

function reducer(state, action) {
  let nextState;
  switch (action.type) {
    case "INIT":
      return action.data
    case "CREATE":
      nextState=[action.data, ...state]
      break;
    case "UPDATE":
      nextState= state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      )
      break;
    case "DELETE":
      nextState= state.filter(
        (item) => String(item.id) !== String(action.id)
      )
      break
    default:
      return state
  }

  localStorage.setItem('diary',JSON.stringify(nextState))

  return nextState
}

export const DiaryStateContext = createContext()
export const DiaryDispatchContext = createContext()

function App() {


  const [data, dispatch] = useReducer(reducer, [])
  const idRef = useRef(0)
  const [isDataLoaded, setIsDataLoaded] = useState(true)


  useEffect(() => {
   const storedData=localStorage.getItem('diary')


    if(!storedData){
      localStorage.setItem('diary',JSON.stringify([]))
      setIsDataLoaded(false)

      return
    }

    let parsed=[]

    try {
      parsed=JSON.parse(storedData)
    } catch (error) {
      localStorage.setItem('diary',JSON.stringify([]))
      return
    }

    if(!Array.isArray(parsed)){
      setIsDataLoaded(false)
      return
    }

    let maxId=0

    parsed.forEach((item)=>{
      if(Number(item.id)>maxId){
        maxId=item.id
      }
    })
    idRef.current=maxId+1 





    dispatch({
      type: 'INIT',
      data: parsed
    })

    setIsDataLoaded(false)
  }, [])


  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: 'CREATE',
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content
      }
    })
  }

  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: 'UPDATE',
      data: {
        id,
        createdDate,
        emotionId,
        content
      }
    })
  }

  const onDelete = (id) => {
    dispatch({
      type: 'DELETE',
      id
    })
  }

  if (isDataLoaded) return <div>로딩중</div>
  return (
    <div>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{onCreate,onUpdate,onDelete}}>

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/new' element={<New />} />
            <Route path='/edit/:id' element={<Edit />} />
            <Route path='/diary/:id' element={<Diary />} />
            <Route path='*' element={<NotFound />} />

          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </div>
  )
}

export default App
