package com.dailyimpact.api.repository

import com.dailyimpact.api.model.Progress
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional

interface ProgressRepository : MongoRepository<Progress, String> {
    fun findByUserId(userId: String): Optional<Progress>
    fun findAllByUserIdIn(userIds: Collection<String>): List<Progress>
}
