import {supabase}  from "../utils/supabase";

export const createUser = async (email: string, password: string, userData: object) => {
    try {
        const userId = await createAuthUser(email, password);

        await createDbUser({
            id: userId,
            email,
            ...userData
        });
        
        return userId;
    } catch (err) {
        throw err;
    }
}

export const createAuthUser = async (email: string, password:string) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;

        if(data.user)
            return data.user.id;
        else
            throw new Error('User not created');
    } catch (err) {
        throw err;
    }
}

export const createDbUser = async (userData: any) => {
    try {
        const { error } = await supabase
            .from('user')
            .insert(userData);

        if (error) throw error;
    } catch (err) {
        throw err;
    }
}

export const authLogin = async (email:string, password:string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    } catch (err) {
        throw err;
    }
}

export const getUserByAuthId = async (authId: string) => {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', authId)
            .single();
            
        if (error) throw error;
        return data;
    } catch (err) {
        throw err;
    }
}

export const updateUserById = async (authId: string, userData: any) => {
    try {
        const { error } = await supabase
            .from('user')
            .update(userData)
            .eq('id', authId);
            
        if (error) throw error;
    } catch (err) {
        throw err;
    }
}

//module.exports = { createUser, authLogin, getUserByAuthId, updateUserById };