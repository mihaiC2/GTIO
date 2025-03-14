const { supabase } = require('../utils/supabase');

const getAllUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('*');

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}

const deleteUser = async (id) => {
    try {
        const { error } = await supabase
            .from('user')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (err) {
        throw err;
    }
}

module.exports = { getAllUsers, deleteUser };