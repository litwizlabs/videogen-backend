import axios from 'axios';
export const addUserKey = async (data: any): Promise<any> => {
    try {
        // Send the file path to the FastAPI server
        const response = await axios.post('https://hasura.getraya.app/api/rest/keys', {
            object: data,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
            }
        });

        return response.data;
    } catch (error) {
        console.log('errors', error);
        throw error;
    }
};

export const addCreditRequest = async (data: any): Promise<any> => {
    try {
        // Send the file path to the FastAPI server
        const response = await axios.post('https://hasura.getraya.app/api/rest/credit_requests', {
            object: data,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
            }
        });
        console.log(response.data)

        return response.data;
    } catch (error) {
        console.log('errors', error);
        throw error;
    }
};

export const getUserCredits = async (user_id: string): Promise<any> => {
    const url = 'https://hasura.getraya.app/api/rest/getuserdata/' + user_id;
    const headers = {
        'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
    };

    const response = await axios.get(url, { headers });
    const credits = response.data.asr_users_by_pk.credits;
    const videos = response.data.asr_users_by_pk.user_videos_aggregate.aggregate.count;
    return { credits, videos };
};