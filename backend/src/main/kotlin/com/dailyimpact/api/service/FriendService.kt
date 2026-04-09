package com.dailyimpact.api.service

import com.dailyimpact.api.dto.FriendRequestResponse
import com.dailyimpact.api.dto.FriendResponse
import com.dailyimpact.api.dto.SendFriendRequestByEmail
import com.dailyimpact.api.dto.toPublicResponse
import com.dailyimpact.api.dto.toResponse
import com.dailyimpact.api.exception.BadRequestException
import com.dailyimpact.api.exception.ConflictException
import com.dailyimpact.api.exception.ForbiddenException
import com.dailyimpact.api.exception.ResourceNotFoundException
import com.dailyimpact.api.model.FriendRequest
import com.dailyimpact.api.model.FriendRequestStatus
import com.dailyimpact.api.repository.FriendRequestRepository
import com.dailyimpact.api.repository.ProgressRepository
import com.dailyimpact.api.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class FriendService(
    private val userRepository: UserRepository,
    private val friendRequestRepository: FriendRequestRepository,
    private val progressRepository: ProgressRepository,
) {
    fun getFriends(userId: String): List<FriendResponse> {
        val user = findUser(userId)
        if (user.friendIds.isEmpty()) return emptyList()

        val friends = userRepository.findAllById(user.friendIds)
        val progressMap = progressRepository.findAllByUserIdIn(user.friendIds)
            .associateBy { it.userId }

        return friends.map { friend ->
            val progress = progressMap[friend.id]
            FriendResponse(
                id = friend.id!!,
                name = friend.name,
                bio = friend.bio,
                avatarUrl = friend.avatarUrl,
                impactTotal = progress?.total ?: 0,
                streak = progress?.streak ?: 0,
            )
        }
    }

    fun sendFriendRequest(fromUserId: String, request: SendFriendRequestByEmail): FriendRequestResponse {
        val toUser = userRepository.findByEmail(request.email)
            .orElseThrow { ResourceNotFoundException("No user found with that email") }

        if (toUser.id == fromUserId) {
            throw BadRequestException("You cannot send a friend request to yourself")
        }

        val fromUser = findUser(fromUserId)

        if (fromUser.friendIds.contains(toUser.id)) {
            throw ConflictException("You are already friends with this user")
        }

        val existing = friendRequestRepository.findByFromUserIdAndToUserId(fromUserId, toUser.id!!)
        if (existing.isPresent && existing.get().status == FriendRequestStatus.PENDING) {
            throw ConflictException("Friend request already sent")
        }

        val friendRequest = friendRequestRepository.save(
            FriendRequest(fromUserId = fromUserId, toUserId = toUser.id)
        )
        return friendRequest.toResponse(fromUser.toPublicResponse(), toUser.toPublicResponse())
    }

    fun getIncomingRequests(userId: String): List<FriendRequestResponse> {
        val requests = friendRequestRepository
            .findAllByToUserIdAndStatus(userId, FriendRequestStatus.PENDING)
        return requests.map { req ->
            val from = findUser(req.fromUserId).toPublicResponse()
            val to = findUser(req.toUserId).toPublicResponse()
            req.toResponse(from, to)
        }
    }

    fun acceptRequest(userId: String, requestId: String): FriendRequestResponse {
        val friendRequest = findRequest(requestId)
        assertRecipient(userId, friendRequest)

        val updated = friendRequestRepository.save(
            friendRequest.copy(status = FriendRequestStatus.ACCEPTED)
        )

        // Add each other as friends
        val toUser = findUser(friendRequest.toUserId)
        val fromUser = findUser(friendRequest.fromUserId)
        userRepository.save(toUser.copy(
            friendIds = toUser.friendIds + friendRequest.fromUserId,
            updatedAt = Instant.now(),
        ))
        userRepository.save(fromUser.copy(
            friendIds = fromUser.friendIds + friendRequest.toUserId,
            updatedAt = Instant.now(),
        ))

        return updated.toResponse(fromUser.toPublicResponse(), toUser.toPublicResponse())
    }

    fun declineRequest(userId: String, requestId: String): FriendRequestResponse {
        val friendRequest = findRequest(requestId)
        assertRecipient(userId, friendRequest)

        val updated = friendRequestRepository.save(
            friendRequest.copy(status = FriendRequestStatus.DECLINED)
        )
        val from = findUser(friendRequest.fromUserId).toPublicResponse()
        val to = findUser(friendRequest.toUserId).toPublicResponse()
        return updated.toResponse(from, to)
    }

    fun removeFriend(userId: String, friendId: String) {
        val user = findUser(userId)
        val friend = findUser(friendId)

        if (!user.friendIds.contains(friendId)) {
            throw BadRequestException("This user is not your friend")
        }

        userRepository.save(user.copy(
            friendIds = user.friendIds - friendId,
            updatedAt = Instant.now(),
        ))
        userRepository.save(friend.copy(
            friendIds = friend.friendIds - userId,
            updatedAt = Instant.now(),
        ))
    }

    private fun findUser(userId: String) =
        userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found") }

    private fun findRequest(requestId: String) =
        friendRequestRepository.findById(requestId)
            .orElseThrow { ResourceNotFoundException("Friend request not found") }

    private fun assertRecipient(userId: String, request: FriendRequest) {
        if (request.toUserId != userId) {
            throw ForbiddenException("You are not the recipient of this friend request")
        }
    }
}
