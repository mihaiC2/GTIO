const { supabase } = require('../utils/supabase');

const createSinger = async (singerData) => {
    try {
        const { data, error } = await supabase
            .from('singer')
            .insert(singerData)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}

const getAllSingers = async () => {
    try {
        const { data, error } = await supabase
            .from('singer')
            .select('*');

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}

const getSingerById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('singer')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}

const updateSingerById = async (id, singerData) => {
    try {
        const { data, error } = await supabase
            .from('singer')
            .update(singerData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}

const deleteSingerById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('singer')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return { success: false, msg: 'No singer found with the given ID' };
        }

        return { success: true, msg: 'Singer deleted successfully', deletedSinger: data };
    } catch (err) {
        return { success: false, msg: 'Error deleting singer', error: err.message };
    }
}

module.exports = { createSinger, getAllSingers, getSingerById, updateSingerById, deleteSingerById };
