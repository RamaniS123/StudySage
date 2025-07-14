import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request); 
}

export const config = {
  matcher: [
  
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}



export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
  }

  const { searchParams, pathname } = new URL(request.url);

  if (!searchParams.get("noteId") && pathname === "/" && user) {
    // 1. Try to fetch the newest note safely
    const newestRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`
    );

    let newestNoteId: string | null = null;

    try {
      const data = await newestRes.json();
      newestNoteId = data?.newestNoteId ?? null;
    } catch (err) {
      console.warn("Failed to parse newest note response:", err);
    }

    if (newestNoteId) {
      const url = request.nextUrl.clone();
      url.searchParams.set("noteId", newestNoteId);
      return NextResponse.redirect(url);
    }

    // 2. Create a new note if none exist
    const createRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let noteId: string | null = null;

    try {
      const data = await createRes.json();
      noteId = data?.noteId ?? null;
    } catch (err) {
      console.warn("Failed to parse create note response:", err);
    }

    if (noteId) {
      const url = request.nextUrl.clone();
      url.searchParams.set("noteId", noteId);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
