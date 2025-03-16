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


export const getVotesCountBySinger = async (singers: any, gala_id: string) => {
    try {
        // Get all votes for the singers in the specific gala
        const { data: votes, error } = await supabase
            .from('vote')
            .select('singer_id, user_id')
            .in('singer_id', singers.map((singer: any) => singer.id))
            .eq('gala_id', gala_id);

        if (error) throw error;

        // Initialize vote counts for all singers
        const voteCounts: Record<string, number> = {};
        singers.forEach((singer: any) => {
            voteCounts[singer.id] = 0;
        });
        
        votes.forEach((vote: any) => {
            voteCounts[vote.singer_id]++;
        });
        
        const data = singers.map((singer: any) => ({
            id: singer.id,
            first_name: singer.first_name,
            last_name: singer.last_name,
            stage_name: singer.stage_name,
            photo_url: singer.photo_url,
            bio: singer.bio,
            birth_date: singer.birth_date,
            totalVotes: voteCounts[singer.id]
        }));

        return data;
    }
    catch (err: any) {
        throw err;
    }
}

export const getVoteByUser = async (authId: string, galaId: string) => {
    try {
        const { data, error } = await supabase
            .from('vote')
            .select('*')
            .eq('user_id', authId)
            .eq('gala_id', galaId)
            .single();

        return data;
    } catch (err) {
        throw err;
    }
}