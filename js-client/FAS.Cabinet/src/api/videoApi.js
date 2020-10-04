import {fetchText} from "./commonApi";

export async function getAccessKey(videoFileName){
  return fetchText(`/video/accessKey/${videoFileName}`);
}
