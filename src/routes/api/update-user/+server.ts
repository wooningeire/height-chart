import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { supabase } from "$/lib/server/supabase";
import { db } from "$/lib/server/db";
import { userTable } from "$/lib/server/db/schema";
import { count, eq } from "drizzle-orm";

export const POST: RequestHandler = async ({request}) => {
    const {data: {user}, error: userError} = await supabase.auth.getUser();
    console.log(userError);
    if (user === null || userError !== null) return error(401, "Unauthorized");

    const existingRows = await db.select({count: count()})
        .from(userTable)
        .where(eq(userTable.discordId, BigInt(user.id)))
        .limit(1);

    if (existingRows.length === 0) {
        await db.insert(userTable)
            .values({
                discordId: BigInt(user.id),
                discordAvatarUrl: user.user_metadata.avatar_url,
                discordDisplayName: user.user_metadata.full_name,
            });
    } else {
        await db.update(userTable)
            .set({
                discordAvatarUrl: user.user_metadata.avatar_url,
                discordDisplayName: user.user_metadata.full_name,
            })
            .where(eq(userTable.discordId, BigInt(user.id)));
    }

    return json({});
};