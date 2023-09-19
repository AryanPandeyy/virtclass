import { FormEvent, useState } from "react";
import { api } from "~/utils/api";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const mutate = api.example.signup.useMutation();
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    try {
      mutate.mutate({ name: name, email: email, pass: pass });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="bg-black flex min-h-screen flex-row items-center justify-center">
      <div className="w-full max-w-xs">
        <form
          className="mb-4 rounded px-8 pb-8 pt-6 shadow-md bg-black"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-100">
              Name
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight bg-gray-700 text-gray-100 shadow focus:outline-none"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-100">
              Email
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 bg-gray-700 leading-tight text-gray-100 shadow focus:outline-none"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-100">
              Password
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight bg-gray-700 text-gray-100 shadow focus:outline-none"
              name="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-100">
          &copy;2023 Made with ❤️ by Aryan.
        </p>
      </div>
    </div>
  );
}
