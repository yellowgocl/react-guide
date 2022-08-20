import { useState, useMemo } from 'react'

export default function Feature() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('wait for query api to get message')
    const queryApi = () => {
        return new Promise((resolve,) => {
            setTimeout(() => resolve({ message: 'query api success!' }), 1000)
        })
    }
    
    const onClick = async() => {
        setIsLoading(true)
        const { message } = await queryApi()
        setMessage(message)
        setIsLoading(false)
    }

    const styles = useMemo(() => {
        return {
            color: isLoading ? '#a1a1a1' : 'black'
        }
    }, [isLoading])

    const Loading = useMemo(() => {
        return isLoading && <span>loading...</span>
    }, [isLoading])

    return (<>
        <h2>{message}</h2>
        <button style={styles} disabled={isLoading} onClick={onClick}>{Loading}query api</button>
    </>)
}