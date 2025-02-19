import { useState, useEffect } from "react";
import { ArtWork } from "../interface/ArtWork.ts";
import ArtworkPreview from "./ArtWorkPreview.tsx";
import styled from "styled-components";

const Container = styled.div`
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
`;

const InputsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
`;

const StyledInput = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 2px solid #aaa;
    border-radius: 8px;
    outline: none;
    transition: all 0.3s ease-in-out;
    
    &:focus { //Source: https://styled-components.com/docs/basics
        border-color: #007BFF;
        box-shadow: 0px 0px 8px rgba(0, 123, 255, 0.6);
    }

    &:hover { //Source: https://styled-components.com/docs/basics
        border-color: #888;
    }
`;

const ArtWorkList = () => {
    const [category, setCategory] = useState("korean");
    const [numArtwork, setNumArtwork] = useState(3);
    const [artworks, setArtworks] = useState<ArtWork[]>([]);
    const [allObjectIDs, setAllObjectIDs] = useState<number[]>([]);

    useEffect(() => {
        async function fetchObjectIDs() {
            try {
                const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${category}`);
                const data = await res.json();

                if (!data.objectIDs || data.objectIDs.length === 0) {
                    setAllObjectIDs([]);
                    setArtworks([]);
                    return;
                }

                setAllObjectIDs(data.objectIDs);
            } catch (error) {
                console.error("Error fetching object IDs:", error);
            }
        }

        fetchObjectIDs();
    }, [category]);

    useEffect(() => {
        async function fetchArtworks() {
            if (allObjectIDs.length === 0) {
                setArtworks([]);
                return;
            }

            const objectIds = allObjectIDs.slice(0, Math.max(1, numArtwork));
            const artworksData: ArtWork[] = [];

            for (const id of objectIds) {
                try {
                    const artRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
                    const artwork = await artRes.json();

                    if (artwork.primaryImageSmall) {
                        artworksData.push(artwork);
                    }
                } catch (error) {
                    console.error(`Error fetching artwork ${id}:`, error);
                }
            }

            setArtworks(artworksData);
        }

        fetchArtworks();
    }, [numArtwork, allObjectIDs]);
    return (
        <Container>
            <h1>The Metropolitan Museum of Art Collection</h1>
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>

            <InputsContainer>
                <StyledInput
                    type="text"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <StyledInput
                    type="number"
                    placeholder="Number of artworks"
                    value={numArtwork}
                    onChange={(e) => setNumArtwork(Number(e.target.value))}
                />
            </InputsContainer>

            {artworks.length > 0 ? (
                artworks.map((artwork) => (
                    <ArtworkPreview key={artwork.objectID} artwork={artwork} />
                ))
            ) : (
                <p>No artworks found for "{category}"</p>
            )}
        </Container>
    );
};

export default ArtWorkList;
