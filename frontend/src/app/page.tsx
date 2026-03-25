"use client";

import { useEffect, useState } from "react";
import { Website } from "@/types/website";
import { getWebsites, deleteWebsite, pingWebsites } from "@/services/api";
import Link from "next/link";

export default function Home() {
  const [websites, setWebsites] = useState<Website[]>([]);

  const fetchData = async () => {
    const data = await getWebsites();
    setWebsites(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteWebsite(id);
    fetchData();
  };

  const handlePing = async () => {
    await pingWebsites();
    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Website Monitor</h1>

      <div className="flex gap-4 my-4">
        <button onClick={handlePing} className="bg-blue-500 text-white px-4 py-2 rounded">
          Run Check
        </button>

        <Link href="/add" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Website
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Status</th>
            <th>Response</th>
            <th>Last Checked</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {websites.map((site) => (
            <tr key={site._id} className="text-center border-t">
              <td>{site.name}</td>
              <td className={site.status === "UP" ? "text-green-600" : "text-red-600"}>
                {site.status}
              </td>
              <td>{site.responseTime || "-"}</td>
              <td>{site.lastChecked || "-"}</td>
              <td>
                <button
                  onClick={() => handleDelete(site._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}