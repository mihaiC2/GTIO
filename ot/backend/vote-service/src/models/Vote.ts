import {supabase}  from "../utils/supabase";

export const createVote = async (voteData: object) => {
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

        const data = votes.reduce((acc : any, vote: any) => {
            const { singer_id, singer } = vote;
            if (!acc[singer_id]) {
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


export const getVotesCountBySinger = async (singers: object[], gala_id: string) => {
    try {
        // Get all votes for the singers in the specific gala
        const { data: votes, error } = await supabase
            .from('vote')
            .select('singer_id, user_id')
            .in('singer_id', singers.map((singer: any) => (singer as Record<string, any>).id))
            .eq('gala_id', gala_id);

        if (error) throw error;

        // Initialize vote counts for all singers
        const voteCounts: Record<string, number> = {};
        singers.forEach((singer) => {
            const singerId = (singer as Record<string, unknown>)['id'] as string;
            voteCounts[singerId] = 0;
        });
        
        votes.forEach((vote) => {
            const singerId = (vote as Record<string, unknown>)['singer_id'] as string;
            voteCounts[singerId]++;
        });
        
        const data = singers.map((singer) => {
            const s = singer as Record<string, unknown>;
            const singerId = s['id'] as string;

            return {
                id: singerId,
                first_name: s['first_name'],
                last_name: s['last_name'],
                stage_name: s['stage_name'],
                photo_url: s['photo_url'],
                bio: s['bio'],
                birth_date: s['birth_date'],
                totalVotes: voteCounts[singerId],   
            };
        });

        return data;
    }
    catch (err) {
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