import { styled } from "styled-components";
import { ArtWork } from "../interface/ArtWork.ts";

const ArtWorkPreviewDiv = styled.div`
    margin: 20px auto;
    width: 80%;
    max-width: 600px;
    text-align: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ArtworkImage = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin-top: 10px;
`;

const ArtworkPreview = ({ artwork }: { artwork: ArtWork }) => {
    return (
        <ArtWorkPreviewDiv>
            <h2>{artwork.title}</h2>
            {artwork.primaryImageSmall ? (
                <ArtworkImage src={artwork.primaryImageSmall} alt={`Image of ${artwork.title}`} />
            ) : (
                <p style={{ color: "gray" }}>No Image Available</p>
            )}
            <p><strong>Accession Number:</strong> {artwork.accessionNumber}</p>
            <p><strong>Year:</strong> {artwork.accessionYear}</p>
        </ArtWorkPreviewDiv>
    );
};

export default ArtworkPreview;
