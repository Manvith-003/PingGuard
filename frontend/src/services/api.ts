const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const WEBSITES_URL = `${BASE_URL}/websites`;
const EMAIL_URL = `${BASE_URL}/email`;
const CONFIG_URL = `${BASE_URL}/config`;

export const getWebsites = async () => {
  const res = await fetch(WEBSITES_URL);
  return res.json();
};

export const addWebsite = async (data: {
  name: string;
  url: string;
}) => {
  const res = await fetch(WEBSITES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const deleteWebsite = async (id: string) => {
  await fetch(`${WEBSITES_URL}/${id}`, {
    method: "DELETE"
  });
};

export const pingWebsites = async () => {
  await fetch(`${WEBSITES_URL}/ping-check`);
};

export const getEmailConfig = async () => {
  const res = await fetch(`${EMAIL_URL}/get-config`);
  return res.json();
};

export const setEmailConfig = async (data: { emails: string[], intervalKey: string }) => {
  const res = await fetch(`${EMAIL_URL}/set-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const setMonitoringInterval = async (interval: number) => {
  const res = await fetch(`${CONFIG_URL}/set-interval`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ interval })
  });
  return res.json();
};