"use client";
import Footer from "../components/Footer";
import Header from "../components/Header";
import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import useWindowSize from '@/src/useWindowSize';

export default function Page() {
  const { width, height } = useWindowSize();
  const calculatedHeight = height ? height * 0.95 : '95vh';
  
  return (
    <div style={{background:'white', height:'100vh'}}>
      <div
        id="container"
        style={{ display: "flex", height: `calc(${calculatedHeight}px - 60px)` }}
      >
        <Map />
      </div>
      <Footer currentPage={"spot"} />
    </div>
  );
}