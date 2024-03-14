import { createContext, useContext, useState } from "react"

const initialState = {
    cityNumber: "1",
    setCityNumber: () => null,
    city1: {
        cityName: "",
        customId: "",
        isResolved: false,
        current: {},
        location: {}
    },
    setCity1: () => null,
    city2: {
        cityName: "",
        customId: "",
        isResolved: false,
        current: {},
        location: {}
    },
    setCity2: () => null,
    city3: {
        cityName: "",
        customId: "",
        isResolved: false,
        current: {},
        location: {}
    },
    setCity3: () => null,
    city4: {
        cityName: "",
        customId: "",
        isResolved: false,
        current: {},
        location: {}
    },
    setCity4: () => null
}

const CityProviderContext = createContext(initialState)

export const CityProvider = CityProviderContext.Provider;

export const useCity = () => {
    const context = useContext(CityProviderContext);
    if(!context) {
        throw new Error("useCity must be used within a CityProvider")
    }
    return context;
}