// src/pages/Individual.js
import React, { useState, useEffect } from 'react';
import Footer from '../../../components/Footers/FooterForLoggedIn';
import HeaderForSignup from '../../../components/Headers/HeaderForLoggedIn';
// import IndividualForm from './IndividualForm';
import MultiSectionForm from './Forms/MultiSectionForm';
const Individual = () => {
    const [fullName, setFullName] = useState('');
    useEffect(() => {
        const fullNameFromLocalStorage = localStorage.getItem('registerFormInput');
        if (fullNameFromLocalStorage) {
            const fullNameData = JSON.parse(fullNameFromLocalStorage);
            setFullName(fullNameData.fullName);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#f6f6f6]">
            {/* Header Section */}
            <HeaderForSignup />

            {/* Main Content */}
            <main className="flex-grow">
                <div className="w-[85%] my-10 mx-auto">
                    <h2 className="text-2xl font-medium mb-2 text-[#4B465C]">{`Welcome ${fullName}!`}</h2>
                    <h2 className="mb-4 text-xs font-thin text-gray-600">
                        Start by telling us your company name, contact detail, address and incorporation detail.
                    </h2>
                    <MultiSectionForm />
                </div>
            </main>

            {/* Footer Section */}
            <Footer />
        </div>
    );
};

export default Individual;
