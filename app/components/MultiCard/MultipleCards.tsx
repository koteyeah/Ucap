"use client";

import React, { useState, useRef, useEffect, createRef } from "react";
import TinderCard from "react-tinder-card";
import "./MultipleCards.css";
import UrlList10 from "../UrlList";
import { Box, Modal } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReplayIcon from "@mui/icons-material/Replay";
import Feedback from "../SwipeFeedBack";
import "../../font.css";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const SimpleZoom1 = dynamic(() => import("../PoP_study_modal"), { ssr: false });

export default function MultipleCards() {
  const router = useRouter();
  const [db, setDb] = useState<
    { name: string; placeName: string; url: string; like: boolean; comment: string; address: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const currentIndexRef = useRef(currentIndex);
  const [childRefs, setChildRefs] = useState<React.RefObject<any>[]>([]);
  const [isMatch, setIsMatch] = useState<boolean>(false);
  const [matchIndex, setMatchIndex] = useState<number | null>(null);
  const cardRef = useRef(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [openModal, setOpenModal] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      const { offsetWidth, offsetHeight } = cardRef.current;
      setCardSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [cardRef.current]);

  const createChildRefs = (length: number) => {
    return Array(length)
      .fill(0)
      .map(() => createRef<any>());
  };

  const fetchData = async () => {
    setDb([]);
    setChildRefs([]);

    const data = await UrlList10();
    setDb(data);
    setCurrentIndex(data.length - 1);
    setChildRefs(createChildRefs(data.length));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setChildRefs(createChildRefs(db.length));
  }, [db]);

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = async (
    direction: string,
    nameToDelete: string,
    index: number,
    place: string,
    like: boolean
  ) => {
    setLastDirection(direction);
    console.log({ direction }, "swiped", { currentIndex });
    const result = await Feedback(place, direction, like);
    console.log("like?", like);
    console.log("result", result);
    setIsMatch(result ?? false);
    setMatchIndex(index);
    updateCurrentIndex(index - 1);

    if (result==false&&currentIndex == 1) {
      console.log("U watch all cards");
      fetchData();
    }
    setOpenModal(false);
  };

  const swipe = async (place: string, dir: string, like: boolean) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = () => {
    console.log(db[currentIndex]?.comment);
    setOpenModal(true);
  };

  const handleToggleHeight = (action: 'add' | 'remove') => {
    const element = document.getElementById("card") as HTMLDivElement;
    console.log('element', element)
    if (element) {
      if(action === 'add') {
        element.classList.add('max-h-0');
      } else {
        element.classList.remove('max-h-0');
      }
    }
  };
  useEffect(() => {
    if (isMatch) {
      handleToggleHeight('add')
      setPopup(true);
    } else {
      handleToggleHeight('remove')
      setPopup(false);
      if (currentIndex == 0) {
        console.log("U watch all cards");
        fetchData();
      }
    }
  }, [isMatch]);

  return (
    <div>
      {popup && matchIndex &&
        <SimpleZoom1
          isMatch={isMatch}
          setIsMatch={setIsMatch}
          image_url={db[matchIndex].url}
          setMatchIndex={setMatchIndex}
          image_name={db[matchIndex].placeName}
        />}
      <div className="cardBack" id="card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="cardContainer">
          {db.map((character, index) => (
            <TinderCard
              key={index}
              ref={childRefs[index]}
              preventSwipe={["up", "down"]}
              className="swipe"
              onSwipe={(dir) =>
                swiped(
                  dir,
                  character.name,
                  index,
                  db[currentIndex]?.name,
                  db[currentIndex]?.like,
                )
              }
            >

              <div
                ref={currentIndex === index ? cardRef : null}
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card z-index:0"
              >
                <button onClick={handleOpenModal} onTouchStart={handleOpenModal}


                  className="font-bold text-3xl text-white z-index:10"
                  style={{
                    backgroundColor: 'transparent',
                    position: "absolute",
                    left: "3%",
                    top: "2%",
                    fontFamily: "KosugiMaru-Regular, sans-serif",
                  }}
                >

                  {character.placeName}
                </button>

                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  onTouchStart={handleCloseModal}
                  BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '10px', zIndex: "20" } }}
                  container={() => cardRef.current}
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1300,
                    width: cardSize.width,
                    height: cardSize.height,
                    top: 0,
                    left: 0,
                  }}
                >
                  <Box className='font-bold text-xl text-white p-10'
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '10%',
                      fontFamily: "KosugiMaru-Regular, sans-serif",
                      border: 'none',
                    }}
                  >
                    <h1> {currentIndex !== null && db[currentIndex]?.address}</h1>
                    <p> クチコミ: {currentIndex !== null && db[currentIndex]?.comment}</p>
                  </Box>
                </Modal>
              </div>
            </TinderCard>
          ))}
        </div>
        <Box
          className="mx-auto max-w-md flex flex-row justify-around items-center"
          sx={{ position: "relative", top: "60%" }}
        >
          <button className="p-4 rounded-full bg-slate-200 transition-all transform hover:bg-slate-300 hover:scale-110">
            <ThumbDownIcon
              style={{ color: "lightcoral", fontSize: "40px" }}
              onClick={() =>
                swipe(db[currentIndex]?.name, "left", db[currentIndex]?.like)
              }
            />
          </button>
          <button className="p-1 rounded-full bg-slate-200 transition-all transform hover:bg-slate-300 hover:scale-110">
            <ReplayIcon
              style={{ color: "skyblue", fontSize: "40px" }}
              onClick={goBack}
            />
          </button>
          <button className="p-4 rounded-full bg-slate-200 transition-all transform hover:bg-slate-300 hover:scale-110">
            <ThumbUpIcon
              style={{ color: "lightgreen", fontSize: "40px" }}
              onClick={() =>
                swipe(db[currentIndex]?.name, "right", db[currentIndex]?.like)
              }
            />
          </button>
        </Box>
      </div>
    </div>
  );
}