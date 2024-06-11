'use client'
import React, { useState } from 'react';
import InputForm from '../components/InputForm';
import Footer from "../components/Footer";
import Header from "../components/Header";
const App: React.FC = () => {
  return (
    <div>
      <Header />
      <div id='container'>
          <InputForm/>
      </div>
      <Footer currentPage={"post"} />
    </div>
  );
};

export default App;