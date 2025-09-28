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
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}
