JOIN leader_user_x_follower_user ON leader_user_x_follower_user.leader_user_id = feed.user_id
AND leader_user_x_follower_user.follower_user_id = $1