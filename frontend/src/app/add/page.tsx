"use client";

import { useState } from "react";
import { addWebsite } from "@/services/api";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await addWebsite({ name, url });

    router.push("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Add Website</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Website Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="https://example.com"
          className="border p-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button className="bg-blue-500 text-white p-2">
          Add Website
        </button>
      </form>
    </div>
  );
}
