import { getUser } from "@/auth/server";
import ClientHome from "@/components/ClientHome";

export default async function Page() {
  const user = await getUser();

  return <ClientHome user={user} />;
}
