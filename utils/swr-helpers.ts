export const getFetcher = async (params: [URL, string]) => {
  const [url] = params;
  const data = await fetch(url, {
    method: "GET",
  });

  const json = await data.json();

  return json;
};
