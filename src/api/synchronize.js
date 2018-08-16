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
  try {
    let postData = new FormData();
    postData.append("Act", paramData.Act);
    postData.append("Param", JSON.stringify(paramData.Param));
    postData.append("Verification", paramData.Verification);
    let response = await postActionHandler(postData);
    return response;
  } catch (error) {
    return error;
  }

};
export default async (verification, type) => {
  paramData.Param.Type = type;
  paramData.Verification = verification;
  let response = await postSync(1);
  return response;
};