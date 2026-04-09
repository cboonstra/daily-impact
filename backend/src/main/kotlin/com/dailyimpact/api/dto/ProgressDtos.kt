package com.dailyimpact.api.dto

import com.dailyimpact.api.model.Progress
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class ProgressResponse(
    val userId: String,
    val total: Int,
    val streak: Int,
    val lastCompletedDate: String?,
    val completedSdgIds: List<Int>,
    /** Last 30 days of history keyed by ISO date */
    val history: Map<String, Boolean>,
)

/** Complete today's action for a given SDG */
data class CompleteActionRequest(
    @field:NotNull @field:Min(1) @field:Max(17) val sdgId: Int,
    /** ISO date string (YYYY-MM-DD) from the client to avoid server timezone issues */
    @field:NotNull val date: String,
)

/** Overwrite progress entirely (e.g. migration from local storage) */
data class SyncProgressRequest(
    val total: Int,
    val streak: Int,
    val lastCompletedDate: String?,
    val completedSdgIds: List<Int>,
    val history: Map<String, Boolean>,
)

fun Progress.toResponse() = ProgressResponse(
    userId = userId,
    total = total,
    streak = streak,
    lastCompletedDate = lastCompletedDate,
    completedSdgIds = completedSdgIds,
    history = history,
)
