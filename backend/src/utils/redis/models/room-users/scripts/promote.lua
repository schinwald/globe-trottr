-- KEYS[1] = room users hash key (e.g., "room_users:{roomCode}")
-- ARGV[1] = user ID to promote to host

local roomKey = KEYS[1]
local userId = ARGV[1]

-- Check if user exists in the room
local currentRole = redis.call("HGET", roomKey, userId)
if not currentRole then
    return {error = "User not found in room"}
end

-- Check if user is already host
if currentRole == "host" then
    return {error = "User is already host"}
end

-- Find current host
local users = redis.call("HKEYS", roomKey)
local currentHost = nil

for i, user in ipairs(users) do
    local role = redis.call("HGET", roomKey, user)
    if role == "host" then
        currentHost = user
        break
    end
end

if not currentHost then
    return {error = "No host found in room"}
end

-- Demote current host to player
redis.call("HSET", roomKey, currentHost, "player")

-- Promote new user to host
redis.call("HSET", roomKey, userId, "host")

-- Return success with host change info
return {
    success = true,
    previousHost = currentHost,
    newHost = userId,
    previousHostRole = "player"
}
