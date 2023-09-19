import { FormEvent, useState } from "react";
import { api } from "~/utils/api";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  // wanted to use query but cant
  // https://github.com/trpc/trpc/discussions/2067
  const mutate = api.example.login.useMutation();
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutate.mutate({email: email, pass: pass });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          name="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <br />
        <button>Submit</button>
      </form>
    </>
  );
}
