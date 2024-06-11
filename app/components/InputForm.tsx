"use client";
import React, { useState, useEffect, useRef, use } from "react";
import { MakeMarker } from "./MakeMarker";
import Button from "@mui/material/Button";
import { addPost } from "@/src/post";
import { Box, Typography } from "@mui/material";
import { resizeImage } from "@/src/resizeImage";
import Loading from "./Loading";
import useWindowSize from '@/src/useWindowSize';

// place_idなど、必要な情報を追加
type ImageData = {
  name: string;
  lat: number;
  lng: number;
  marker_url_like: File | null;
  marker_url_match: File | null;
  marker_filename_like: string;
  marker_filename_match: string;
  imageUrl: string;
  imageFilename: string;
  address: string;
  webpage: string;
};
type PostObject = {
  placeId: string;
  comment: string | null;
  image: File | null;
  imageFilename: string;
  bluePing: File | null;
  pinkPing: File | null;
};

const initialPostData: PostObject = {
  placeId: "",
  comment: "",
  image: null,
  imageFilename: "",
  bluePing: null,
  pinkPing: null,
};

const InputForm: React.FC = () => {
  const searchBoxRef = useRef<HTMLInputElement | null>(null);
  const fileBoxRef = useRef<HTMLInputElement | null>(null);
  const commentBoxRef = useRef<HTMLTextAreaElement | null>(null);
  const initialImageData: ImageData = {
    name: "",
    lat: 0,
    lng: 0,
    marker_url_like: null,
    marker_url_match: null,
    marker_filename_like: "",
    marker_filename_match: "",
    imageUrl: "",
    imageFilename: "",
    address: "",
    webpage: "",
  };
  const [imageData, setImageData] = useState<ImageData>(initialImageData);
  const [postData, setPostData] = useState<PostObject>(initialPostData);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    window.initMap = function () {
      if (searchBoxRef.current) {
        const searchBox = new google.maps.places.SearchBox(
          searchBoxRef.current
        );
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();
          console.log(
            "place_id: ",
            places[0].place_id,
            "name: ",
            places[0].name,
            "lat: ",
            places[0].geometry!.location.lat(),
            "lng: ",
            places[0].geometry!.location.lng(),
            "address: ",
            places[0].formatted_address,
            "webpage: ",
            places[0].website
          );
          if (places.length > 0 && places[0].place_id) {
            setPostData((preState) => ({
              ...preState,
              placeId: places[0].place_id!,
            }));
          }
        });
      }
    };

    if (
      document.querySelector(
        `script[src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANdk-7xD4KbN6tTR_3TODw0P1BUev42Cg&libraries=places"]`
      )
    ) {
      if (typeof window.initMap === "function") {
        window.initMap();
      }
    }
  }, []);

  useEffect(() => {
    if (postData.bluePing && postData.pinkPing) {
      setLoading(true);
      addPost(
        postData.placeId,
        postData.comment,
        postData.image,
        postData.bluePing,
        postData.pinkPing
      ).then((postSuccess) => {
        setLoading(false);
        setTimeout(() => {
          if (postSuccess) {
            alert("投稿しました");
          } else {
            alert("投稿に失敗しました");
          }
          setPostData({
            image: null,
            imageFilename: "",
            placeId: "",
            comment: "",
            bluePing: null,
            pinkPing: null,
          });
          searchBoxRef.current!.value = "";
          fileBoxRef.current!.value = "";
          commentBoxRef.current!.value = "";
        }, 100);
      });
    }
  }, [postData.bluePing, postData.pinkPing]);

  // ファイルにアップロードした画像からfilename, imageUrlを取得する関数
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      resizeImage(file, 0.75).then(({ resizedFile }) => {
        const filename = file.name.split(".").slice(0, -1).join(".");
        setPostData((preState) => ({
          ...preState,
          image: resizedFile,
          imageFilename: filename,
        }));
      });
    }
  };
  

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    console.log(`Image aspect ratio: ${aspectRatio}`);
  };
  const { width, height } = useWindowSize();
  const calculatedHeight = height ? height * 0.9 : '90vh';
  
  return (
    <Box
      sx={{
        display: "flex",
        // height: "calc(100vh - 60px -55px",
        flexDirection: "colum",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height:`calc(${calculatedHeight}px - 60px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 3,
          bgcolor: "rgba(255, 255, 255, 0.4)",
          borderRadius: "10px",
          // overflow: "auto",
        }}
      >
        <Typography component="h1" variant="h6" >
          投稿場所の情報を入力してください
        </Typography>
        <Box sx={{ px: "10px", py: "20px", maxWidth: "80vw" }}>
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="    Search places..."
            style={{
              width: "100%",
              height: "30px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <input
            ref={fileBoxRef}
            type="file"
            onChange={handleImageChange}
            style={{ borderRadius: "0px", width: "130px" }}
          />
        </Box>
        <Box style={{ display: "flex", justifyContent: "center" }}>

          {postData.image ? (
            <img
              src={URL.createObjectURL(postData.image)}
              onLoad={handleImageLoad}
              style={{
                width: "21vh",
                height: "28vh",
                maxHeight: "100vh",
                maxWidth: "100vw",
                borderRadius: "10px",
                boxShadow: "5px 5px 5px 5px rgba(128, 128, 128, 0.5)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "21vh",
                height: "28vh",
                maxHeight: "100vh",
                maxWidth: "100vw",
                borderRadius: "10px",
                boxShadow: "5px 5px 5px 5px rgba(128, 128, 128, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                color: "gray",
              }}
            >
              No Image
            </Box>
          )}
          {postData.image && (
            <button
              style={{
                height:"40px",
                width:"30px",
                transform: "translate(-50%, -50%)",
                background: "rgba(255, 255, 255, 0.5)",
                border: "none",
                borderRadius: "5px",
                fontSize: "25px",
                cursor: "pointer",
              }}
              onClick={() => {
                setPostData((prevData) => ({
                  ...prevData,
                  image: null,
                }));
              }}
            >
            ×
            </button>
          )}
        </Box>

        <Box
          sx={{
            justifyContent: "center",
            mt: "15px",
            position: "relative",
            bottom: "0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <textarea
            id="comment"
            name="comment"
            ref={commentBoxRef}
            placeholder="   Comment..."
            style={{
              width: "100%",
              lineHeight: "30px",
              borderRadius: "8px",
              marginTop: "10px",
              marginBottom: "20px",
            }}
            rows={2}
            onChange={(event) =>
              setPostData((preState) => ({
                ...preState,
                comment: event.target.value,
              }))
            }
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // 送信ボタンを押したら、MakeMarker関数を呼び出してmarkerを作成
              if (postData.image) {
                if (!postData.placeId) {
                  alert("場所を選択してください");
                  return;
                }
                MakeMarker(
                  URL.createObjectURL(postData.image),
                  postData.imageFilename,
                  "ピン青.jpg"
                )
                  .then(({ marker_url, marker_filename }) => {
                    setPostData((preState) => ({
                      ...preState,
                      bluePing: marker_url,
                    }));
                  })
                  .catch((error) => {
                    console.error(error);
                  });
                MakeMarker(
                  URL.createObjectURL(postData.image),
                  postData.imageFilename,
                  "ピン赤.jpg"
                )
                  .then(({ marker_url, marker_filename }) => {
                    setPostData((preState) => ({
                      ...preState,
                      pinkPing: marker_url,
                    }));
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                alert("画像を選択してください");
              }
            }}
          >
            投稿
          </Button>
        </Box>
      </Box>
      {loading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            pointerEvents: "none",
          }}
        >
          <Loading />
        </div>
      )}
    </Box>
  );
};

export default InputForm;
