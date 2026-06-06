import { useState, useEffect } from 'react';
import { Search } from "react-bootstrap-icons";
import layoutStyle from "./layoutStyle.module.css";

export default function SearchBar({ onSearch }) {
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (keyword.trim() !== "") {
                onSearch(keyword);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    return (
        <div className={layoutStyle.searchBar}>
            <button className={layoutStyle.btn} type="button">
                <Search />
            </button>
            <input
                className={layoutStyle.input}
                type="text"
                placeholder="Search brand or model..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
}