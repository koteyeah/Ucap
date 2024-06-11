import { getPosts } from "@/src/post";
import { getPostPhoto } from "@/src/url2Photo";

export default async function UrlList10(){
    console.log("get image URL list")
    const post = await getPosts()
    let imgUrlList: {name: string,  placeName:string,like: boolean, url: string ,comment:string ,address:string}[] = [];
    
    for (let i = 0; i < post!.length; i++) {
        const name = post![i].placeId
        const placeName = post![i].placeInf!.name!
        // console.log(post);
        const like = post![i].flag
        const url = await getPostPhoto(post![i].imgUrl)
        const comment =  post![i].comment
        const address = post![i].placeInf!.address!
        imgUrlList.push({name,placeName,like,url,comment,address})
        //console.log((await getPostPhoto(post![i].imgUrl)))
    }
    return(imgUrlList)
}