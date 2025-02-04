import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, inviteCode } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `https://weddlist.dev/invite/${inviteCode}`,
      data: {
        inviteCode,
      },
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    );
  }
}
