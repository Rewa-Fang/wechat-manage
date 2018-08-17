import { postActionHandler } from "@/api/getData";

let paramData = {
  Act: 'Material_Synchronize',
  Param: {
    "Type": 1,  // 同步的素材类型 1图片 2语音 3视频
    "Offset": 0, // 同步素材的起始位置
    "Count": 2 // 单次同步素材的数量
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
export default async (mediaConfig) => {
  paramData.Param.Type = mediaConfig.type;
  paramData.Verification = mediaConfig.verification;

  let time = Math.ceil(mediaConfig.wxTotalCount / paramData.Param.Count);
  let responseArr = [];

  for (let count = 0; count < 1; count++) {
    let resOnce = await postSync(count);
    responseArr.push(resOnce)
  }

  console.log(responseArr);
  return responseArr;
};