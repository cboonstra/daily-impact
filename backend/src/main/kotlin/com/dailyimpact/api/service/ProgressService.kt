package com.dailyimpact.api.service

import com.dailyimpact.api.dto.CompleteActionRequest
import com.dailyimpact.api.dto.ProgressResponse
import com.dailyimpact.api.dto.SyncProgressRequest
import com.dailyimpact.api.dto.toResponse
import com.dailyimpact.api.exception.BadRequestException
import com.dailyimpact.api.exception.ForbiddenException
import com.dailyimpact.api.exception.ResourceNotFoundException
import com.dailyimpact.api.model.Progress
import com.dailyimpact.api.repository.ProgressRepository
import com.dailyimpact.api.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.format.DateTimeParseException

@Service
class ProgressService(
    private val progressRepository: ProgressRepository,
    private val userRepository: UserRepository,
) {
    fun getMyProgress(userId: String): ProgressResponse =
        getOrCreate(userId).toResponse()

    fun completeAction(userId: String, request: CompleteActionRequest): ProgressResponse {
        val date = parseDate(request.date)
        val progress = getOrCreate(userId)

        if (progress.history[request.date] == true) {
            throw BadRequestException("Action already completed for ${request.date}")
        }

        val yesterday = date.minusDays(1).toString()
        val newStreak = when (progress.lastCompletedDate) {
            yesterday -> progress.streak + 1
            null -> 1
            else -> 1 // streak broken
        }

        val updated = progress.copy(
            total = progress.total + 1,
            streak = newStreak,
            lastCompletedDate = request.date,
            completedSdgIds = (progress.completedSdgIds + request.sdgId).distinct(),
            history = progress.history + (request.date to true),
            updatedAt = Instant.now(),
        )
        return progressRepository.save(updated).toResponse()
    }

    fun syncProgress(userId: String, request: SyncProgressRequest): ProgressResponse {
        val progress = getOrCreate(userId)
        val updated = progress.copy(
            total = request.total,
            streak = request.streak,
            lastCompletedDate = request.lastCompletedDate,
            completedSdgIds = request.completedSdgIds,
            history = request.history,
            updatedAt = Instant.now(),
        )
        return progressRepository.save(updated).toResponse()
    }

    fun getFriendProgress(requestingUserId: String, targetUserId: String): ProgressResponse {
        val requestingUser = userRepository.findById(requestingUserId)
            .orElseThrow { ResourceNotFoundException("User not found") }
        if (targetUserId != requestingUserId && !requestingUser.friendIds.contains(targetUserId)) {
            throw ForbiddenException("You can only view progress of your friends")
        }
        return getOrCreate(targetUserId).toResponse()
    }

    private fun getOrCreate(userId: String): Progress =
        progressRepository.findByUserId(userId)
            .orElseGet { progressRepository.save(Progress(userId = userId)) }

    private fun parseDate(date: String): LocalDate =
        try {
            LocalDate.parse(date)
        } catch (e: DateTimeParseException) {
            throw BadRequestException("Invalid date format: $date (expected YYYY-MM-DD)")
        }
}
