import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import PetPage from "./PetPage";
import NavBar from "./NavBar"
import Profile from "./Profile"

function App() {
  const xurl = "http://localhost:4000"
  const [currUser, setCurrUser] = useState("")
  const [pets, setPets] = useState([])
  const [users, setUsers] = useState([])
  const [adopt, setAdopt] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)

  // useEffect(()=>{
  //   console.log(currUser)
  // },[currUser])

  useEffect(()=>{
    fetch(`${xurl}/authorized`)
    .then(r=>{
      if(r.ok){
        r.json()
        .then(d=>setCurrentUser(d))
      }
    })
  })

  useEffect(() => {
    fetch(`${xurl}/pets`)
      .then(r => r.json())
      .then(setPets)
  }, [])

  useEffect(() => {
    fetch(`${xurl}/users`)
      .then(r => r.json())
      .then(setUsers)
  }, [])

  useEffect(() => {
    fetch(`${xurl}/adoptions`)
      .then(r => r.json())
      .then(setAdopt)
  }, [])

  useEffect(() => {
    fetch(`${xurl}/favorites`)
      .then(r => r.json())
      .then(setFavorites)
  }, [])

  function setLogIn(data) {
    setLoggedIn(data)
  }

  function setCurrentUser(data) {
    setCurrUser(data)
  }

  function postFavorites(data) {
    // if(typeof(data) === "number"){
    //   console.log(data)
    //   const updatedFavorites = favorites.filter(
    //     (favorite) => favorite.id !== data
    //   )
    //   setFavorites(updateFavorites)
    //   const updatedCurrUserFavs = currUser.favorites.filter(
    //     (favorite) => favorite.id !== data
    //   )
    //   setCurrUser({
    //     ...currUser,
    //     favorites:updatedCurrUserFavs,
    //   })
    // }else{
    //   console.log(data)
    //   console.log(favorites)
    //   setFavorites([...favorites,data])
    //   console.log(favorites)
    //   setCurrUser({
    //     ...currUser,
    //     favorites:[
    //       ...currUser.favorites,
    //       data,
    //     ],
    //   })
    //   console.log(currUser)
    //   const updatedPetList = pets.map((pet)=>{
    //     if(pet.id === data.pet_id){
    //       return {...pet,favorites:[...pet.favorites,data]}
    //     }else{
    //       return pet
    //     }
    //   })
    //   setPets(updatedPetList)

    // }
    setFavorites([...favorites, data])
    setCurrUser({
      ...currUser,
      favorites: [
        ...currUser.favorites,
        data,
      ],
    })
    fetch(`${xurl}/pets/${data.pet_id}`)
      .then(r => r.json())
      .then(d => {
        let newPetsList = []
        pets.map((pet) => {
          if (pet.id === d.id) {
            newPetsList.push(d)
          } else {
            newPetsList.push(pet)
          }
        })
        setPets(newPetsList)
      })
  }

  function addUser(data){
    setUsers([...users,data])
  }

function removeFavorite(data){
    setFavorites(favorites.filter((favorite) => favorite.id !== data))
    const updatedCurrUserFavs = currUser.favorites.filter(
      (favorite) => favorite.id !== data
    )
    setCurrUser({
      ...currUser,
      favorites: updatedCurrUserFavs,
  })
}

  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <NavBar currUser={currUser}/>
        <Routes>
          <Route path="/" element={<></>}/>
          <Route path="/pets" element={<PetPage pets={pets} currUser={currUser} xurl={xurl} postFavorites={postFavorites} removeFavorite={removeFavorite}/>}/>
          <Route path="/login" element={<Login users={users} currUser={currUser} loggedIn={loggedIn} setLogIn={setLogIn} setCurrentUser={setCurrentUser} xurl={xurl} addUser={addUser}/>}/>
          <Route path="/profile" element={<Profile currUser={currUser} setCurrentUser={setCurrentUser} xurl={xurl} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

}
export default App;