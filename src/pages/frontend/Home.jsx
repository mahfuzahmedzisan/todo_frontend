import React from 'react'
import FrontendLayout from '../../components/layout/frontend/FrontendLayout'
import Button from '../../components/ui/Button'

export default function Home() {


    const handleAlertShow = () => {
        alert('Hello World')
    }


    return (
        <FrontendLayout>
            <div className="flex gap-2">
                <Button variant="primary" onClick={handleAlertShow}>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" outline>Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button link href="https://google.com" target="_blank" rel="noreferrer">Google Link</Button>
                <Button dashed>Dashed</Button>
            </div>
        </FrontendLayout>
    )
}
