local roomUserIndex = KEYS[1] -- RediSearch index name
local roomCode = ARGV[1]
local userId = ARGV[2]

-- 1. Search for all users in the room
local res = redis.call(
	"FT.SEARCH",
	roomUserIndex,
	"@roomCode:{" .. roomCode .. "}",
	"RETURN",
	3,
	"userId",
	"role",
	"connections"
)

local roomUser = nil
local doesRoomHaveHost = false

for i = 2, #res, 2 do
	local docId = res[i]
	local fields = res[i + 1]

	-- Fields
	local _userId = fields[2]
	local _role = fields[4]
	local _connections = fields[5]

	if _role == "host" then
		doesRoomHaveHost = true
	end

	if _userId == userId then
		-- Fetch current connections as number
		local connections = tonumber(_connections or "0")
		roomUser = {
			id = docId,
			userId = _userId,
			role = _role,
			connections = connections,
		}
	end
end

-- 2. Determine role for the user
local role = doesRoomHaveHost and "guest" or "host"

-- 3. Update existing user or add new user using RedisJSON
if roomUser ~= nil then
	-- Increment connections and update role
	local newConnections = roomUser.connections + 1
	redis.call("JSON.SET", roomUser.id, "$.connections", tostring(newConnections))
	redis.call("JSON.SET", roomUser.id, "$.role", cjson.encode(role))
else
	-- Use a predictable JSON key as the doc ID
	local newDocId = "room_users:" .. userId .. "-" .. roomCode
	local payload = cjson.encode({
		userId = userId,
		roomCode = roomCode,
		role = role,
		connections = 1,
	})
	redis.call("JSON.SET", newDocId, "$", payload)
end

return { success = true, role = role }
