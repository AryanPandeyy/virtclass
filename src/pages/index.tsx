import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  return (
    <>
      <div>
        <h1>Virtual ClassRoom</h1>
      </div>
    </>
  );
}
