import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import { Link } from "lucide-react";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();

  let notes: Note[] = [];

  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }
  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="nb-2 mt-2 text-lg">
            {user ? (
              "Your notes"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{" "}
                Login to see your notes
              </p>
            )}
          </SidebarGroupLabel>
          {user && notes?.length > 0 && (
            <SidebarGroupContent
              notes={notes.map((note) => ({
                ...note,
                text: note.text || "", // ✅ ensures no undefined text
              }))}
            />
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
