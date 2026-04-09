package com.dailyimpact.api.dto

import com.dailyimpact.api.model.FriendRequest
import com.dailyimpact.api.model.FriendRequestStatus
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class FriendResponse(
    val id: String,
    val name: String,
    val bio: String,
    val avatarUrl: String?,
    val impactTotal: Int,
    val streak: Int,
)

data class SendFriendRequestByEmail(
    @field:NotBlank @field:Email val email: String,
)

data class FriendRequestResponse(
    val id: String,
    val fromUser: PublicUserResponse,
    val toUser: PublicUserResponse,
    val status: FriendRequestStatus,
    val createdAt: String,
)

fun FriendRequest.toResponse(from: PublicUserResponse, to: PublicUserResponse) = FriendRequestResponse(
    id = id!!,
    fromUser = from,
    toUser = to,
    status = status,
    createdAt = createdAt.toString(),
)
