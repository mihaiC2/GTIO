import {supabase}  from "../utils/supabase";

export const createSinger = async (singerData: object) => {
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

export const getAllSingers = async () => {
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

export const getSingerById = async (id:string) => {
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

export const updateSingerById = async (id:string, singerData:any) => {
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

export const deleteSingerById = async (id:string) => {
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
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { success: false, msg: 'Error deleting singer', error: err.message };
        } else {
            return { success: false, msg: 'Error deleting singer', error: err};
        }
        
    }
}

export const getSingersByGalaId = async (galaId:string) => {
    try {
        const { data: singers, error } = await supabase
            .from('singer')
            .select('*')
            .gte('last_gala_id', galaId);

        if (error) throw error;

        return singers;
    } catch (err) {
        throw err;
    }
}