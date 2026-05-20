import ApiClient from "./ApiClient";

export const getPopularCategories = () => ApiClient.get("/popular-categories/");

export const searchSkills = (searchQuery) => ApiClient.get(`/?q=${  searchQuery}`);
export const loginUser = (username, password) => ApiClient.post(
    "/users/login",
    {},
    { auth: { username, password } }
  );

export const childrenSkills = (file_id) => ApiClient.get(`/children/?path_addr=${  file_id}`);

export const treeSkills = (file_id) => ApiClient.get(`/tree/?path_addr=${  file_id}`);
export const getRecommendations = (file_id) => ApiClient.get(`/get-recommendations/?path_addr=${  file_id}`);
