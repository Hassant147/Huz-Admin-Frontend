import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = ({ onSearch }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            onSearch(date);
        }
    };

    return (
        <div className="mb-6">
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                Select Date:
            </label>
            <div className="flex items-center">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    className="border border-gray-300 rounded px-3 py-2"
                    calendarClassName="custom-calendar" // Custom class for calendar styling
                />
            </div>
        </div>
    );
};

export default SearchBar;
