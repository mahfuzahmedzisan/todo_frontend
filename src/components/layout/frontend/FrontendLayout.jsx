import React, { useRef, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar';

export default function FrontendLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <>
            <div className={`h-screen flex flex-col`}>
                <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <main className={`flex-1`}>
                    {children}
                </main>
                <Footer />
            </div>
        </>
    )
}
