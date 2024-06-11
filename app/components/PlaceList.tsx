'use client'

import { useEffect, useState, useRef } from 'react';
import MarkerOverLay from './MarkerOverLay';
import { Box, ThemeProvider, createTheme, Typography, Grid, Link, Switch } from '@mui/material';
import { createRoot } from 'react-dom/client';
import Drawer from './Drawer';
import ImageDialog from './ImageDialog';
import { grey } from '@mui/material/colors';
import { useMediaQuery } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getLikePlace, getMatchPlace } from "@/src/Place";
import { auth } from "@/src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { id2Ping } from "@/src/url2Photo";
import Loading from './Loading';

declare global {
  interface Window {
    initMap: () => void;
  }
}

type LocationData = {
  name: string;
  lat: number;
  lng: number;
  url: string;
  marker_url: string;
  comment: string;
  address: string;
  webpage: string;
};

interface SearchMapProps {
  map: google.maps.Map;
  isDrawerOpen: boolean;
  toggleDrawer: (isDrawerOpen?: boolean) => void;
}

const sampleLikePlaceDatas: LocationData[] = [
  { name: '鴨川', lat: 34.9804985, lng: 135.7671783, address: '日本、京都府京都市 鴨川', webpage: 'https://ja.wikipedia.org/wiki/%E9%B4%A8%E5%B7%9D_(%E4%BA%AC%E9%83%BD%E5%B8%82)', url: '/sample画像/鴨川.jpg', marker_url: '/sampleマーカー/鴨川_marker.jpg', comment: '鴨川は、京都府京都市を流れる、桂川の支流である。' },
  { name: '清水寺', lat: 34.9946662, lng: 135.784661, address: '日本、〒605-0862 京都府京都市東山区清水1-294', webpage: 'https://ja.wikipedia.org/wiki/%E6%B8%85%E6%B0%B4%E5%AF%BA', url: '/sample画像/清水寺.jpg', marker_url: '/sampleマーカー/清水寺_marker.jpg', comment: '清水寺（きよみずでら）は、京都府京都市東山区清水にある、臨済宗相国寺派の寺院。' },
  { name: '伏見稲荷大社', lat: 34.96769449999999, lng: 135.7791876, address: '日本、〒612-0882 京都府京都市伏見区深草藤ノ木町68', webpage: 'https://ja.wikipedia.org/wiki/%E4%BC%8F%E8%A6%8B%E7%A8%B2%E8%8D%B7%E5%A4%A7%E7%A4%BE', url: '/sample画像/京都伏見稲荷神社.jpg', marker_url: '/sampleマーカー/京都伏見稲荷神社_marker.jpg', comment: '伏見稲荷大社（ふしみいなりたいしゃ）は、京都府京都市伏見区にある神社。' },
  { name: '嵐山竹林の小径', lat: 35.0168187, lng: 135.6713013, address: '日本、〒616-8392 京都府京都市右京区嵐山町', webpage: 'https://ja.wikipedia.org/wiki/%E7%AB%B9%E6%9E%97%E3%81%AE%E5%B0%8F%E5%BE%84', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '嵐山（あらしやま）は、京都府京都市右京区にある地域。' },
  { name: '京都御所', lat: 35.025475, lng: 135.762836, address: '日本、〒602-0881 京都府京都市上京区京都御苑', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%BE%A1%E6%89%80', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都御所（きょうとごしょ）は、京都府京都市上京区にある日本の皇居の一つ。' },
  { name: '平等院鳳凰堂', lat: 34.889444, lng: 135.8075, address: '日本、〒610-1101 京都府乙訓郡大山崎町大山崎', webpage: 'https://ja.wikipedia.org/wiki/%E5%B9%B3%E7%AD%89%E9%99%A2%E9%B3%B3%E5%87%B0%E5%A0%82', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '平等院鳳凰堂（びょうどういんほうおうどう）は、京都府乙訓郡大山崎町大山崎にある真言宗醍醐派の寺院。' },
  { name: '金閣寺', lat: 35.039444, lng: 135.729444, address: '日本、〒603-8361 京都府京都市北区金閣寺町1', webpage: 'https://ja.wikipedia.org/wiki/%E9%87%91%E9%96%A3%E5%AF%BA', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '金閣寺（きんかくじ）は、京都府京都市北区にある臨済宗相国寺派の寺院。' },
  { name: '二条城', lat: 35.030278, lng: 135.748611, address: '日本、〒604-0912 京都府京都市中京区二条城町541', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%8C%E6%9D%A1%E5%9F%8E', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '二条城（にじょうじょう）は、京都府京都市中京区二条城町にある日本の城。' },
  { name: '京都タワー', lat: 34.9875, lng: 135.759167, address: '日本、〒600-8216 京都府京都市下京区烏丸通七条下ル東塩小路町721-1', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E3%82%BF%E3%83%AF%E3%83%BC', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都タワー（きょうとタワー）は、京都府京都市下京区烏丸通七条下ル東塩小路町にある電波塔。' },
  { name: '京都駅', lat: 34.985849, lng: 135.758767, address: '日本、〒600-8216 京都府京都市下京区烏丸通塩小路下ル東塩小路町', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E9%A7%85', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都駅（きょうとえき）は、京都府京都市下京区烏丸通塩小路下ル東塩小路町にある、西日本旅客鉄道（JR西日本）の駅。' },
  { name: '京都国立博物館', lat: 35.025475, lng: 135.781543, address: '日本、〒606-8344 京都府京都市左京区岡崎円勝寺町527', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%9B%BD%E7%AB%8B%E5%8D%9A%E7%89%A9%E9%A4%A8', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都国立博物館（きょうとこくりつはくぶつかん）は、京都府京都市東山区にある日本の国立博物館。' },
  { name: '八坂神社', lat: 35.003611, lng: 135.778611, address: '日本、〒605-0073 京都府京都市東山区祇園町東大路', webpage: 'https://ja.wikipedia.org/wiki/%E5%85%AB%E5%9D%82%E7%A5%9E%E7%A4%BE', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '八坂神社（やさかじんじゃ）は、京都府京都市東山区祇園町東大路にある神社。' },
  { name: '京都水族館', lat: 35.011389, lng: 135.768611, address: '日本、〒605-0035 京都府京都市東山区下河原町35番地', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E6%B0%B4%E6%97%8F%E9%A4%A8', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都水族館（きょうとすいぞくかん）は、京都府京都市東山区にある水族館。' },
];

const sampleMatchPlaceDatas: LocationData[] = [
  { name: '鴨川', lat: 34.9804985, lng: 135.7671783, address: '日本、京都府京都市 鴨川', webpage: 'https://ja.wikipedia.org/wiki/%E9%B4%A8%E5%B7%9D_(%E4%BA%AC%E9%83%BD%E5%B8%82)', url: '/sample画像/鴨川.jpg', marker_url: '/sampleマーカー/鴨川_marker_match.jpg', comment: '鴨川は、京都府京都市を流れる、桂川の支流である。' },
  { name: '清水寺', lat: 34.9946662, lng: 135.784661, address: '日本、〒605-0862 京都府京都市東山区清水1-294', webpage: 'https://ja.wikipedia.org/wiki/%E6%B8%85%E6%B0%B4%E5%AF%BA', url: '/sample画像/清水寺.jpg', marker_url: '/sampleマーカー/清水寺_marker_match.jpg', comment: '清水寺（きよみずでら）は、京都府京都市東山区清水にある、臨済宗相国寺派の寺院。' },
  { name: '伏見稲荷大社', lat: 34.96769449999999, lng: 135.7791876, address: '日本、〒612-0882 京都府京都市伏見区深草藤ノ木町68', webpage: 'https://ja.wikipedia.org/wiki/%E4%BC%8F%E8%A6%8B%E7%A8%B2%E8%8D%B7%E5%A4%A7%E7%A4%BE', url: '/sample画像/京都伏見稲荷神社.jpg', marker_url: '/sampleマーカー/清水寺_marker_match.jpg', comment: '伏見稲荷大社（ふしみいなりたいしゃ）は、京都府京都市伏見区にある神社。' },
  // {name: '京都御所', lat: 35.025475, lng: 135.762836, address: '日本、〒602-0881 京都府京都市上京区京都御苑', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%BE%A1%E6%89%80', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都御所（きょうとごしょ）は、京都府京都市上京区にある日本の皇居の一つ。'},
  // {name: '金閣寺', lat: 35.039444, lng: 135.729444, address: '日本、〒603-8361 京都府京都市北区金閣寺町1', webpage: 'https://ja.wikipedia.org/wiki/%E9%87%91%E9%96%A3%E5%AF%BA', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '金閣寺（きんかくじ）は、京都府京都市北区にある臨済宗相国寺派の寺院。'},
  // {name: '京都タワー', lat: 34.9875, lng: 135.759167, address: '日本、〒600-8216 京都府京都市下京区烏丸通七条下ル東塩小路町721-1', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E3%82%BF%E3%83%AF%E3%83%BC', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都タワー（きょうとタワー）は、京都府京都市下京区烏丸通七条下ル東塩小路町にある電波塔。'},
  // {name: '京都国立博物館', lat: 35.025475, lng: 135.781543, address: '日本、〒606-8344 京都府京都市左京区岡崎円勝寺町527', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E5%9B%BD%E7%AB%8B%E5%8D%9A%E7%89%A9%E9%A4%A8', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都国立博物館（きょうとこくりつはくぶつかん）は、京都府京都市東山区にある日本の国立博物館。'},
  // {name: '京都水族館', lat: 35.011389, lng: 135.768611, address: '日本、〒605-0035 京都府京都市東山区下河原町35番地', webpage: 'https://ja.wikipedia.org/wiki/%E4%BA%AC%E9%83%BD%E6%B0%B4%E6%97%8F%E9%A4%A8', url: '/sample画像/嵐山_竹林.jpg', marker_url: '/sampleマーカー/嵐山_竹林_marker.jpg', comment: '京都水族館（きょうとすいぞくかん）は、京都府京都市東山区にある水族館。'},
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function PlaceList({ map, isDrawerOpen, toggleDrawer }: SearchMapProps) {
  const markerOverLayRef = useRef<MarkerOverLay[]>([]);
  const highlightedIndexRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const isAspectRatioHigh = useMediaQuery('(min-aspect-ratio: 3/5)');
  const [dataSource, setDataSource] = useState<'like' | 'match'>('like');
  const [likeDataSource, setLikeDataSource] = useState(false);
  const [likePlaceDatas, setLikePlaceDatas] = useState<DocumentData[] | null>(null);
  const [matchPlaceDatas, setMatchPlaceDatas] = useState<DocumentData[] | null>(null);
  const [likeLocationDatas, setLikeLocationDatas] = useState<LocationData[] | null>(null);
  const [matchLocationDatas, setMatchLocationDatas] = useState<LocationData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const likeDocsData = await getLikePlace();
          setLikePlaceDatas(likeDocsData || null);
          const matchDocsData = await getMatchPlace();
          setMatchPlaceDatas(matchDocsData || null);
        } catch (error) {
          console.log(error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (likePlaceDatas) {
        const locationDatas: LocationData[] = [];
        for (const data of likePlaceDatas) {
          const markerUrl = await id2Ping(data.id, "blue");
          const locationData: LocationData = {
            name: data.name,
            lat: data.lat,
            lng: data.lng,
            url: data.imgUrl,
            marker_url: markerUrl,
            comment: data.overview,
            address: data.address,
            webpage: data.website,
          };
          locationDatas.push(locationData);
        }
        setLikeLocationDatas(locationDatas);
      }
    };
    fetchData();
  }, [likePlaceDatas]);

  useEffect(() => {
    const fetchData = async () => {
      if (matchPlaceDatas) {
        const locationDatas: LocationData[] = [];
        for (const data of matchPlaceDatas) {
          const markerUrl = await id2Ping(data.id, "pink");
          const locationData: LocationData = {
            name: data.name,
            lat: data.lat,
            lng: data.lng,
            url: data.imgUrl,
            marker_url: markerUrl,
            comment: data.overview,
            address: data.address,
            webpage: data.website,
          };
          locationDatas.push(locationData);
        }
        setMatchLocationDatas(locationDatas);
      }
    };
    fetchData();
  }, [matchPlaceDatas]);

  useEffect(() => {
    if (map && likeLocationDatas && matchLocationDatas) {
      setLoading(false);
      markerOverLayRef.current.forEach(overlay => overlay.setMap(null));
      markerOverLayRef.current = [];
      const placesList = document.getElementById("places") as HTMLUListElement;
      if (placesList) {
        while (placesList.firstChild) {
          placesList.removeChild(placesList.firstChild);
        }
      }
      let newOverlays: MarkerOverLay[] = [];
      const activeLocationDatas = dataSource === 'match' ? matchLocationDatas : likeLocationDatas;
      // const activeLocationDatas = dataSource === 'match' ? sampleMatchLocationDatas : sampleLikePlaceDatas;
      if (activeLocationDatas.length === 0 && dataSource === 'like') {
        const li = document.createElement("li");
        li.style.padding = '5vh';
        li.textContent = 'お気に入りのスポットがありません';
        placesList.appendChild(li);
      } else if (activeLocationDatas.length === 0 && dataSource === 'match') {
        const li = document.createElement("li");
        li.style.padding = '5vh';
        li.textContent = 'マッチングしたスポットがありません';
        placesList.appendChild(li);
      }
      activeLocationDatas.forEach((locationData, index) => {
        let isMatchData = false;
        let i = 0;
        if (dataSource !== 'match') {
          for (i; i < matchLocationDatas.length; i++) {
            if (matchLocationDatas[i].name === locationData.name) {
              isMatchData = true;
              break;
            }
          }
        }
        const position = new google.maps.LatLng(locationData.lat, locationData.lng);
        const overlay = new MarkerOverLay(locationData.name, position, isMatchData ? matchLocationDatas[i].marker_url : locationData.marker_url, isMatchData, () => toggleHighlight(index));
        overlay.setMap(map);
        newOverlays.push(overlay);

        const li = document.createElement("li");
        li.style.borderRadius = '8px';
        li.style.listStyleType = 'none';
        li.addEventListener("click", (e) => {
          if (e.target instanceof HTMLImageElement || e.target instanceof HTMLDialogElement || e.target instanceof SVGElement) {
            return;
          }
          toggleHighlight(index);
        });

        const wrappedLi = (
          <Box
            key={locationData.name}
            // sx={{ height: `14vh`, border: `solid ${(dataSource === 'like' && isMatchData === false) ? '#165e83' : '#cf6865ff'}`,padding:'10pxchat',borderWidth:'3px 8px', borderRadius: '3px', cursor: 'pointer', transformOrigin: 'center', overflow: 'auto', boxShadow: '0px 1px 3px #00000029'}}
            sx={{
              height: '14vh',
              backgroundColor: `${(dataSource === 'like' && isMatchData === false) ? 'rgba(44, 169, 225, 0.10)':'rgba(240, 144, 141, 0.10)'}` ,
              padding: '0.25em 1em', // ここは必要に応じて調整してください
              cursor: 'pointer',
              transformOrigin: 'center',
              overflow: 'auto',
              boxShadow: '0px 1px 3px #00000029',
              position: 'relative',
              '&:before, &:after': {
                content: '""',
                width: '20px',
                height: '30px',
                position: 'absolute',
                display: 'inline-block',
              },
              '&:before': {

                borderLeft:`5px solid ${(dataSource === 'like' && isMatchData === false) ? '#165e83' : '#cf6865ff'}`,
                borderTop: `5px solid ${(dataSource === 'like' && isMatchData === false) ? '#165e83' : '#cf6865ff'}`,
                top: 0,
                left: 0,
              },
              '&:after': {
                borderRight: `5px solid ${(dataSource === 'like' && isMatchData === false) ? '#165e83' : '#cf6865ff'}`,
                borderBottom: `5px solid ${(dataSource === 'like' && isMatchData === false) ? '#165e83' : '#cf6865ff'}`,
                bottom: 0,
                right: 0,
              }
            }}
            className={`place mb-2 p-2 transition-all duration-500 ease-in-out transform`}
          //   sx={{
          //     '&:before, &:after': {
          //         content: '""',
          //         width: '20px',
          //         height: '30px',
          //         position: 'absolute',
          //         display: 'inline-block',
          //     },
          //     '&:before': {
          //         borderLeft: 'solid 1px #5767bf',
          //         borderTop: 'solid 1px #5767bf',
          //         top: 0,
          //         left: 0,
          //     },
          //     '&:after': {
          //         borderRight: 'solid 1px #5767bf',
          //         borderBottom: 'solid 1px #5767bf',
          //         bottom: 0,
          //         right: 0,
          //     }
          // }}
          // className={`box19`}              
          >
            <Grid container sx={{ display: 'flex', overflow: 'hidden', alignItems: 'stretch', height: '100%', borderRadius: '30px' }}>
              <Grid item xs={isAspectRatioHigh ? 4 : 5.5} sx={{ paddingRight: '1vh', paddingLeft: '1vh', display: 'flex', justifyContent: 'center' }}>
                <Box ref={imgRef} className="img mb-1 " sx={{ display: 'flex', height: '12vh', width: '18vh', transition: 'width 0.55s, height 0.55s' }}>
                  <ImageDialog src={locationData.url} alt={locationData.name} />
                </Box>
              </Grid>
              <Grid item xs={isAspectRatioHigh ? 8 : 6.5} sx={{ paddingTop: '0.5vh', display: 'flex', flexDirection: 'column', height: '100%' }} >
                <Typography variant="h6">{locationData.name}</Typography>
                <Typography variant="body2" color="text.secondary">場所: {locationData.address}</Typography>
                <Box className={`details max-h-0 opacity-0 transition-all duration-500 ease-in-out pointer-events-none`} sx={{ overflow: 'auto', flexGrow: 1 }}>
                  <Typography variant="body2">{locationData.comment}</Typography>
                  <Link href={locationData.webpage} target="_blank" rel="noopener">
                    {locationData.webpage}
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

        const root = createRoot(li); // create a root for each list item
        root.render(wrappedLi); // render the JSX inside the list item
        placesList.appendChild(li);
      });
      markerOverLayRef.current = newOverlays;
      const li = document.createElement("li");
      li.style.padding = '5vh';
      placesList.appendChild(li);

    }
  }, [map, dataSource, likeLocationDatas, matchLocationDatas]);

  function toggleHighlight(index: number) {
    if (highlightedIndexRef.current === index) {
      highlightedIndexRef.current = null;
      unhighlightMarker();
    } else {
      highlightedIndexRef.current = index;
      highlightMarker(index);
    }
  }

  function highlightMarker(index: number) {
    const placesList = document.getElementById("places") as HTMLUListElement;
    const allLiElements = placesList?.getElementsByTagName('li');
    markerOverLayRef.current.forEach((overlay, i) => {
      if (i === index) {
        overlay.highlightMarker();
        map.panTo({ lat: overlay.getPosition().lat(), lng: overlay.getPosition().lng() });
      } else {
        overlay.unhighlightMarker();
      }
    });
    if (allLiElements) {
      Array.from(allLiElements).forEach((element, i) => {
        const detailsDiv = element.querySelector('.details');
        const placeDiv = element.querySelector('.place');
        const imageDiv = element.querySelector('.img');
        if (i === index) {
          element.style.backgroundColor = grey[300]; // Highlight the selected li
          if (detailsDiv && placeDiv) {
            (placeDiv as HTMLElement).style.height = '28vh';
            (imageDiv as HTMLElement).style.height = '26vh';
            placeDiv.classList.add('transition-all', 'duration-500', 'ease-in-out');
            detailsDiv.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none'); // Show the details div in the selected li
            detailsDiv.classList.add('max-h-40', 'opacity-100'); // Adjust the max height and opacity as needed
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          element.style.backgroundColor = ''; // Reset the background color for all other li's
          if (detailsDiv && placeDiv) {
            (placeDiv as HTMLElement).style.height = '14vh';
            (imageDiv as HTMLElement).style.height = '12vh';
            placeDiv.classList.remove('transition-all', 'duration-500', 'ease-in-out');
            detailsDiv.classList.remove('max-h-40', 'opacity-100'); // Hide the details div in all other li's
            detailsDiv.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
          }
        }
      });
      toggleDrawer(true)
    }
  }

  function unhighlightMarker() {
    const placesList = document.getElementById("places") as HTMLUListElement;
    const allLiElements = placesList?.getElementsByTagName('li');
    markerOverLayRef.current.forEach((overlay) => {
      overlay.unhighlightMarker();
    });
    if (allLiElements) {
      Array.from(allLiElements).forEach((element, i) => {
        const detailsDiv = element.querySelector('.details');
        const placeDiv = element.querySelector('.place');
        const imageDiv = element.querySelector('.img');
        element.style.backgroundColor = ''; // Reset the background color for all other li's
        if (detailsDiv && placeDiv) {
          (placeDiv as HTMLElement).style.height = '14vh';
          (imageDiv as HTMLElement).style.height = '12vh';
          placeDiv.classList.add('transition-all', 'duration-500', 'ease-in-out');
          detailsDiv.classList.remove('max-h-40', 'opacity-100'); // Hide the details div in all other li's
          detailsDiv.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
        }
      });
    }
  }

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDataSource = event.target.checked ? 'match' : 'like';
    setLikeDataSource(event.target.checked);
    setDataSource(newDataSource);
  };

  return (
    <Drawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer}>
      {loading && <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        pointerEvents: 'none',
      }}>
        <Loading />
      </div>}
      <ThemeProvider theme={theme}>
        <Box id='sidebar' sx={{ paddingTop: 5, paddingBottom: 5, paddingLeft: '2vw', paddingRight: '2vw', height: '100%', width: '100%', marginBottom: '100px', zIndex: '900' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              value="start"
              control={<Switch checked={likeDataSource} onChange={handleSwitchChange} />}
              label="マッチのみ表示"
              labelPlacement="start"
            />
          </div>
          <ul id="places" style={{ listStyleType: 'none', padding: 0 }}></ul>
        </Box>
      </ThemeProvider>
    </Drawer>
  );
}