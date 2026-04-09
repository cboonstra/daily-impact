package com.dailyimpact.api.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document(collection = "progress")
data class Progress(
    @Id val id: String? = null,
    @Indexed(unique = true) val userId: String,
    val total: Int = 0,
    val streak: Int = 0,
    /** ISO date string of the last completed action (YYYY-MM-DD) */
    val lastCompletedDate: String? = null,
    /** SDG IDs (1–17) the user has completed at least one action for */
    val completedSdgIds: List<Int> = emptyList(),
    /** Map of ISO date string -> true for every day an action was completed */
    val history: Map<String, Boolean> = emptyMap(),
    val updatedAt: Instant = Instant.now(),
)
