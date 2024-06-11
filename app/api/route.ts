import { getPlaceInfo } from "@/src/Place";
import { NextRequest, NextResponse } from "next/server";
//api/place?place_id=PLACE_ID

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const place_id = searchParams.get("place_id");
  console.log("apiが呼び出されました");
  if (place_id != null) {
    try {
      const placeInf = await getPlaceInfo(place_id);
      if (placeInf) {
        const res = NextResponse.json(
          {
            placeInf: placeInf,
          },
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return res;
      } else {
        const res = NextResponse.json({
          msg: "An error occurred while fetching place info",
        });
        return res;
      }
    } catch (error) {
      // エラーレスポンスを作成
      const res = NextResponse.json({
        msg: "An error occurred while fetching place info",
      });
      return res;
    }
  }
}
