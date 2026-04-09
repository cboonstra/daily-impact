package com.dailyimpact.api.service

import com.dailyimpact.api.dto.PublicUserResponse
import com.dailyimpact.api.dto.UpdateProfileRequest
import com.dailyimpact.api.dto.UserResponse
import com.dailyimpact.api.dto.toPublicResponse
import com.dailyimpact.api.dto.toResponse
import com.dailyimpact.api.exception.ResourceNotFoundException
import com.dailyimpact.api.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class UserService(private val userRepository: UserRepository) {

    fun getMe(userId: String): UserResponse =
        findUser(userId).toResponse()

    fun updateMe(userId: String, request: UpdateProfileRequest): UserResponse {
        val user = findUser(userId)
        val updated = user.copy(
            name = request.name ?: user.name,
            bio = request.bio ?: user.bio,
            avatarUrl = request.avatarUrl ?: user.avatarUrl,
            links = request.links ?: user.links,
            updatedAt = Instant.now(),
        )
        return userRepository.save(updated).toResponse()
    }

    fun getPublicProfile(userId: String): PublicUserResponse =
        findUser(userId).toPublicResponse()

    fun searchByEmail(email: String): PublicUserResponse =
        userRepository.findByEmail(email)
            .orElseThrow { ResourceNotFoundException("User not found") }
            .toPublicResponse()

    internal fun findUser(userId: String) =
        userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found") }
}
