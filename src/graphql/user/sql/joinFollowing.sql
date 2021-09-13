LEFT JOIN leader_user_x_follower_user AS following2 ON following2.follower_user_id = "user".id
LEFT JOIN "user" AS following ON following.id = following2.leader_user_id