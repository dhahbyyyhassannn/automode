import { useState, useEffect, useCallback } from 'react';
import { searchCar, getRandomCars } from '../api/carAPI';
import SearchCar from './SearchCar';
import RandomCars from './RandomCars';
import SearchResults from './SearchResults';
import layoutStyle from './layoutStyle.module.css';

export default function CarBrowser() {
    const [cars, setCars] = useState([]);
    const [mode, setMode] = useState('random');
    
    const loadRandomCars = useCallback(async () => {
        try {
            const response = await getRandomCars();
            setCars(response.data);
            setMode('random');
        } catch (error) {
            console.error("Random cars error", error);
        }
    }, []);

    const handleSearch = useCallback(async (keyword) => {
        if (keyword.trim() === "") {
            loadRandomCars();
            return;
        }

        try {
            const response = await searchCar(keyword);
            setCars(response.data);
            setMode('search');
        } catch (error) {
            console.error("Search error", error);
        }
    }, [loadRandomCars]);

    useEffect(() => {
        loadRandomCars();
    }, [loadRandomCars]);
    return (
        <div className={layoutStyle.homeContainer}>
            
            <h1>AutoMode</h1>
            <div className={layoutStyle.searchContainer}>
                <SearchCar onSearch={handleSearch} />
            </div>

            <div>
                {mode === 'random' ? (
                    <RandomCars cars={cars} />
                ) : (
                    <SearchResults cars={cars} />
                )}
            </div>
            
        </div>
    );
}
