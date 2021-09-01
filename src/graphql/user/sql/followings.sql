SELECT %I
FROM "user"
  JOIN leader_user_x_follower_user ON leader_user_x_follower_user.leader_user_id = "user".id
WHERE leader_user_x_follower_user.follower_user_id = $1;