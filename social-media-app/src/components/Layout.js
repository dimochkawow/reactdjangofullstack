import { createContext, useMemo, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import Toaster from './Toaster'

export const Context = createContext('unknown')

function Layout({ children, hasNavigationBack }) {
    const navigate = useNavigate()
    const [toaster, setToaster] = useState({
        title: '',
        show: false,
        message: '',
        type: '',
    })
    const value = useMemo(() => ({ toaster, setToaster }), [toaster])

    return (
        <Context.Provider value={value}>
            <div>
                <NavigationBar />
                {hasNavigationBack && (
                    <ArrowLeftOutlined
                        style={{
                            color: '#0D6EFD',
                            fontSize: '24px',
                            marginLeft: '5%',
                            marginTop: '1%',
                        }}
                        onClick={() => navigate(-1)}
                    />
                )}
                <div className='container m-5'>{children}</div>
            </div>
            <Toaster
                title={toaster.title}
                message={toaster.message}
                type={toaster.type}
                showToast={toaster.show}
                onClose={() => setToaster({ ...toaster, show: false })}
            />
        </Context.Provider>
    )
}

export default Layout
