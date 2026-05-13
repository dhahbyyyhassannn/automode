import { useState, useEffect } from 'react';
import { searchCar, getRandomCars } from '../api/carAPI';
import SearchCar from './SearchCar';
import RandomCars from './RandomCars';
import SearchResults from './SearchResults';
import layoutStyle from './layoutStyle.module.css';

export default function CarBrowser() {
    const [cars, setCars] = useState([]);
    const [mode, setMode] = useState('random'); 
    useEffect(() => {
        loadRandomCars();
    }, []);
    const loadRandomCars = async () => {
        try {
            const response = await getRandomCars();
            setCars(response.data);
            setMode('random');
        } catch (error) {
            console.error("Erreur random", error);
        }
    };
    const handleSearch = async (keyword) => {
        if (keyword.trim() === "") {
            loadRandomCars();
            return;
        }

        try {
            const response = await searchCar(keyword);
            setCars(response.data);
            setMode('search');
        } catch (error) {
            console.error("Erreur recherche", error);
        }
    };
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
