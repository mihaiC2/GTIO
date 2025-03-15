import {supabase}  from "../../../shared/utils/supabase";

export const createVote = async (voteData:any) => {
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

export const getVotesBySinger = async (singerId:string) => {
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

export const getSingerVoteStatsForGala = async (galaId:string) => {
    try {
        const { data: votes, error } = await supabase
            .from('vote')
            .select('singer_id, singer(first_name)')
            .eq('gala_id', galaId);

        if (error) throw error;

        // Contar los votos por cantante manualmente
        const data = votes.reduce((acc : any, vote: any) => {
            const { singer_id, singer } = vote;
            if (!acc[singer_id]) {
                //acc[singer_id] = { singerId: singer_id, singerName: singer?.first_name, totalVotes: 0 };
                acc[singer_id] = { singerId: singer_id, singerName: singer[0]?.first_name, totalVotes: 0 };
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


//module.exports = { createVote, getVotesBySinger, getSingerVoteStatsForGala };
