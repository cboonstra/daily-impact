package com.dailyimpact.api.dto

import com.dailyimpact.api.model.User
import com.dailyimpact.api.model.UserLink
import jakarta.validation.constraints.Size

data class UserResponse(
    val id: String,
    val email: String,
    val name: String,
    val bio: String,
    val avatarUrl: String?,
    val links: List<UserLink>,
    val friendCount: Int,
)

data class PublicUserResponse(
    val id: String,
    val name: String,
    val bio: String,
    val avatarUrl: String?,
    val links: List<UserLink>,
)

data class UpdateProfileRequest(
    @field:Size(min = 1, max = 100) val name: String?,
    @field:Size(max = 500) val bio: String?,
    val avatarUrl: String?,
    val links: List<UserLink>?,
)

fun User.toResponse() = UserResponse(
    id = id!!,
    email = email,
    name = name,
    bio = bio,
    avatarUrl = avatarUrl,
    links = links,
    friendCount = friendIds.size,
)

fun User.toPublicResponse() = PublicUserResponse(
    id = id!!,
    name = name,
    bio = bio,
    avatarUrl = avatarUrl,
    links = links,
)
