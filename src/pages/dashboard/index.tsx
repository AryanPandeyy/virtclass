import { api } from "~/utils/api"

export default function Dash() {
  const auth = api.example.demo.useQuery({text:'authtest'});
  return <h1>dash</h1>
}
