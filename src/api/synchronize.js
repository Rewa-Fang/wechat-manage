import { postActionHandler } from "@/api/getData";

let paramData = {
  Act: 'Material_Synchronize',
  Param: {
    "Type": 1,  // 同步的素材类型 1图片 2语音 3视频
    "Offset": 0, // 同步素材的起始位置
    "Count": 20 // 单次同步素材的数量
  },
  Verification: ''
};

const postSync = async (time) => {
  paramData.Param.Offset = time * paramData.Param.Count;
  try {
    let postData = new FormData();
    postData.append("Act", paramData.Act);
    postData.append("Param", JSON.stringify(paramData.Param));
    postData.append("Verification", paramData.Verification);
    let response = await postActionHandler(postData);
    console.log(response);

    return response;
  } catch (error) {
    return error;
  }
};
export default async (mediaConfig, vueObject) => {
  let syncCountNum = 0;

  if(mediaConfig.type == 4){ // 图文同步的参数不一样
    paramData.Act = 'Material_SynchronizeNews';
    delete paramData.Param.Type;
  }else{
    paramData.Param.Type = mediaConfig.type;
  }
  
  paramData.Verification = mediaConfig.verification;
  let time = Math.ceil(mediaConfig.wxTotalCount / paramData.Param.Count);
  let responseArr = [];
  vueObject.$syncProgress.show({
    text: "正在同步...",
    now: 0,
    total: mediaConfig.wxTotalCount
  });

  for (let count = 0; count >= 0; count++) {
    if (vueObject.$syncProgress.cancel()) {
      let resOnce = await postSync(count);
      if (resOnce.Data.ItemCount <= 0) {
        break;
      }
      syncCountNum = syncCountNum + resOnce.Data.ItemCount;
      console.log(syncCountNum);
      vueObject.$syncProgress.progress(syncCountNum);
      responseArr.push(resOnce)
    } else {
      break;
    }
  }
  console.log(responseArr);
  setTimeout(() => {
    vueObject.$syncProgress.hide();
  }, 500);
  return responseArr;
};