import { db } from "$/lib/server/db";
import { characterTable, userTable } from "$/lib/server/db/schema";
import { supabase } from "$/lib/server/supabase";
import {type RequestHandler, error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async () => {
    const characters = await db
        .select({
            id: characterTable.id,
            name: characterTable.name,
            targetLength: characterTable.targetLength,
            offsetPos: characterTable.offsetPos,
            offsetScale: characterTable.offsetScale,
            referenceCurve: characterTable.referenceCurve,
            ownerUserId: userTable.discordId,
            ownerAvatarUrl: userTable.discordAvatarUrl,
            ownerDisplayName: userTable.discordDisplayName,
        })
        .from(characterTable)
        .innerJoin(userTable, eq(characterTable.ownerUserId, userTable.discordId));

    const charactersWithUrls = await Promise.all(
        characters.map(async (character) => {
            const imageUrl = `public/${character.id}.png`;
            const { data: signedUrlData, error: signedUrlError } = await supabase
                .storage
                .from("character")
                .createSignedUrl(imageUrl, 60 * 60 * 24 * 3);

            if (signedUrlError) {
                return {
                    ...character,
                    ownerUserId: character.ownerUserId.toString(),
                    imageUrl: null,
                };
            }

            return {
                ...character,
                ownerUserId: character.ownerUserId.toString(),
                imageUrl: signedUrlData.signedUrl,
            };
        })
    );

    return json(charactersWithUrls);
};

export const PUT: RequestHandler = async ({ request }) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (user === null || userError !== null) return error(401, "Unauthorized");




    const formData = await request.formData();

    const name = formData.get('name') as string;
    const targetLength = parseFloat(formData.get('targetLength') as string);
    const offsetPos = JSON.parse(formData.get('offsetPos') as string);
    const offsetScale = JSON.parse(formData.get('offsetScale') as string);
    const referenceCurve = JSON.parse(formData.get('referenceCurve') as string);
    const file = formData.get('file') as File;

    if (typeof name !== "string") return error(400, "Invalid name");
    if (isNaN(targetLength)) return error(400, "Invalid targetLength");
    if (!Array.isArray(offsetPos)) return error(400, "Invalid offsetPos");
    if (!Array.isArray(offsetScale)) return error(400, "Invalid offsetScale");
    if (!file || !(file instanceof File)) return error(400, "No file provided");

    const rows = await db.insert(characterTable)
        .values({
            name,
            referenceCurve,
            targetLength,
            offsetPos,
            offsetScale,
            ownerUserId: BigInt(user.id),
        })
        .returning({
            id: characterTable.id,
        });
    if (rows.length !== 1) return error(500, "Failed to create character");

    const id = rows[0].id;

    const imageUrl = `public/${id}.png`;
    const { error: uploadError } = await supabase
        .storage
        .from("character")
        .upload(imageUrl, file, {
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) {
        return error(500, "Failed to upload image");
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from("character")
        .createSignedUrl(imageUrl, 60 * 60 * 24 * 3);

    if (signedUrlError) {
        return error(500, "Failed to create image URL");
    }

    return new Response(JSON.stringify({
        id,
        imageUrl: signedUrlData.signedUrl,
    }));
};



