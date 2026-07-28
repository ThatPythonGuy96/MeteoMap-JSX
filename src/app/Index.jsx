import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'

const Index = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default Index