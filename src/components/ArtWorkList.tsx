import useSWR from "swr"; // Source: https://swr.vercel.app/docs/getting-started
import { useState } from "react";
import { ArtWork } from "../interface/ArtWork.ts";
import ArtworkPreview from "./ArtWorkPreview.tsx";
import styled from "styled-components";

// Styled Components
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

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ArtWorkList = () => {
    const [category, setCategory] = useState("korean");
    const [numArtwork, setNumArtwork] = useState(3);

    const { data: objectData, error: objectError } = useSWR<{ objectIDs?: number[] } >
    (
        category ? `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${category}` : null,
        fetcher
    );

    const objectIDs: number[] = objectData?.objectIDs || [];
    const fetchValidArtworks = async (urls: string[]): Promise<ArtWork[]> => {
        try {
            const fetchedArtworks = await Promise.all(urls.map(url => fetcher(url)));
            const validArtworks = fetchedArtworks.filter(artwork => artwork.primaryImageSmall);

            return validArtworks.slice(0, numArtwork);
        } catch (error) {
            console.error("Error fetching artworks:", error);
            return [];
        }
    };

    const { data: artworksData, error: artworkError } = useSWR<ArtWork[]>
    (
        objectIDs.length > 0 ?
            objectIDs.slice(0, numArtwork * 2).map(id => `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            : null,
        fetchValidArtworks
    );

    if (objectError) return <p>Error fetching artwork IDs</p>;
    if (artworkError) return <p>Error fetching artwork details</p>;

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

            {artworksData?.length ? (artworksData.map((artwork) =>
                    (
                        <ArtworkPreview key={artwork.objectID} artwork={artwork} />
                    )
                )
            ) : (
                    <p>No artworks found for "{category}"</p>
                )
            }
        </Container>
    );
};

export default ArtWorkList;
