import React, { createContext, useContext, useState } from 'react';

const FormDataContext = createContext();

export const useFormDataThreshold = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
    const [globalThreshold, setFormDataThreshold] = useState({});

    const updateFormDataThreshold = (data) => {
        console.log("updateFormDataThreshold", data);
        setFormDataThreshold(data);
    };

    return (
        <FormDataContext.Provider value={{ globalThreshold, updateFormDataThreshold }}>
            {children}
        </FormDataContext.Provider>
    );
};