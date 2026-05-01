import service from "@/utils/request";

export function register(data) {
  return service.post("/user/add", data);
};
export const startSession = (data) => {
  return service.post("/psychological-chat/session/start", data);
};
export const getSessionList =(params) => {
  return service.get("/psychological-chat/sessions",{params});
}
export const deleteSession = (sessionId) => {
  return service.delete(`/psychological-chat/session/${sessionId}`);
}
export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`);
}
export const getSeesionEmotion = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`);
}
export const addEmotionDairy = (data) => {
  return service.post("/emotion-diary", data);
}
export const getKnowledgeList = (params) => {
  return service.get("/knowledge/article/page",{params});
}
export const getKnowledgeDetail = (acticleId) =>{
  return service.get(`/knowledge/article/${acticleId}`)
}
