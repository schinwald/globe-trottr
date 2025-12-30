local roomUserIndex = KEYS[1] -- RediSearch index
local roomCode = ARGV[1]
local userId = ARGV[2]

-- Compute the JSON key / entity ID
local docId = "room_users:" .. userId .. "-" .. roomCode

-- Check if the user exists
if redis.call("EXISTS", docId) == 0 then
	return { success = false, message = "user not in room" }
end

-- Fetch current connections
local connectionsStr = redis.call("JSON.GET", docId, "$.connections")
local connections = tonumber(connectionsStr and connectionsStr[1] or "0")

-- Decrement connections
connections = connections - 1

if connections <= 0 then
	-- Remove the user completely if no connections left
	redis.call("DEL", docId)
else
	-- Update the connections field
	redis.call("JSON.SET", docId, "$.connections", tostring(connections))
end

-- Optional: check if leaving user was host
local roleStr = redis.call("JSON.GET", docId, "$.role")
local role = roleStr and cjson.decode(roleStr[1]) or nil

local hostReassigned = false

if role == "host" and connections <= 0 then
	-- Need to assign a new host in the same room
	local res = redis.call(
		"FT.SEARCH",
		roomUserIndex,
		"@roomCode:{" .. roomCode .. "}",
		"RETURN",
		3,
		"userId",
		"role",
		"connections",
		"LIMIT",
		0,
		1
	)

	if #res > 1 then
		local newHostId = res[2] -- Redis key of first remaining user
		redis.call("JSON.SET", newHostId, "$.role", cjson.encode("host"))
		hostReassigned = true
	end
end

return {
	success = true,
	remainingConnections = math.max(connections, 0),
	hostReassigned = hostReassigned,
}
