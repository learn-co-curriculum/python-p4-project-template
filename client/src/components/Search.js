import React from "react"

function Search({searchTerm,onSearchTermChange}){
    function handleSearchChange(e){
        onSearchTermChange(e.target.value)
    }
    return(
        <div>
            <label>Search:</label>
            <input value={searchTerm} onChange={handleSearchChange}></input>
        </div>
    )
}

export default Search;