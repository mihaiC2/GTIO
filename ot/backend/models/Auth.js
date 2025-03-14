const { supabase } = require('../utils/supabase');

const createUser = async (email, password, userData) => {
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

const createAuthUser = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data.user.id;
    } catch (err) {
        throw err;
    }
}

const createDbUser = async (userData) => {
    try {
        const { error } = await supabase
            .from('user')
            .insert(userData);

        if (error) throw error;
    } catch (err) {
        throw err;
    }
}

const authLogin = async (email, password) => {
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

const getUserByAuthId = async (authId) => {
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

const updateUserById = async (authId, userData) => {
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

module.exports = { createUser, authLogin, getUserByAuthId, updateUserById };