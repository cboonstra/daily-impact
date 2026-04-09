package com.dailyimpact.api.controller

import com.dailyimpact.api.dto.CompleteActionRequest
import com.dailyimpact.api.dto.ProgressResponse
import com.dailyimpact.api.dto.SyncProgressRequest
import com.dailyimpact.api.service.ProgressService
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/progress")
class ProgressController(private val progressService: ProgressService) {

    @GetMapping("/me")
    fun getMyProgress(@AuthenticationPrincipal principal: UserDetails): ProgressResponse =
        progressService.getMyProgress(principal.username)

    @PostMapping("/me/complete")
    fun completeAction(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody request: CompleteActionRequest,
    ): ProgressResponse = progressService.completeAction(principal.username, request)

    @PutMapping("/me/sync")
    fun syncProgress(
        @AuthenticationPrincipal principal: UserDetails,
        @RequestBody request: SyncProgressRequest,
    ): ProgressResponse = progressService.syncProgress(principal.username, request)

    @GetMapping("/{userId}")
    fun getFriendProgress(
        @AuthenticationPrincipal principal: UserDetails,
        @PathVariable userId: String,
    ): ProgressResponse = progressService.getFriendProgress(principal.username, userId)
}
