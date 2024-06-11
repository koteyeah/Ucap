
import { addMatch } from "@/src/match";
import SimpleZoom1 from "../components/PoP_study_modal";
import { addLike } from "@/src/like";



export default async function Feedback(place: string, dir:string,like:boolean){
  if(dir === 'right'){
    addLike(place)
    if(like){
    addMatch(place)
    console.log("matched!!!!!!!")
    return true
  } else {
    return false
  }
  } else{
    return false
  } 

}

