package com.dailyimpact.api.repository

import com.dailyimpact.api.model.FriendRequest
import com.dailyimpact.api.model.FriendRequestStatus
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional

interface FriendRequestRepository : MongoRepository<FriendRequest, String> {
    fun findAllByToUserIdAndStatus(toUserId: String, status: FriendRequestStatus): List<FriendRequest>
    fun findAllByFromUserIdAndStatus(fromUserId: String, status: FriendRequestStatus): List<FriendRequest>
    fun findByFromUserIdAndToUserId(fromUserId: String, toUserId: String): Optional<FriendRequest>
}
