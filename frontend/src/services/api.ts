const BASE_URL = "http://localhost:5000/api/websites";

export const getWebsites = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const addWebsite = async (data: {
  name: string;
  url: string;
}) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const deleteWebsite = async (id: string) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });
};

export const pingWebsites = async () => {
  await fetch(`${BASE_URL}/ping-check`);
};