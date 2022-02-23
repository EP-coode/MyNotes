const notesApiService = (apiServerUrl: string) => {
  return {
    auth: authService(apiServerUrl),
    notes: notesService(apiServerUrl),
    tags: tagsService(apiServerUrl),
  };
};

export default notesApiService;
