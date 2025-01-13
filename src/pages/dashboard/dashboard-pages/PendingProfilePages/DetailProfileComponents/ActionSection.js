import React, { useState, useEffect } from 'react';
import { fetchSalesDirectors, updateCompanyStatus } from '../../../../../utility/Super-Admin-Api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const ActionSection = ({ company, onSubmit }) => {
    const [action, setAction] = useState('');
    const [saleDirector, setSaleDirector] = useState('');
    const [directors, setDirectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for handling submission
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        const fetchData = async () => {
            const { status, data, error } = await fetchSalesDirectors();
            if (status === 200) {
                setDirectors(data);
            } else {
                toast.error(error || "Failed to fetch sales directors.");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleActionChange = (event) => {
        setAction(event.target.value);
    };

    const handleSaleDirectorChange = (event) => {
        setSaleDirector(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (action && company) {
            setIsSubmitting(true); // Show loader
            const { status, message, error } = await updateCompanyStatus(
                company.partner_session_token,
                action === 'accept' ? 'Active' : 'Rejected',
                saleDirector // Send the selected sale director's session token
            );
            setIsSubmitting(false); // Hide loader
            if (status === 200) {
                toast.success(message);
                onSubmit({ action, saleDirector });
                navigate(-1); // Navigate back to the previous page
            } else {
                toast.error(error || "Failed to update company status.");
            }
        } else {
            toast.error("Please select an action.");
        }
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Your Action</h2>
            <form onSubmit={handleSubmit}>
                <p className="text-sm md:text-base text-gray-600 mb-4">Which kind of option do you want to choose?</p>
                <div className="mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6">
                        <label className="inline-flex items-center mb-2 sm:mb-0">
                            <input
                                type="radio"
                                value="accept"
                                checked={action === 'accept'}
                                onChange={handleActionChange}
                                className="form-radio text-[#00936C]"
                            />
                            <span className="ml-2 text-gray-700">Accept & In-Progress</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="reject"
                                checked={action === 'reject'}
                                onChange={handleActionChange}
                                className="form-radio text-[#00936C]"
                            />
                            <span className="ml-2 text-gray-700">Reject this booking</span>
                        </label>
                    </div>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-2">Do you want to assign this company to any sale director or agent?</p>
                <select
                    value={saleDirector}
                    onChange={handleSaleDirectorChange}
                    className="w-full p-2 md:p3 border border-gray-300 rounded-md mb-4 md:mb-6"
                    disabled={loading}
                >
                    <option value="">Select Sale Director</option>
                    {directors.map((director) => (
                        <option key={director.session_token} value={director.session_token}>
                            {director.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-[#00936C] text-white px-4 py-2 md:px-6 md:py-3 rounded-md w-full hover:bg-[#007a57] transition duration-300 flex items-center justify-center"
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? <div className="spinner"></div> : 'Submit your decision'}
                </button>
            </form>
        </div>
    );
};

export default ActionSection;
