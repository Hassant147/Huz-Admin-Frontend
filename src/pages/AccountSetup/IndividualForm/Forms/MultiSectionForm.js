import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactDetailsForm from './ContactDetailsForm';
import LicenseDetailsForm from './LicenseDetailsForm';
import AddressDetailsForm from './AddressDetailsForm';
import { uploadIndividualDocuments } from '../../../../utility/AuthApis';
import Loader from '../../../../components/loader';

const MultiSectionForm = () => {
    const navigate = useNavigate();
    const [contactName, setContactName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [frontLicense, setFrontLicense] = useState(null);
    const [backLicense, setBackLicense] = useState(null);
    const [streetAddress, setStreetAddress] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [countryRegion, setCountryRegion] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [errors, setErrors] = useState({
        contactName: '',
        contactNumber: '',
        licenseNumber: '',
        streetAddress: '',
        city: '',
        countryRegion: '',
        postalCode: '',
        frontLicense: '',
        backLicense: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validate = () => {
        let valid = true;
        const newErrors = {
            contactName: '',
            contactNumber: '',
            licenseNumber: '',
            streetAddress: '',
            city: '',
            postalCode: '',
            countryRegion: '',
            frontLicense: '',
            backLicense: ''
        };

        // Validation checks
        if (!contactName.trim()) {
            newErrors.contactName = 'Contact name is required';
            valid = false;
        }
        if (!contactNumber.trim()) {
            newErrors.contactNumber = 'Contact number is required';
            valid = false;
        }
        if (!licenseNumber.trim()) {
            newErrors.licenseNumber = 'License number is required';
            valid = false;
        }
        if (!frontLicense) {
            newErrors.frontLicense = 'Front side of the driver’s license is required';
            valid = false;
        }
        if (!backLicense) {
            newErrors.backLicense = 'Back side of the driver’s license is required';
            valid = false;
        }
        if (!streetAddress.trim()) {
            newErrors.streetAddress = 'Street address is required';
            valid = false;
        }
        if (!city.trim()) {
            newErrors.city = 'City is required';
            valid = false;
        }
        if (!countryRegion) {
            newErrors.countryRegion = 'Selecting a country/region is required';
            valid = false;
        }
        if (!postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleContinue = async () => {
        if (validate()) {
            const formData = {
                contactName,
                contactNumber,
                licenseNumber,
                frontLicense,
                backLicense,
                streetAddress,
                addressLine2,
                countryRegion,
                city,
                postalCode
            };

            setIsLoading(true);
            setErrorMessage('');

            try {
                const response = await uploadIndividualDocuments(formData);
                localStorage.setItem('SignedUp-User-Profile', JSON.stringify(response));
                navigate('/review');
            } catch (error) {
                console.error('Error uploading individual documents:', error);
                setErrorMessage('An error occurred while uploading. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row lg:space-x-6 font-sans">
        <div className="flex flex-col space-y-4 lg:w-[78%]">

                <ContactDetailsForm
                    contactName={contactName}
                    setContactName={setContactName}
                    contactNumber={contactNumber}
                    setContactNumber={setContactNumber}
                    errors={errors}
                    setErrors={setErrors}
                />
                <LicenseDetailsForm
                    licenseNumber={licenseNumber}
                    setLicenseNumber={setLicenseNumber}
                    frontLicense={frontLicense}
                    setFrontLicense={setFrontLicense}
                    backLicense={backLicense}
                    setBackLicense={setBackLicense}
                    errors={errors}
                    setErrors={setErrors}
                />
                <AddressDetailsForm
                    streetAddress={streetAddress}
                    setStreetAddress={setStreetAddress}
                    addressLine2={addressLine2}
                    setAddressLine2={setAddressLine2}
                    countryRegion={countryRegion}
                    setCountryRegion={setCountryRegion}
                    city={city}
                    setCity={setCity}
                    postalCode={postalCode}
                    setPostalCode={setPostalCode}
                    errors={errors}
                    setErrors={setErrors}
                />
                <button
                    onClick={handleContinue}
                    className="mt-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00936C] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full flex items-center justify-center"
                    disabled={isLoading}
                >
                    Continue
                {isLoading && <Loader />} {/* Add Loader here */}
                </button>
                {errorMessage && <p className="mt-2 text-xs text-red-500">{errorMessage}</p>}
            </div>
            <div className="mt-4 lg:mt-0 lg:w-1/4 h-1/4 p-4 bg-[#E6F4F0] rounded-lg border border-green-200 shadow-sm">
                <p className="text-xs text-gray-700">
                    Please ensure that the information you provide is accurate and carefully considered.
                    HUZ Solutions will verify the data submitted during registration prior to listing
                    your company on the platform.
                    </p>
            </div>
        </div>

    );
};

export default MultiSectionForm;
