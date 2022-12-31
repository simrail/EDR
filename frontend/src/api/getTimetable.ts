const BASE_API_URL = "http://localhost:8080/";

export const getTimetable = (server: string, post: string) =>
    fetch(BASE_API_URL + "dispatch/" + server + "/" + post).then(res => res.json());