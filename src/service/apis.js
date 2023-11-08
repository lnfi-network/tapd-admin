import request from "./request";
export const getAssetsList = (params) => {
  return request.get(`/api/taproot/assets/list`, { params, enableIcp: true });
};
export const getUniverseStats = (params) => {
  return request.get(`/api/taproot/universe/queryAssetStats`, { params, enableIcp: true });
};
export const getUniverseInfo = (params) => {
  return request.get(`/api/taproot/universe/info`, { params, enableIcp: true, grpc: params.grpc });
};
export const getDecodeAddr = (params) => {
  return request.post(`/api/taproot/assets/decodeAddr`, params, { enableIcp: true });
};
export const getUniverseHost = () => {
  return request.get(`/api/taproot/node/host`, { enableIcp: true });
};

export const createInvoice = (params) => {
  return request.post(`/api/taproot/assets/newAddr`, params, { enableIcp: true })
}

export const sendAsset = (params) => {
  return request.post(`/api/taproot/assets/sendAsset`, params, { enableIcp: true })
}
export const mintAsset = (params) => {
  return request.post(`/api/taproot/mint/mintAsset`, params, { enableIcp: true })
}
export const syncAsset = (params) => {
  return request.post(`/api/taproot/universe/syncUniverse`, params, { enableIcp: true })
}
export const setHost = (params) => {
  return request.post(`/api/taproot/universe/setting`, params, { enableIcp: true, contentType: "multipart/form-data" });
}
export const getHosts = () => {
  return request.get(`/api/taproot/universe/hosts`, { enableIcp: true });
};
