import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import trashIcon from '../assets/trashIcon.svg';
import img from '../assets/uploadlogo.svg';

const ImageInput = ({ onFileSelect, onError, selectedFiles, setSelectedFiles }) => {
    const [fileError, setFileError] = useState('');

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('UploadLogo'));
        if (savedData && savedData.files) {
            const files = savedData.files.map(fileData => new File([fileData], fileData.name, { type: fileData.type }));
            setSelectedFiles(files);
        } else {
            localStorage.removeItem('UploadLogo');
        }
    }, [setSelectedFiles]);

    const onDrop = (acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024);
        if (validFiles.length !== acceptedFiles.length) {
            setFileError('Some files were too large and not accepted (Max size: 2MB)');
            onError('Some files were too large and not accepted (Max size: 2MB)');
        } else {
            setFileError('');
            onError('');
        }

        if (validFiles.length > 0) {
            const updatedFiles = [...selectedFiles, ...validFiles];
            setSelectedFiles(updatedFiles);
            localStorage.setItem('UploadLogo', JSON.stringify({ files: updatedFiles }));
            onFileSelect(updatedFiles);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
    });

    const handleDelete = (file) => {
        const updatedFiles = selectedFiles.filter(f => f !== file);
        setSelectedFiles(updatedFiles);
        localStorage.setItem('UploadLogo', JSON.stringify({ files: updatedFiles }));
        onFileSelect(updatedFiles);
    };

    return (
        <div>
            <div
                {...getRootProps()}
                className="h-40 w-full border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer mb-4"
            >
                <input {...getInputProps()} />
                <img src={img} alt="Upload Icon" className="h-10 w-10 mb-2" />
                <p className="text-gray-600 font-light">Drag & drop your files here or</p>
                <button className="mt-2 py-1 px-3 border border-gray-300 rounded-md text-sm font-light text-gray-600">
                    Choose files
                </button>
            </div>
            {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleDelete(file)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {fileError && <p className="mt-2 text-xs text-red-500">{fileError}</p>}
        </div>
    );
};

export default ImageInput;
