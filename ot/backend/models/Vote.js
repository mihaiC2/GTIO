const { supabase } = require('../utils/supabase');

const createVote = async (voteData) => {
    try {
        const { data, error } = await supabase
            .from('vote')
            .insert(voteData)
            .select()
            .single();
            
        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        throw err;
    }
}

const getVotesBySinger = async (singerId) => {
    try {
        const { data, error } = await supabase
            .from('vote')
            .select('*', { count: 'exact' })
            .eq('singer_id', singerId);

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}

const getSingerVoteStatsForGala = async (galaId) => {
    try {
        const { data: votes, error } = await supabase
            .from('vote')
            .select('singer_id, singer(first_name)')
            .eq('gala_id', galaId);

        if (error) throw error;

        // Contar los votos por cantante manualmente
        const data = votes.reduce((acc, vote) => {
            const { singer_id, singer } = vote;
            if (!acc[singer_id]) {
                acc[singer_id] = { singerId: singer_id, singerName: singer?.first_name, totalVotes: 0 };
            }
            acc[singer_id].totalVotes += 1;
            return acc;
        }, {});

        if (error) throw error;

        return data;
    } catch (err) {
        throw err;
    }
}


module.exports = { createVote, getVotesBySinger, getSingerVoteStatsForGala };
