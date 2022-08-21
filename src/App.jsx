import { useCallback, useMemo, useState } from 'react'
export default function App() {

  const [count, setCount] = useState(9)
  const [counting, setCounting] = useState(false)

  const incrementDelayByFunc = () => {
    setCounting(true)
    setTimeout(() => {
      setCount((count) => count + 1)
      setCounting(false)
    }, 2000)
  }

  const incrementDelay = () => {
    setCounting(true)
    setTimeout(() => {
      setCount(count + 1)
      setCounting(false)
    }, 2000)
  }

  const increment = () => {
    setCount((count) => count + 1)
  }

  const countingStyle = useMemo(() => {
    return {
      background: counting ? '#333' : null
    }
  }, [counting])

  const countingLabel = useCallback((label) => {
    return counting ? '正在更新count...' : (label || '延迟2秒count自增1(by value)')
  }, [counting])
  
  return (
    <>
      <h1>count: {count}</h1>
      <button onClick={increment}>count自增1</button>
      <button style={countingStyle} disabled={counting} onClick={incrementDelay}>{countingLabel()}</button>
      <button style={countingStyle} disabled={counting} onClick={incrementDelayByFunc}>{countingLabel('延迟2秒count自增1(by function)')}</button>
    </>
  )
}