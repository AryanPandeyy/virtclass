import { TRPCError } from "@trpc/server";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { api } from "~/utils/api";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [isError, setIsError] = useState<string>("");
  const mutate = api.example.signup.useMutation();
  const router = useRouter();
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // https://github.com/trpc/trpc/issues/631
    mutate
      .mutateAsync({ name: name, email: email, pass: pass })
      .then(() => {
        router.push("/login").catch((e) => console.log(e));
      })
      .catch((e: TRPCError) => setIsError(e.message));
  };
  return (
    <div className="flex min-h-screen flex-row items-center justify-center bg-black">
      <div className="w-full max-w-xs">
        <form
          className="mb-4 rounded bg-black px-8 pb-8 pt-6 shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-100">
              Name
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border bg-gray-700 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
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
              className="focus:shadow-outline w-full appearance-none rounded border bg-gray-700 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
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
              className="focus:shadow-outline w-full appearance-none rounded border bg-gray-700 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
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
              Sign up
            </button>
          </div>
        </form>
        {isError === "" ? (
          <></>
        ) : (
          <div
            className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">Holy smokes! </strong>
            <span className="block sm:inline">{isError}</span>
            <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
              <svg
                className="h-6 w-6 fill-current text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        <p className="text-center text-xs text-gray-100">
          &copy;2023 Made with ❤️ by Aryan.
        </p>
      </div>
    </div>
  );
}
