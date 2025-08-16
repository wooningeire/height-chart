import { error } from "@sveltejs/kit";
import { supabase } from "./supabase";

export const getUser = async (request: Request) => {
    const authorization = request.headers.get("Authorization");
    if (authorization === null) return error(400, "No authorization token given");

    const token = authorization.split(" ")[1]
    const userResponse = await supabase.auth.getUser(token);

    if (userResponse.data.user === null || userResponse.error !== null) return error(401, "No user found");
    const user = userResponse.data.user;

    return user;
};