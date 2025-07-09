import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from '../Hooks/useDebounce';

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

const GiphyBox = ({ gifSelect, setShowGifPicker }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // add custom debounce for gif search.
    const gifBoxRef = useRef(null)

    const fetchGifs = useCallback(
        (offset) => {
            // Default gif..
            if (!debouncedSearchTerm) {
                return gf.trending({ offset, limit: 10 });
            }
            return gf.search(debouncedSearchTerm, { offset, limit: 10 }); // when search gif...
        },
        [debouncedSearchTerm]
    );

    // Hide gif box when clicked on outside..
    useEffect(() => {
        const handleClickOnOutside = (e) => {
            // console.log(e.target.value);
            
            if (gifBoxRef.current && !gifBoxRef.current.contains(e.target)) {
                setShowGifPicker(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOnOutside);
        return () => document.removeEventListener('pointerdown', handleClickOnOutside);

    }, []);

    return (
        <div className='gif-picker' ref={gifBoxRef} >
            <input
                className='gif-search'
                type="text"
                placeholder="Search GIFs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Grid
                key={debouncedSearchTerm}
                fetchGifs={fetchGifs}
                width={250}
                columns={2}
                gutter={6}
                onGifClick={(gif, e) => {
                    e.preventDefault();
                    gifSelect(gif.images.original.url);
                    setShowGifPicker(false);
                }}
            />
        </div>
    );
};

export default GiphyBox;
