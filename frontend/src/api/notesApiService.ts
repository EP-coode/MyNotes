import authService from "./services/auth";
import notesService from "./services/notes";
import tagsService from "./services/tags";

const notesApiService = (apiServerUrl: string) => {
  return {
    auth: authService(apiServerUrl),
    notes: notesService(apiServerUrl),
    tags: tagsService(apiServerUrl),
  };
};

export default notesApiService;
