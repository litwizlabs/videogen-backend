import express, { Request, Response } from 'express';
import { addCreditRequest, addUserKey, getUserCredits } from '../services/hasuraService';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();



router.post('/credit-request', authenticateUser, (req: any, res: any) => {
  const user_id = req.user.id;
  addCreditRequest({ "user_id": user_id, "amount": parseInt(req.body.amount) });
  res.status(200).json({ message: "Credit request added" });
});

router.get('/get-videos', authenticateUser, async (req: any, res: any) => {
  const url = 'https://hasura.getraya.app/api/rest/user_video/' + req.user.id;
  const headers = {
    'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
  };

  try {
    const response = await fetch(url, { headers });
    const videos = await response.json();
    // Check the number of requests ahead for each video with status "queued"
    const updatedVideos = await Promise.all(videos.videogen_user_video.map(async (video: any) => {
      if (video.user_video_statuses[0].status === 'queued') {
        const statusUrl = `https://hasura.getraya.app/api/rest/user_video_status/${video.user_video_statuses[0].id}`;
        const statusResponse = await fetch(statusUrl, { headers });
        const statusData = await statusResponse.json();
        video.queue_position = statusData.videogen_user_video_status_aggregate?.aggregate?.count || 0;
      }
      return video;
    }));

    res.status(200).json(updatedVideos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});


router.post('/generate-video', authenticateUser, async (req: any, res: any) => {
  try {
    const { prompt, aspect_ratio, resolution, duration } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!prompt || !resolution || !duration || !aspect_ratio) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'prompt, style and duration are required'
      });
    }

    //check if user has enough credits
    const user_credits = await getUserCredits(user_id);
    if (user_credits.videos >= 2) {
      return res.status(400).json({
        error: 'Insufficient credits',
        details: 'User has insufficient credits'
      });
    }

    // Call Hasura to create video record
    const url = 'https://hasura.getraya.app/api/rest/user_video';
    const aspect_ratio_map: Record<string, string> = {
      '16:9': '960x544',
      '9:16': '544x960',
      '4:3': '832x624',
      '3:4': '624x832',
      '1:1': '720x720'
    };
    const aspect_ratio_value = aspect_ratio_map[aspect_ratio as keyof typeof aspect_ratio_map];
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
      },
      body: JSON.stringify({
        object: {
          user_id: user_id,
          prompt: prompt,
          aspect_ratio: aspect_ratio_value,
          duration: '3',
          resolution: '540',
          video_url: ''
        }
      })
    });

    // console.log(response)

    if (!response.ok) {
      throw new Error('Failed to create video record');
    }

    const data = await response.json();

    // Create video status after successful video creation
    const statusUrl = 'https://hasura.getraya.app/api/rest/user_video_status';
    const statusResponse = await fetch(statusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
      },
      body: JSON.stringify({
        object: {
          video_id: data.insert_videogen_user_video_one.id,
          status: 'queued', // or any initial status you want to set
          progress: '0',
          queue_position: 3,
        }
      })
    });

    console.log(statusResponse)

    if (!statusResponse.ok) {
      throw new Error('Failed to create video status');
    }

    // Return response with video ID
    return res.status(201).json({
      message: 'Video generation request submitted successfully',
      video_id: data.insert_videogen_user_video_one.id
    });

  } catch (error) {
    console.error('Error generating video:', error);

    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
});


router.delete('/delete-key', authenticateUser, (req: any, res: any) => {
  console.log(req.body.keyId)
  const url = 'https://hasura.getraya.app/api/rest/delete-key/' + req.body.keyId;
  const headers = {
    'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
  };
  fetch(url, {
    method: 'DELETE',
    headers
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error deleting key:', error);
      res.status(500).json({ error: 'Failed to delete key' });
    });
});

router.get('/get-user-info', authenticateUser, (req: any, res: any) => {
  const url = 'https://hasura.getraya.app/api/rest/getuserdata/' + req.user.id;
  const headers = {
    'x-hasura-admin-secret': 'Ae0HyTeGbumzL0a9mk8hLHe4tezWdSsSC1KG6pu9jQaejspZWDCT5iiLFAv8sKsd'
  };
  fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      console.log('User info response data:', data);
      res.status(200).json(data);
    });
});

export default router;
