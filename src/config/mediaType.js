const checkedMediaType = (mediaType, fileType) => {
  let type = [
    ["占位"],
    ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/bmp"],
    ["audio/mp3", "audio/x-ms-wma", "audio/wav"],
    ["video/mp4"]
  ];
  return type[mediaType].indexOf(fileType) > -1;
}
const checkedMediaSize = (mediaType, fileSize) => {
  if(mediaType < 3){
    return (fileSize / 1024 / 1024) < 2;
  }
  if(mediaType == 3){
    return (fileSize / 1024 / 1024) < 10;
  }
  return false;
}

const typeMsg = ["占位","上传图片只能是 bmp/png/jpeg/jpg/gif 格式!","上传语音只能是 mp3/wav/wma/amr 格式!","上传视频只能是 MP4 格式!"];
const sizeMsg = ["占位","上传图片大小不能超过 2MB!","上传语音大小不能超过 2MB!","上传视频大小不能超过 10MB!"];
export {
  checkedMediaType,
  checkedMediaSize,
  typeMsg,
  sizeMsg
}