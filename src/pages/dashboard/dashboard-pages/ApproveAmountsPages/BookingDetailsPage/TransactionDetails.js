import React from "react";

const TransactionDetails = ({ booking }) => {
    const { payment_detail } = booking;
    const { REACT_APP_API_BASE_URL } = process.env;

    if (!payment_detail || payment_detail.length === 0) {
        return <div>No transaction details available.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">Transaction Details</h2>
            <div className="space-y-4">
                {payment_detail.map((payment, index) => (
                    <div key={index} className="border-b pb-4">
                        <p className="text-sm text-gray-500 mb-2">
                            <strong>Transaction Time:</strong>{" "}
                            {new Date(payment.transaction_time).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            <strong>Transaction Amount:</strong> PKR {payment.transaction_amount}
                        </p>
                        {payment.transaction_number && (
                            <p className="text-sm text-gray-500 mb-2">
                                <strong>Transaction Number:</strong> {payment.transaction_number}
                            </p>
                        )}
                        {payment.transaction_photo && (
                            <div className="mt-4">
                                <strong className="text-gray-600">Transaction Photo:</strong>
                                <img
                                    src={`${REACT_APP_API_BASE_URL}${payment.transaction_photo}`}
                                    alt="Transaction"
                                    className="mt-2 max-w-xs rounded-md shadow-md"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionDetails;
