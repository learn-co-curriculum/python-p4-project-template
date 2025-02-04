import CategorySelector from '@/components/category'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/seachbar'
import Details from '@/components/details'
import React from 'react'
import Omg from '@/components/omg'
import IslandsSection from '@/components/Islands'
import Footer from '@/components/footer'



export default function () {
  return (
    <div>
      <Navbar />
      <SearchBar />
      <CategorySelector />
     
      <Omg /> 
      <Details />
      <IslandsSection />
      <Footer />
      
      

    </div>
  )
}
