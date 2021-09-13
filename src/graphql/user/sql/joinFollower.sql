LEFT JOIN leader_user_x_follower_user AS follower2 ON follower2.leader_user_id = "user".id
LEFT JOIN "user" AS follower ON follower.id = follower2.follower_user_id