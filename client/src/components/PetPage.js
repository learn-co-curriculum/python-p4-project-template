import React, {useEffect, useState} from "react";
import PetList from "./PetList";
import { NavLink } from "react-router-dom";
import Search from "./Search";


function PetPage({xurl,pets,currUser,postFavorites,removeFavorite}) {
    const [petsSearch,setPetsSearch] = useState(pets)
    const [searchTerm,setSearchTerm] = useState("")

    function onSearchTermChange(term){
        setSearchTerm(term)
    }

    useEffect(()=>{
        setSearchFunction()
    },[pets,searchTerm])

    function setSearchFunction(){
        setPetsSearch(pets.filter((pet)=>{
            return pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || pet.type.toLowerCase().includes(searchTerm.toLowerCase())
        }))
    }
    return (
        <main>
            <Search onSearchTermChange={onSearchTermChange} searchTerm={searchTerm}/>
            <PetList
                pets={petsSearch} currUser={currUser} xurl={xurl} postFavorites={postFavorites} removeFavorite={removeFavorite}/>
        </main>
    )
}

export default PetPage;









