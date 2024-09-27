import React from "react";
import PetCard from "./PetCard";

function PetList({ xurl,pets,currUser,postFavorites,removeFavorite }) {
    const renderPets = pets.map((pet) => {
        return <PetCard key={pet.id} pet={pet} currUser={currUser} xurl={xurl} postFavorites={postFavorites} removeFavorite={removeFavorite}/>
    })

    return (
        <>
            <ul className="cards">{renderPets}</ul>
        </>
    )
}

export default PetList;