package com.dailyimpact.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

enum class FriendRequestStatus { PENDING, ACCEPTED, DECLINED }

@Document(collection = "friend_requests")
data class FriendRequest(
    @Id val id: String? = null,
    val fromUserId: String,
    val toUserId: String,
    val status: FriendRequestStatus = FriendRequestStatus.PENDING,
    val createdAt: Instant = Instant.now(),
)
